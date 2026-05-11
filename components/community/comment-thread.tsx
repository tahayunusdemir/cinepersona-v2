"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReplyIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CommentActionsMenu } from "@/components/community/comment-actions";
import { CommentForm } from "@/components/community/comment-form";
import { MarkdownBody } from "@/components/community/markdown-body";
import { RelativeTime } from "@/components/community/relative-time";
import { ReportDialog } from "@/components/community/report-dialog";
import { ShareMenu } from "@/components/community/share-menu";
import { VoteButtons } from "@/components/community/vote-buttons";
import type { CommentWithAuthor } from "@/lib/community/types";
import { cn } from "@/lib/utils";

type Props = {
  comments: CommentWithAuthor[];
  threadId: string;
  boardSlug: string;
  threadLocked: boolean;
  viewerId: string | null;
  shareBaseUrl: string;
};

export function CommentTree({
  comments,
  threadId,
  boardSlug,
  threadLocked,
  viewerId,
  shareBaseUrl,
}: Props) {
  // Build a child map keyed by parent_comment_id.
  const byParent = new Map<string | null, CommentWithAuthor[]>();
  for (const c of comments) {
    const k = c.parent_comment_id ?? null;
    const arr = byParent.get(k) ?? [];
    arr.push(c);
    byParent.set(k, arr);
  }

  const roots = byParent.get(null) ?? [];

  if (roots.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No comments yet — be the first to share your take.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {roots.map((c) => (
        <CommentNode
          key={c.id}
          comment={c}
          byParent={byParent}
          threadId={threadId}
          boardSlug={boardSlug}
          threadLocked={threadLocked}
          viewerId={viewerId}
          shareBaseUrl={shareBaseUrl}
        />
      ))}
    </ul>
  );
}

function CommentNode({
  comment,
  byParent,
  threadId,
  boardSlug,
  threadLocked,
  viewerId,
  shareBaseUrl,
}: {
  comment: CommentWithAuthor;
  byParent: Map<string | null, CommentWithAuthor[]>;
  threadId: string;
  boardSlug: string;
  threadLocked: boolean;
  viewerId: string | null;
  shareBaseUrl: string;
}) {
  const router = useRouter();
  const [replying, setReplying] = useState(false);
  const children = byParent.get(comment.id) ?? [];
  const isDeleted = comment.deleted_at !== null;
  const isOwner = !isDeleted && viewerId === comment.author_id;
  const isAuthed = Boolean(viewerId);

  const onReplyClick = () => {
    if (!isAuthed) {
      const next = `${shareBaseUrl}#comment-${comment.id}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }
    setReplying((v) => !v);
  };
  const author = isDeleted ? null : comment.author;
  const username = author?.username ?? "deleted";
  const displayName = author?.display_name?.trim() || `@${username}`;
  const canReply = !isDeleted && comment.depth < 3 && !threadLocked;

  return (
    <li
      id={`comment-${comment.id}`}
      className="scroll-mt-20"
    >
      <article className="flex gap-3">
        <div className="flex flex-col items-center pt-1">
          {isDeleted ? (
            <span
              aria-hidden
              className="block size-7 rounded-md bg-muted/50"
            />
          ) : (
            <VoteButtons
              targetType="comment"
              targetId={comment.id}
              score={comment.score}
              viewerVote={comment.viewer_vote ?? 0}
              isAuthed={isAuthed}
              isOwner={isOwner}
              size="sm"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center gap-2 text-xs">
            {isDeleted ? (
              <span className="text-muted-foreground italic">
                [deleted]
              </span>
            ) : (
              <Link
                href={author ? `/${author.username}` : "#"}
                className="flex items-center gap-2"
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
                <span className="text-muted-foreground">@{username}</span>
              </Link>
            )}
            <span className="text-muted-foreground">·</span>
            <RelativeTime
              date={comment.created_at}
              className="text-muted-foreground"
            />
            {!isDeleted && comment.updated_at !== comment.created_at ? (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground italic">edited</span>
              </>
            ) : null}
            <div className="ml-auto flex items-center gap-1">
              {isOwner ? (
                <CommentActionsMenu
                  commentId={comment.id}
                  threadId={threadId}
                  boardSlug={boardSlug}
                />
              ) : !isDeleted && isAuthed ? (
                <ReportDialog
                  targetType="comment"
                  targetId={comment.id}
                />
              ) : null}
            </div>
          </header>

          <div className="mt-1.5">
            {isDeleted ? (
              <p className="text-sm italic text-muted-foreground">
                [comment deleted]
              </p>
            ) : (
              <MarkdownBody source={comment.body} />
            )}
          </div>

          <footer className="mt-2 flex items-center gap-1">
            {canReply ? (
              <Button variant="ghost" size="sm" onClick={onReplyClick}>
                <ReplyIcon /> Reply
              </Button>
            ) : null}
            {!isDeleted ? (
              <ShareMenu
                url={`${shareBaseUrl}#comment-${comment.id}`}
                title="Comment on CinePersona"
                size="sm"
              />
            ) : null}
          </footer>

          {replying ? (
            <div className="mt-3 rounded-lg border bg-card/50 p-3">
              <CommentForm
                threadId={threadId}
                boardSlug={boardSlug}
                parentCommentId={comment.id}
                placeholder={`Reply to @${username}…`}
                autoFocus
                onSuccess={() => setReplying(false)}
              />
            </div>
          ) : null}

          {children.length > 0 ? (
            <ul
              className={cn(
                "mt-4 space-y-4 border-l border-border pl-4",
                comment.depth >= 2 && "pl-3",
              )}
            >
              {children.map((child) => (
                <CommentNode
                  key={child.id}
                  comment={child}
                  byParent={byParent}
                  threadId={threadId}
                  boardSlug={boardSlug}
                  threadLocked={threadLocked}
                  viewerId={viewerId}
                  shareBaseUrl={shareBaseUrl}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </li>
  );
}
