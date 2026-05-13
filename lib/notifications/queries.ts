import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import {
  NOTIFICATIONS_PAGE_SIZE,
  type NotificationActor,
  type NotificationRow,
  type NotificationType,
  type NotificationView,
} from "./types";

type Supabase = SupabaseClient;

// ---------------------------------------------------------------------------
// raw fetch
// ---------------------------------------------------------------------------

async function fetchRows(
  supabase: Supabase,
  viewerId: string,
  limit: number,
): Promise<NotificationRow[]> {
  const { data } = await supabase
    .from("notifications")
    .select(
      "id, user_id, actor_id, type, entity_type, entity_id, metadata, read_at, created_at",
    )
    .eq("user_id", viewerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as NotificationRow[];
}

// ---------------------------------------------------------------------------
// resolvers — fill in actor profile + href + summary for each row
// ---------------------------------------------------------------------------

async function loadActors(
  supabase: Supabase,
  ids: string[],
): Promise<Map<string, NotificationActor>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids);
  const map = new Map<string, NotificationActor>();
  for (const row of (data ?? []) as NotificationActor[]) map.set(row.id, row);
  return map;
}

// thread → board slug for URL building. Returns Map<threadId, boardSlug>.
async function loadThreadBoards(
  supabase: Supabase,
  threadIds: string[],
): Promise<Map<string, string>> {
  if (threadIds.length === 0) return new Map();
  const { data } = await supabase
    .from("threads")
    .select("id, board:boards!inner(slug)")
    .in("id", threadIds);
  const map = new Map<string, string>();
  type Row = { id: string; board: { slug: string } | { slug: string }[] | null };
  for (const row of (data ?? []) as Row[]) {
    const board = Array.isArray(row.board) ? row.board[0] : row.board;
    if (board?.slug) map.set(row.id, board.slug);
  }
  return map;
}

// comment → thread + board for URL. Returns Map<commentId, {threadId, boardSlug}>.
async function loadCommentRefs(
  supabase: Supabase,
  commentIds: string[],
): Promise<Map<string, { threadId: string; boardSlug: string }>> {
  if (commentIds.length === 0) return new Map();
  const { data } = await supabase
    .from("comments")
    .select("id, thread_id, thread:threads!inner(board:boards!inner(slug))")
    .in("id", commentIds);
  const map = new Map<string, { threadId: string; boardSlug: string }>();
  type BoardShape = { slug: string };
  type ThreadShape = { board: BoardShape | BoardShape[] | null };
  type Row = {
    id: string;
    thread_id: string;
    thread: ThreadShape | ThreadShape[] | null;
  };
  for (const row of (data ?? []) as Row[]) {
    const thread = Array.isArray(row.thread) ? row.thread[0] : row.thread;
    const board = thread
      ? Array.isArray(thread.board)
        ? thread.board[0]
        : thread.board
      : null;
    if (board?.slug) {
      map.set(row.id, { threadId: row.thread_id, boardSlug: board.slug });
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// summarise — render a one-line label per row
// ---------------------------------------------------------------------------

function actorLabel(actor: NotificationActor | null): string {
  if (!actor) return "Someone";
  const name = actor.display_name?.trim();
  if (name) return name;
  if (actor.username) return `@${actor.username}`;
  return "Someone";
}

function summarise(
  type: NotificationType,
  actor: NotificationActor | null,
  metadata: Record<string, unknown>,
): string {
  const who = actorLabel(actor);
  switch (type) {
    case "follow":
      return `${who} started following you`;
    case "friend_request":
      return `${who} sent you a friend request`;
    case "friend_accept":
      return `${who} accepted your friend request`;
    case "friend_message": {
      const preview = typeof metadata.preview === "string" ? metadata.preview : "";
      return preview ? `${who}: ${preview}` : `${who} sent you a message`;
    }
    case "match_created": {
      const pct = typeof metadata.similarity_pct === "number" ? metadata.similarity_pct : null;
      return pct != null
        ? `You matched with ${who} (${pct}%)`
        : `You matched with ${who}`;
    }
    case "match_message": {
      const preview = typeof metadata.preview === "string" ? metadata.preview : "";
      return preview ? `${who}: ${preview}` : `${who} sent you a match message`;
    }
    case "thread_upvote":
      return `${who} upvoted your thread`;
    case "comment_upvote":
      return `${who} upvoted your comment`;
  }
}

// ---------------------------------------------------------------------------
// public API
// ---------------------------------------------------------------------------

export async function listNotifications(
  supabase: Supabase,
  viewerId: string,
  limit = NOTIFICATIONS_PAGE_SIZE,
): Promise<NotificationView[]> {
  const rows = await fetchRows(supabase, viewerId, limit);
  if (rows.length === 0) return [];

  const actorIds = Array.from(
    new Set(rows.map((r) => r.actor_id).filter((v): v is string => Boolean(v))),
  );
  const threadIds = rows
    .filter((r) => r.entity_type === "thread" && r.entity_id)
    .map((r) => r.entity_id as string);
  const commentIds = rows
    .filter((r) => r.entity_type === "comment" && r.entity_id)
    .map((r) => r.entity_id as string);

  const [actors, threadBoards, commentRefs] = await Promise.all([
    loadActors(supabase, actorIds),
    loadThreadBoards(supabase, threadIds),
    loadCommentRefs(supabase, commentIds),
  ]);

  return rows.map<NotificationView>((row) => {
    const actor = row.actor_id ? actors.get(row.actor_id) ?? null : null;
    const href = buildHref(row, actor, threadBoards, commentRefs);
    return {
      ...row,
      actor,
      href,
      summary: summarise(row.type, actor, row.metadata ?? {}),
    };
  });
}

function buildHref(
  row: NotificationRow,
  actor: NotificationActor | null,
  threadBoards: Map<string, string>,
  commentRefs: Map<string, { threadId: string; boardSlug: string }>,
): string | null {
  switch (row.type) {
    case "follow":
    case "friend_accept":
      return actor?.username ? `/${actor.username}` : null;
    case "friend_request":
      // Inbox lives on /messages (it lists incoming + outgoing requests).
      return "/messages";
    case "friend_message":
      return actor?.username ? `/messages/${actor.username}` : "/messages";
    case "match_created":
      return row.entity_id ? `/cine-match/${row.entity_id}/messages` : "/cine-match/matches";
    case "match_message":
      return row.entity_id ? `/cine-match/${row.entity_id}/messages` : "/cine-match/matches";
    case "thread_upvote": {
      if (!row.entity_id) return null;
      const slug = threadBoards.get(row.entity_id);
      return slug ? `/community/${slug}/${row.entity_id}` : null;
    }
    case "comment_upvote": {
      if (!row.entity_id) return null;
      const ref = commentRefs.get(row.entity_id);
      return ref ? `/community/${ref.boardSlug}/${ref.threadId}#comment-${row.entity_id}` : null;
    }
  }
}

export async function countUnreadNotifications(
  supabase: Supabase,
  viewerId: string,
): Promise<number> {
  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", viewerId)
    .is("read_at", null);
  return count ?? 0;
}
