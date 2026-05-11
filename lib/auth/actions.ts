"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import {
  forgotSchema,
  loginSchema,
  registerSchema,
  resetSchema,
} from "@/lib/schemas/auth";
import { mapAuthError, type AuthErrorKey } from "@/lib/auth/errors";
import { RECOVERY_COOKIE, safeNext } from "@/lib/auth/safe-next";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

export type AuthFieldErrors = Partial<Record<string, string>>;

export type AuthActionState = {
  ok?: boolean;
  error?: AuthErrorKey | "validation";
  fieldErrors?: AuthFieldErrors;
  message?: string;
};

function safeNextForm(raw: FormDataEntryValue | null | undefined): string {
  return safeNext(typeof raw === "string" ? raw : null);
}

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): AuthFieldErrors {
  const out: AuthFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0]?.toString();
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function loginAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, error: mapAuthError(error) };
  }

  // Reactivation: clear deactivated_at on successful login.
  await supabase
    .from("profiles")
    .update({ deactivated_at: null })
    .eq("id", data.user.id)
    .not("deactivated_at", "is", null);

  redirect(safeNextForm(formData.get("next")));
}

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export async function registerAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await createClient();

  // Pre-check username collision against existing profiles for a friendly
  // error before signUp creates the auth row.
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .maybeSingle();

  if (existing) {
    return {
      ok: false,
      error: "username_taken",
      fieldErrors: { username: "That username is already taken." },
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, error: mapAuthError(error) };
  }

  // Email confirmation is disabled (spec §3) — signUp returns an active
  // session. The handle_new_user trigger has inserted a placeholder profile
  // row keyed by the new user's id. Set the real username + display_name.
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      username: parsed.data.username,
      display_name: parsed.data.username,
    })
    .eq("id", data.user.id);

  if (profileError) {
    if (profileError.code === "23505") {
      return {
        ok: false,
        error: "username_taken",
        fieldErrors: { username: "That username is already taken." },
      };
    }
    return { ok: false, error: "unknown", message: profileError.message };
  }

  redirect(safeNextForm(formData.get("next")));
}

// ---------------------------------------------------------------------------
// Forgot password
// ---------------------------------------------------------------------------

export async function forgotAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await createClient();

  // Fire-and-forget — never leak whether the email is registered or whether
  // we hit a per-email rate limit. The user always sees the same success UI.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteConfig.url}/auth/confirm?next=/reset-password`,
  });

  return { ok: true, message: "sent" };
}

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------

export async function resetAction(
  _prev: AuthActionState | undefined,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = resetSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims) {
    return { ok: false, error: "invalid_link" };
  }

  // Only allow password change when the session was just minted from a
  // recovery email exchange (set by /auth/confirm). This prevents a normal
  // logged-in user from bypassing the current-password re-auth that
  // /settings enforces.
  const cookieStore = await cookies();
  if (!cookieStore.get(RECOVERY_COOKIE)) {
    return { ok: false, error: "invalid_link" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  cookieStore.delete(RECOVERY_COOKIE);
  redirect("/");
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
