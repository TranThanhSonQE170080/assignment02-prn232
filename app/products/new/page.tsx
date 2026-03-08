"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create product");
      setLoading(false);
      return;
    }

    const product = await res.json();
    router.push(`/products/${product.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-900">New product</h1>
      <form onSubmit={handleSubmit} className="surface-card space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="app-input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="app-input mt-1"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Price</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="app-input mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="app-input mt-1"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="app-button-primary px-4 py-2 text-sm transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create product"}
        </button>
      </form>
    </div>
  );
}
