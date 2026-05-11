import { ClockIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  used: number;
  pending: number;
  nextSlotAt: string | null;
  /** Server-computed render time. Passed in so this component stays pure. */
  nowMs: number;
};

/**
 * Compact card surfacing the rolling-week request quota.
 *
 * Renders three dots (one per slot), how many are pending, and a
 * relative "next slot in" countdown when at least one has been spent.
 */
export function QuotaCard({ used, pending, nextSlotAt, nowMs }: Props) {
  const slots = Array.from({ length: WEEKLY_REQUEST_LIMIT }, (_, i) => {
    if (i < used - pending) return "used" as const;
    if (i < used) return "pending" as const;
    return "open" as const;
  });
  const remaining = Math.max(0, WEEKLY_REQUEST_LIMIT - used);
  const resetIn = nextSlotAt ? formatRelative(nextSlotAt, nowMs) : null;

  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          {remaining} of {WEEKLY_REQUEST_LIMIT} requests left
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {pending > 0 ? (
            <>
              {pending} searching now ·{" "}
              {resetIn ? `next slot in ${resetIn}` : "rolls in 7 days"}
            </>
          ) : resetIn ? (
            <>Next slot in {resetIn}</>
          ) : (
            <>Rolling 7-day window. No requests spent yet.</>
          )}
        </p>
      </div>
      <div
        className="flex items-center gap-1.5"
        role="group"
        aria-label={`${used} of ${WEEKLY_REQUEST_LIMIT} weekly requests used`}
      >
        {slots.map((state, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "size-2.5 rounded-full border transition-colors",
              state === "used" && "border-foreground bg-foreground",
              state === "pending" &&
                "border-foreground bg-foreground/40 motion-safe:animate-pulse",
              state === "open" && "border-muted-foreground/40 bg-transparent",
            )}
          />
        ))}
        {resetIn ? (
          <span className="ml-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <ClockIcon className="size-3" aria-hidden />
            {resetIn}
          </span>
        ) : null}
      </div>
    </Card>
  );
}

function formatRelative(iso: string, nowMs: number): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "";
  const diffMs = target - nowMs;
  if (diffMs <= 0) return "now";
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}
