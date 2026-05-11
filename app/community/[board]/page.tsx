import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LockIcon, PlusIcon } from "lucide-react";

import { PaginationBar } from "@/components/community/pagination-bar";
import { SortTabs } from "@/components/community/sort-tabs";
import { ThreadCard } from "@/components/community/thread-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
      <header className="mb-6 flex flex-wrap items-start gap-4">
        <span className="flex size-11 items-center justify-center rounded-md bg-muted">
          <BoardIcon slug={board.slug} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {board.name}
            </h1>
            {board.locked ? (
              <Badge variant="outline" className="gap-1">
                <LockIcon className="size-3" /> Locked
              </Badge>
            ) : null}
          </div>
          {board.description ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {board.description}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">
            <Link href="/community" className="hover:text-foreground">
              ← All boards
            </Link>
          </p>
        </div>
        {viewer && !board.locked ? (
          <Link
            href={`/community/${board.slug}/new`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <PlusIcon /> New thread
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
          <span className="text-xs text-muted-foreground">
            Page {list.page} of {list.pageCount}
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
