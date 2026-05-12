import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LockIcon, PlusIcon } from "lucide-react";

import { PaginationBar } from "@/components/community/pagination-bar";
import { SortTabs } from "@/components/community/sort-tabs";
import { ThreadCard } from "@/components/community/thread-card";
import { ctaPrimarySm } from "@/lib/ui-tokens";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { BoardIcon } from "@/components/community/board-icon";
import {
  getBoardBySlug,
  getViewerProfile,
  listThreads,
} from "@/lib/community/queries";
import {
  firstParam,
  type SearchValue,
  type ThreadRange,
  type ThreadSort,
} from "@/lib/community/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type Params = { board: string };
type Search = {
  sort?: SearchValue;
  range?: SearchValue;
  page?: SearchValue;
};

const SORTS: ThreadSort[] = ["hot", "new", "top"];
const RANGES: ThreadRange[] = ["day", "week", "month", "all"];

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { board } = await params;
  const supabase = await createClient();
  const b = await getBoardBySlug(supabase, board);
  if (!b) return { title: "Board not found" };
  return {
    title: b.name,
    description: b.description ?? `Discussion on ${b.name}.`,
  };
}

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { board: slug } = await params;
  const sp = await searchParams;
  const sortParam = firstParam(sp.sort);
  const rangeParam = firstParam(sp.range);
  const pageParam = firstParam(sp.page);

  const supabase = await createClient();
  const board = await getBoardBySlug(supabase, slug);
  if (!board) notFound();

  const sort: ThreadSort = SORTS.includes(sortParam as ThreadSort)
    ? (sortParam as ThreadSort)
    : "hot";
  const range: ThreadRange | null =
    sort === "top" && RANGES.includes(rangeParam as ThreadRange)
      ? (rangeParam as ThreadRange)
      : sort === "top"
        ? "day"
        : null;
  const page = Math.max(1, Number(pageParam) || 1);

  const [viewer, list] = await Promise.all([
    getViewerProfile(supabase),
    listThreads(supabase, { boardId: board.id, sort, range, page }),
  ]);

  const baseHref = `/community/${board.slug}`;

  const queryForPagination: Record<string, string> = {};
  if (sort !== "hot") queryForPagination.sort = sort;
  if (sort === "top" && range && range !== "day")
    queryForPagination.range = range;

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
          <BoardIcon slug={board.slug} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <Link
            href="/community"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
          >
            ← All boards
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
              {board.name}
            </h1>
            {board.locked ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <LockIcon className="size-3" /> Locked
              </span>
            ) : null}
          </div>
          {board.description ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {board.description}
            </p>
          ) : null}
        </div>
        {viewer && !board.locked ? (
          <Link
            href={`/community/${board.slug}/new`}
            className={ctaPrimarySm}
          >
            <PlusIcon className="size-4" /> New thread
          </Link>
        ) : null}
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SortTabs
          items={[
            { value: "hot", label: "Hot" },
            { value: "new", label: "New" },
            { value: "top", label: "Top" },
          ]}
          active={sort}
          baseHref={baseHref}
          searchParams={{ sort: sortParam, range: rangeParam }}
        />
        {sort === "top" ? (
          <SortTabs
            items={[
              { value: "day", label: "Today" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
              { value: "all", label: "All" },
            ]}
            active={range ?? "day"}
            baseHref={baseHref}
            paramKey="range"
            searchParams={{ sort, range: rangeParam }}
          />
        ) : null}
        {list.total > 0 ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Page {list.page} / {list.pageCount}
          </span>
        ) : null}
      </div>

      {list.rows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BoardIcon slug={board.slug} />
            </EmptyMedia>
            <EmptyTitle>No threads yet</EmptyTitle>
            <EmptyDescription>
              {viewer && !board.locked
                ? "Create the first thread to get the discussion going."
                : "Check back soon — new discussions get posted regularly."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="space-y-3">
          {list.rows.map((t) => (
            <li key={t.id}>
              <ThreadCard thread={t} viewerId={viewer?.id ?? null} />
            </li>
          ))}
        </ul>
      )}

      <PaginationBar
        page={list.page}
        pageCount={list.pageCount}
        baseHref={baseHref}
        searchParams={queryForPagination}
      />
    </div>
  );
}
