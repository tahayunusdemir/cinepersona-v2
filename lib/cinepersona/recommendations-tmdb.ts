import "server-only";

import {
  fetchTmdbPeopleSearch,
  fetchTmdbSearch,
} from "@/lib/films/tmdb";
import type { TypeRecommendation } from "./types";

export type ResolvedRecommendation = TypeRecommendation & {
  imagePath: string | null; // TMDB path (e.g. "/abc.jpg"), no host prefix
  tmdbId: number | null;
};

async function resolveDirector(
  rec: TypeRecommendation,
): Promise<ResolvedRecommendation> {
  const { results } = await fetchTmdbPeopleSearch(rec.title);
  // Prefer entries whose department is Directing; fall back to first result.
  const directing = results.find(
    (p) => p.known_for_department === "Directing",
  );
  const match = directing ?? results[0] ?? null;
  return {
    ...rec,
    tmdbId: match?.id ?? null,
    imagePath: match?.profile_path ?? null,
  };
}

async function resolveFilm(
  rec: TypeRecommendation,
): Promise<ResolvedRecommendation> {
  const results = await fetchTmdbSearch(rec.title);
  // If the recommendation specifies a year, pick the closest release_date.
  let match = results[0] ?? null;
  if (rec.year && results.length > 0) {
    const want = rec.year;
    const byDistance = [...results].sort((a, b) => {
      const ay = a.release_date ? Number(a.release_date.slice(0, 4)) : 0;
      const by = b.release_date ? Number(b.release_date.slice(0, 4)) : 0;
      return Math.abs(ay - want) - Math.abs(by - want);
    });
    match = byDistance[0] ?? match;
  }
  return {
    ...rec,
    tmdbId: match?.id ?? null,
    imagePath: match?.poster_path ?? null,
  };
}

export async function resolveRecommendations(
  recommendations: TypeRecommendation[],
): Promise<ResolvedRecommendation[]> {
  return Promise.all(
    recommendations.map((rec) => {
      if (rec.kind === "director") return resolveDirector(rec);
      if (rec.kind === "film") return resolveFilm(rec);
      return Promise.resolve<ResolvedRecommendation>({
        ...rec,
        tmdbId: null,
        imagePath: null,
      });
    }),
  );
}
