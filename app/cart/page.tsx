"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (!cancelled) {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function updateQuantity(productId: string, quantity: number) {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  }

  async function removeItem(productId: string) {
    await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">Your cart</h1>
      {loading ? (
        <p className="text-sm text-zinc-600">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-600">
          Your cart is empty. Browse{" "}
          <Link href="/products" className="text-zinc-900 underline">
            products
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {item.product.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product.id, Number(e.target.value))
                    }
                    className="w-16 rounded-md border border-zinc-300 px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
            <p className="text-sm font-semibold text-zinc-900">
              Total: ${total.toFixed(2)}
            </p>
            <Link
              href="/checkout"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

