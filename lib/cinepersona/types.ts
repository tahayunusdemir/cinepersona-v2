// CinePersona — domain types.
// See docs/MBTI/cinepersona-personality-system.md for the underlying model.

export type AxisId = 1 | 2 | 3 | 4;

export type AxisLetter = "E" | "D" | "S" | "L" | "A" | "I" | "C" | "W";

export type GroupSlug = "auteurs" | "visionaries" | "connoisseurs" | "escapists";

export type StrategySlug = "devoted" | "free-spirit" | "archivist" | "drifter";

export type SectionSlug =
  | "overview"
  | "strengths"
  | "weaknesses"
  | "watching-style"
  | "discovery"
  | "conversation"
  | "recommendations"
  | "conclusion";

export type TraitKind = "strength" | "weakness";

export type RecommendationKind = "film" | "director" | "genre";

export type Group = {
  slug: GroupSlug;
  name: string;
  axisCode: "_SA_" | "_SI_" | "_LA_" | "_LI_";
  tagline: string;
  description: string;
};

export type Strategy = {
  slug: StrategySlug;
  name: string;
  axisCode: "E__C" | "E__W" | "D__C" | "D__W";
  tagline: string;
  description: string;
};

export type AxisDefinition = {
  id: AxisId;
  name: string; // e.g. "Connection"
  primary: { letter: AxisLetter; name: string; blurb: string };
  opposite: { letter: AxisLetter; name: string; blurb: string };
};

export type PersonalityType = {
  code: string; // 4-letter, uppercase, e.g. "ESAC"
  slug: string; // lowercase, e.g. "esac"
  name: string; // e.g. "The Interpreter"
  tagline: string;
  quote: string;
  group: GroupSlug;
  strategy: StrategySlug;
  axes: {
    a1: "E" | "D";
    a2: "S" | "L";
    a3: "A" | "I";
    a4: "C" | "W";
  };
  /** Public-path image for the type. Placeholder art under /public/types. */
  image: string;
};

export type TypeTrait = {
  kind: TraitKind;
  label: string;
  description: string;
};

export type TypeRecommendation = {
  kind: RecommendationKind;
  title: string;
  reason?: string;
  year?: number;
};

export type TypeProfileSection = {
  slug: SectionSlug;
  title: string;
  body: string; // markdown-lite paragraphs separated by \n\n
};

export type TypeProfile = {
  code: string;
  sections: TypeProfileSection[];
  traits: TypeTrait[];
  recommendations: TypeRecommendation[];
};

export type LikertValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;

// -------- Film picks (12-question pre-test step) --------

export type PickKind = "film" | "person";

export type PickQuestionSlug =
  | "favourites-four"
  | "loved-but-bad-ending"
  | "best-ending"
  | "guilty-pleasure"
  | "never-want-to-end"
  | "rewatch-different-eyes"
  | "first-show-someone"
  | "childhood-comfort"
  | "which-actor-are-you"
  | "auto-watch-director"
  | "soundtrack-on-repeat"
  | "live-in-this-universe";

export type PersonDepartment = "Acting" | "Directing";

export type PickQuestion = {
  id: number; // 1..12
  slug: PickQuestionSlug;
  kind: PickKind;
  body: string;
  hint?: string;
  minSelections: number;
  maxSelections: number;
  shortLabel: string; // ≤ 20 chars, shown on profile + aside
  /** Only meaningful when kind === "person". Filters TMDB results. */
  personDepartment?: PersonDepartment;
};

export type PickSelection = {
  questionId: number;
  kind: PickKind;
  tmdbId: number;
  title: string;
  posterPath: string | null;
};

export type TestStateV2 = {
  picks: Record<number, PickSelection[]>;
  answers: Record<number, LikertValue>;
};

export type Question = {
  id: number; // 1..48
  axis: AxisId;
  direction: AxisLetter;
  body: string;
};

export type AxisScore = {
  axis: AxisId;
  primary: AxisLetter;
  letter: AxisLetter; // letter assigned to the user
  primaryPct: number; // 0..100, share of the primary pole
  raw: number; // -36..+36
};

export type TestResult = {
  code: string;
  axes: [AxisScore, AxisScore, AxisScore, AxisScore];
  answers: Record<number, LikertValue>;
};
