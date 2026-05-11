import { CheckIcon, CircleDashedIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  viewer: boolean;
  partner: boolean;
  partnerLabel: string;
};

/**
 * Two-row "X / partner" consent indicator that makes mutual opt-in visible
 * before chat unlocks. Each row is a check or dashed circle plus a label.
 */
export function ConsentStatus({ viewer, partner, partnerLabel }: Props) {
  return (
    <ul
      className="flex flex-col gap-1.5 rounded-md border bg-muted/30 px-3 py-2 text-xs sm:flex-row sm:items-center sm:gap-4"
      aria-label="Messaging consent status"
    >
      <Row done={viewer} label="You" />
      <span className="hidden text-muted-foreground/40 sm:inline" aria-hidden>
        ·
      </span>
      <Row done={partner} label={partnerLabel} />
    </ul>
  );
}

function Row({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      {done ? (
        <CheckIcon
          className="size-3.5 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
      ) : (
        <CircleDashedIcon
          className="size-3.5 text-muted-foreground"
          aria-hidden
        />
      )}
      <span className={cn(done ? "text-foreground" : "text-muted-foreground")}>
        {label}
      </span>
      <span className="text-muted-foreground">
        {done ? "opted in" : "hasn't yet"}
      </span>
    </li>
  );
}
