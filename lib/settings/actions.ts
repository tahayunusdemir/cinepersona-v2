"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  emailSchema,
  passwordSchema,
  profileSchema,
} from "@/lib/schemas/settings";
import { mapAuthError, type AuthErrorKey } from "@/lib/auth/errors";
import { createClient } from "@/lib/supabase/server";

export type SettingsFieldErrors = Partial<Record<string, string>>;

export type SettingsActionState = {
  ok?: boolean;
  error?: AuthErrorKey | "validation";
  fieldErrors?: SettingsFieldErrors;
  message?: string;
};

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): SettingsFieldErrors {
  const out: SettingsFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0]?.toString();
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, user: data.user };
}

// ---------------------------------------------------------------------------
// Profile (display_name, bio)
// ---------------------------------------------------------------------------

export async function updateProfileAction(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name") ?? "",
    bio: formData.get("bio") ?? "",
    link: formData.get("link") ?? "",
    location: formData.get("location") ?? "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  // profileSchema already trims and maps empty strings to null.
  const { error } = await ctx.supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      bio: parsed.data.bio,
      link: parsed.data.link,
      location: parsed.data.location,
    })
    .eq("id", ctx.user.id);

  if (error) {
    return { ok: false, error: "unknown", message: error.message };
  }

  // Display name is shown in the user menu (root layout) and on the public
  // profile page; refresh the whole tree so SSR caches pick up the new value.
  revalidatePath("/", "layout");

  return { ok: true, message: "profile_updated" };
}

// ---------------------------------------------------------------------------
// Password
// ---------------------------------------------------------------------------

export async function updatePasswordAction(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = passwordSchema.safeParse({
    current_password: formData.get("current_password"),
    new_password: formData.get("new_password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const ctx = await requireUser();
  if (!ctx || !ctx.user.email) return { ok: false, error: "unknown" };

  // Re-auth: verify the current password by attempting a fresh sign-in
  // with the user's current email + supplied current_password.
  const { error: reauthError } = await ctx.supabase.auth.signInWithPassword({
    email: ctx.user.email,
    password: parsed.data.current_password,
  });

  if (reauthError) {
    return {
      ok: false,
      error: "current_password_invalid",
      fieldErrors: { current_password: "Current password is incorrect." },
    };
  }

  const { error } = await ctx.supabase.auth.updateUser({
    password: parsed.data.new_password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true, message: "password_updated" };
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export async function updateEmailAction(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  const parsed = emailSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  if (parsed.data.email === ctx.user.email) {
    return { ok: true, message: "email_unchanged" };
  }

  const { error } = await ctx.supabase.auth.updateUser({
    email: parsed.data.email,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error) };
  }

  return { ok: true, message: "email_updated" };
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

const AVATAR_BUCKET = "avatars";
const AVATAR_MAX_BYTES = 2 * 1024 * 1024; // 2 MB — matches bucket file_size_limit
const AVATAR_ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function clearUserAvatarFolder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<void> {
  const { data: existing } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);
  if (existing && existing.length > 0) {
    await supabase.storage
      .from(AVATAR_BUCKET)
      .remove(existing.map((entry) => `${userId}/${entry.name}`));
  }
}

export async function updateAvatarAction(
  _prev: SettingsActionState | undefined,
  formData: FormData,
): Promise<SettingsActionState> {
  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: { avatar: "Pick an image to upload." },
    };
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: { avatar: "Image must be 2 MB or smaller." },
    };
  }
  const ext = AVATAR_ALLOWED_TYPES[file.type];
  if (!ext) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: { avatar: "Use a JPG, PNG, WebP, or GIF image." },
    };
  }

  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  // Wipe the user's folder first so each upload yields a fresh URL (cache
  // busting) and we never accumulate orphan blobs.
  await clearUserAvatarFolder(ctx.supabase, ctx.user.id);

  const path = `${ctx.user.id}/${Date.now()}.${ext}`;
  const { error: uploadError } = await ctx.supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
  if (uploadError) {
    return { ok: false, error: "unknown", message: uploadError.message };
  }

  const { data: pub } = ctx.supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path);

  const { error: updateError } = await ctx.supabase
    .from("profiles")
    .update({ avatar_url: pub.publicUrl })
    .eq("id", ctx.user.id);
  if (updateError) {
    return { ok: false, error: "unknown", message: updateError.message };
  }

  // Avatar appears in the header user menu and on the public profile.
  revalidatePath("/", "layout");

  return { ok: true, message: "avatar_updated" };
}

export async function removeAvatarAction(): Promise<SettingsActionState> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  await clearUserAvatarFolder(ctx.supabase, ctx.user.id);

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", ctx.user.id);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "avatar_removed" };
}

// ---------------------------------------------------------------------------
// Profile banner film
// ---------------------------------------------------------------------------

export async function setBannerFilmAction(
  movieId: number,
): Promise<SettingsActionState> {
  if (!Number.isInteger(movieId) || movieId <= 0) {
    return { ok: false, error: "validation", message: "invalid_film" };
  }

  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  // Verify the movie exists and is selectable (RLS already strips adult).
  const { data: film } = await ctx.supabase
    .from("movies")
    .select("id")
    .eq("id", movieId)
    .maybeSingle<{ id: number }>();

  if (!film) {
    return { ok: false, error: "validation", message: "film_not_found" };
  }

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ banner_movie_id: film.id })
    .eq("id", ctx.user.id);

  if (error) return { ok: false, error: "unknown", message: error.message };

  // Banner shows on /[username]; bust the public profile page cache.
  const { data: profile } = await ctx.supabase
    .from("profiles")
    .select("username")
    .eq("id", ctx.user.id)
    .maybeSingle<{ username: string }>();
  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

  return { ok: true, message: "banner_updated" };
}

export async function clearBannerFilmAction(): Promise<SettingsActionState> {
  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unknown" };

  const { error } = await ctx.supabase
    .from("profiles")
    .update({ banner_movie_id: null })
    .eq("id", ctx.user.id);

  if (error) return { ok: false, error: "unknown", message: error.message };

  const { data: profile } = await ctx.supabase
    .from("profiles")
    .select("username")
    .eq("id", ctx.user.id)
    .maybeSingle<{ username: string }>();
  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

  return { ok: true, message: "banner_cleared" };
}

// ---------------------------------------------------------------------------
// Deactivate account
// ---------------------------------------------------------------------------

export async function deactivateAccountAction(): Promise<void> {
  const ctx = await requireUser();
  if (!ctx) {
    redirect("/login");
  }

  const { data: profile } = await ctx.supabase
    .from("profiles")
    .select("username")
    .eq("id", ctx.user.id)
    .maybeSingle<{ username: string }>();

  await ctx.supabase
    .from("profiles")
    .update({ deactivated_at: new Date().toISOString() })
    .eq("id", ctx.user.id);

  await ctx.supabase.auth.signOut();

  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
    revalidatePath(`/${profile.username}/followers`);
    revalidatePath(`/${profile.username}/following`);
  }

  redirect("/?flash=deactivated");
}
