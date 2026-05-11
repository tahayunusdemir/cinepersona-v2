"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  pageCount: number;
  disabled?: boolean;
  onChange: (next: number) => void;
};

function visibleWindow(page: number, pageCount: number): number[] {
  const span = 2;
  const start = Math.max(1, page - span);
  const end = Math.min(pageCount, page + span);
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

export function PicksPagination({
  page,
  pageCount,
  disabled,
  onChange,
}: Props) {
  const window = visibleWindow(page, pageCount);
  const showFirst = window[0] > 1;
  const showLast = window[window.length - 1] < pageCount;

  return (
    <nav
      aria-label="Results pagination"
      className="flex flex-wrap items-center justify-center gap-1"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={disabled || page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
        Prev
      </Button>

      {showFirst ? (
        <>
          <PageButton
            value={1}
            active={page === 1}
            disabled={disabled}
            onChange={onChange}
          />
          {window[0] > 2 ? <Ellipsis /> : null}
        </>
      ) : null}

      {window.map((p) => (
        <PageButton
          key={p}
          value={p}
          active={p === page}
          disabled={disabled}
          onChange={onChange}
        />
      ))}

      {showLast ? (
        <>
          {window[window.length - 1] < pageCount - 1 ? <Ellipsis /> : null}
          <PageButton
            value={pageCount}
            active={page === pageCount}
            disabled={disabled}
            onChange={onChange}
          />
        </>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={disabled || page >= pageCount}
        aria-label="Next page"
      >
        Next
        <ChevronRightIcon className="size-4" />
      </Button>
    </nav>
  );
}

function PageButton({
  value,
  active,
  disabled,
  onChange,
}: {
  value: number;
  active: boolean;
  disabled?: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      disabled={disabled || active}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-mono text-xs tabular-nums transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border/60 hover:bg-muted",
        disabled && !active && "opacity-50",
      )}
    >
      {value}
    </button>
  );
}

function Ellipsis() {
  return (
    <span
      aria-hidden
      className="inline-flex h-8 items-center px-1 text-muted-foreground"
    >
      …
    </span>
  );
}
