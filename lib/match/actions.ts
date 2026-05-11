"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { picksSchema, messageSchema } from "./schemas";
import {
  MESSAGE_RATE_PER_MIN,
  PICKS_MAX,
  PICKS_MIN,
  WATCHED_MIN,
} from "./types";

export type ActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : T))
  | { ok: false; error: ActionError; message?: string };

export type ActionError =
  | "unauthorized"
  | "not_eligible"
  | "no_test"
  | "watched_too_few"
  | "no_pool"
  | "pool_locked"
  | "already_joined"
  | "not_joined"
  | "invalid_picks"
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

function periodBoundsFor(d: Date): { start: string; end: string } {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth();
  const start = new Date(Date.UTC(y, m, 1));
  const end = new Date(Date.UTC(y, m + 1, 0));
  const fmt = (x: Date) => x.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

// ---------------------------------------------------------------------------
// 5.7 ensureCurrentPool — lazy creator (cron backup).
// ---------------------------------------------------------------------------

export async function ensureCurrentPool(): Promise<
  ActionResult<{ pool_id: number }>
> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("match_pools")
    .select("id")
    .lte("period_start", today)
    .gte("period_end", today)
    .order("period_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existing) return { ok: true, pool_id: (existing as { id: number }).id };

  if (!hasServiceRole()) {
    return { ok: false, error: "unknown", message: "service role missing" };
  }
  const admin = createAdminClient();
  const { start, end } = periodBoundsFor(new Date());
  const { data, error } = await admin
    .from("match_pools")
    .upsert(
      { period_start: start, period_end: end, status: "open" },
      { onConflict: "period_start,period_end", ignoreDuplicates: false },
    )
    .select("id")
    .single();

  if (error || !data)
    return { ok: false, error: "unknown", message: error?.message };
  return { ok: true, pool_id: (data as { id: number }).id };
}

// ---------------------------------------------------------------------------
// 5.1 joinPool
// ---------------------------------------------------------------------------

export async function joinPool(input: {
  picks: number[];
}): Promise<ActionResult<{ entry_id: string }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const parsed = picksSchema.safeParse(input.picks);
  if (!parsed.success) return { ok: false, error: "invalid_picks" };
  const picks = parsed.data;

  // Watched gate
  const { count: watchedCount } = await supabase
    .from("user_movies")
    .select("movie_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "watched");
  if ((watchedCount ?? 0) < WATCHED_MIN) {
    return { ok: false, error: "watched_too_few" };
  }

  // Active pool (lazy create)
  const ensured = await ensureCurrentPool();
  if (!ensured.ok) return ensured;
  const poolId = ensured.pool_id;

  const { data: poolRow } = await supabase
    .from("match_pools")
    .select("status")
    .eq("id", poolId)
    .maybeSingle();
  if (!poolRow || (poolRow as { status: string }).status !== "open") {
    return { ok: false, error: "pool_locked" };
  }

  // Already joined?
  const { data: existing } = await supabase
    .from("match_pool_entries")
    .select("user_id")
    .eq("pool_id", poolId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { ok: false, error: "already_joined" };

  // Latest test result (axes snapshot)
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

  // Validate every pick is one of the user's own library entries (prevents
  // arbitrary movie_id submission outside of the picker UI).
  const { data: lib } = await supabase
    .from("user_movies")
    .select("movie_id")
    .eq("user_id", user.id)
    .in("movie_id", picks);
  const ownIds = new Set(
    ((lib ?? []) as { movie_id: number }[]).map((r) => r.movie_id),
  );
  if (picks.some((id) => !ownIds.has(id))) {
    return { ok: false, error: "invalid_picks" };
  }

  // Insert entry then picks. RLS gates both on pool.status='open'.
  const { error: entryErr } = await supabase
    .from("match_pool_entries")
    .insert({
      pool_id: poolId,
      user_id: user.id,
      type_code: cpRow.type_code,
      axis_1_pct: cpRow.axis_1_pct,
      axis_2_pct: cpRow.axis_2_pct,
      axis_3_pct: cpRow.axis_3_pct,
      axis_4_pct: cpRow.axis_4_pct,
    });
  if (entryErr) {
    return { ok: false, error: "unknown", message: entryErr.message };
  }

  const pickRows = picks.map((movie_id, i) => ({
    pool_id: poolId,
    user_id: user.id,
    movie_id,
    sort_order: i,
  }));
  const { error: picksErr } = await supabase
    .from("match_pool_picks")
    .insert(pickRows);
  if (picksErr) {
    // Best-effort cleanup of the entry row so the user can retry cleanly.
    await supabase
      .from("match_pool_entries")
      .delete()
      .eq("pool_id", poolId)
      .eq("user_id", user.id);
    return { ok: false, error: "unknown", message: picksErr.message };
  }

  revalidatePath("/cine-match");
  revalidatePath("/cine-match/matches");
  return { ok: true, entry_id: `${poolId}:${user.id}` };
}

// ---------------------------------------------------------------------------
// 5.2 updatePoolPicks
// ---------------------------------------------------------------------------

export async function updatePoolPicks(input: {
  picks: number[];
}): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const parsed = picksSchema.safeParse(input.picks);
  if (!parsed.success) return { ok: false, error: "invalid_picks" };
  const picks = parsed.data;

  const today = new Date().toISOString().slice(0, 10);
  const { data: pool } = await supabase
    .from("match_pools")
    .select("id, status")
    .lte("period_start", today)
    .gte("period_end", today)
    .order("period_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!pool) return { ok: false, error: "no_pool" };
  const p = pool as { id: number; status: string };
  if (p.status !== "open") return { ok: false, error: "pool_locked" };

  const { data: entry } = await supabase
    .from("match_pool_entries")
    .select("user_id")
    .eq("pool_id", p.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!entry) return { ok: false, error: "not_joined" };

  // Library check
  const { data: lib } = await supabase
    .from("user_movies")
    .select("movie_id")
    .eq("user_id", user.id)
    .in("movie_id", picks);
  const ownIds = new Set(
    ((lib ?? []) as { movie_id: number }[]).map((r) => r.movie_id),
  );
  if (picks.some((id) => !ownIds.has(id))) {
    return { ok: false, error: "invalid_picks" };
  }

  // Replace picks: delete then insert (no update path on a composite PK row set).
  const { error: delErr } = await supabase
    .from("match_pool_picks")
    .delete()
    .eq("pool_id", p.id)
    .eq("user_id", user.id);
  if (delErr) return { ok: false, error: "unknown", message: delErr.message };

  const pickRows = picks.map((movie_id, i) => ({
    pool_id: p.id,
    user_id: user.id,
    movie_id,
    sort_order: i,
  }));
  const { error: insErr } = await supabase
    .from("match_pool_picks")
    .insert(pickRows);
  if (insErr) return { ok: false, error: "unknown", message: insErr.message };

  revalidatePath("/cine-match");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// 5.3 leavePool
// ---------------------------------------------------------------------------

export async function leavePool(): Promise<ActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const today = new Date().toISOString().slice(0, 10);
  const { data: pool } = await supabase
    .from("match_pools")
    .select("id, status")
    .lte("period_start", today)
    .gte("period_end", today)
    .order("period_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!pool) return { ok: false, error: "no_pool" };
  const p = pool as { id: number; status: string };
  if (p.status !== "open") return { ok: false, error: "pool_locked" };

  // ON DELETE CASCADE on match_pool_picks → entry delete also clears picks.
  const { error } = await supabase
    .from("match_pool_entries")
    .delete()
    .eq("pool_id", p.id)
    .eq("user_id", user.id);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath("/cine-match");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// 5.4 hideMatch / unhideMatch
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
// 5.5 setMatchConsent
// ---------------------------------------------------------------------------

export async function setMatchConsent(
  matchId: string,
  granted: boolean,
): Promise<ActionResult<{ both_consented: boolean }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  // Match exists + viewer is a party.
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

  // Block check: refuse if either side blocks the other.
  const partnerId = m.user_a === user.id ? m.user_b : m.user_a;
  const { data: blocks } = await supabase
    .from("blocks")
    .select("blocker_id, blocked_id")
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`,
    );
  if ((blocks ?? []).length > 0) {
    return { ok: false, error: "blocked" };
  }

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
// 5.6 sendMatchMessage
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

  // Party + block + consent — DB policies enforce the same; we surface clean
  // error codes for UI toasts.
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

  // Rate limit: 30 / 60s across all matches for this user.
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

// ---------------------------------------------------------------------------
// markMessagesRead — flip read_at on partner messages.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Re-export so the picks bounds are reachable from server pages without
// importing the types module separately.
// ---------------------------------------------------------------------------

export const limits = { PICKS_MIN, PICKS_MAX } as const;
