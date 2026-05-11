import { createClient } from "@/lib/supabase/server";

import { cacheSearchResults } from "./lazy-cache";
import { fetchTmdbSearch } from "./tmdb";
import { PAGE_SIZE, type FilmsSearchParams, type MovieRow } from "./types";

export type BrowseResult = {
  rows: MovieRow[];
  total: number;
  pageSize: number;
  pageCount: number;
};

type RpcArgs = {
  q: string;
  sort: string;
  genres: number[] | null;
  decade: number | null;
  lang: string | null;
  rating: number | null;
  min_votes: number | null;
  page: number;
  page_size: number;
};

// When sorting by popularity with no explicit votes filter, apply a baseline
// vote-count floor. TMDB's popularity score boosts trending-but-obscure films
// (often NSFW spam or untranslated trailers) — requiring a small audience
// strips that out without hiding legit niche titles.
const POPULAR_VOTE_BASELINE = 500;

function rpcArgs(params: FilmsSearchParams, pageSize: number): RpcArgs {
  const minVotes =
    params.votes ?? (params.sort === "popular" ? POPULAR_VOTE_BASELINE : null);
  return {
    q: params.q,
    sort: params.sort,
    genres: params.genre.length > 0 ? params.genre : null,
    decade: params.decade,
    lang: params.lang,
    rating: params.rating,
    min_votes: minVotes,
    page: params.page,
    page_size: pageSize,
  };
}

async function callRpc(
  supabase: Awaited<ReturnType<typeof createClient>>,
  args: RpcArgs,
) {
  const { data, error } = await supabase.rpc("films_browse", args);
  if (error) {
    console.error("films_browse rpc failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { total: 0, rows: [] as MovieRow[] };
  }
  const payload = (data ?? {}) as { total?: number; rows?: MovieRow[] };
  return {
    total: payload.total ?? 0,
    rows: payload.rows ?? [],
  };
}

export async function browseFilms(
  params: FilmsSearchParams,
): Promise<BrowseResult> {
  const supabase = await createClient();
  const pageSize = PAGE_SIZE[params.view];
  const args = rpcArgs(params, pageSize);

  const isSearching = params.q.trim().length >= 2 && params.page === 1;

  if (!isSearching) {
    const { rows, total } = await callRpc(supabase, args);
    return {
      rows,
      total,
      pageSize,
      pageCount: Math.max(Math.ceil(total / pageSize), 1),
    };
  }

  // Lazy-search: query local + TMDB in parallel. If TMDB returns films we
  // don't have yet, upsert them and re-run the local query so they appear
  // in the result with the correct sort and per-user state.
  const [local, tmdbResults] = await Promise.all([
    callRpc(supabase, args),
    fetchTmdbSearch(params.q),
  ]);

  if (tmdbResults.length === 0) {
    return {
      rows: local.rows,
      total: local.total,
      pageSize,
      pageCount: Math.max(Math.ceil(local.total / pageSize), 1),
    };
  }

  const knownIds = new Set(local.rows.map((r) => r.tmdb_id));
  const newOnes = tmdbResults.filter((m) => !knownIds.has(m.id));

  if (newOnes.length === 0) {
    return {
      rows: local.rows,
      total: local.total,
      pageSize,
      pageCount: Math.max(Math.ceil(local.total / pageSize), 1),
    };
  }

  await cacheSearchResults(newOnes);

  const refreshed = await callRpc(supabase, args);
  return {
    rows: refreshed.rows,
    total: refreshed.total,
    pageSize,
    pageCount: Math.max(Math.ceil(refreshed.total / pageSize), 1),
  };
}
