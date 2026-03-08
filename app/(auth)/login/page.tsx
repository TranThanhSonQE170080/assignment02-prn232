"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="surface-card w-full max-w-md space-y-6 p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Login</h1>
        <p className="-mt-3 text-sm text-zinc-600">
          Welcome back. Sign in to manage products and checkout faster.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="app-input mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="app-input mt-1"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" aria-live="polite">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="app-button-primary w-full py-2 text-sm transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-zinc-900">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
