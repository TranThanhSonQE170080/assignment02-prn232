import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ items: [], total: 0 });
  }

  type CartRow = {
    id: number;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
    };
  };

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products (
        id,
        name,
        price,
        image_url
      )
    `
    )
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items = (data ?? []) as unknown as CartRow[];

  const total = items.reduce(
    (sum: number, item: CartRow) => sum + item.quantity * item.product.price,
    0
  );

  return NextResponse.json({ items, total });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { productId, quantity } = body;

  if (!productId || typeof quantity !== "number") {
    return NextResponse.json(
      { error: "productId and quantity are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  let upsertResult;

  if (existing) {
    upsertResult = await supabase
      .from("cart_items")
      .update({ quantity: quantity })
      .eq("id", existing.id)
      .select()
      .single();
  } else {
    upsertResult = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
      })
      .select()
      .single();
  }

  if (upsertResult.error) {
    return NextResponse.json(
      { error: upsertResult.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(upsertResult.data);
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

