import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothing Store",
  description: "Simple clothing e-commerce with Supabase",
};

async function NavBar() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Clothing Store
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="text-zinc-700 hover:text-black">
            Products
          </Link>
          <Link href="/cart" className="text-zinc-700 hover:text-black">
            Cart
          </Link>
          <Link href="/orders" className="text-zinc-700 hover:text-black">
            Orders
          </Link>
          {user ? (
            <>
              <span className="hidden text-zinc-500 sm:inline">
                {user.email}
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-100"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-700 hover:text-black font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50`}
      >
        {/* Async Server Component */}
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

