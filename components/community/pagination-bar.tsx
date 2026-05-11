import Link from "next/link";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  pageCount: number;
  baseHref: string;
  searchParams?: Record<string, string | undefined>;
};

function buildHref(
  baseHref: string,
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (v && k !== "page") params.set(k, v);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${baseHref}?${qs}` : baseHref;
}

export function PaginationBar({
  page,
  pageCount,
  baseHref,
  searchParams = {},
}: Props) {
  if (pageCount <= 1) return null;

  // Compact page list: 1, …, current-1, current, current+1, …, last
  const pages = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  const list = Array.from(pages)
    .filter((p) => p >= 1 && p <= pageCount)
    .sort((a, b) => a - b);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          {page > 1 ? (
            <PaginationPrevious
              href={buildHref(baseHref, searchParams, page - 1)}
            />
          ) : (
            <span aria-disabled className="pointer-events-none opacity-50">
              <PaginationPrevious href="#" />
            </span>
          )}
        </PaginationItem>
        {list.map((p, idx) => {
          const prev = list[idx - 1];
          const gap = prev !== undefined && p - prev > 1;
          return (
            <PaginationItem key={p}>
              <>
                {gap ? <PaginationEllipsis /> : null}
                <PaginationLink
                  href={buildHref(baseHref, searchParams, p)}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              </>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          {page < pageCount ? (
            <PaginationNext
              href={buildHref(baseHref, searchParams, page + 1)}
            />
          ) : (
            <span aria-disabled className="pointer-events-none opacity-50">
              <PaginationNext href="#" />
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { Link as _Link };
