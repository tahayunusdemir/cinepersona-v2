import type { Metadata } from "next";

import { ActiveFilters } from "@/components/films/active-filters";
import { FilmsEmptyState } from "@/components/films/empty-state";
import { FilterBar } from "@/components/films/filter-bar";
import { FilmsPagination } from "@/components/films/films-pagination";
import { PosterItem } from "@/components/films/poster-item";
import { browseFilms } from "@/lib/films/queries";
import {
  isFiltered,
  parseSearchParams,
  serializeSearchParams,
} from "@/lib/films/search-params";
import { SORT_LABELS, type FilmsSearchParams } from "@/lib/films/types";
import { GENRES } from "@/lib/films/genres";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const raw = await searchParams;
  const params = parseSearchParams(raw);
  const filtered = isFiltered(params) || params.page > 1;

  return {
    title: deriveTitle(params),
    description:
      "Browse films by genre, decade, language and rating. Track what you've watched and build your watchlist.",
    alternates: {
      canonical:
        params.page > 1
          ? `/films${serializeSearchParams({ page: params.page })}`
          : "/films",
    },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

function deriveTitle(params: FilmsSearchParams): string {
  if (!isFiltered(params)) return "Films — CinePersona";
  const parts: string[] = [];
  if (params.genre.length === 1) {
    const g = GENRES.find((x) => x.id === params.genre[0]);
    if (g) parts.push(`${g.name} films`);
  } else if (params.genre.length > 1) {
    parts.push(`${params.genre.length} genres`);
  } else {
    parts.push("Films");
  }
  if (params.decade) parts.push(`from the ${params.decade}s`);
  if (params.sort !== "popular") parts.push(`(${SORT_LABELS[params.sort]})`);
  return `${parts.join(" ")} — CinePersona`;
}

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const params = parseSearchParams(raw);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = Boolean(user);

  const { rows, total, pageCount } = await browseFilms(params);

  const loginHref = `/login?next=${encodeURIComponent(
    `/films${serializeSearchParams(params)}`,
  )}`;

  const gridClass =
    params.view === "dense"
      ? "grid-cols-3 gap-3 md:grid-cols-6 xl:grid-cols-12"
      : "grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 xl:grid-cols-6";

  const priorityCount = params.view === "dense" ? 12 : 6;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6">
      <header className="flex items-end justify-between gap-4 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Films
        </h1>
        <p
          className="text-sm text-muted-foreground tabular-nums"
          aria-live="polite"
        >
          {total === 1 ? "1 film" : `${total.toLocaleString("en-US")} films`}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <FilterBar params={params} />
        <ActiveFilters params={params} />
      </div>

      <div className="mt-6">
        {rows.length === 0 ? (
          <FilmsEmptyState params={params} />
        ) : (
          <ul className={cn("grid", gridClass)}>
            {rows.map((movie, idx) => (
              <PosterItem
                key={movie.id}
                movie={movie}
                view={params.view}
                isAuthed={isAuthed}
                loginHref={loginHref}
                priority={params.page === 1 && idx < priorityCount}
              />
            ))}
          </ul>
        )}
      </div>

      <FilmsPagination params={params} pageCount={pageCount} />
    </div>
  );
}
