// CineMatch — domain types.
//
// v2 model: anytime pool + weekly "find a new match" requests (max 3 / 7d).
// Scoring: 70% personality axes + 30% watched-films overlap.
// Matches land at ≥90% similarity, or after 7 days the closest candidate
// becomes a fallback match (is_fallback=true).

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
  watched: {
    shared_count: number;
  };
};

// Wire shape the matcher writes to matches.breakdown_json.
export type BreakdownJson = {
  a: { user_id: string; type_code: string; axes: [number, number, number, number] };
  b: { user_id: string; type_code: string; axes: [number, number, number, number] };
  watched_shared_count: number;
};

export type MatchRow = {
  id: string;
  user_a: string;
  user_b: string;
  similarity_pct: number;
  axes_pct: number;
  watched_pct: number;
  breakdown_json: BreakdownJson;
  is_fallback: boolean;
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
  similarity_pct: number;
  axes_pct: number;
  watched_pct: number;
  is_fallback: boolean;
  hidden_at: string | null;
  created_at: string;
  partner: MatchPartner;
  both_consented: boolean;
  partner_consented: boolean;
  viewer_consented: boolean;
  unread_count: number;
};

export type MatchDetail = MatchListItem & {
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

export type MatchPoolEntry = {
  user_id: string;
  type_code: string;
  axis_1_pct: number;
  axis_2_pct: number;
  axis_3_pct: number;
  axis_4_pct: number;
  watched_count: number;
  joined_at: string;
  refreshed_at: string;
};

export type MatchRequest = {
  id: string;
  user_id: string;
  requested_at: string;
  status: "pending" | "fulfilled" | "cancelled";
  match_id: string | null;
  resolved_at: string | null;
};

export type RequestQuota = {
  used: number;            // 0..3
  remaining: number;       // 3 - used
  nextSlotAt: string | null; // when the oldest non-expired request rolls off
  pending: MatchRequest[];
};

export type EligibilityState =
  | { ok: true; alreadyJoined: boolean; watchedCount: number }
  | { ok: false; reason: "no_test"; watchedCount: number }
  | { ok: false; reason: "watched_too_few"; watchedCount: number };

export const MATCH_THRESHOLD = 90;
export const WATCHED_MIN = 20;
export const WEEKLY_REQUEST_LIMIT = 3;
export const FALLBACK_WAIT_DAYS = 7;
export const AXES_WEIGHT = 0.7;
export const WATCHED_WEIGHT = 0.3;
export const MESSAGE_MAX_LEN = 2000;
export const MESSAGE_RATE_PER_MIN = 30;
