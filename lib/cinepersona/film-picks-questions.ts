import type { PickKind, PickQuestion } from "./types";

// 12 film-picks questions shown before the 48-question Likert section.
// `kind === "film"` uses TMDB movie search + the local `movies` cache.
// `kind === "person"` uses TMDB person search (no local cache yet).
// The selections do not affect the personality score — they accompany the
// result row and are surfaced on the profile + used by CineMatch.
export const filmPicksQuestions: PickQuestion[] = [
  {
    id: 1,
    slug: "favourites-four",
    kind: "film",
    body: "Pick your four all-time favourite films.",
    hint: "The four films you'd take to a desert island.",
    minSelections: 4,
    maxSelections: 4,
    shortLabel: "Favourites",
  },
  {
    id: 2,
    slug: "loved-but-bad-ending",
    kind: "film",
    body: "A film you loved — except for the ending.",
    hint: "It pulled you in, then the last act let you down.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Weak ending",
  },
  {
    id: 3,
    slug: "best-ending",
    kind: "film",
    body: "The film with the best ending you've ever seen.",
    hint: "An ending that landed exactly the way it needed to.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Best ending",
  },
  {
    id: 4,
    slug: "guilty-pleasure",
    kind: "film",
    body: "Your guilty pleasure — bad on paper, fun every time.",
    hint: '"I know it\'s not good, but I love it."',
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Guilty pleasure",
  },
  {
    id: 5,
    slug: "never-want-to-end",
    kind: "film",
    body: "A film you never wanted to end.",
    hint: "You wanted to stay inside its world a little longer.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Never ends",
  },
  {
    id: 6,
    slug: "rewatch-different-eyes",
    kind: "film",
    body: "A film you didn't get years ago but would see differently now.",
    hint: "Worth a rewatch with the person you've become.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Older eyes",
  },
  {
    id: 7,
    slug: "first-show-someone",
    kind: "film",
    body: "The first film you'd show someone to make them love cinema.",
    hint: "Not necessarily your favourite — the most convincing.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Gateway film",
  },
  {
    id: 8,
    slug: "childhood-comfort",
    kind: "film",
    body: "A film that takes you back to your childhood.",
    hint: "The one that smells like home when you hear the score.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Childhood",
  },
  {
    id: 9,
    slug: "which-actor-are-you",
    kind: "person",
    body: "An actor or actress you most see yourself in.",
    hint: "Whose presence on screen feels closest to you.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Your mirror",
    personDepartment: "Acting",
  },
  {
    id: 10,
    slug: "auto-watch-director",
    kind: "person",
    body: "A director whose every film you'd watch on sight.",
    hint: "Name alone is enough — you're in.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Auto-watch",
    personDepartment: "Directing",
  },
  {
    id: 11,
    slug: "soundtrack-on-repeat",
    kind: "film",
    body: "A film whose score you'd listen to on its own.",
    hint: "The music outlived the credits for you.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Score on repeat",
  },
  {
    id: 12,
    slug: "live-in-this-universe",
    kind: "film",
    body: "A film universe you'd want to live in.",
    hint: "The world you'd happily move into.",
    minSelections: 1,
    maxSelections: 1,
    shortLabel: "Live there",
  },
];

export const FILM_PICKS_COUNT = filmPicksQuestions.length;

export function getPickQuestion(id: number): PickQuestion | undefined {
  return filmPicksQuestions.find((q) => q.id === id);
}

export function totalPicksNeeded(): number {
  return filmPicksQuestions.reduce((sum, q) => sum + q.minSelections, 0);
}

export function isPickKind(value: string): value is PickKind {
  return value === "film" || value === "person";
}
