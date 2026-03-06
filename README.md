## Clothing Store – Next.js + Supabase

Simple clothing e-commerce app with authentication, product CRUD, cart, and orders. Built with Next.js App Router and Supabase, deployable to Vercel.

### 1. Supabase setup

1. Create a new Supabase project.
2. In `Authentication → Providers`, make sure Email/Password is enabled.
3. In `Project Settings → API`, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create a `.env.local` file (or configure these in Vercel):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

If you hit `email rate limit exceeded` when registering (Supabase sending confirmation emails), you have two options:

- **Recommended for assignments/dev**: Add `SUPABASE_SERVICE_ROLE_KEY` and the app will fall back to creating users via the Admin API with `email_confirm: true` (no confirmation email sent).
- **Alternative**: In Supabase Auth settings, disable email confirmations (so sign-up won’t send emails).

### 2. Database schema

Run this SQL in Supabase (SQL editor):

```sql
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  image_url text,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "Public can view products"
on public.products for select
using (true);

create policy "Authenticated can manage own products"
on public.products for all
using (auth.uid() = created_by);

create table public.cart_items (
  id bigserial primary key,
  user_id uuid references auth.users(id) not null,
  product_id uuid references public.products(id) not null,
  quantity int not null check (quantity > 0)
);

alter table public.cart_items enable row level security;

create policy "Users manage own cart"
on public.cart_items for all
using (auth.uid() = user_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  total_amount numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users manage own orders"
on public.orders for all
using (auth.uid() = user_id);

create table public.order_items (
  id bigserial primary key,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "Users manage own order items"
on public.order_items for all
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);
```

### 3. Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### 4. Features

- **Auth**: Register, login, logout using Supabase Auth (email/password). Only logged-in users can create, update, or delete products.
- **Products**:
  - List: `Products` page.
  - Detail: per-product page with add-to-cart.
  - Create/Update/Delete via protected UI + RESTful API (`/api/products`).
- **Cart**:
  - Server-side cart stored in `cart_items`.
  - Add from product detail, view/update/remove on `Cart` page.
- **Orders**:
  - Checkout page to create an order from cart.
  - Orders saved in `orders` and `order_items` with status `paid` after simulated payment.
  - Order history page showing past orders.

### 5. Deployment to Vercel

1. Push this project to GitHub.
2. In Vercel, import the repository.
3. Set environment variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

