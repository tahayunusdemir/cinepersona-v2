import "server-only";

import { createClient } from "@/lib/supabase/server";

import { cacheMovieDetail } from "./lazy-cache";
import { fetchTmdbMovie } from "./tmdb";

export type FilmDetailGenre = { id: number; name: string };

export type FilmDetailPerson = {
  credit_id: string;
  person_id: number;
  tmdb_id: number;
  name: string;
  profile_path: string | null;
  character: string | null;
  job: string | null;
  department: string;
  credit_order: number | null;
};

export type FilmDetail = {
  id: number;
  tmdb_id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string | null;
  tagline: string | null;
  release_date: string | null;
  runtime: number | null;
  status: string | null;
  popularity: number | null;
  vote_average: number | null;
  vote_count: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  watched: boolean;
  in_watchlist: boolean;
  fetched_at: string | null;
  genres: FilmDetailGenre[];
  cast: FilmDetailPerson[];
  crew: FilmDetailPerson[];
};

// Skip re-fetching from TMDB if the local row was refreshed within this
// window — protects against rate-limit hammering on movies that genuinely
// have no cast on TMDB.
const TMDB_REFETCH_WINDOW_MS = 24 * 60 * 60 * 1000;

const MOVIE_COLS = [
  "id",
  "tmdb_id",
  "title",
  "original_title",
  "original_language",
  "overview",
  "tagline",
  "release_date",
  "runtime",
  "status",
  "popularity",
  "vote_average",
  "vote_count",
  "poster_path",
  "backdrop_path",
  "adult",
  "fetched_at",
].join(",");

/**
 * Parse a `{tmdbId}-{kebab-title}` slug. Strict: the leading segment must
 * be all digits, optionally followed by `-...`. This prevents URLs like
 * `/films/123abc` or `/films/123zzz` from resolving to film 123 (and
 * silently producing duplicate-content 200s).
 */
export function parseSlug(slug: string): number | null {
  const match = /^(\d+)(?:-.*)?$/.exec(slug);
  if (!match) return null;
  const id = Number.parseInt(match[1], 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function loadLocalDetail(tmdbId: number): Promise<FilmDetail | null> {
  const supabase = await createClient();

  const { data: movie, error } = await supabase
    .from("movies")
    .select(MOVIE_COLS)
    .eq("tmdb_id", tmdbId)
    .maybeSingle();
  if (error || !movie) return null;

  const movieRow = movie as unknown as {
    id: number;
    tmdb_id: number;
    title: string;
    original_title: string;
    original_language: string;
    overview: string | null;
    tagline: string | null;
    release_date: string | null;
    runtime: number | null;
    status: string | null;
    popularity: number | null;
    vote_average: number | null;
    vote_count: number | null;
    poster_path: string | null;
    backdrop_path: string | null;
    adult: boolean;
    fetched_at: string | null;
  };

  const [{ data: genreRows }, { data: creditRows }, { data: userRows }] =
    await Promise.all([
      supabase
        .from("movie_genres")
        .select("genre_id, genres(id, name)")
        .eq("movie_id", movieRow.id),
      supabase
        .from("movie_credits")
        .select(
          "credit_id, department, job, character, credit_order, person_id, people(id, tmdb_id, name, profile_path)",
        )
        .eq("movie_id", movieRow.id),
      supabase
        .from("user_movies")
        .select("status")
        .eq("movie_id", movieRow.id),
    ]);

  const genres: FilmDetailGenre[] = [];
  for (const g of (genreRows as
    | { genre_id: number; genres: { id: number; name: string } | null }[]
    | null) ?? []) {
    if (g.genres) genres.push({ id: g.genres.id, name: g.genres.name });
  }

  const cast: FilmDetailPerson[] = [];
  const crew: FilmDetailPerson[] = [];
  for (const c of (creditRows as
    | {
        credit_id: string;
        department: string;
        job: string | null;
        character: string | null;
        credit_order: number | null;
        person_id: number;
        people: {
          id: number;
          tmdb_id: number;
          name: string;
          profile_path: string | null;
        } | null;
      }[]
    | null) ?? []) {
    if (!c.people) continue;
    const row: FilmDetailPerson = {
      credit_id: c.credit_id,
      person_id: c.people.id,
      tmdb_id: c.people.tmdb_id,
      name: c.people.name,
      profile_path: c.people.profile_path,
      character: c.character,
      job: c.job,
      department: c.department,
      credit_order: c.credit_order,
    };
    if (c.department === "cast") cast.push(row);
    else crew.push(row);
  }

  cast.sort((a, b) => (a.credit_order ?? 999) - (b.credit_order ?? 999));

  const watched = (userRows ?? []).some(
    (r) => (r as { status: string }).status === "watched",
  );
  const inWatchlist = (userRows ?? []).some(
    (r) => (r as { status: string }).status === "watchlist",
  );

  return {
    ...movieRow,
    watched,
    in_watchlist: inWatchlist,
    fetched_at: movieRow.fetched_at,
    genres,
    cast,
    crew,
  };
}

/**
 * Resolve a film by tmdb_id. If we don't have it locally (or its credits
 * are empty AND the local row hasn't been refreshed recently), call TMDB
 * and lazy-cache the response, then re-read.
 */
export async function getFilmDetail(
  tmdbId: number,
): Promise<FilmDetail | null> {
  const local = await loadLocalDetail(tmdbId);
  if (local && local.cast.length > 0) return local;

  if (local?.fetched_at) {
    const age = Date.now() - new Date(local.fetched_at).getTime();
    if (Number.isFinite(age) && age < TMDB_REFETCH_WINDOW_MS) {
      // Recently refreshed — accept the empty cast rather than hammering TMDB.
      return local;
    }
  }

  const detail = await fetchTmdbMovie(tmdbId);
  if (!detail) return local;

  await cacheMovieDetail(detail);
  return loadLocalDetail(tmdbId);
}
