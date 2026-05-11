import "server-only";

import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

import type {
  TmdbMovieDetail,
  TmdbSearchMovie,
} from "./tmdb";

// ISO 639-1 codes are exactly two lowercase ASCII letters. Anything else
// (empty, mixed case, malformed) defaults to "en" so the NOT NULL char(2)
// column in `movies` doesn't get garbage.
function normalizeLanguage(raw: string | null | undefined): string {
  const lower = (raw ?? "").toLowerCase();
  return /^[a-z]{2}$/.test(lower) ? lower : "en";
}

// Search payloads carry no credits, so we deliberately leave `fetched_at`
// unset here. That column marks "we've done a /movie/{id} detail fetch"
// and gates the 24h refetch window in detail.ts — letting search writes
// touch it would conflate the two and block detail refetches.
function shapeSearchRow(m: TmdbSearchMovie) {
  return {
    tmdb_id: m.id,
    title: m.title || m.original_title || `Untitled (${m.id})`,
    original_title:
      m.original_title || m.title || `Untitled (${m.id})`,
    original_language: normalizeLanguage(m.original_language),
    overview: m.overview ?? null,
    release_date: m.release_date || null,
    popularity: m.popularity ?? null,
    vote_average: m.vote_average ?? null,
    vote_count: m.vote_count ?? null,
    poster_path: m.poster_path ?? null,
    backdrop_path: m.backdrop_path ?? null,
    adult: Boolean(m.adult),
    video: Boolean(m.video),
  };
}

/**
 * Upsert TMDB search results into `movies` and link `movie_genres` from
 * `genre_ids` (basic shape). Returns the count of rows actually inserted
 * or refreshed. Skips silently if no service-role key is configured.
 */
export async function cacheSearchResults(
  results: TmdbSearchMovie[],
): Promise<number> {
  if (!hasServiceRole() || results.length === 0) return 0;

  const filtered = results.filter((m) => !m.adult);
  if (filtered.length === 0) return 0;

  const admin = createAdminClient();

  const movieRows = filtered.map(shapeSearchRow);
  const { data, error } = await admin
    .from("movies")
    .upsert(movieRows, { onConflict: "tmdb_id" })
    .select("id, tmdb_id");
  if (error) {
    console.warn("cacheSearchResults movies upsert:", error.message);
    return 0;
  }

  const idMap = new Map(data.map((r) => [r.tmdb_id as number, r.id as number]));
  const junctions: { movie_id: number; genre_id: number }[] = [];
  for (const m of filtered) {
    const localId = idMap.get(m.id);
    if (!localId || !Array.isArray(m.genre_ids)) continue;
    for (const gid of m.genre_ids) {
      junctions.push({ movie_id: localId, genre_id: gid });
    }
  }
  if (junctions.length > 0) {
    const { error: jErr } = await admin
      .from("movie_genres")
      .upsert(junctions, { onConflict: "movie_id,genre_id" });
    if (jErr) console.warn("cacheSearchResults junctions:", jErr.message);
  }

  return data.length;
}

/**
 * Upsert a TMDB movie detail (and its genres / collection / cast / crew /
 * keywords) into the local mirror. Best-effort; logs but doesn't throw on
 * partial failures so the calling page can still render what's available.
 */
