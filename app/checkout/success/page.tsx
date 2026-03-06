import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Payment successful
      </h1>
      <p className="text-sm text-zinc-600">
        Your order has been placed and marked as paid. You can review it in
        your order history.
      </p>
      <div className="flex gap-3">
        <Link
          href="/orders"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          View orders
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

