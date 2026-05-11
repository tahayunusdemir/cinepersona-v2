import { createClient } from "@/lib/supabase/server";
import type { MovieRow } from "@/lib/films/types";

export type ProfileFilmStatus = "watched" | "watchlist";

export type ProfileFilmRow = MovieRow & { addedAt: string };

export type ProfileFilmsResult = {
  rows: ProfileFilmRow[];
  total: number;
  pageCount: number;
};

type OwnerRow = {
  created_at: string;
  movie: {
    id: number;
    tmdb_id: number;
    title: string;
    original_title: string;
    release_date: string | null;
    poster_path: string | null;
    vote_average: number | null;
    vote_count: number | null;
    popularity: number | null;
    original_language: string;
  };
};

export async function getProfileFilms({
  ownerId,
  status,
  page,
  pageSize,
}: {
  ownerId: string;
  status: ProfileFilmStatus;
  page: number;
  pageSize: number;
}): Promise<ProfileFilmsResult> {
  const supabase = await createClient();

  const from = Math.max((page - 1) * pageSize, 0);
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("user_movies")
    .select(
      `created_at,
       movie:movies!inner(
         id, tmdb_id, title, original_title, release_date, poster_path,
         vote_average, vote_count, popularity, original_language
       )`,
      { count: "exact" },
    )
    .eq("user_id", ownerId)
    .eq("status", status)
    .order("created_at", { ascending: false })
    .range(from, to);

  // Supabase types the embedded relation as an array; movies!inner is 1:1 so
  // coerce to the singular shape we need.
  const ownerRows = (data ?? []).map((r: Record<string, unknown>) => ({
    ...r,
    movie: Array.isArray(r.movie) ? r.movie[0] : r.movie,
  })) as unknown as OwnerRow[];

  if (error) {
    console.error("getProfileFilms failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { rows: [], total: 0, pageCount: 1 };
  }

  const owner = ownerRows;
  const total = count ?? 0;

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();
  const viewerId = viewer?.id ?? null;

  const watched = new Set<number>();
  const inWatchlist = new Set<number>();
  const movieIds = owner.map((r) => r.movie.id);

  if (viewerId && movieIds.length > 0) {
    const { data: viewerRows } = await supabase
      .from("user_movies")
      .select("movie_id, status")
      .eq("user_id", viewerId)
      .in("movie_id", movieIds);

    for (const row of viewerRows ?? []) {
      if (row.status === "watched") watched.add(row.movie_id);
      else if (row.status === "watchlist") inWatchlist.add(row.movie_id);
    }
  }

  const rows: ProfileFilmRow[] = owner.map((r) => ({
    id: r.movie.id,
    tmdb_id: r.movie.tmdb_id,
    title: r.movie.title,
    original_title: r.movie.original_title,
    release_date: r.movie.release_date,
    poster_path: r.movie.poster_path,
    vote_average: r.movie.vote_average,
    vote_count: r.movie.vote_count,
    popularity: r.movie.popularity,
    original_language: r.movie.original_language,
    watched: watched.has(r.movie.id),
    in_watchlist: inWatchlist.has(r.movie.id),
    addedAt: r.created_at,
  }));

  return {
    rows,
    total,
    pageCount: Math.max(Math.ceil(total / pageSize), 1),
  };
}
