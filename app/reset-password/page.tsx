import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Reset password" };

// /reset-password lives outside the (auth) route group: the recovery email
// flow always lands here with an active session (set by /auth/confirm), so
// the "redirect logged-in users to /" guard would break the flow. Visitors
// without a session are bounced to /forgot-password.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data) {
    redirect("/forgot-password");
  }

  return (
    <AuthShell
      title="Set a new password."
      description="Pick something memorable. We'll use it the next time you sign in."
    >
      <ResetForm />
    </AuthShell>
  );
}