export async function cacheMovieDetail(
  detail: TmdbMovieDetail,
): Promise<number | null> {
  if (!hasServiceRole()) return null;
  // Hard stop: never persist adult films into the mirror, even when we
  // already fetched the detail. The `/films` page filters via RLS, but
  // picks search reads through the same `movies` table and we don't
  // want adult posters appearing there.
  if (detail.adult) return null;

  const admin = createAdminClient();

  // collection (optional)
  let collectionId: number | null = null;
  if (detail.belongs_to_collection?.id) {
    const c = detail.belongs_to_collection;
    const { error } = await admin
      .from("collections")
      .upsert(
        {
          id: c.id,
          name: c.name,
          poster_path: c.poster_path ?? null,
          backdrop_path: c.backdrop_path ?? null,
        },
        { onConflict: "id" },
      );
    if (!error) collectionId = c.id;
  }

  // genres
  if (detail.genres && detail.genres.length > 0) {
    const { error } = await admin
      .from("genres")
      .upsert(
        detail.genres.map((g) => ({ id: g.id, name: g.name })),
        { onConflict: "id" },
      );
    if (error) console.warn("cacheMovieDetail genres:", error.message);
  }

  // movie row
  const productionCountries = (detail.production_countries ?? [])
    .map((p) => p.iso_3166_1)
    .filter(Boolean);
  const spokenLanguages = (detail.spoken_languages ?? [])
    .map((l) => l.iso_639_1)
    .filter(Boolean);

  const movieRow = {
    tmdb_id: detail.id,
    imdb_id: detail.imdb_id ?? null,
    collection_id: collectionId,
    title:
      detail.title || detail.original_title || `Untitled (${detail.id})`,
    original_title:
      detail.original_title || detail.title || `Untitled (${detail.id})`,
    original_language: normalizeLanguage(detail.original_language),
    origin_country: detail.origin_country ?? null,
    production_countries: productionCountries.length > 0 ? productionCountries : null,
    spoken_languages: spokenLanguages.length > 0 ? spokenLanguages : null,
    overview: detail.overview ?? null,
    tagline: detail.tagline ?? null,
    release_date: detail.release_date || null,
    runtime: detail.runtime ?? null,
    status: detail.status ?? null,
    video: Boolean(detail.video),
    popularity: detail.popularity ?? null,
    vote_average: detail.vote_average ?? null,
    vote_count: detail.vote_count ?? null,
    poster_path: detail.poster_path ?? null,
    backdrop_path: detail.backdrop_path ?? null,
    adult: Boolean(detail.adult),
    fetched_at: new Date().toISOString(),
  };

  const { data: movieRows, error: movieErr } = await admin
    .from("movies")
    .upsert([movieRow], { onConflict: "tmdb_id" })
    .select("id, tmdb_id");
  if (movieErr || !movieRows || movieRows.length === 0) {
    console.warn("cacheMovieDetail movie:", movieErr?.message);
    return null;
  }
  const movieId = movieRows[0].id as number;

  // movie_genres
  if (detail.genres && detail.genres.length > 0) {
    const { error } = await admin.from("movie_genres").upsert(
      detail.genres.map((g) => ({ movie_id: movieId, genre_id: g.id })),
      { onConflict: "movie_id,genre_id" },
    );
    if (error) console.warn("cacheMovieDetail movie_genres:", error.message);
  }

  // keywords + movie_keywords
  const keywordList = detail.keywords?.keywords ?? [];
  if (keywordList.length > 0) {
    const { error } = await admin.from("keywords").upsert(
      keywordList.map((k) => ({ id: k.id, name: k.name })),
      { onConflict: "id" },
    );
    if (!error) {
      const { error: jErr } = await admin.from("movie_keywords").upsert(
        keywordList.map((k) => ({ movie_id: movieId, keyword_id: k.id })),
        { onConflict: "movie_id,keyword_id" },
      );
      if (jErr) console.warn("cacheMovieDetail movie_keywords:", jErr.message);
    } else {
      console.warn("cacheMovieDetail keywords:", error.message);
    }
  }

  // people + movie_credits
  const cast = detail.credits?.cast ?? [];
  const crew = detail.credits?.crew ?? [];
  const allPeople = [...cast, ...crew];

  if (allPeople.length > 0) {
    const peopleRows = Array.from(
      new Map(
        allPeople.map((p) => [
          p.id,
          {
            tmdb_id: p.id,
            name: p.name,
            original_name: p.original_name ?? null,
            gender: p.gender ?? null,
            known_for_department: p.known_for_department ?? null,
            popularity: p.popularity ?? null,
            profile_path: p.profile_path ?? null,
          },
        ]),
      ).values(),
    );

    const { data: peopleData, error: peopleErr } = await admin
      .from("people")
      .upsert(peopleRows, { onConflict: "tmdb_id" })
      .select("id, tmdb_id");
    if (peopleErr || !peopleData) {
      console.warn("cacheMovieDetail people:", peopleErr?.message);
    } else {
      const personIdMap = new Map(
        peopleData.map((p) => [p.tmdb_id as number, p.id as number]),
      );

      const creditRows: {
        credit_id: string;
        movie_id: number;
        person_id: number;
        department: string;
        job: string | null;
        character: string | null;
        credit_order: number | null;
      }[] = [];

      for (const c of cast) {
        const personId = personIdMap.get(c.id);
        if (!personId || !c.credit_id) continue;
        creditRows.push({
          credit_id: c.credit_id,
          movie_id: movieId,
          person_id: personId,
          department: "cast",
          job: null,
          character: c.character ?? null,
          credit_order: typeof c.order === "number" ? c.order : null,
        });
      }
      for (const c of crew) {
        const personId = personIdMap.get(c.id);
        if (!personId || !c.credit_id) continue;
        creditRows.push({
          credit_id: c.credit_id,
          movie_id: movieId,
          person_id: personId,
          department: c.department || "Crew",
          job: c.job ?? null,
          character: null,
          credit_order: null,
        });
      }

      if (creditRows.length > 0) {
        const { error: creditErr } = await admin
          .from("movie_credits")
          .upsert(creditRows, { onConflict: "credit_id" });
        if (creditErr)
          console.warn("cacheMovieDetail movie_credits:", creditErr.message);
      }
    }
  }

  return movieId;
}
