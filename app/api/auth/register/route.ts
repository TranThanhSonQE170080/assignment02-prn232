import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const body = await req.json().catch(() => null);

  const email = body?.email;
  const password = body?.password;

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    const msg = error.message.toLowerCase();
    const looksRateLimited =
      msg.includes("rate limit") || msg.includes("rate_limit");

    if (looksRateLimited && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const admin = createSupabaseAdminClient();
      const { error: adminError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (adminError) {
        return NextResponse.json({ error: adminError.message }, { status: 400 });
      }
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

