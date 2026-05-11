"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { requestMatch } from "@/lib/match/actions";
import { WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";

type Props = {
  remaining: number;
  nextSlotAt: string | null;
  pendingCount: number;
};

export function RequestMatchButton({
  remaining,
  nextSlotAt,
  pendingCount,
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onClick = () => {
    start(async () => {
      const result = await requestMatch();
      if (!result.ok) {
        toast.error(requestErrorLabel(result.error), {
          description: result.message ?? undefined,
        });
        return;
      }
      if (result.match_id) {
        toast.success("Match found.");
        router.push(`/cine-match/${result.match_id}`);
      } else {
        toast(
          "Searching for a match. We'll keep looking for up to 7 days — check back.",
        );
        router.refresh();
      }
    });
  };

  const exhausted = remaining <= 0;
  const nextSlotLabel = formatNextSlot(nextSlotAt);

  return (
    <div className="flex w-full flex-col gap-1">
      <Button
        size="lg"
        onClick={onClick}
        disabled={pending || exhausted}
        className="w-full"
      >
        <SparklesIcon className="size-4" />
        {pending
          ? "Searching…"
          : exhausted
            ? `0 / ${WEEKLY_REQUEST_LIMIT} this week`
            : `Find a new match (${remaining}/${WEEKLY_REQUEST_LIMIT} left)`}
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        {exhausted && nextSlotLabel
          ? `Next request opens ${nextSlotLabel}.`
          : pendingCount > 0
            ? `${pendingCount} request${pendingCount > 1 ? "s" : ""} still searching.`
            : "Each request runs for up to 7 days before a fallback match."}
      </p>
    </div>
  );
}

function requestErrorLabel(err: string): string {
  switch (err) {
    case "weekly_limit":
      return `You've used your ${WEEKLY_REQUEST_LIMIT} requests this week.`;
    case "not_joined":
      return "Join the pool first.";
    case "no_candidates":
      return "No candidates available yet. Try again later.";
    case "unauthorized":
      return "Sign in first.";
    default:
      return "Something went wrong.";
  }
}

function formatNextSlot(iso: string | null): string | null {
  if (!iso) return null;
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "soon";
  const hours = Math.round(ms / (1000 * 60 * 60));
  if (hours < 24) return `in ~${hours}h`;
  const days = Math.round(hours / 24);
  return `in ~${days}d`;
}
