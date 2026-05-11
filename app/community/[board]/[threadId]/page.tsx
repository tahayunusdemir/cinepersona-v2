import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LockIcon, PinIcon } from "lucide-react";

import { CommentForm } from "@/components/community/comment-form";
import { CommentTree } from "@/components/community/comment-thread";
import { MarkdownBody } from "@/components/community/markdown-body";
import { RelativeTime } from "@/components/community/relative-time";
import { ReportDialog } from "@/components/community/report-dialog";
import { ShareMenu } from "@/components/community/share-menu";
import { SortTabs } from "@/components/community/sort-tabs";
import { ThreadActionsMenu } from "@/components/community/thread-actions";
import { VoteButtons } from "@/components/community/vote-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getBoardBySlug,
  getThread,
  getViewerProfile,
  listComments,
} from "@/lib/community/queries";
import { plainTextExcerpt } from "@/lib/community/markdown";
import {
  firstParam,
  type CommentSort,
  type SearchValue,
} from "@/lib/community/types";
import { createClient } from "@/lib/supabase/server";

const COMMENT_SORTS: CommentSort[] = ["top", "new"];

type Params = { board: string; threadId: string };
type Search = { sort?: SearchValue };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { board, threadId } = await params;
  const supabase = await createClient();
  const thread = await getThread(supabase, threadId);
  if (!thread || thread.board.slug !== board) {
    return { title: "Thread not found" };
  }
  return {
    title: thread.title,
    description: plainTextExcerpt(thread.body, 160),
  };
}

export default async function ThreadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { board: boardSlug, threadId } = await params;
  const sp = await searchParams;
  const sortParam = firstParam(sp.sort);
  const sort: CommentSort = COMMENT_SORTS.includes(sortParam as CommentSort)
    ? (sortParam as CommentSort)
    : "top";

  const supabase = await createClient();
  const board = await getBoardBySlug(supabase, boardSlug);
  if (!board) notFound();

  const thread = await getThread(supabase, threadId);
  if (!thread || thread.board.slug !== boardSlug) notFound();

  const [viewer, comments] = await Promise.all([
    getViewerProfile(supabase),
    listComments(supabase, threadId, sort),
  ]);

  const isOwner = viewer?.id === thread.author_id;
  const author = thread.author;
  const username = author?.username ?? "deleted";
  const displayName = author?.display_name?.trim() || `@${username}`;

  const detailHref = `/community/${boardSlug}/${threadId}`;
  const edited = thread.updated_at !== thread.created_at;
  const canComment = !thread.locked && !board.locked;

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">
        <Link href="/community" className="hover:text-foreground">
          Community
        </Link>{" "}
        ·{" "}
        <Link href={`/community/${boardSlug}`} className="hover:text-foreground">
          {thread.board.name}
        </Link>
      </p>

      <article className="rounded-lg border bg-card p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <VoteButtons
              targetType="thread"
              targetId={thread.id}
              score={thread.score}
              viewerVote={thread.viewer_vote ?? 0}
              isAuthed={Boolean(viewer)}
              isOwner={Boolean(isOwner)}
            />
          </div>
          <div className="min-w-0 flex-1">
            <header className="flex flex-wrap items-start gap-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {thread.title}
              </h1>
              {thread.pinned ? (
                <Badge variant="secondary" className="gap-1">
                  <PinIcon className="size-3" /> Pinned
                </Badge>
              ) : null}
              {thread.locked ? (
                <Badge variant="outline" className="gap-1">
                  <LockIcon className="size-3" /> Locked
                </Badge>
              ) : null}
              {edited ? (
                <Badge variant="outline" className="text-[10px]">
                  edited
                </Badge>
              ) : null}
              {isOwner ? (
                <div className="ml-auto">
                  <ThreadActionsMenu
                    threadId={thread.id}
                    boardSlug={boardSlug}
                    showEdit
                  />
                </div>
              ) : null}
            </header>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Link
                href={author ? `/${author.username}` : "#"}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Avatar className="size-6">
                  <AvatarImage
                    src={author?.avatar_url ?? "/user.png"}
                    alt=""
                  />
                  <AvatarFallback />
                </Avatar>
                <span className="font-medium text-foreground">
                  {displayName}
                </span>
                <span>@{username}</span>
              </Link>
              <span>·</span>
              <RelativeTime date={thread.created_at} />
            </div>

            <div className="mt-4">
              <MarkdownBody source={thread.body} />
            </div>

            <footer className="mt-5 flex flex-wrap items-center gap-1">
              <ShareMenu
                url={detailHref}
                title={thread.title}
                size="sm"
                label="Share"
              />
              {viewer && !isOwner ? (
                <ReportDialog
                  targetType="thread"
                  targetId={thread.id}
                />
              ) : null}
            </footer>
          </div>
        </div>
      </article>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            {thread.comment_count}{" "}
            {thread.comment_count === 1 ? "comment" : "comments"}
          </h2>
          <SortTabs
            items={[
              { value: "top", label: "Top" },
              { value: "new", label: "New" },
            ]}
            active={sort}
            baseHref={detailHref}
          />
        </div>

        <CommentTree
          comments={comments}
          threadId={thread.id}
          boardSlug={boardSlug}
          threadLocked={thread.locked || board.locked}
          viewerId={viewer?.id ?? null}
          shareBaseUrl={detailHref}
        />

        <div className="mt-8 rounded-lg border bg-card/50 p-4">
          {!viewer ? (
            <p className="text-sm text-muted-foreground">
              <Link
                href={`/login?next=${encodeURIComponent(detailHref)}`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>{" "}
              to join the conversation.
            </p>
          ) : !canComment ? (
            <p className="text-sm text-muted-foreground">
              {thread.locked
                ? "This thread is locked."
                : "This board is locked."}
            </p>
          ) : (
            <CommentForm
              threadId={thread.id}
              boardSlug={boardSlug}
              placeholder="Add a comment…"
            />
          )}
        </div>
      </section>
    </div>
  );
}
