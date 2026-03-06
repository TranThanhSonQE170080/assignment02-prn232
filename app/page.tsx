export default function Home() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Welcome to the Clothing Store
      </h1>
      <p className="text-zinc-600">
        Browse products, add them to your cart, and place orders. Login to
        create and manage products.
      </p>
      <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-1">
        <li>Register / Login from the top-right.</li>
        <li>View all products on the Products page.</li>
        <li>Manage your cart and checkout to create orders.</li>
      </ul>
    </section>
  );
}
