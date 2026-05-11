"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { voteOn } from "@/lib/community/actions";
import { cn } from "@/lib/utils";

type Props = {
  targetType: "thread" | "comment";
  targetId: string;
  score: number;
  viewerVote: -1 | 0 | 1;
  isAuthed: boolean;
  isOwner: boolean;
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md";
};

type OptimisticState = { score: number; vote: -1 | 0 | 1 };

export function VoteButtons({
  targetType,
  targetId,
  score,
  viewerVote,
  isAuthed,
  isOwner,
  orientation = "vertical",
  size = "md",
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [state, setOptimistic] = useOptimistic<OptimisticState, 1 | -1>(
    { score, vote: viewerVote },
    (cur, dir) => {
      if (cur.vote === dir) return { score: cur.score - dir, vote: 0 };
      const delta = dir - cur.vote;
      return { score: cur.score + delta, vote: dir };
    },
  );

  const trigger = (dir: 1 | -1) => {
    if (!isAuthed) {
      router.push(
        `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`,
      );
      return;
    }
    if (isOwner) {
      toast.error("You can't vote on your own post.");
      return;
    }
    startTransition(async () => {
      setOptimistic(dir);
      const res = await voteOn(targetType, targetId, dir);
      if (!res.ok) {
        if (res.error === "cannot_vote_self") {
          toast.error("You can't vote on your own post.");
        } else if (res.error === "unauthorized") {
          toast.error("Please sign in to vote.");
        } else {
          toast.error("Could not record your vote.");
        }
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  const colorScore =
    state.score > 0
      ? "text-emerald-500"
      : state.score < 0
        ? "text-rose-500"
        : "text-muted-foreground";

  const iconSize = size === "sm" ? "size-4" : "size-5";

  const upLabel = isOwner ? "You can't vote on your own post" : "Upvote";
  const downLabel = isOwner ? "You can't vote on your own post" : "Downvote";

  return (
    <div
      className={cn(
        "flex items-center gap-0.5",
        orientation === "vertical" && "flex-col",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={state.vote === 1}
        aria-label={upLabel}
        title={isOwner ? upLabel : undefined}
        disabled={isOwner}
        onClick={() => trigger(1)}
        className={cn(
          size === "sm" ? "size-7" : "size-8",
          state.vote === 1 && "text-emerald-500",
        )}
      >
        <ChevronUpIcon
          className={cn(iconSize, state.vote === 1 && "fill-current")}
        />
      </Button>
      <span
        className={cn(
          "min-w-[2ch] text-center text-xs font-medium tabular-nums",
          colorScore,
        )}
      >
        {state.score}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={state.vote === -1}
        aria-label={downLabel}
        title={isOwner ? downLabel : undefined}
        disabled={isOwner}
        onClick={() => trigger(-1)}
        className={cn(
          size === "sm" ? "size-7" : "size-8",
          state.vote === -1 && "text-rose-500",
        )}
      >
        <ChevronDownIcon
          className={cn(iconSize, state.vote === -1 && "fill-current")}
        />
      </Button>
    </div>
  );
}
