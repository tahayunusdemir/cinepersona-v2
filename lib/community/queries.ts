import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import {
  PAGE_SIZE,
  type Author,
  type Board,
  type CommentSort,
  type CommentWithAuthor,
  type ThreadRange,
  type ThreadSort,
  type ThreadWithMeta,
} from "./types";

type Supabase = SupabaseClient;

export async function getViewerId(supabase: Supabase): Promise<string | null> {
  const { data } = await supabase.auth.getClaims();
  return data?.claims.sub ?? null;
}

export async function getViewerProfile(supabase: Supabase) {
  const uid = await getViewerId(supabase);
  if (!uid) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_admin")
    .eq("id", uid)
    .maybeSingle();
  return data as
    | (Author & { is_admin: boolean })
    | null;
}

export async function listBoards(supabase: Supabase): Promise<Board[]> {
  const { data } = await supabase
    .from("boards")
    .select("id, slug, name, description, sort_order, locked")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Board[];
}

export async function getBoardBySlug(
  supabase: Supabase,
  slug: string,
): Promise<Board | null> {
  const { data } = await supabase
    .from("boards")
    .select("id, slug, name, description, sort_order, locked")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Board) ?? null;
}

async function attachAuthors<T extends { author_id: string }>(
  supabase: Supabase,
  rows: T[],
): Promise<(T & { author: Author | null })[]> {
  if (rows.length === 0) return rows.map((r) => ({ ...r, author: null }));
  const ids = Array.from(new Set(rows.map((r) => r.author_id)));
  const { data } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url")
    .in("id", ids);
  const map = new Map<string, Author>();
  for (const row of (data ?? []) as Author[]) map.set(row.id, row);
  return rows.map((r) => ({ ...r, author: map.get(r.author_id) ?? null }));
}

async function attachViewerVotes<
  T extends { id: string },
>(
  supabase: Supabase,
  viewerId: string | null,
  targetType: "thread" | "comment",
  rows: T[],
): Promise<(T & { viewer_vote: -1 | 0 | 1 })[]> {
  if (!viewerId || rows.length === 0) {
    return rows.map((r) => ({ ...r, viewer_vote: 0 as const }));
  }
  const { data } = await supabase
    .from("votes")
    .select("target_id, value")
    .eq("user_id", viewerId)
    .eq("target_type", targetType)
    .in(
      "target_id",
      rows.map((r) => r.id),
    );
  const map = new Map<string, -1 | 1>();
  for (const v of (data ?? []) as { target_id: string; value: number }[]) {
    map.set(v.target_id, v.value === 1 ? 1 : -1);
  }
  return rows.map((r) => ({
    ...r,
    viewer_vote: (map.get(r.id) ?? 0) as -1 | 0 | 1,
  }));
}

function rangeStart(range: ThreadRange | null): string | null {
  if (!range || range === "all") return null;
  const now = Date.now();
  const ms =
    range === "day"
      ? 24 * 60 * 60 * 1000
      : range === "week"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;
  return new Date(now - ms).toISOString();
}

export type ThreadListResult = {
  rows: ThreadWithMeta[];
  total: number;
  page: number;
  pageCount: number;
};

