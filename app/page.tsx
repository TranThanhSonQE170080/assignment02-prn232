import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <section className="space-y-8">
      <div className="surface-card p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Modern essentials for everyday wear
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Shop quality clothing with a smooth checkout flow
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Discover new arrivals, review details quickly, and place orders in
          just a few steps.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/products"
            className="app-button-primary px-4 py-2 transition"
          >
            Browse products
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-zinc-300 bg-white px-4 py-2 font-medium text-zinc-900 transition hover:bg-zinc-100"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900">Featured products</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-zinc-700 transition hover:text-zinc-900"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(products as Product[] | null)?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="surface-card group p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {product.image_url && (
                <div className="mb-3 aspect-[3/4] overflow-hidden rounded-md bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <h3 className="text-sm font-semibold text-zinc-900 group-hover:underline">
                {product.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                {product.description}
              </p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
        {products?.length === 0 && (
          <div className="surface-card p-6 text-sm text-zinc-600">
            No products yet. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
