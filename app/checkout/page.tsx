"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartSnapshot = {
  total: number;
  items: Array<{ id: number; quantity: number }>;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadCart() {
      setLoadingCart(true);
      const res = await fetch("/api/cart");
      const data = await res.json().catch(() => ({}));
      if (!cancelled) {
        setCart({
          total: data.total ?? 0,
          items: data.items ?? [],
        });
        setLoadingCart(false);
      }
    }
    loadCart();
    return () => {
      cancelled = true;
    };
  }, []);

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const isCartEmpty = !loadingCart && itemCount === 0;

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/orders", { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to place order");
      setLoading(false);
      return;
    }
    router.push("/checkout/success");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
      <div className="surface-card space-y-5 p-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Checkout</h1>
        <p className="text-sm text-zinc-600">
          Confirm your order and complete payment in one step.
        </p>

        <div className="space-y-3 text-sm text-zinc-700">
          <div className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <p>Your order is marked as paid immediately after checkout.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <p>You can review full order details anytime in your order history.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-500" />
            <p>Need changes? Update quantities in your cart before paying.</p>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <aside className="surface-card h-fit space-y-4 p-6">
        <h2 className="text-base font-semibold text-zinc-900">Order summary</h2>
        {loadingCart ? (
          <p className="text-sm text-zinc-600">Loading cart summary...</p>
        ) : (
          <>
            <div className="space-y-2 border-y border-zinc-200 py-3 text-sm">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-zinc-900">
                <span>Total</span>
                <span>${(cart?.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
            {isCartEmpty && (
              <p className="text-sm text-zinc-600">
                Your cart is empty.{" "}
                <Link href="/products" className="font-medium underline">
                  Browse products
                </Link>
                .
              </p>
            )}
          </>
        )}

        <button
          type="button"
          disabled={loading || loadingCart || isCartEmpty}
          onClick={handleCheckout}
          className="app-button-primary w-full px-4 py-2 text-sm transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay now"}
        </button>
        <Link
          href="/cart"
          className="block text-center text-xs text-zinc-600 transition hover:underline"
        >
          Back to cart
        </Link>
      </aside>
    </section>
  );
}