export async function listThreads(
  supabase: Supabase,
  args: {
    boardId?: number;
    sort: ThreadSort;
    range?: ThreadRange | null;
    page: number;
    pageSize?: number;
  },
): Promise<ThreadListResult> {
  const pageSize = args.pageSize ?? PAGE_SIZE;
  const page = Math.max(1, args.page);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const start = rangeStart(args.range ?? null);

  let countQuery = supabase
    .from("threads")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);
  if (args.boardId !== undefined) {
    countQuery = countQuery.eq("board_id", args.boardId);
  }
  if (start) countQuery = countQuery.gte("created_at", start);
  const { count } = await countQuery;

  let query = supabase
    .from("threads")
    .select(
      "id, board_id, author_id, title, body, score, comment_count, pinned, locked, created_at, updated_at, board:boards!inner(slug, name)",
    )
    .is("deleted_at", null);
  if (args.boardId !== undefined) query = query.eq("board_id", args.boardId);
  if (start) query = query.gte("created_at", start);

  query = query.order("pinned", { ascending: false });
  if (args.sort === "hot") {
    query = query.order("hot_score", { ascending: false });
  } else if (args.sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("score", { ascending: false });
  }
  query = query.order("id", { ascending: false }).range(from, to);

  const { data } = await query;
  type Row = Omit<ThreadWithMeta, "author" | "viewer_vote" | "board"> & {
    board: { slug: string; name: string };
  };
  // Supabase types the embedded relation as an array; for an FK with one row
  // we coerce it to the singular shape we need.
  const rows = (data ?? []).map((r: Record<string, unknown>) => ({
    ...r,
    board: Array.isArray(r.board) ? r.board[0] : r.board,
  })) as unknown as Row[];

  const viewerId = await getViewerId(supabase);
  const withAuthor = await attachAuthors(supabase, rows);
  const withVote = await attachViewerVotes(
    supabase,
    viewerId,
    "thread",
    withAuthor,
  );

  return {
    rows: withVote as ThreadWithMeta[],
    total: count ?? 0,
    page,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getThread(
  supabase: Supabase,
  threadId: string,
): Promise<ThreadWithMeta | null> {
  const { data } = await supabase
    .from("threads")
    .select(
      "id, board_id, author_id, title, body, score, comment_count, pinned, locked, created_at, updated_at, board:boards!inner(slug, name)",
    )
    .eq("id", threadId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) return null;
  const normalized = {
    ...(data as Record<string, unknown>),
    board: Array.isArray((data as { board: unknown }).board)
      ? (data as { board: unknown[] }).board[0]
      : (data as { board: unknown }).board,
  };
  const [withAuthor] = await attachAuthors(supabase, [normalized as never]);
  const [withVote] = await attachViewerVotes(
    supabase,
    await getViewerId(supabase),
    "thread",
    [withAuthor],
  );
  return withVote as ThreadWithMeta;
}

export async function listComments(
  supabase: Supabase,
  threadId: string,
  sort: CommentSort,
): Promise<CommentWithAuthor[]> {
  let query = supabase
    .from("comments")
    .select(
      "id, thread_id, author_id, parent_comment_id, body, depth, score, created_at, updated_at, deleted_at",
    )
    .eq("thread_id", threadId);

  if (sort === "new") query = query.order("created_at", { ascending: false });
  else query = query.order("score", { ascending: false }).order("created_at");

  const { data } = await query;
  const rows = (data ?? []) as CommentWithAuthor[];
  // Drop deleted leaves so the tree doesn't grow placeholder-only branches.
  const childCount = new Map<string | null, number>();
  for (const r of rows) {
    const k = r.parent_comment_id;
    childCount.set(k, (childCount.get(k) ?? 0) + 1);
  }
  const visible = rows.filter(
    (r) => r.deleted_at === null || (childCount.get(r.id) ?? 0) > 0,
  );
  const withAuthor = await attachAuthors(supabase, visible);
  const viewerId = await getViewerId(supabase);
  const withVote = await attachViewerVotes(
    supabase,
    viewerId,
    "comment",
    withAuthor,
  );
  return withVote as CommentWithAuthor[];
}

export async function getViewerBlockedIds(
  supabase: Supabase,
  viewerId: string | null,
): Promise<Set<string>> {
  if (!viewerId) return new Set();
  const { data } = await supabase
    .from("blocks")
    .select("blocked_id")
    .eq("blocker_id", viewerId);
  return new Set(((data ?? []) as { blocked_id: string }[]).map((r) => r.blocked_id));
}

export async function getViewerFollowingIds(
  supabase: Supabase,
  viewerId: string | null,
): Promise<Set<string>> {
  if (!viewerId) return new Set();
  const { data } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", viewerId);
  return new Set(
    ((data ?? []) as { following_id: string }[]).map((r) => r.following_id),
  );
}

export async function makeServerClient() {
  return createClient();
}
