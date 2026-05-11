import { LoaderIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FALLBACK_WAIT_DAYS } from "@/lib/match/types";

type Props = {
  requestedAt: string;
  /** Server-computed render time. Passed as a prop so this component stays pure. */
  nowMs: number;
};

/**
 * Placeholder row shown in the matches list while a match_request is
 * still pending. Mirrors MatchListRow's layout so the list feels
 * continuous — pending searches sit at the top, real matches below.
 */
export function PendingRequestRow({ requestedAt, nowMs }: Props) {
  const ageMs = nowMs - new Date(requestedAt).getTime();
  const fallbackInMs =
    FALLBACK_WAIT_DAYS * 24 * 60 * 60 * 1000 - ageMs;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-dashed bg-card/40 p-3",
      )}
      aria-label="Match request searching"
    >
      <div className="relative">
        <Skeleton className="size-10 rounded-full" />
        <LoaderIcon
          className="absolute inset-0 m-auto size-4 animate-spin text-muted-foreground"
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">Searching for a 90%+ match…</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Sent {formatAge(ageMs)} ago ·{" "}
          {fallbackInMs > 0
            ? `fallback in ${formatRemaining(fallbackInMs)}`
            : "fallback ready"}
        </p>
      </div>

      <div className="text-right">
        <div className="font-mono text-lg leading-none tabular-nums text-muted-foreground">
          —
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          pending
        </div>
      </div>
    </div>
  );
}

function formatAge(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

function formatRemaining(ms: number): string {
  const hours = Math.round(ms / (60 * 60 * 1000));
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}
