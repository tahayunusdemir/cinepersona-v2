import { type NextRequest, NextResponse } from "next/server";

import { RECOVERY_COOKIE, safeNext } from "@/lib/auth/safe-next";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const errParam = searchParams.get("error") ?? searchParams.get("error_code");

  if (errParam || !code) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  // Mark this session as recovery-context when the link redirects to the
  // password reset flow. Short-lived: 10 minutes, http-only, same-site.
  if (next === "/reset-password") {
    response.cookies.set(RECOVERY_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });
  }

  return response;
}
