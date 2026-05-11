import Link from "next/link";
import { LockIcon, MessageSquareIcon, PinIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ThreadActionsMenu } from "@/components/community/thread-actions";
import { RelativeTime } from "@/components/community/relative-time";
import { VoteButtons } from "@/components/community/vote-buttons";
import { plainTextExcerpt } from "@/lib/community/markdown";
import type { ThreadWithMeta } from "@/lib/community/types";

type Props = {
  thread: ThreadWithMeta;
  viewerId: string | null;
};

export function ThreadCard({ thread, viewerId }: Props) {
  const author = thread.author;
  const username = author?.username ?? "deleted";
  const displayName = author?.display_name?.trim() || `@${username}`;
  const isOwner = viewerId === thread.author_id;
  const isAuthed = Boolean(viewerId);
  const detailHref = `/community/${thread.board.slug}/${thread.id}`;
  const excerpt = plainTextExcerpt(thread.body, 240);

  return (
    <article className="flex gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-card/80">
      <div className="flex flex-col items-center pt-0.5">
        <VoteButtons
          targetType="thread"
          targetId={thread.id}
          score={thread.score}
          viewerVote={thread.viewer_vote ?? 0}
          isAuthed={isAuthed}
          isOwner={isOwner}
        />
      </div>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-start gap-2">
          <h3 className="text-base font-semibold tracking-tight">
            <Link href={detailHref} className="hover:underline">
              {thread.title}
            </Link>
          </h3>
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
          {isOwner ? (
            <div className="ml-auto">
              <ThreadActionsMenu
                threadId={thread.id}
                boardSlug={thread.board.slug}
              />
            </div>
          ) : null}
        </header>
        <p className="mt-1 text-xs text-muted-foreground">
          <Link
            href={author ? `/${author.username}` : "#"}
            className="font-medium hover:text-foreground"
          >
            {displayName}
          </Link>
          <span className="mx-1.5">·</span>
          <RelativeTime date={thread.created_at} />
          <span className="mx-1.5">·</span>
          <Link
            href={`/community/${thread.board.slug}`}
            className="hover:text-foreground"
          >
            {thread.board.name}
          </Link>
        </p>
        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3">
            {excerpt}
          </p>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">
          <Link
            href={detailHref}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <MessageSquareIcon className="size-3.5" />
            {thread.comment_count}{" "}
            {thread.comment_count === 1 ? "comment" : "comments"}
          </Link>
        </p>
      </div>
    </article>
  );
}
