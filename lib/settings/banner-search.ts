"use server";

import { browseFilms } from "@/lib/films/queries";

export type BannerFilmRow = {
  id: number;
  tmdb_id: number;
  title: string;
  release_date: string | null;
  poster_path: string | null;
};

export type BannerSearchResult = {
  rows: BannerFilmRow[];
  page: number;
  pageCount: number;
};

const MAX_PAGE = 50;

function clampPage(page: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  if (page > MAX_PAGE) return MAX_PAGE;
  return Math.floor(page);
}

export async function searchBannerFilms(
  query: string,
  page = 1,
): Promise<BannerSearchResult> {
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
    rows: rows.map((m) => ({
      id: m.id,
      tmdb_id: m.tmdb_id,
      title: m.title,
      release_date: m.release_date,
      poster_path: m.poster_path,
    })),
    page: safePage,
    pageCount: Math.max(1, Math.min(pageCount, MAX_PAGE)),
  };
}
