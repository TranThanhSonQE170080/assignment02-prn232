import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type OrderItemRow = {
  id: number;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
    image_url?: string | null;
  } | null;
};

type OrderRow = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItemRow[];
};

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_amount,
      created_at,
      items:order_items (
        id,
        quantity,
        unit_price,
        product:products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orders = (data ?? []) as unknown as OrderRow[];

  return NextResponse.json(orders);
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  type CartRow = {
    id: number;
    quantity: number;
    product: {
      id: string;
      price: number;
    };
  };

  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products (
        id,
        price
      )
    `
    )
    .eq("user_id", user.id);

  if (cartError) {
    return NextResponse.json({ error: cartError.message }, { status: 500 });
  }

  if (!cartItems || cartItems.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  const total = (cartItems as unknown as CartRow[]).reduce(
    (sum: number, item: CartRow) => sum + item.quantity * item.product.price,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: total,
      status: "paid",
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  const orderItemsPayload = (cartItems as unknown as CartRow[]).map((item: CartRow) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    unit_price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    // Best-effort rollback of the order if its items fail to insert
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  return NextResponse.json({ ...order, items: orderItemsPayload }, { status: 201 });
}

