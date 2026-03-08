import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AddToCartForm } from "@/components/AddToCartForm";

type ProductPageParams = {
  id: string;
};

export default async function ProductDetailPage(props: {
  params: Promise<ProductPageParams>;
}) {
  const { id } = await props.params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="md:max-w-xl">
        {product.image_url && (
          <div className="surface-card flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-zinc-100 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
        )}
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/products" className="transition hover:text-zinc-800">
              Products
            </Link>
            <span>/</span>
            <span className="line-clamp-1 text-zinc-700">{product.name}</span>
          </div>

          <span className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
            In stock
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            {product.name}
          </h1>
          <p className="whitespace-pre-line text-sm leading-6 text-zinc-600">
            {product.description}
          </p>

          <div className="surface-card space-y-4 p-6">
            <div className="border-b border-zinc-200 pb-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Price
              </p>
              <p className="mt-1 text-3xl font-semibold text-zinc-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
            {user ? (
              <>
                <AddToCartForm productId={product.id} />
                <Link
                  href={`/products/${product.id}/edit`}
                  className="block text-center text-xs text-zinc-600 transition hover:underline"
                >
                  Edit product
                </Link>
              </>
            ) : (
              <p className="text-sm text-zinc-600">
                Login to add this item to your cart and manage products.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

