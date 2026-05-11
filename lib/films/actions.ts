"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ToggleResult =
  | { ok: true; active: boolean }
  | { ok: false; reason: "unauthorized" | "error" };

function revalidateFilmsViews() {
  revalidatePath("/films", "page");
  revalidatePath("/films/[slug]", "page");
}

export async function toggleWatched(movieId: number): Promise<ToggleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthorized" };

  const { data: existing } = await supabase
    .from("user_movies")
    .select("movie_id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watched")
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("status", "watched");
    if (error) return { ok: false, reason: "error" };
    revalidateFilmsViews();
    return { ok: true, active: false };
  }

  // Mark watched + drop watchlist row (watched implies removed-from-watchlist).
  // upsert + ignoreDuplicates makes concurrent double-clicks idempotent
  // instead of failing the second insert with a unique-violation.
  const { error: insertError } = await supabase.from("user_movies").upsert(
    {
      user_id: user.id,
      movie_id: movieId,
      status: "watched",
    },
    { onConflict: "user_id,movie_id,status", ignoreDuplicates: true },
  );
  if (insertError) return { ok: false, reason: "error" };

  await supabase
    .from("user_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watchlist");

  revalidateFilmsViews();
  return { ok: true, active: true };
}

export async function toggleWatchlist(movieId: number): Promise<ToggleResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauthorized" };

  const { data: existing } = await supabase
    .from("user_movies")
    .select("movie_id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watchlist")
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId)
      .eq("status", "watchlist");
    if (error) return { ok: false, reason: "error" };
    revalidateFilmsViews();
    return { ok: true, active: false };
  }

  // Already watched → don't allow watchlist (state machine: watched is terminal).
  const { data: watchedRow } = await supabase
    .from("user_movies")
    .select("movie_id")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .eq("status", "watched")
    .maybeSingle();
  if (watchedRow) return { ok: false, reason: "error" };

  const { error } = await supabase.from("user_movies").upsert(
    {
      user_id: user.id,
      movie_id: movieId,
      status: "watchlist",
    },
    { onConflict: "user_id,movie_id,status", ignoreDuplicates: true },
  );
  if (error) return { ok: false, reason: "error" };

  revalidateFilmsViews();
  return { ok: true, active: true };
}
