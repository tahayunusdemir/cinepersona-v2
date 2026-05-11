"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// shared
// ---------------------------------------------------------------------------

export type CommunityActionState = {
  ok?: boolean;
  error?:
    | "unauthorized"
    | "validation"
    | "board_locked"
    | "thread_locked"
    | "depth_exceeded"
    | "rate_limited"
    | "cannot_vote_self"
    | "blocked"
    | "not_found"
    | "unknown";
  message?: string;
  redirect?: string;
  fieldErrors?: Record<string, string>;
};

async function requireAuth(
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

// ---------------------------------------------------------------------------
// vote
// ---------------------------------------------------------------------------

export async function voteOn(
  targetType: "thread" | "comment",
  targetId: string,
  direction: 1 | -1,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: existing } = await supabase
    .from("votes")
    .select("value")
    .eq("user_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase
      .from("votes")
      .insert({
        user_id: user.id,
        target_type: targetType,
        target_id: targetId,
        value: direction,
      });
    if (error) {
      if ((error.message ?? "").includes("cannot_vote_self")) {
        return { ok: false, error: "cannot_vote_self" };
      }
      return { ok: false, error: "unknown", message: error.message };
    }
  } else if (existing.value === direction) {
    const { error } = await supabase
      .from("votes")
      .delete()
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId);
    if (error) return { ok: false, error: "unknown", message: error.message };
  } else {
    const { error } = await supabase
      .from("votes")
      .update({ value: direction })
      .eq("user_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId);
    if (error) return { ok: false, error: "unknown", message: error.message };
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// follow / unfollow
// ---------------------------------------------------------------------------

export async function followUser(
  targetId: string,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };
  if (user.id === targetId) return { ok: false, error: "validation" };

  const { error } = await supabase
    .from("follows")
    .upsert(
      { follower_id: user.id, following_id: targetId },
      { onConflict: "follower_id,following_id", ignoreDuplicates: true },
    );

  if (error) {
    // 23514 = check constraint (e.g. follower_id <> following_id).
    // 42501 = RLS / permission denied → only this means a block edge prevents
    // the follow. Anything else is treated as an unknown infrastructure error
    // so we don't mislead the user with a "blocked" toast on a network glitch.
    const code = error.code ?? "";
    if (code === "23514") return { ok: false, error: "validation" };
    if (code === "42501") return { ok: false, error: "blocked" };
    return { ok: false, error: "unknown", message: error.message };
  }
  return { ok: true };
}

export async function unfollowUser(
  targetId: string,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", targetId);

  if (error) return { ok: false, error: "unknown", message: error.message };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// block / unblock
// ---------------------------------------------------------------------------

function revalidateBlockTargets(targetUsername?: string | null) {
  revalidatePath("/settings/community");
  if (targetUsername) {
    revalidatePath(`/${targetUsername}`);
    revalidatePath(`/${targetUsername}/followers`);
    revalidatePath(`/${targetUsername}/following`);
  }
}

export async function blockUser(
  targetId: string,
  targetUsername?: string | null,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };
  if (user.id === targetId) return { ok: false, error: "validation" };

  const { error } = await supabase
    .from("blocks")
    .upsert(
      { blocker_id: user.id, blocked_id: targetId },
      { onConflict: "blocker_id,blocked_id", ignoreDuplicates: true },
    );
  if (error) return { ok: false, error: "unknown", message: error.message };

  // public.blocks_cleanup_follows trigger removes any existing follow edges
  // in either direction on insert.

  revalidateBlockTargets(targetUsername);
  return { ok: true };
}

export async function unblockUser(
  targetId: string,
  targetUsername?: string | null,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", targetId);

  if (error) return { ok: false, error: "unknown", message: error.message };
  revalidateBlockTargets(targetUsername);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// threads (any signed-in user can insert; owner edit/delete)
// ---------------------------------------------------------------------------

const titleLen = (t: string) => t.trim().length;

export async function createThreadAction(
  _prev: CommunityActionState | undefined,
  formData: FormData,
): Promise<CommunityActionState> {
  const boardSlug = String(formData.get("board_slug") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (titleLen(title) < 8 || titleLen(title) > 200) {
    fieldErrors.title = "Title must be between 8 and 200 characters.";
  }
  if (body.trim().length < 20 || body.trim().length > 10000) {
    fieldErrors.body = "Body must be between 20 and 10,000 characters.";
  }
  if (!boardSlug) fieldErrors.board_slug = "Board is required.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "validation", fieldErrors };
  }

  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: board } = await supabase
    .from("boards")
    .select("id, locked")
    .eq("slug", boardSlug)
    .maybeSingle();
  if (!board) return { ok: false, error: "not_found" };
  if (board.locked) return { ok: false, error: "board_locked" };

  const { data: inserted, error } = await supabase
    .from("threads")
    .insert({
      board_id: board.id,
      author_id: user.id,
      title: title.trim(),
      body: body.trim(),
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { ok: false, error: "unknown", message: error?.message };
  }

  revalidatePath(`/community/${boardSlug}`);
  revalidatePath("/community");
  redirect(`/community/${boardSlug}/${inserted.id}`);
}

export async function updateThreadAction(
  _prev: CommunityActionState | undefined,
  formData: FormData,
): Promise<CommunityActionState> {
  const id = String(formData.get("thread_id") ?? "");
  const boardSlug = String(formData.get("board_slug") ?? "");
  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");

  const fieldErrors: Record<string, string> = {};
  if (titleLen(title) < 8 || titleLen(title) > 200)
    fieldErrors.title = "Title must be between 8 and 200 characters.";
  if (body.trim().length < 20 || body.trim().length > 10000)
    fieldErrors.body = "Body must be between 20 and 10,000 characters.";
  if (Object.keys(fieldErrors).length)
    return { ok: false, error: "validation", fieldErrors };

  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("threads")
    .update({ title: title.trim(), body: body.trim() })
    .eq("id", id)
    .eq("author_id", user.id);
  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath(`/community/${boardSlug}/${id}`);
  revalidatePath(`/community/${boardSlug}`);
  return { ok: true, redirect: `/community/${boardSlug}/${id}` };
}

export async function deleteThreadAction(
  threadId: string,
  boardSlug: string,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("threads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", threadId)
    .eq("author_id", user.id);

  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath(`/community/${boardSlug}`);
  revalidatePath("/community");
  return { ok: true, redirect: `/community/${boardSlug}` };
}

// ---------------------------------------------------------------------------
// comments
// ---------------------------------------------------------------------------

export async function createCommentAction(
  _prev: CommunityActionState | undefined,
  formData: FormData,
): Promise<CommunityActionState> {
  const threadId = String(formData.get("thread_id") ?? "");
  const boardSlug = String(formData.get("board_slug") ?? "");
  const parentId = String(formData.get("parent_comment_id") ?? "");
  const body = String(formData.get("body") ?? "");

  const trimmed = body.trim();
  if (trimmed.length < 1 || trimmed.length > 5000) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: { body: "Comment must be 1–5,000 characters." },
    };
  }

  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { data: thread } = await supabase
    .from("threads")
    .select("id, locked, board_id, board:boards!inner(slug, locked)")
    .eq("id", threadId)
    .is("deleted_at", null)
    .maybeSingle<{
      id: string;
      locked: boolean;
      board_id: number;
      board:
        | { slug: string; locked: boolean }
        | { slug: string; locked: boolean }[];
    }>();
  if (!thread) return { ok: false, error: "not_found" };
  // PostgREST returns embedded `!inner` relations as either an object or a
  // single-element array depending on relationship cardinality detection.
  const boardRow = Array.isArray(thread.board) ? thread.board[0] : thread.board;
  if (!boardRow) return { ok: false, error: "not_found" };
  if (thread.locked || boardRow.locked)
    return { ok: false, error: "thread_locked" };

  let depth = 0;
  if (parentId) {
    const { data: parent } = await supabase
      .from("comments")
      .select("depth")
      .eq("id", parentId)
      .maybeSingle();
    if (!parent) return { ok: false, error: "not_found" };
    depth = parent.depth + 1;
    if (depth > 3) return { ok: false, error: "depth_exceeded" };
  }

  const { error } = await supabase.from("comments").insert({
    thread_id: threadId,
    author_id: user.id,
    parent_comment_id: parentId || null,
    body: trimmed,
    depth,
  });

  if (error) return { ok: false, error: "unknown", message: error.message };

  revalidatePath(`/community/${boardSlug}/${threadId}`);
  return { ok: true };
}

