import { createSupabaseServerClient } from "@/lib/supabase/server";

type OrderItem = {
  id: number;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
  } | null;
};

type Order = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
};

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <p className="text-sm text-zinc-600">
        Please login to see your orders.
      </p>
    );
  }

  const { data: orders } = await supabase
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
          name
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Order history</h1>
      {orders && ((orders as unknown as Order[]).length > 0) ? (
        <ul className="space-y-4">
          {(orders as unknown as Order[]).map((order) => (
            <li
              key={order.id}
              className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-900">
                  Order #{order.id.slice(0, 8)}
                </span>
                <span className="text-xs uppercase tracking-wide text-green-700">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Placed on {new Date(order.created_at).toLocaleString()}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-zinc-700">
                {order.items?.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name ?? "Product"} x {item.quantity}
                    </span>
                    <span>
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                Total: ${order.total_amount.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-zinc-600">
          You don&apos;t have any orders yet.
        </p>
      )}
    </div>
  );
}

