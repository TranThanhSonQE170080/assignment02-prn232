import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
};

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
        {user && (
          <Link
            href="/products/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add product
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(products as Product[] | null)?.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group rounded-lg border border-zinc-200 bg-white p-4 hover:shadow-sm"
          >
            {product.image_url && (
              <div className="mb-3 overflow-hidden rounded-md bg-zinc-100 aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <h2 className="text-sm font-semibold text-zinc-900 group-hover:underline">
              {product.name}
            </h2>
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
              {product.description}
            </p>
            <p className="mt-2 text-sm font-semibold text-zinc-900">
              ${product.price.toFixed(2)}
            </p>
          </Link>
        ))}
        {products?.length === 0 && (
          <p className="text-sm text-zinc-600">
            No products yet. Login and create your first product.
          </p>
        )}
      </div>
    </div>
  );
}

