import "server-only";

const TMDB_BASE = "https://api.themoviedb.org/3";

export type TmdbSearchMovie = {
  id: number;
  title?: string;
  original_title?: string;
  original_language?: string;
  overview?: string | null;
  release_date?: string | null;
  popularity?: number | null;
  vote_average?: number | null;
  vote_count?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  adult?: boolean;
  video?: boolean;
  genre_ids?: number[];
};

export type TmdbCastMember = {
  id: number;
  name: string;
  original_name?: string;
  gender?: number | null;
  known_for_department?: string | null;
  popularity?: number | null;
  profile_path?: string | null;
  character?: string | null;
  credit_id: string;
  order?: number;
};

export type TmdbCrewMember = {
  id: number;
  name: string;
  original_name?: string;
  gender?: number | null;
  known_for_department?: string | null;
  popularity?: number | null;
  profile_path?: string | null;
  department: string;
  job: string;
  credit_id: string;
};

export type TmdbMovieDetail = {
  id: number;
  imdb_id?: string | null;
  title: string;
  original_title?: string;
  original_language?: string;
  overview?: string | null;
  tagline?: string | null;
  release_date?: string | null;
  runtime?: number | null;
  status?: string | null;
  popularity?: number | null;
  vote_average?: number | null;
  vote_count?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  adult?: boolean;
  video?: boolean;
  origin_country?: string[];
  production_countries?: { iso_3166_1: string; name: string }[];
  spoken_languages?: { iso_639_1: string; english_name?: string; name?: string }[];
  genres?: { id: number; name: string }[];
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
  } | null;
  credits?: {
    cast?: TmdbCastMember[];
    crew?: TmdbCrewMember[];
  };
  keywords?: { keywords?: { id: number; name: string }[] };
};

async function tmdbGet<T>(path: string): Promise<T | null> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`${TMDB_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      // Cache TMDB responses for an hour at the framework layer.
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`TMDB ${res.status}: ${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`TMDB fetch failed: ${path}`, err);
    return null;
  }
}

export async function fetchTmdbSearch(
  query: string,
): Promise<TmdbSearchMovie[]> {
  if (!query.trim()) return [];
  const data = await tmdbGet<{ results?: TmdbSearchMovie[] }>(
    `/search/movie?language=en-US&include_adult=false&query=${encodeURIComponent(query)}`,
  );
  return data?.results ?? [];
}

export type TmdbSearchPerson = {
  id: number;
  name: string;
  original_name?: string;
  gender?: number | null;
  known_for_department?: string | null;
  popularity?: number | null;
  profile_path?: string | null;
  adult?: boolean;
  known_for?: { title?: string; name?: string; media_type?: string }[];
};

// TMDB's `adult` flag on people marks performers in the adult industry.
// /search/person + /person/popular both surface them — search respects
// include_adult, but /person/popular has no such param and consistently
// leaks adult performers. Drop them here as a single chokepoint.
function dropAdultPeople(
  list: TmdbSearchPerson[] | undefined,
): TmdbSearchPerson[] {
  return (list ?? []).filter((p) => p && p.id && !p.adult);
}

export type TmdbPaginated<T> = {
  results: T[];
  page: number;
  totalPages: number;
};

const EMPTY_PAGE: TmdbPaginated<never> = {
  results: [],
  page: 1,
  totalPages: 1,
};

export async function fetchTmdbPeopleSearch(
  query: string,
  page = 1,
): Promise<TmdbPaginated<TmdbSearchPerson>> {
  if (!query.trim()) return EMPTY_PAGE;
  const data = await tmdbGet<{
    results?: TmdbSearchPerson[];
    page?: number;
    total_pages?: number;
  }>(
    `/search/person?language=en-US&include_adult=false&page=${page}&query=${encodeURIComponent(query)}`,
  );
  return {
    results: dropAdultPeople(data?.results),
    page: data?.page ?? page,
    totalPages: Math.min(data?.total_pages ?? 1, 500),
  };
}

export async function fetchTmdbPopularPeople(
  page = 1,
): Promise<TmdbPaginated<TmdbSearchPerson>> {
  const data = await tmdbGet<{
    results?: TmdbSearchPerson[];
    page?: number;
    total_pages?: number;
  }>(`/person/popular?language=en-US&page=${page}`);
  return {
    results: dropAdultPeople(data?.results),
    page: data?.page ?? page,
    totalPages: Math.min(data?.total_pages ?? 1, 500),
  };
}

export async function fetchTmdbMovie(
  tmdbId: number,
): Promise<TmdbMovieDetail | null> {
  return tmdbGet<TmdbMovieDetail>(
    `/movie/${tmdbId}?language=en-US&append_to_response=credits,keywords`,
  );
}
