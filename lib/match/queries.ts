import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { MovieRow } from "@/lib/films/types";

import {
  WATCHED_MIN,
  type EligibilityState,
  type MatchBreakdown,
  type MatchDetail,
  type MatchListItem,
  type MatchMessage,
  type MatchPartner,
  type MatchPool,
  type MatchRow,
} from "./types";

type Supabase = SupabaseClient;

export async function getViewerId(supabase: Supabase): Promise<string | null> {
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

// ---------------------------------------------------------------------------
// pools
// ---------------------------------------------------------------------------

export async function getCurrentPool(
  supabase: Supabase,
): Promise<MatchPool | null> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("match_pools")
    .select("id, period_start, period_end, status, created_at")
    .lte("period_start", today)
    .gte("period_end", today)
    .order("period_start", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as MatchPool) ?? null;
}

export async function getPool(
  supabase: Supabase,
  poolId: number,
): Promise<MatchPool | null> {
  const { data } = await supabase
    .from("match_pools")
    .select("id, period_start, period_end, status, created_at")
    .eq("id", poolId)
    .maybeSingle();
  return (data as MatchPool) ?? null;
}

export function poolWindowLabel(pool: MatchPool): string {
  const start = new Date(`${pool.period_start}T00:00:00Z`);
  return start.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function daysUntilPoolClose(pool: MatchPool): number {
  const end = new Date(`${pool.period_end}T23:59:59Z`).getTime();
  const ms = end - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// ---------------------------------------------------------------------------
// eligibility
// ---------------------------------------------------------------------------

export async function getEligibility(
  supabase: Supabase,
  viewerId: string,
): Promise<EligibilityState> {
  const pool = await getCurrentPool(supabase);

  const { data: latestResult } = await supabase
    .from("cp_results")
    .select("type_code")
    .eq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const typeCode = (latestResult as { type_code: string | null } | null)
    ?.type_code;

  if (!typeCode) {
    return { ok: false, reason: "no_test", pool };
  }

  const { count } = await supabase
    .from("user_movies")
    .select("movie_id", { count: "exact", head: true })
    .eq("user_id", viewerId)
    .eq("status", "watched");
  const watchedCount = count ?? 0;
  if (watchedCount < WATCHED_MIN) {
    return { ok: false, reason: "watched_too_few", watchedCount, pool };
  }

  if (!pool) {
    return { ok: false, reason: "no_pool" };
  }
  if (pool.status !== "open") {
    return { ok: false, reason: "pool_locked", pool };
  }

  const { data: entry } = await supabase
    .from("match_pool_entries")
    .select("user_id")
    .eq("pool_id", pool.id)
    .eq("user_id", viewerId)
    .maybeSingle();

  return { ok: true, pool, alreadyJoined: !!entry };
}

// ---------------------------------------------------------------------------
// own picks for current pool (used by the wizard edit screen)
// ---------------------------------------------------------------------------

export async function getOwnPoolPicks(
  supabase: Supabase,
  poolId: number,
  viewerId: string,
): Promise<MovieRow[]> {
  const { data: picks } = await supabase
    .from("match_pool_picks")
    .select("movie_id, sort_order")
    .eq("pool_id", poolId)
    .eq("user_id", viewerId)
    .order("sort_order", { ascending: true });
  const rows = (picks ?? []) as { movie_id: number; sort_order: number }[];
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.movie_id);

  const { data: movies } = await supabase
    .from("movies")
    .select(
      "id, tmdb_id, title, original_title, release_date, poster_path, vote_average, vote_count, popularity, original_language",
    )
    .in("id", ids);

  const byId = new Map(
    ((movies ?? []) as Partial<MovieRow>[]).map((m) => [m.id as number, m]),
  );
  return rows
    .map((r) => byId.get(r.movie_id))
    .filter((m): m is Partial<MovieRow> => !!m)
    .map((m) => ({
      ...m,
      watched: false,
      in_watchlist: false,
    })) as MovieRow[];
}

// Films a user can pick from: their own watched + watchlist.
export async function getOwnLibraryForPicker(
  supabase: Supabase,
  viewerId: string,
  query?: string,
): Promise<MovieRow[]> {
  const { data: lib } = await supabase
    .from("user_movies")
    .select("movie_id, status, created_at")
    .eq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = (lib ?? []) as {
    movie_id: number;
    status: "watched" | "watchlist";
    created_at: string;
  }[];
  if (rows.length === 0) return [];
  const ids = Array.from(new Set(rows.map((r) => r.movie_id)));
  const statusByMovie = new Map<number, { watched: boolean; watchlist: boolean }>();
  for (const r of rows) {
    const cur = statusByMovie.get(r.movie_id) ?? {
      watched: false,
      watchlist: false,
    };
    if (r.status === "watched") cur.watched = true;
    else cur.watchlist = true;
    statusByMovie.set(r.movie_id, cur);
  }

  let q = supabase
    .from("movies")
    .select(
      "id, tmdb_id, title, original_title, release_date, poster_path, vote_average, vote_count, popularity, original_language",
    )
    .in("id", ids)
    .order("popularity", { ascending: false, nullsFirst: false })
    .limit(200);

  if (query && query.trim().length >= 1) {
    const term = query.trim().replace(/[%_]/g, "");
    q = q.ilike("title", `%${term}%`);
  }

  const { data: movies } = await q;
  return ((movies ?? []) as Partial<MovieRow>[]).map((m) => ({
    ...m,
    watched: statusByMovie.get(m.id as number)?.watched ?? false,
    in_watchlist: statusByMovie.get(m.id as number)?.watchlist ?? false,
  })) as MovieRow[];
}

// ---------------------------------------------------------------------------
// matches (list + detail)
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

  const { data: results } = await supabase
    .from("cp_results")
    .select("user_id, type_code, created_at")
    .in("user_id", partnerIds)
    .order("created_at", { ascending: false });
  const latestTypeByUser = new Map<string, string>();
  for (const r of (results ?? []) as {
    user_id: string;
    type_code: string;
    created_at: string;
  }[]) {
    if (!latestTypeByUser.has(r.user_id)) {
      latestTypeByUser.set(r.user_id, r.type_code);
    }
  }

  const map = new Map<string, MatchPartner>();
  for (const row of (data ?? []) as Omit<MatchPartner, "type_code">[]) {
    map.set(row.id, {
      id: row.id,
      username: row.username,
      display_name: row.display_name,
      avatar_url: row.avatar_url,
      type_code: latestTypeByUser.get(row.id) ?? null,
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

export type ListMatchesParams = {
  scope: "current" | "past";
  limit?: number;
};

export async function listMatches(
  supabase: Supabase,
  viewerId: string,
  params: ListMatchesParams,
): Promise<MatchListItem[]> {
  const limit = params.limit ?? 25;

  let q = supabase
    .from("matches")
    .select(
      "id, pool_id, user_a, user_b, similarity_pct, axes_pct, picks_pct, watched_pct, breakdown_json, hidden_at, created_at",
    )
    .or(`user_a.eq.${viewerId},user_b.eq.${viewerId}`)
    .is("hidden_at", null)
    .order("similarity_pct", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params.scope === "current") {
    const pool = await getCurrentPool(supabase);
    if (!pool) return [];
    q = q.eq("pool_id", pool.id);
  } else {
    const pool = await getCurrentPool(supabase);
    if (pool) q = q.neq("pool_id", pool.id);
  }

  const { data, error } = await q;
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
    const c = consents.get(r.id) ?? {
      both: false,
      partner: false,
      viewer: false,
    };
    return {
      id: r.id,
      pool_id: r.pool_id,
      similarity_pct: r.similarity_pct,
      axes_pct: r.axes_pct,
      picks_pct: r.picks_pct,
      watched_pct: r.watched_pct,
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
    .select(
      "id, pool_id, user_a, user_b, similarity_pct, axes_pct, picks_pct, watched_pct, breakdown_json, hidden_at, created_at",
    )
    .eq("id", matchId)
    .maybeSingle();
  if (error || !data) return null;
  const row = data as MatchRow;
  if (row.user_a !== viewerId && row.user_b !== viewerId) return null;

  const pool = await getPool(supabase, row.pool_id);
  if (!pool) return null;

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
  const c = consents.get(row.id) ?? {
    both: false,
    partner: false,
    viewer: false,
  };

  // Re-orient breakdown to viewer's perspective: stored breakdown is in
  // user_a/user_b order. Compute job emits it that way.
  const breakdown = row.breakdown_json as MatchBreakdown;
  const reoriented = row.user_a === viewerId
    ? breakdown
    : flipBreakdown(breakdown);

  return {
    id: row.id,
    pool_id: row.pool_id,
    similarity_pct: row.similarity_pct,
    axes_pct: row.axes_pct,
    picks_pct: row.picks_pct,
    watched_pct: row.watched_pct,
    hidden_at: row.hidden_at,
    created_at: row.created_at,
    pool,
    breakdown: reoriented,
    partner,
    both_consented: c.both,
    partner_consented: c.partner,
    viewer_consented: c.viewer,
    unread_count: unread.get(row.id) ?? 0,
    is_user_a: row.user_a === viewerId,
  };
}

function flipBreakdown(b: MatchBreakdown): MatchBreakdown {
  const flipAxis = (a: MatchBreakdown["axes"]["axis_1"]) => ({
    self_pct: a.other_pct,
    other_pct: a.self_pct,
    delta: a.delta,
    label_self: a.label_other,
    label_other: a.label_self,
  });
  return {
    axes: {
      axis_1: flipAxis(b.axes.axis_1),
      axis_2: flipAxis(b.axes.axis_2),
      axis_3: flipAxis(b.axes.axis_3),
      axis_4: flipAxis(b.axes.axis_4),
    },
    picks: {
      self: b.picks.other,
      other: b.picks.self,
      shared: b.picks.shared,
      shared_count: b.picks.shared_count,
      union_count: b.picks.union_count,
      jaccard_pct: b.picks.jaccard_pct,
    },
    watched: b.watched,
  };
}

// ---------------------------------------------------------------------------
// movies by tmdb_id (used in detail page poster lookup)
// ---------------------------------------------------------------------------

export async function getMoviesByTmdbIds(
  supabase: Supabase,
  tmdbIds: number[],
): Promise<MovieRow[]> {
  if (tmdbIds.length === 0) return [];
  const { data } = await supabase
    .from("movies")
    .select(
      "id, tmdb_id, title, original_title, release_date, poster_path, vote_average, vote_count, popularity, original_language",
    )
    .in("tmdb_id", tmdbIds);
  return ((data ?? []) as Partial<MovieRow>[]).map((m) => ({
    ...m,
    watched: false,
    in_watchlist: false,
  })) as MovieRow[];
}

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
