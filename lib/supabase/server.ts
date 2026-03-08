import { cookies } from "next/headers";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      async set(name: string, value: string, options: CookieOptions) {
        try {
          await cookieStore.set({ name, value, ...options });
        } catch {
          // Server Components cannot mutate cookies. Writes are handled in
          // Server Actions/Route Handlers where mutation is allowed.
        }
      },
      async remove(name: string, options: CookieOptions) {
        try {
          await cookieStore.set({ name, value: "", ...options });
        } catch {
          // Server Components cannot mutate cookies. Writes are handled in
          // Server Actions/Route Handlers where mutation is allowed.
        }
      },
    },
  });
}

