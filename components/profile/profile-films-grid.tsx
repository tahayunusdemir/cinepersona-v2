import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, type LucideIcon } from "lucide-react";

import { PosterItem } from "@/components/films/poster-item";
import type { ProfileFilmRow } from "@/lib/profile/films-queries";
import { cn } from "@/lib/utils";

type Props = {
  rows: ProfileFilmRow[];
  total: number;
  page: number;
  pageCount: number;
  basePath: string;
  isAuthed: boolean;
  loginHref: string;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
};

export function ProfileFilmsGrid({
  rows,
  total,
  page,
  pageCount,
  basePath,
  isAuthed,
  loginHref,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
}: Props) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <EmptyIcon className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium">{emptyTitle}</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p
        className="text-sm text-muted-foreground tabular-nums"
        aria-live="polite"
      >
        {total === 1 ? "1 film" : `${total.toLocaleString("en-US")} films`}
      </p>

      <ul className="grid grid-cols-3 gap-3 md:grid-cols-6 xl:grid-cols-8">
        {rows.map((movie, idx) => (
          <PosterItem
            key={movie.id}
            movie={movie}
            view="dense"
            isAuthed={isAuthed}
            loginHref={loginHref}
            priority={page === 1 && idx < 12}
          />
        ))}
      </ul>

      <ProfilePagination
        basePath={basePath}
        page={page}
        pageCount={pageCount}
      />
    </div>
  );
}

function ProfilePagination({
  basePath,
  page,
  pageCount,
}: {
  basePath: string;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const current = Math.min(Math.max(page, 1), pageCount);

  const href = (p: number) =>
    p === 1 ? basePath : `${basePath}?page=${p}`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-2"
    >
      <PageLink
        href={href(Math.max(current - 1, 1))}
        disabled={current === 1}
        ariaLabel="Previous page"
      >
        <ChevronLeftIcon className="size-4" />
        <span className="sr-only">Previous</span>
      </PageLink>

      <span className="px-2 text-sm text-muted-foreground tabular-nums">
        Page {current} of {pageCount}
      </span>

      <PageLink
        href={href(Math.min(current + 1, pageCount))}
        disabled={current === pageCount}
        ariaLabel="Next page"
      >
        <ChevronRightIcon className="size-4" />
        <span className="sr-only">Next</span>
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  disabled,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  ariaLabel: string;
}) {
  const className = cn(
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors text-muted-foreground hover:text-foreground",
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
    <Link href={href} aria-label={ariaLabel} className={className} scroll>
      {children}
    </Link>
  );
}
