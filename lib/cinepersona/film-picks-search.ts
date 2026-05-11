"use server";

import { browseFilms } from "@/lib/films/queries";
import type { MovieRow } from "@/lib/films/types";
import {
  fetchTmdbPeopleSearch,
  fetchTmdbPopularPeople,
  type TmdbSearchPerson,
} from "@/lib/films/tmdb";
import type { PersonDepartment } from "./types";
import { POPULAR_ACTOR_NAMES } from "./popular-actors";
import { POPULAR_DIRECTOR_NAMES } from "./popular-directors";

export type PickFilmRow = Pick<
  MovieRow,
  "tmdb_id" | "title" | "release_date" | "poster_path" | "vote_average"
>;

export type PickPersonRow = {
  tmdb_id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string | null;
  known_for: string[];
};

export type PickSearchFilms = {
  kind: "film";
  rows: PickFilmRow[];
  page: number;
  pageCount: number;
};
export type PickSearchPeople = {
  kind: "person";
  rows: PickPersonRow[];
  page: number;
  pageCount: number;
};
export type PickSearchResult = PickSearchFilms | PickSearchPeople;

// Max pages we expose. TMDB caps `/popular` and `/search` around 500; we
// also cap the local grid by what feels usable for picking from a list.
const MAX_PAGE = 50;

function trimFilm(row: MovieRow): PickFilmRow {
  return {
    tmdb_id: row.tmdb_id,
    title: row.title,
    release_date: row.release_date,
    poster_path: row.poster_path,
    vote_average: row.vote_average,
  };
}

function clampPage(page: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  if (page > MAX_PAGE) return MAX_PAGE;
  return Math.floor(page);
}

export async function searchPickFilms(
  query: string,
  page = 1,
): Promise<PickSearchFilms> {
  const trimmed = query.trim().slice(0, 80);
  const safePage = clampPage(page);
  const { rows, pageCount } = await browseFilms({
    q: trimmed,
    sort: "popular",
    genre: [],
    decade: null,
    lang: null,
    rating: null,
    votes: null,
    view: "dense",
    page: safePage,
  });
  return {
    kind: "film",
    rows: rows.map(trimFilm),
    page: safePage,
    pageCount: Math.max(1, Math.min(pageCount, MAX_PAGE)),
  };
}

function shapePerson(p: TmdbSearchPerson): PickPersonRow {
  return {
    tmdb_id: p.id,
    name: p.name,
    profile_path: p.profile_path ?? null,
    known_for_department: p.known_for_department ?? null,
    known_for: (p.known_for ?? [])
      .map((k) => k.title || k.name || "")
      .filter(Boolean)
      .slice(0, 3),
  };
}

function popularityOf(p: TmdbSearchPerson): number {
  return typeof p.popularity === "number" ? p.popularity : 0;
}

function isInDepartment(
  p: TmdbSearchPerson,
  department: PersonDepartment,
): boolean {
  return p.known_for_department === department;
}

// TMDB returns ~20 people per page; ~17 of those are actors. We fetch
// ACTING_STEP raw pages per filtered page so we comfortably have ≥18 actors
// after filtering, and we walk forward in non-overlapping windows so each
// "filtered page" shows fresh names instead of resorting the same ~18.
const TARGET_ROWS = 18;
const ACTING_STEP = 2;

async function fetchCuratedPeople(
  names: readonly string[],
  prefer: PersonDepartment,
): Promise<TmdbSearchPerson[]> {
  const responses = await Promise.all(
    names.map((name) => fetchTmdbPeopleSearch(name, 1)),
  );
  const byId = new Map<number, TmdbSearchPerson>();
  for (const r of responses) {
    // Prefer the first result whose primary department matches; fall back
    // to the top match so we still surface someone if TMDB classifies them
    // under Writing or Production.
    const hit =
      r.results.find((p) => p.known_for_department === prefer) ??
      r.results[0];
    if (hit && hit.id && hit.name && !byId.has(hit.id)) {
      byId.set(hit.id, hit);
    }
  }
  return Array.from(byId.values());
}

export async function searchPickPeople(
  query: string,
  page = 1,
  department?: PersonDepartment,
): Promise<PickSearchPeople> {
  const trimmed = query.trim().slice(0, 80);
  const safePage = clampPage(page);

  async function fetchPage(p: number) {
    return trimmed.length >= 2
      ? await fetchTmdbPeopleSearch(trimmed, p)
      : await fetchTmdbPopularPeople(p);
  }

  // Sort by popularity desc when no query (so the most recognizable
  // names lead). For active searches, trust TMDB's relevance order.
  const sortByPopularity = trimmed.length < 2;

  if (!department) {
    const paginated = await fetchPage(safePage);
    const valid = paginated.results.filter(
      (p) => Boolean(p.id) && Boolean(p.name),
    );
    const ordered = sortByPopularity
      ? [...valid].sort((a, b) => popularityOf(b) - popularityOf(a))
      : valid;
    return {
      kind: "person",
      rows: ordered.map(shapePerson),
      page: paginated.page,
      pageCount: Math.max(1, Math.min(paginated.totalPages, MAX_PAGE)),
    };
  }

  // No-query mode for known departments uses a curated list hydrated via
  // /search/person so every page reliably renders TARGET_ROWS cards.
  // TMDB's /person/popular has too few directors and thins out on actors
  // deeper into the list, which produced uneven grids.
  if (sortByPopularity && department) {
    const names =
      department === "Directing"
        ? POPULAR_DIRECTOR_NAMES
        : POPULAR_ACTOR_NAMES;
    const curated = await fetchCuratedPeople(names, department);
    const ordered = curated.sort(
      (a, b) => popularityOf(b) - popularityOf(a),
    );
    const totalPages = Math.max(1, Math.ceil(ordered.length / TARGET_ROWS));
    const pageIdx = Math.min(safePage, totalPages);
    const start = (pageIdx - 1) * TARGET_ROWS;
    return {
      kind: "person",
      rows: ordered.slice(start, start + TARGET_ROWS).map(shapePerson),
      page: pageIdx,
      pageCount: Math.min(totalPages, MAX_PAGE),
    };
  }

  // Other department filters (and director searches): fetch ACTING_STEP
  // consecutive raw pages — without overlap across filtered pages — so
  // each new page reveals the next batch of TARGET_ROWS people.
  const startRawPage = (safePage - 1) * ACTING_STEP + 1;
  const pages = await Promise.all(
    Array.from({ length: ACTING_STEP }, (_, i) => fetchPage(startRawPage + i)),
  );
  const collected: TmdbSearchPerson[] = [];
  let lastTotalPages = 1;
  for (const raw of pages) {
    lastTotalPages = Math.max(lastTotalPages, raw.totalPages);
    for (const p of raw.results) {
      if (Boolean(p.id) && Boolean(p.name) && isInDepartment(p, department)) {
        collected.push(p);
      }
    }
  }

  const ordered = sortByPopularity
    ? [...collected].sort((a, b) => popularityOf(b) - popularityOf(a))
    : collected;

  // Each filtered page consumes ACTING_STEP raw pages.
  const pageCount = Math.max(
    1,
    Math.min(Math.ceil(lastTotalPages / ACTING_STEP), MAX_PAGE),
  );

  return {
    kind: "person",
    rows: ordered.slice(0, TARGET_ROWS).map(shapePerson),
    page: safePage,
    pageCount,
  };
}
