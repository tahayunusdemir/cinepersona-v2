"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { friendMessageSchema } from "./schemas";
import { FRIEND_MESSAGE_RATE_PER_MIN } from "./types";

export type FriendActionError =
  | "unauthorized"
  | "validation"
  | "blocked"
  | "not_found"
  | "not_party"
  | "not_accepted"
  | "already_friends"
  | "already_requested"
  | "rate_limited"
  | "too_long"
  | "unknown";

export type FriendActionResult<T = void> =
  | ({ ok: true } & (T extends void ? object : T))
  | { ok: false; error: FriendActionError; message?: string };

async function requireUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

function pairKey(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

// ---------------------------------------------------------------------------
// sendFriendRequest — viewer requests friendship with target.
// ---------------------------------------------------------------------------

export async function sendFriendRequest(
  targetId: string,
  targetUsername?: string | null,
): Promise<FriendActionResult<{ id: string }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };
  if (user.id === targetId) return { ok: false, error: "validation" };

  // Surface the "you've blocked them" case with a clear error. The
  // reverse-block case is opaque (RLS won't tell us) and falls through to a
  // generic insert error.
  const { data: viewerBlock } = await supabase
    .from("blocks")
    .select("blocker_id")
    .eq("blocker_id", user.id)
    .eq("blocked_id", targetId)
    .maybeSingle();
  if (viewerBlock) return { ok: false, error: "blocked" };

  const [a, b] = pairKey(user.id, targetId);

  // Friendly pre-check — RLS still enforces uniqueness, but this lets us
  // distinguish "already accepted" from "already pending" for the UI.
  const { data: existing } = await supabase
    .from("friendships")
    .select("id, status, requester_id")
    .eq("user_a", a)
    .eq("user_b", b)
    .maybeSingle<{ id: string; status: string; requester_id: string }>();
  if (existing) {
    if (existing.status === "accepted") {
      return { ok: false, error: "already_friends" };
    }
    if (existing.requester_id === user.id) {
      return { ok: false, error: "already_requested" };
    }
    // Pending and the OTHER side asked us — auto-accept instead of inserting.
    return acceptFriendRequest(existing.id, targetUsername).then((r) =>
      r.ok ? { ok: true, id: existing.id } : r,
    );
  }

  const { data: inserted, error } = await supabase
    .from("friendships")
    .insert({
      user_a: a,
      user_b: b,
      requester_id: user.id,
      status: "pending",
    })
    .select("id")
    .single();
  if (error || !inserted) {
    const code = error?.code ?? "";
    if (code === "23505") return { ok: false, error: "already_requested" };
    if (code === "42501") return { ok: false, error: "blocked" };
    return { ok: false, error: "unknown", message: error?.message };
  }

  if (targetUsername) revalidatePath(`/${targetUsername}`);
  revalidatePath("/messages");
  return { ok: true, id: (inserted as { id: string }).id };
}

// ---------------------------------------------------------------------------
// acceptFriendRequest — addressee accepts a pending row.
// ---------------------------------------------------------------------------

export async function acceptFriendRequest(
  friendshipId: string,
  targetUsername?: string | null,
): Promise<FriendActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: row } = await supabase
    .from("friendships")
    .select("id, user_a, user_b, requester_id, status")
    .eq("id", friendshipId)
    .maybeSingle<{
      id: string;
      user_a: string;
      user_b: string;
      requester_id: string;
      status: string;
    }>();
  if (!row) return { ok: false, error: "not_found" };
  if (row.user_a !== user.id && row.user_b !== user.id)
    return { ok: false, error: "not_party" };
  if (row.requester_id === user.id) return { ok: false, error: "not_party" };
  if (row.status === "accepted") return { ok: true };

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", friendshipId);
  if (error) {
    if (error.code === "42501") return { ok: false, error: "blocked" };
    return { ok: false, error: "unknown", message: error.message };
  }

  if (targetUsername) revalidatePath(`/${targetUsername}`);
  revalidatePath("/messages");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// removeFriendship — cancel, decline, or unfriend depending on state.
// ---------------------------------------------------------------------------

export async function removeFriendship(
  friendshipId: string,
  targetUsername?: string | null,
): Promise<FriendActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);
  if (error) return { ok: false, error: "unknown", message: error.message };

  if (targetUsername) revalidatePath(`/${targetUsername}`);
  revalidatePath("/messages");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// sendFriendMessage — chat. Gated server-side by RLS on accepted status.
// ---------------------------------------------------------------------------

export async function sendFriendMessage(
  friendshipId: string,
  body: string,
): Promise<FriendActionResult<{ id: string }>> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const parsed = friendMessageSchema.safeParse(body);
  if (!parsed.success) return { ok: false, error: "too_long" };
  const trimmed = parsed.data;

  const { data: row } = await supabase
    .from("friendships")
    .select("id, user_a, user_b, status")
    .eq("id", friendshipId)
    .maybeSingle<{
      id: string;
      user_a: string;
      user_b: string;
      status: string;
    }>();
  if (!row) return { ok: false, error: "not_found" };
  if (row.user_a !== user.id && row.user_b !== user.id)
    return { ok: false, error: "not_party" };
  if (row.status !== "accepted") return { ok: false, error: "not_accepted" };

  const partnerId = row.user_a === user.id ? row.user_b : row.user_a;
  const { data: blocks } = await supabase
    .from("blocks")
    .select("blocker_id")
    .or(
      `and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`,
    );
  if ((blocks ?? []).length > 0) return { ok: false, error: "blocked" };

  const since = new Date(Date.now() - 60 * 1000).toISOString();
  const { count } = await supabase
    .from("friend_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= FRIEND_MESSAGE_RATE_PER_MIN) {
    return { ok: false, error: "rate_limited" };
  }

  const { data, error } = await supabase
    .from("friend_messages")
    .insert({ friendship_id: friendshipId, sender_id: user.id, body: trimmed })
    .select("id")
    .single();
  if (error || !data) {
    return { ok: false, error: "unknown", message: error?.message };
  }
  return { ok: true, id: (data as { id: string }).id };
}

export async function markFriendMessagesRead(
  friendshipId: string,
): Promise<FriendActionResult> {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("friend_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("friendship_id", friendshipId)
    .neq("sender_id", user.id)
    .is("read_at", null);
  if (error) return { ok: false, error: "unknown", message: error.message };
  return { ok: true };
}
