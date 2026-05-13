// Badges / achievements — domain types.
// Spec: docs/specs/badge.md

export type AchievementTier =
  | "bronze"
  | "silver"
  | "gold"
  | "legendary"
  | "mythic"
  | "secret"
  | "super_legendary";

export type AchievementCategory =
  | "total_films"
  | "genre_comedy"
  | "genre_horror"
  | "genre_scifi"
  | "genre_drama"
  | "era_classic"
  | "era_modern"
  | "rewatch"
  | "match"
  | "discovery"
  | "director"
  | "emotional"
  | "pace"
  | "exploration"
  | "secret"
  | "super_legendary";

export type Achievement = {
  id: number;
  code: string;
  category: AchievementCategory;
  tier: AchievementTier;
  name: string;
  requirement: number | null;
  requirement_label: string | null;
  secret: boolean;
  sort_order: number;
};

export type UserAchievement = {
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
};

export type AchievementWithStatus = Achievement & {
  unlocked: boolean;
  unlocked_at: string | null;
};

export type CategorySection = {
  category: AchievementCategory;
  title: string;
  description?: string;
  rows: AchievementWithStatus[];
};

export const TIER_ORDER: AchievementTier[] = [
  "bronze",
  "silver",
  "gold",
  "legendary",
  "mythic",
  "super_legendary",
  "secret",
];

export const CATEGORY_TITLES: Record<AchievementCategory, string> = {
  total_films: "Total films watched",
  genre_comedy: "Comedy path",
  genre_horror: "Horror path",
  genre_scifi: "Sci-Fi path",
  genre_drama: "Drama path",
  era_classic: "Classic cinema",
  era_modern: "Modern cinema",
  rewatch: "Rewatch",
  match: "Matches",
  discovery: "Discovery (hidden gems)",
  director: "Directors explored",
  emotional: "Emotional resonance",
  pace: "Slow cinema",
  exploration: "Genre exploration",
  secret: "Secret",
  super_legendary: "Super legendary",
};

export const TIER_LABELS: Record<AchievementTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  legendary: "Legendary",
  mythic: "Mythic",
  secret: "Secret",
  super_legendary: "Super legendary",
};

// Asset map — codes that have a real PNG in /public/badges. Missing codes
// fall back to the generic medal icon. Spaces in folder names are URL-
// encoded so next/image accepts them.
export const BADGE_ASSETS: Record<string, string> = {
  total_films_bronze:    "/badges/Total%20Films%20Watched/Total%20Bronze.png",
  total_films_silver:    "/badges/Total%20Films%20Watched/Total%20Silver.png",
  total_films_gold:      "/badges/Total%20Films%20Watched/Total%20Gold.png",
  total_films_legendary: "/badges/Total%20Films%20Watched/Total%20Legendary.png",
  total_films_mythic:    "/badges/Total%20Films%20Watched/Total%20Mythic.png",

  match_bronze:    "/badges/match/Match%20Bronze.png",
  match_silver:    "/badges/match/Match%20Silver.png",
  match_gold:      "/badges/match/Match%20Gold.png",
  match_legendary: "/badges/match/Match%20Main.png",

  emotional_bronze: "/badges/emotional-films/Bronze_Emo.png",
  emotional_silver: "/badges/emotional-films/Silver_Emo.png",
  emotional_gold:   "/badges/emotional-films/Gold_Emo.png",
};

// Tailwind ring/text accents per tier — kept as full class strings so the
// JIT picks them up.
export const TIER_STYLES: Record<
  AchievementTier,
  { ring: string; text: string; bg: string }
> = {
  bronze: {
    ring: "ring-amber-700/40",
    text: "text-amber-700 dark:text-amber-500",
    bg: "bg-amber-700/10",
  },
  silver: {
    ring: "ring-slate-400/50",
    text: "text-slate-500 dark:text-slate-300",
    bg: "bg-slate-400/10",
  },
  gold: {
    ring: "ring-yellow-500/50",
    text: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  legendary: {
    ring: "ring-purple-500/50",
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
  },
  mythic: {
    ring: "ring-pink-500/50",
    text: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10",
  },
  super_legendary: {
    ring: "ring-cyan-500/50",
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  secret: {
    ring: "ring-foreground/30",
    text: "text-foreground",
    bg: "bg-foreground/5",
  },
};
