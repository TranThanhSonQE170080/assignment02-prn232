"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="surface-card w-full max-w-md space-y-6 p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Register</h1>
        <p className="-mt-3 text-sm text-zinc-600">
          Create an account to track orders and manage products.
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
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
