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
    <div className="grid gap-8 md:grid-cols-[1.2fr,1fr]">
      <div className="space-y-4">
        {product.image_url && (
          <div className="w-full max-h-[420px] overflow-hidden rounded-lg bg-zinc-100 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[400px] w-auto object-contain"
            />
          </div>
        )}
        <h1 className="text-2xl font-semibold text-zinc-900">
          {product.name}
        </h1>
        <p className="text-sm text-zinc-600 whitespace-pre-line">
          {product.description}
        </p>
      </div>
      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-xl font-semibold text-zinc-900">
          ${product.price.toFixed(2)}
        </p>
        {user ? (
          <>
            <AddToCartForm productId={product.id} />
            <Link
              href={`/products/${product.id}/edit`}
              className="block text-center text-xs text-zinc-600 hover:underline"
            >
              Edit product
            </Link>
          </>
        ) : (
          <p className="text-sm text-zinc-600">
            Login to add to cart and manage products.
          </p>
        )}
      </div>
    </div>
  );
}

