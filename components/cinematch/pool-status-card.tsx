import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { MatchPoolEntry } from "@/lib/match/types";

import { LeavePoolButton } from "./leave-pool-button";

type Props = {
  entry: MatchPoolEntry | null;
};

/**
 * Clear "are you in the pool?" answer at the top of `/cine-match`.
 *
 * Renders either:
 *   - In: check icon + "You're in the pool" + joined date + Leave button
 *   - Out: dashed circle + "Not in the pool" + helper line
 */
export function PoolStatusCard({ entry }: Props) {
  const joined = Boolean(entry);

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {joined ? (
          <CheckCircle2Icon
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-foreground"
          />
        ) : (
          <CircleDashedIcon
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold sm:text-base">
            {joined ? "You're in the pool" : "You're not in the pool"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            {joined && entry
              ? `Joined ${formatDate(entry.joined_at)}${
                  entry.refreshed_at &&
                  entry.refreshed_at !== entry.joined_at
                    ? ` · refreshed ${formatDate(entry.refreshed_at)}`
                    : ""
                }`
              : "Join the pool to start finding matches."}
          </p>
        </div>
      </div>
      {joined ? (
        <div className="sm:ml-4">
          <LeavePoolButton />
        </div>
      ) : null}
    </Card>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