export async function deleteCommentAction(
  commentId: string,
  boardSlug: string,
  threadId: string,
): Promise<CommunityActionState> {
  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const { error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) return { ok: false, error: "unknown", message: error.message };
  revalidatePath(`/community/${boardSlug}/${threadId}`);
  return { ok: true };
}

// ---------------------------------------------------------------------------
// reports
// ---------------------------------------------------------------------------

const reportReasons = new Set([
  "spam",
  "harassment",
  "hate",
  "nsfw",
  "misinformation",
  "other",
]);
const reportTargets = new Set(["user", "thread", "comment"]);

export async function reportAction(
  _prev: CommunityActionState | undefined,
  formData: FormData,
): Promise<CommunityActionState> {
  const targetType = String(formData.get("target_type") ?? "");
  const targetId = String(formData.get("target_id") ?? "");
  const reason = String(formData.get("reason") ?? "");
  const details = String(formData.get("details") ?? "");

  if (!reportTargets.has(targetType) || !targetId)
    return { ok: false, error: "validation" };
  if (!reportReasons.has(reason))
    return { ok: false, error: "validation" };
  if (details.length > 1000)
    return { ok: false, error: "validation" };

  const supabase = await createClient();
  const user = await requireAuth(supabase);
  if (!user) return { ok: false, error: "unauthorized" };

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("reporter_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .gte("created_at", since);

  if ((count ?? 0) >= 1) return { ok: false, error: "rate_limited" };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_type: targetType,
    target_id: targetId,
    reason,
    details: details.trim() || null,
  });

  if (error) return { ok: false, error: "unknown", message: error.message };
  return { ok: true };
}
