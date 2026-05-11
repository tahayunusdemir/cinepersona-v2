import {
  DECADES,
  LANGUAGES,
  RATING_FLOORS,
  SORT_KEYS,
  VOTE_FLOORS,
  type FilmsSearchParams,
  type RatingFloor,
  type SortKey,
  type ViewMode,
  type VoteFloor,
} from "./types";

const LANG_CODES = new Set(LANGUAGES.map((l) => l.code));
const DECADE_SET = new Set(DECADES);
const RATING_SET = new Set<number>(RATING_FLOORS);
const VOTE_SET = new Set<number>(VOTE_FLOORS);
const SORT_SET = new Set<string>(SORT_KEYS);

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSearchParams(raw: RawParams): FilmsSearchParams {
  const q = (first(raw.q) ?? "").trim().slice(0, 80);

  const sortRaw = first(raw.sort);
  const sort: SortKey =
    sortRaw && SORT_SET.has(sortRaw) ? (sortRaw as SortKey) : "popular";

  const genre = (first(raw.genre) ?? "")
    .split(",")
    .map((s) => Number.parseInt(s, 10))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 8);

  const decadeNum = Number.parseInt(first(raw.decade) ?? "", 10);
  const decade = DECADE_SET.has(decadeNum) ? decadeNum : null;

  const langRaw = (first(raw.lang) ?? "").toLowerCase();
  const lang = LANG_CODES.has(langRaw) ? langRaw : null;

  const ratingNum = Number.parseInt(first(raw.rating) ?? "", 10);
  const rating: RatingFloor | null = RATING_SET.has(ratingNum)
    ? (ratingNum as RatingFloor)
    : null;

  const votesNum = Number.parseInt(first(raw.votes) ?? "", 10);
  const votes: VoteFloor | null = VOTE_SET.has(votesNum)
    ? (votesNum as VoteFloor)
    : null;

  const view: ViewMode = first(raw.view) === "large" ? "large" : "dense";

  const pageNum = Number.parseInt(first(raw.page) ?? "1", 10);
  const page = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;

  return { q, sort, genre, decade, lang, rating, votes, view, page };
}

export function serializeSearchParams(
  params: Partial<FilmsSearchParams>,
): string {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "popular") sp.set("sort", params.sort);
  if (params.genre && params.genre.length > 0)
    sp.set("genre", params.genre.join(","));
  if (params.decade) sp.set("decade", String(params.decade));
  if (params.lang) sp.set("lang", params.lang);
  if (params.rating) sp.set("rating", String(params.rating));
  if (params.votes) sp.set("votes", String(params.votes));
  if (params.view && params.view !== "dense") sp.set("view", params.view);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function buildHref(
  base: string,
  current: FilmsSearchParams,
  patch: Partial<FilmsSearchParams>,
): string {
  return `${base}${serializeSearchParams({ ...current, ...patch })}`;
}

export function isFiltered(params: FilmsSearchParams): boolean {
  return Boolean(
    params.q ||
      params.genre.length > 0 ||
      params.decade ||
      params.lang ||
      params.rating ||
      params.votes ||
      params.sort !== "popular",
  );
}
