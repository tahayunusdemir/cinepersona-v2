import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { axes as cinepersonaAxes } from "@/lib/cinepersona";

import { axesScore } from "./score";
import {
  FALLBACK_WAIT_DAYS,
  WATCHED_MIN,
  WEEKLY_REQUEST_LIMIT,
  type AxisBreakdown,
  type BreakdownJson,
  type EligibilityState,
  type MatchBreakdown,
  type MatchDetail,
  type MatchListItem,
  type MatchMessage,
  type MatchPartner,
  type MatchPoolEntry,
  type MatchRequest,
  type MatchRow,
  type RequestQuota,
} from "./types";

type Supabase = SupabaseClient;

export async function getViewerId(supabase: Supabase): Promise<string | null> {
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

// ---------------------------------------------------------------------------
// eligibility — gate on test result + ≥WATCHED_MIN watched films.
// ---------------------------------------------------------------------------

export async function getEligibility(
  supabase: Supabase,
  viewerId: string,
): Promise<EligibilityState> {
  const { data: latestResult } = await supabase
    .from("cp_results")
    .select("type_code")
    .eq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const typeCode = (latestResult as { type_code: string | null } | null)
    ?.type_code;

  const { count } = await supabase
    .from("user_movies")
    .select("movie_id", { count: "exact", head: true })
    .eq("user_id", viewerId)
    .eq("status", "watched");
  const watchedCount = count ?? 0;

  if (!typeCode) return { ok: false, reason: "no_test", watchedCount };
  if (watchedCount < WATCHED_MIN) {
    return { ok: false, reason: "watched_too_few", watchedCount };
  }

  const { data: entry } = await supabase
    .from("match_pool")
    .select("user_id")
    .eq("user_id", viewerId)
    .maybeSingle();

  return { ok: true, alreadyJoined: !!entry, watchedCount };
}

// ---------------------------------------------------------------------------
// pool membership (current viewer)
// ---------------------------------------------------------------------------

export async function getPoolEntry(
  supabase: Supabase,
  viewerId: string,
): Promise<MatchPoolEntry | null> {
  const { data } = await supabase
    .from("match_pool")
    .select(
      "user_id, type_code, axis_1_pct, axis_2_pct, axis_3_pct, axis_4_pct, watched_count, joined_at, refreshed_at",
    )
    .eq("user_id", viewerId)
    .maybeSingle();
  return (data as MatchPoolEntry) ?? null;
}

// ---------------------------------------------------------------------------
// request quota — used / remaining for the rolling 7-day window.
// ---------------------------------------------------------------------------

export async function getRequestQuota(
  supabase: Supabase,
  viewerId: string,
): Promise<RequestQuota> {
  const sinceMs = Date.now() - FALLBACK_WAIT_DAYS * 24 * 60 * 60 * 1000;
  const since = new Date(sinceMs).toISOString();

  const { data } = await supabase
    .from("match_requests")
    .select("id, user_id, requested_at, status, match_id, resolved_at")
    .eq("user_id", viewerId)
    .gte("requested_at", since)
    .order("requested_at", { ascending: true });

  const rows = (data ?? []) as MatchRequest[];
  const used = rows.length;
  const oldest = rows[0];
  const nextSlotAt = oldest
    ? new Date(
        new Date(oldest.requested_at).getTime() +
          FALLBACK_WAIT_DAYS * 24 * 60 * 60 * 1000,
      ).toISOString()
    : null;

  return {
    used,
    remaining: Math.max(0, WEEKLY_REQUEST_LIMIT - used),
    nextSlotAt,
    pending: rows.filter((r) => r.status === "pending"),
  };
}

// ---------------------------------------------------------------------------
// matches list + detail
// ---------------------------------------------------------------------------

async function attachPartners(
  supabase: Supabase,
  rows: MatchRow[],
  viewerId: string,
): Promise<Map<string, MatchPartner>> {
  if (rows.length === 0) return new Map();
  const partnerIds = Array.from(
    new Set(rows.map((r) => (r.user_a === viewerId ? r.user_b : r.user_a))),
  );
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", partnerIds);

  // Pull each partner's type from the pool snapshot first (cheap, current),
  // fall back to the breakdown_json embedded on the match row otherwise.
  const { data: poolRows } = await supabase
    .from("match_pool")
    .select("user_id, type_code")
    .in("user_id", partnerIds);
  const typeByUser = new Map<string, string>();
  for (const r of (poolRows ?? []) as {
    user_id: string;
    type_code: string;
  }[]) {
    typeByUser.set(r.user_id, r.type_code);
  }
  // Fallback: extract from breakdown_json on the match rows themselves.
  for (const row of rows) {
    const bd = row.breakdown_json;
    if (!typeByUser.has(bd.a.user_id)) typeByUser.set(bd.a.user_id, bd.a.type_code);
    if (!typeByUser.has(bd.b.user_id)) typeByUser.set(bd.b.user_id, bd.b.type_code);
  }

  const map = new Map<string, MatchPartner>();
  for (const row of (data ?? []) as Omit<MatchPartner, "type_code">[]) {
    map.set(row.id, {
      id: row.id,
      username: row.username,
      display_name: row.display_name,
      avatar_url: row.avatar_url,
      type_code: typeByUser.get(row.id) ?? null,
    });
  }
  return map;
}

async function attachConsents(
  supabase: Supabase,
  matchIds: string[],
  viewerId: string,
): Promise<Map<string, { both: boolean; partner: boolean; viewer: boolean }>> {
  const result = new Map<
    string,
    { both: boolean; partner: boolean; viewer: boolean }
  >();
  if (matchIds.length === 0) return result;
  const { data } = await supabase
    .from("match_consents")
    .select("match_id, user_id")
    .in("match_id", matchIds);
  const grouped = new Map<string, Set<string>>();
  for (const row of (data ?? []) as { match_id: string; user_id: string }[]) {
    if (!grouped.has(row.match_id)) grouped.set(row.match_id, new Set());
    grouped.get(row.match_id)!.add(row.user_id);
  }
  for (const id of matchIds) {
    const set = grouped.get(id) ?? new Set<string>();
    result.set(id, {
      both: set.size === 2,
      partner: Array.from(set).some((u) => u !== viewerId),
      viewer: set.has(viewerId),
    });
  }
  return result;
}

async function attachUnread(
  supabase: Supabase,
  matchIds: string[],
  viewerId: string,
): Promise<Map<string, number>> {
  const result = new Map<string, number>();
  if (matchIds.length === 0) return result;
  const { data } = await supabase
    .from("match_messages")
    .select("match_id")
    .in("match_id", matchIds)
    .neq("sender_id", viewerId)
    .is("read_at", null);
  for (const row of (data ?? []) as { match_id: string }[]) {
    result.set(row.match_id, (result.get(row.match_id) ?? 0) + 1);
  }
  return result;
}

const MATCH_SELECT =
  "id, user_a, user_b, similarity_pct, axes_pct, watched_pct, breakdown_json, is_fallback, hidden_at, created_at";

export async function listMatches(
  supabase: Supabase,
  viewerId: string,
  limit = 50,
): Promise<MatchListItem[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .or(`user_a.eq.${viewerId},user_b.eq.${viewerId}`)
    .is("hidden_at", null)
    .order("similarity_pct", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("listMatches failed:", error.message);
    return [];
  }
  const rows = (data ?? []) as MatchRow[];

  const [partners, consents, unread] = await Promise.all([
    attachPartners(supabase, rows, viewerId),
    attachConsents(
      supabase,
      rows.map((r) => r.id),
      viewerId,
    ),
    attachUnread(
      supabase,
      rows.map((r) => r.id),
      viewerId,
    ),
  ]);

  return rows.map((r) => {
    const partnerId = r.user_a === viewerId ? r.user_b : r.user_a;
    const partner = partners.get(partnerId) ?? {
      id: partnerId,
      username: null,
      display_name: null,
      avatar_url: null,
      type_code: null,
    };
    const c = consents.get(r.id) ?? { both: false, partner: false, viewer: false };
    return {
      id: r.id,
      similarity_pct: r.similarity_pct,
      axes_pct: r.axes_pct,
      watched_pct: r.watched_pct,
      is_fallback: r.is_fallback,
      hidden_at: r.hidden_at,
      created_at: r.created_at,
      partner,
      both_consented: c.both,
      partner_consented: c.partner,
      viewer_consented: c.viewer,
      unread_count: unread.get(r.id) ?? 0,
    };
  });
}

export async function getMatchDetail(
  supabase: Supabase,
  matchId: string,
  viewerId: string,
): Promise<MatchDetail | null> {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("id", matchId)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as MatchRow;
  if (row.user_a !== viewerId && row.user_b !== viewerId) return null;

  const [partners, consents, unread] = await Promise.all([
    attachPartners(supabase, [row], viewerId),
    attachConsents(supabase, [row.id], viewerId),
    attachUnread(supabase, [row.id], viewerId),
  ]);

  const partnerId = row.user_a === viewerId ? row.user_b : row.user_a;
  const partner = partners.get(partnerId) ?? {
    id: partnerId,
    username: null,
    display_name: null,
    avatar_url: null,
    type_code: null,
  };
  const c = consents.get(row.id) ?? { both: false, partner: false, viewer: false };

  const breakdown = buildBreakdown(row.breakdown_json, viewerId);

  return {
    id: row.id,
    similarity_pct: row.similarity_pct,
    axes_pct: row.axes_pct,
    watched_pct: row.watched_pct,
    is_fallback: row.is_fallback,
    hidden_at: row.hidden_at,
    created_at: row.created_at,
    partner,
    both_consented: c.both,
    partner_consented: c.partner,
    viewer_consented: c.viewer,
    unread_count: unread.get(row.id) ?? 0,
    breakdown,
    is_user_a: row.user_a === viewerId,
  };
}

// ---------------------------------------------------------------------------
// breakdown — turn the stored JSON snapshot into the UI's perspective view.
// ---------------------------------------------------------------------------

function buildBreakdown(
  raw: BreakdownJson,
  viewerId: string,
): MatchBreakdown {
  const isViewerA = raw.a.user_id === viewerId;
  const selfAxes = isViewerA ? raw.a.axes : raw.b.axes;
  const otherAxes = isViewerA ? raw.b.axes : raw.a.axes;

  const sharedCount = raw.watched_shared_count ?? 0;

  return {
    axes: {
      axis_1: makeAxisBreakdown(0, selfAxes, otherAxes),
      axis_2: makeAxisBreakdown(1, selfAxes, otherAxes),
      axis_3: makeAxisBreakdown(2, selfAxes, otherAxes),
      axis_4: makeAxisBreakdown(3, selfAxes, otherAxes),
    },
    watched: { shared_count: sharedCount },
  };
}

function makeAxisBreakdown(
  idx: number,
  self: readonly number[],
  other: readonly number[],
): AxisBreakdown {
  const axis = cinepersonaAxes[idx];
  const selfPct = self[idx] ?? 50;
  const otherPct = other[idx] ?? 50;
  return {
    self_pct: selfPct,
    other_pct: otherPct,
    delta: Math.abs(selfPct - otherPct),
    label_self:
      selfPct >= 50 ? axis?.primary.name ?? "" : axis?.opposite.name ?? "",
    label_other:
      otherPct >= 50 ? axis?.primary.name ?? "" : axis?.opposite.name ?? "",
  };
}

// Expose axes scoring helper for previews (admin / debug UIs).
export { axesScore };

// ---------------------------------------------------------------------------
// messages
// ---------------------------------------------------------------------------

export async function listMessages(
  supabase: Supabase,
  matchId: string,
  limit = 100,
): Promise<MatchMessage[]> {
  const { data } = await supabase
    .from("match_messages")
    .select("id, match_id, sender_id, body, created_at, read_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as MatchMessage[];
}
