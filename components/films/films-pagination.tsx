import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { serializeSearchParams } from "@/lib/films/search-params";
import type { FilmsSearchParams } from "@/lib/films/types";

type Props = {
  params: FilmsSearchParams;
  pageCount: number;
};

export function FilmsPagination({ params, pageCount }: Props) {
  if (pageCount <= 1) return null;

  const current = Math.min(Math.max(params.page, 1), pageCount);
  const pages = pageNumbers(current, pageCount);

  function href(page: number) {
    return `/films${serializeSearchParams({ ...params, page })}`;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-4"
    >
      <PaginationLink
        href={href(Math.max(current - 1, 1))}
        disabled={current === 1}
        ariaLabel="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
        <span className="sr-only">Previous</span>
      </PaginationLink>

      <span className="hidden items-center gap-1 sm:flex">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              aria-hidden
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <PaginationLink
              key={p}
              href={href(p)}
              ariaLabel={`Page ${p}`}
              ariaCurrent={p === current ? "page" : undefined}
              active={p === current}
            >
              {p}
            </PaginationLink>
          ),
        )}
      </span>

      <span className="px-2 text-sm text-muted-foreground sm:hidden">
        Page {current} of {pageCount}
      </span>

      <PaginationLink
        href={href(Math.min(current + 1, pageCount))}
        disabled={current === pageCount}
        ariaLabel="Next page"
      >
        <ChevronRightIcon className="size-4" />
        <span className="sr-only">Next</span>
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  children,
  active,
  disabled,
  ariaLabel,
  ariaCurrent,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  ariaCurrent?: "page";
}) {
  const className = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors",
    active
      ? "bg-foreground text-background"
      : "text-muted-foreground hover:text-foreground",
    disabled && "pointer-events-none opacity-50",
  );

  if (disabled) {
    return (
      <span aria-disabled className={className} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      className={className}
      scroll
    >
      {children}
    </Link>
  );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}
