// CineMatch — domain types.
// See docs/specs/cinematch.md for the full feature spec.

export type MatchPoolStatus = "open" | "locked" | "computing" | "closed";

export type MatchPool = {
  id: number;
  period_start: string; // ISO date "YYYY-MM-DD"
  period_end: string;
  status: MatchPoolStatus;
  created_at: string;
};

export type MatchPoolEntry = {
  pool_id: number;
  user_id: string;
  type_code: string;
  axis_1_pct: number;
  axis_2_pct: number;
  axis_3_pct: number;
  axis_4_pct: number;
  joined_at: string;
  locked_at: string | null;
};

export type MatchPoolPick = {
  pool_id: number;
  user_id: string;
  movie_id: number;
  sort_order: number;
};

export type AxisBreakdown = {
  self_pct: number;
  other_pct: number;
  delta: number;
  label_self: string;
  label_other: string;
};

export type MatchBreakdown = {
  axes: {
    axis_1: AxisBreakdown;
    axis_2: AxisBreakdown;
    axis_3: AxisBreakdown;
    axis_4: AxisBreakdown;
  };
  picks: {
    self: number[]; // tmdb_ids
    other: number[];
    shared: number[];
    shared_count: number;
    union_count: number;
    jaccard_pct: number;
  };
  watched: {
    shared_count: number;
    union_count: number;
    jaccard_pct: number;
    top_shared_tmdb_ids: number[];
  };
};

export type MatchRow = {
  id: string;
  pool_id: number;
  user_a: string;
  user_b: string;
  similarity_pct: number;
  axes_pct: number;
  picks_pct: number;
  watched_pct: number;
  breakdown_json: MatchBreakdown;
  hidden_at: string | null;
  created_at: string;
};

export type MatchPartner = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  type_code: string | null;
};

export type MatchListItem = {
  id: string;
  pool_id: number;
  similarity_pct: number;
  axes_pct: number;
  picks_pct: number;
  watched_pct: number;
  hidden_at: string | null;
  created_at: string;
  partner: MatchPartner;
  both_consented: boolean;
  partner_consented: boolean;
  viewer_consented: boolean;
  unread_count: number;
};

export type MatchDetail = MatchListItem & {
  pool: MatchPool;
  breakdown: MatchBreakdown;
  is_user_a: boolean;
};

export type MatchMessage = {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

export type EligibilityState =
  | { ok: true; pool: MatchPool; alreadyJoined: boolean }
  | { ok: false; reason: "no_test"; pool: MatchPool | null }
  | { ok: false; reason: "watched_too_few"; watchedCount: number; pool: MatchPool | null }
  | { ok: false; reason: "pool_locked"; pool: MatchPool }
  | { ok: false; reason: "no_pool" };

export const MATCH_THRESHOLD = 90;
export const PICKS_MIN = 5;
export const PICKS_MAX = 10;
export const WATCHED_MIN = 10;
export const WATCHED_RECENT_CAP = 200;
export const TOP_SHARED_MAX = 8;
export const MESSAGE_MAX_LEN = 2000;
export const MESSAGE_RATE_PER_MIN = 30;
