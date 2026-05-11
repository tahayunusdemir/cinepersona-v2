"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { messageSchema } from "./schemas";
import {
  MESSAGE_RATE_PER_MIN,
  WATCHED_MIN,
  WEEKLY_REQUEST_LIMIT,
} from "./types";

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : T))
  | { ok: false; error: ActionError; message?: string };

export type ActionError =
  | "unauthorized"
  | "no_test"
  | "watched_too_few"
  | "not_joined"
  | "already_joined"
  | "weekly_limit"
  | "no_candidates"
  | "not_party"
  | "no_consent"
  | "rate_limited"
  | "blocked"
  | "too_long"
  | "not_found"
  | "unknown";

async function requireUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// ---------------------------------------------------------------------------
// joinPool — gate on test + ≥20 watched, then snapshot axes.
// ---------------------------------------------------------------------------

export async function joinPool(): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: cp } = await supabase
    .from("cp_results")
    .select("type_code, axis_1_pct, axis_2_pct, axis_3_pct, axis_4_pct")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!cp) return { ok: false, error: "no_test" };
  const cpRow = cp as {
    type_code: string;
    axis_1_pct: number;
    axis_2_pct: number;
    axis_3_pct: number;
    axis_4_pct: number;
  };

  const { count } = await supabase
    .from("user_movies")
    .select("movie_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "watched");
  const watchedCount = count ?? 0;
  if (watchedCount < WATCHED_MIN) {
    return { ok: false, error: "watched_too_few" };
  }

  const { data: existing } = await supabase
    .from("match_pool")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Refresh the snapshot (axes may have changed since last join).
    const { error } = await supabase
      .from("match_pool")
      .update({
        type_code: cpRow.type_code,
        axis_1_pct: cpRow.axis_1_pct,
        axis_2_pct: cpRow.axis_2_pct,
        axis_3_pct: cpRow.axis_3_pct,
        axis_4_pct: cpRow.axis_4_pct,
        watched_count: watchedCount,
        refreshed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (error) return { ok: false, error: "unknown", message: error.message };
  } else {
    const { error } = await supabase.from("match_pool").insert({
      user_id: user.id,
      type_code: cpRow.type_code,
      axis_1_pct: cpRow.axis_1_pct,
      axis_2_pct: cpRow.axis_2_pct,
      axis_3_pct: cpRow.axis_3_pct,
      axis_4_pct: cpRow.axis_4_pct,
      watched_count: watchedCount,
    });
    if (error) return { ok: false, error: "unknown", message: error.message };
  }

  revalidatePath("/cine-match");
  revalidatePath("/cine-match/matches");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// leavePool — drop pool membership. Existing matches remain.
// ---------------------------------------------------------------------------

export async function leavePool(): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("match_pool")
    .delete()
    .eq("user_id", user.id);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/cine-match");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// requestMatch — user pushed "find me a new match" (max 3 / rolling 7 days).
//
// Strategy: insert a row (RLS-enforced cap is the security gate), then call
// the SECURITY DEFINER matcher synchronously to resolve immediately when
// possible. If no ≥90 candidate yet, the row stays pending and the hourly
// cron + fallback-after-7-days logic takes over.
// ---------------------------------------------------------------------------

export async function requestMatch(): Promise<
  ActionResult<{ match_id: string | null; request_id: string }>
> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  // Must be in the pool to request.
  const { data: pool } = await supabase
    .from("match_pool")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!pool) return { ok: false, error: "not_joined" };

  // Pre-check the weekly cap for a friendlier error message. RLS will
  // re-enforce server-side if the client tries to bypass.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("match_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("requested_at", since);
  if ((count ?? 0) >= WEEKLY_REQUEST_LIMIT) {
    return { ok: false, error: "weekly_limit" };
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("match_requests")
    .insert({ user_id: user.id })
    .select("id")
    .single();
  if (insertErr || !inserted) {
    // Postgres code 23514 = check constraint, 42501 = RLS deny → both mean
    // the weekly cap was hit (RLS enforces it inline). Anything else is
    // surfaced verbatim so we don't silently mislabel real failures.
    const code = insertErr?.code;
    if (code === "23514" || code === "42501") {
      return { ok: false, error: "weekly_limit", message: insertErr?.message };
    }
    console.error("requestMatch insert failed:", {
      code,
      message: insertErr?.message,
      details: insertErr?.details,
      hint: insertErr?.hint,
    });
    return {
      ok: false,
      error: "unknown",
      message: insertErr?.message ?? "Insert returned no row.",
    };
  }
  const requestId = (inserted as { id: string }).id;

  // Try to resolve immediately via service role (DEFINER fn).
  let matchId: string | null = null;
  if (hasServiceRole()) {
    const admin = createAdminClient();
    const { data: resolved } = await admin.rpc("resolve_match_request", {
      req_id: requestId,
    });
    matchId = (resolved as string | null) ?? null;
  }

  revalidatePath("/cine-match");
  revalidatePath("/cine-match/matches");
  return { ok: true, request_id: requestId, match_id: matchId };
}

// ---------------------------------------------------------------------------
// hideMatch / unhideMatch
// ---------------------------------------------------------------------------

export async function hideMatch(matchId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("matches")
    .update({ hidden_at: new Date().toISOString() })
    .eq("id", matchId);
  if (error) {
    if (error.code === "PGRST116") return { ok: false, error: "not_found" };
    return { ok: false, error: "unknown", message: error.message };
  }
  revalidatePath("/cine-match/matches");
  revalidatePath(`/cine-match/${matchId}`);
  return { ok: true };
}

export async function unhideMatch(matchId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("matches")
    .update({ hidden_at: null })
    .eq("id", matchId);
  if (error) return { ok: false, error: "unknown", message: error.message };
  revalidatePath("/cine-match/matches");
  revalidatePath(`/cine-match/${matchId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// setMatchConsent — mutual gate for chat.
// ---------------------------------------------------------------------------

export async function setMatchConsent(
  matchId: string,
  granted: boolean,
): Promise<ActionResult<{ both_consented: boolean }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: match } = await supabase
    .from("matches")
    .select("id, user_a, user_b")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) return { ok: false, error: "not_found" };
  const m = match as { id: string; user_a: string; user_b: string };
  if (m.user_a !== user.id && m.user_b !== user.id) {
    return { ok: false, error: "not_party" };
  }

  const partnerId = m.user_a === user.id ? m.user_b : m.user_a;
  const { data: blocks } = await supabase
    .from("blocks")
    .select("blocker_id, blocked_id")
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`,
    );
  if ((blocks ?? []).length > 0) return { ok: false, error: "blocked" };

  if (granted) {
    const { error } = await supabase
      .from("match_consents")
      .upsert(
        { match_id: matchId, user_id: user.id },
        { onConflict: "match_id,user_id", ignoreDuplicates: true },
      );
    if (error) return { ok: false, error: "unknown", message: error.message };
  } else {
    const { error } = await supabase
      .from("match_consents")
      .delete()
      .eq("match_id", matchId)
      .eq("user_id", user.id);
    if (error) return { ok: false, error: "unknown", message: error.message };
  }

  const { data: rows } = await supabase
    .from("match_consents")
    .select("user_id")
    .eq("match_id", matchId);
  const both = ((rows ?? []) as { user_id: string }[]).length === 2;

  revalidatePath(`/cine-match/${matchId}`);
  revalidatePath(`/cine-match/${matchId}/messages`);
  return { ok: true, both_consented: both };
}

// ---------------------------------------------------------------------------
// sendMatchMessage
// ---------------------------------------------------------------------------

export async function sendMatchMessage(
  matchId: string,
  body: string,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "too_long" };
  const trimmed = parsed.data;

  const { data: match } = await supabase
    .from("matches")
    .select("id, user_a, user_b")
    .eq("id", matchId)
    .maybeSingle();
  if (!match) return { ok: false, error: "not_found" };
  const m = match as { id: string; user_a: string; user_b: string };
  if (m.user_a !== user.id && m.user_b !== user.id)
    return { ok: false, error: "not_party" };

  const partnerId = m.user_a === user.id ? m.user_b : m.user_a;
  const { data: blocks } = await supabase
    .from("blocks")
    .select("blocker_id")
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`,
    );
  if ((blocks ?? []).length > 0) return { ok: false, error: "blocked" };

  const { data: consents } = await supabase
    .from("match_consents")
    .select("user_id")
    .eq("match_id", matchId);
  if (((consents ?? []) as { user_id: string }[]).length < 2) {
    return { ok: false, error: "no_consent" };
  }

  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const { count } = await supabase
    .from("match_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= MESSAGE_RATE_PER_MIN) {
    return { ok: false, error: "rate_limited" };
  }

  const { data, error } = await supabase
    .from("match_messages")
    .insert({ match_id: matchId, sender_id: user.id, body: trimmed })
    .select("id")
    .single();
  if (error || !data) {
    return { ok: false, error: "unknown", message: error?.message };
  }
  return { ok: true, id: (data as { id: string }).id };
}

export async function markMessagesRead(matchId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("match_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("match_id", matchId)
    .neq("sender_id", user.id)
    .is("read_at", null);
  if (error) return { ok: false, error: "unknown", message: error.message };
  return { ok: true };
}
