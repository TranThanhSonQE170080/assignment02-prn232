"use client";

import { useState, FormEvent } from "react";

type Props = {
  productId: string;
};

export function AddToCartForm({ productId }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Failed to add to cart");
      return;
    }

    setMessage("Added to cart");
    setTimeout(() => setMessage(null), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-zinc-700">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          className="app-input mt-1 w-24"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="app-button-primary w-full px-4 py-2 text-sm transition disabled:opacity-60"
      >
        {submitting ? "Adding..." : "Add to cart"}
      </button>
      {message && (
        <p className="text-xs text-green-700" aria-live="polite">
          {message}
        </p>
      )}
    </form>
  );
}

