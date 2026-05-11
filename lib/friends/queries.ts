import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  FriendMessage,
  FriendPartner,
  FriendshipRow,
  FriendshipState,
  FriendshipView,
} from "./types";

type Supabase = SupabaseClient;

const PAIR_SELECT =
  "id, user_a, user_b, requester_id, status, created_at, accepted_at";

function pairKey(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

// ---------------------------------------------------------------------------
// friendship state between viewer and a target user
// ---------------------------------------------------------------------------

export async function getFriendshipState(
  supabase: Supabase,
  viewerId: string,
  targetId: string,
): Promise<FriendshipState> {
  if (viewerId === targetId) return { kind: "none" };
  const [a, b] = pairKey(viewerId, targetId);
  const { data } = await supabase
    .from("friendships")
    .select(PAIR_SELECT)
    .eq("user_a", a)
    .eq("user_b", b)
    .maybeSingle();
  const row = (data as FriendshipRow | null) ?? null;
  if (!row) return { kind: "none" };
  if (row.status === "accepted") return { kind: "accepted", id: row.id };
  return row.requester_id === viewerId
    ? { kind: "pending_outgoing", id: row.id }
    : { kind: "pending_incoming", id: row.id };
}

// ---------------------------------------------------------------------------
// list helpers — accepted friends, incoming requests, outgoing requests
// ---------------------------------------------------------------------------

async function attachPartners(
  supabase: Supabase,
  rows: FriendshipRow[],
  viewerId: string,
): Promise<Map<string, FriendPartner>> {
  if (rows.length === 0) return new Map();
  const ids = Array.from(
    new Set(rows.map((r) => (r.user_a === viewerId ? r.user_b : r.user_a))),
  );
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids);
  const map = new Map<string, FriendPartner>();
  for (const row of (data ?? []) as FriendPartner[]) {
    map.set(row.id, row);
  }
  return map;
}

function shape(row: FriendshipRow, viewerId: string, partner: FriendPartner | undefined): FriendshipView {
  const partnerId = row.user_a === viewerId ? row.user_b : row.user_a;
  return {
    id: row.id,
    status: row.status,
    created_at: row.created_at,
    accepted_at: row.accepted_at,
    viewer_is_requester: row.requester_id === viewerId,
    partner:
      partner ?? {
        id: partnerId,
        username: null,
        display_name: null,
        avatar_url: null,
      },
  };
}

export async function listFriends(
  supabase: Supabase,
  viewerId: string,
  limit = 100,
): Promise<FriendshipView[]> {
  const { data } = await supabase
    .from("friendships")
    .select(PAIR_SELECT)
    .eq("status", "accepted")
    .or(`user_a.eq.${viewerId},user_b.eq.${viewerId}`)
    .order("accepted_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  const rows = (data ?? []) as FriendshipRow[];
  const partners = await attachPartners(supabase, rows, viewerId);
  return rows.map((r) =>
    shape(
      r,
      viewerId,
      partners.get(r.user_a === viewerId ? r.user_b : r.user_a),
    ),
  );
}

export async function listIncomingRequests(
  supabase: Supabase,
  viewerId: string,
): Promise<FriendshipView[]> {
  const { data } = await supabase
    .from("friendships")
    .select(PAIR_SELECT)
    .eq("status", "pending")
    .or(`user_a.eq.${viewerId},user_b.eq.${viewerId}`)
    .neq("requester_id", viewerId)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as FriendshipRow[];
  const partners = await attachPartners(supabase, rows, viewerId);
  return rows.map((r) =>
    shape(
      r,
      viewerId,
      partners.get(r.user_a === viewerId ? r.user_b : r.user_a),
    ),
  );
}

export async function listOutgoingRequests(
  supabase: Supabase,
  viewerId: string,
): Promise<FriendshipView[]> {
  const { data } = await supabase
    .from("friendships")
    .select(PAIR_SELECT)
    .eq("status", "pending")
    .eq("requester_id", viewerId)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as FriendshipRow[];
  const partners = await attachPartners(supabase, rows, viewerId);
  return rows.map((r) =>
    shape(
      r,
      viewerId,
      partners.get(r.user_a === viewerId ? r.user_b : r.user_a),
    ),
  );
}

// ---------------------------------------------------------------------------
// thread detail + messages
// ---------------------------------------------------------------------------

export type FriendshipDetail = FriendshipView & {
  viewer_id: string;
  partner_id: string;
};

export async function getFriendshipForChat(
  supabase: Supabase,
  viewerId: string,
  targetUsername: string,
): Promise<FriendshipDetail | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, deactivated_at")
    .eq("username", targetUsername)
    .maybeSingle<{
      id: string;
      username: string;
      display_name: string | null;
      avatar_url: string | null;
      deactivated_at: string | null;
    }>();
  if (!profile || profile.deactivated_at) return null;
  if (profile.id === viewerId) return null;

  const [a, b] = pairKey(viewerId, profile.id);
  const { data } = await supabase
    .from("friendships")
    .select(PAIR_SELECT)
    .eq("user_a", a)
    .eq("user_b", b)
    .maybeSingle();
  const row = (data as FriendshipRow | null) ?? null;
  if (!row || row.status !== "accepted") return null;

  const view = shape(row, viewerId, {
    id: profile.id,
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
  });
  return { ...view, viewer_id: viewerId, partner_id: profile.id };
}

export async function listFriendMessages(
  supabase: Supabase,
  friendshipId: string,
  limit = 100,
): Promise<FriendMessage[]> {
  const { data } = await supabase
    .from("friend_messages")
    .select("id, friendship_id, sender_id, body, created_at, read_at")
    .eq("friendship_id", friendshipId)
    .order("created_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as FriendMessage[];
}

export async function countUnreadFromPartner(
  supabase: Supabase,
  friendshipId: string,
  viewerId: string,
): Promise<number> {
  const { count } = await supabase
    .from("friend_messages")
    .select("id", { count: "exact", head: true })
    .eq("friendship_id", friendshipId)
    .neq("sender_id", viewerId)
    .is("read_at", null);
  return count ?? 0;
}
