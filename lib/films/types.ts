export type SortKey =
  | "popular"
  | "rating"
  | "votes"
  | "newest"
  | "oldest"
  | "name";

export type ViewMode = "dense" | "large";

export type RatingFloor = 50 | 60 | 70 | 80 | 90;

export type VoteFloor = 100 | 500 | 1000 | 5000 | 10000;

export type FilmsSearchParams = {
  q: string;
  sort: SortKey;
  genre: number[];
  decade: number | null;
  lang: string | null;
  rating: RatingFloor | null;
  votes: VoteFloor | null;
  view: ViewMode;
  page: number;
};

export type MovieRow = {
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
  watched: boolean;
  in_watchlist: boolean;
};

export const PAGE_SIZE: Record<ViewMode, number> = {
  dense: 72,
  large: 18,
};

export const SORT_KEYS: SortKey[] = [
  "popular",
  "rating",
  "votes",
  "newest",
  "oldest",
  "name",
];

export const SORT_LABELS: Record<SortKey, string> = {
  popular: "Popularity",
  rating: "Rating",
  votes: "Vote count",
  newest: "Newest",
  oldest: "Oldest",
  name: "Name (A–Z)",
};

export const VIEW_LABELS: Record<ViewMode, string> = {
  dense: "Dense",
  large: "Large",
};

export const RATING_FLOORS: RatingFloor[] = [50, 60, 70, 80, 90];

export const RATING_LABELS: Record<RatingFloor, string> = {
  50: "≥ 5",
  60: "≥ 6",
  70: "≥ 7",
  80: "≥ 8",
  90: "≥ 9",
};

export const VOTE_FLOORS: VoteFloor[] = [100, 500, 1000, 5000, 10000];

export const VOTE_LABELS: Record<VoteFloor, string> = {
  100: "≥ 100 votes",
  500: "≥ 500 votes",
  1000: "≥ 1k votes",
  5000: "≥ 5k votes",
  10000: "≥ 10k votes",
};

export const DECADES: number[] = [
  2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950, 1940, 1930, 1920, 1910, 1900,
];

export const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "es", label: "Spanish" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "it", label: "Italian" },
  { code: "ru", label: "Russian" },
  { code: "zh", label: "Chinese" },
  { code: "hi", label: "Hindi" },
  { code: "pt", label: "Portuguese" },
];
