"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FILM_PICKS_COUNT,
  filmPicksQuestions,
} from "@/lib/cinepersona/film-picks-questions";
import {
  searchPickFilms,
  searchPickPeople,
  type PickFilmRow,
  type PickPersonRow,
  type PickSearchResult,
} from "@/lib/cinepersona/film-picks-search";
import type {
  PickQuestion,
  PickSelection,
  TestStateV2,
} from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

import { PickGridSkeleton } from "./pick-grid-skeleton";
import { PickPersonCard } from "./pick-person-card";
import { PickPosterCard } from "./pick-poster-card";
import { PicksPagination } from "./picks-pagination";

type Props = {
  question: PickQuestion;
  state: TestStateV2;
  onTogglePick: (
    questionId: number,
    selection: PickSelection,
    max: number,
  ) => void;
};

const SEARCH_DEBOUNCE_MS = 300;
const AUTO_ADVANCE_DELAY_MS = 320;

function selectionFromFilm(
  question: PickQuestion,
  film: PickFilmRow,
): PickSelection {
  return {
    questionId: question.id,
    kind: "film",
    tmdbId: film.tmdb_id,
    title: film.title,
    posterPath: film.poster_path,
  };
}

function selectionFromPerson(
  question: PickQuestion,
  person: PickPersonRow,
): PickSelection {
  return {
    questionId: question.id,
    kind: "person",
    tmdbId: person.tmdb_id,
    title: person.name,
    posterPath: person.profile_path,
  };
}

function nextHref(currentId: number): string {
  if (currentId >= FILM_PICKS_COUNT) {
    return "/cinetest/take/likert/1";
  }
  return `/cinetest/take/picks/${currentId + 1}`;
}

function prevHref(currentId: number): string | null {
  if (currentId <= 1) return null;
  return `/cinetest/take/picks/${currentId - 1}`;
}

export function PicksStep({ question, state, onTogglePick }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const deferred = useDeferredValue(query);
  const [results, setResults] = useState<PickSearchResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const advanceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsTopRef = useRef<HTMLDivElement | null>(null);

  // Reset query + paging when switching question. setState calls happen on
  // a navigation boundary (parent re-renders with a new `question` prop),
  // so the cascading-render lint rule is a false positive here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery("");
    setResults(null);
    setPage(1);
  }, [question.id, question.kind]);

  // Debounced search.
  useEffect(() => {
    const handle = setTimeout(() => {
      startTransition(async () => {
        if (question.kind === "film") {
          const res = await searchPickFilms(deferred, page);
          setResults(res);
        } else {
          const res = await searchPickPeople(
            deferred,
            page,
            question.personDepartment,
          );
          setResults(res);
        }
      });
    }, deferred === "" ? 0 : SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [deferred, question.kind, question.personDepartment, page]);

  // Cleanup pending auto-advance on unmount.
  useEffect(
    () => () => {
      if (advanceTimeoutRef.current) clearTimeout(advanceTimeoutRef.current);
    },
    [],
  );

  const picks = useMemo(
    () => state.picks[question.id] ?? [],
    [state.picks, question.id],
  );
  const minOk = picks.length >= question.minSelections;
  const atMax = picks.length >= question.maxSelections;

  // Set of tmdbIds (scoped by kind) already used in *other* questions of
  // the same kind. Same item cannot appear in two picks questions.
  const lockedFromElsewhere = useMemo(() => {
    const map = new Map<number, number>(); // tmdbId → otherQuestionId
    for (const [qid, list] of Object.entries(state.picks)) {
      const otherId = Number.parseInt(qid, 10);
      if (otherId === question.id) continue;
      for (const sel of list) {
        if (sel.kind !== question.kind) continue;
        if (!map.has(sel.tmdbId)) map.set(sel.tmdbId, otherId);
      }
    }
    return map;
  }, [state.picks, question.id, question.kind]);

  const lockedLabel = useCallback(
    (otherId: number): string => {
      const slug =
        filmPicksQuestions.find((q) => q.id === otherId)?.shortLabel ??
        `Q${otherId}`;
      return `Used in "${slug}"`;
    },
    [],
  );

  const scheduleAdvance = useCallback(() => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : AUTO_ADVANCE_DELAY_MS;
    advanceTimeoutRef.current = setTimeout(() => {
      router.push(nextHref(question.id));
    }, delay);
  }, [question.id, router]);

  const handleSelectFilm = useCallback(
    (film: PickFilmRow) => {
      if (lockedFromElsewhere.has(film.tmdb_id)) return;
      const selection = selectionFromFilm(question, film);
      const currentlySelected = picks.some(
        (p) => p.tmdbId === selection.tmdbId,
      );
      onTogglePick(question.id, selection, question.maxSelections);

      if (currentlySelected) {
        // Deselect — do not auto-advance.
        return;
      }
      // After this toggle the new pick count will be:
      const nextCount = Math.min(picks.length + 1, question.maxSelections);
      if (nextCount >= question.maxSelections) {
        scheduleAdvance();
      }
    },
    [lockedFromElsewhere, onTogglePick, picks, question, scheduleAdvance],
  );

  const handleSelectPerson = useCallback(
    (person: PickPersonRow) => {
      if (lockedFromElsewhere.has(person.tmdb_id)) return;
      const selection = selectionFromPerson(question, person);
      const currentlySelected = picks.some(
        (p) => p.tmdbId === selection.tmdbId,
      );
      onTogglePick(question.id, selection, question.maxSelections);
      if (currentlySelected) return;
      const nextCount = Math.min(picks.length + 1, question.maxSelections);
      if (nextCount >= question.maxSelections) {
        scheduleAdvance();
      }
    },
    [lockedFromElsewhere, onTogglePick, picks, question, scheduleAdvance],
  );

  const prev = prevHref(question.id);
  const next = nextHref(question.id);
  const isLastPick = question.id === FILM_PICKS_COUNT;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            Picks · {question.id} / {FILM_PICKS_COUNT}
          </Badge>
          <Badge variant="outline" className="font-mono uppercase">
            {question.kind === "film" ? "Film" : "Person"}
          </Badge>
          <Badge variant="outline">
            {question.maxSelections === 1
              ? "Pick 1"
              : `Pick ${question.minSelections}–${question.maxSelections}`}
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {question.body}
        </h1>
        {question.hint ? (
          <p className="text-sm text-muted-foreground">{question.hint}</p>
        ) : null}
      </header>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder={
            question.kind === "film"
              ? "Search films by title…"
              : question.personDepartment === "Directing"
                ? "Search directors by name…"
                : question.personDepartment === "Acting"
                  ? "Search actors by name…"
                  : "Search people by name…"
          }
          className="pl-9"
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPage(1);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <XIcon className="size-4" />
          </button>
        ) : null}
      </div>

      {picks.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border/70 p-3 text-xs">
          <span className="text-muted-foreground">Selected:</span>
          {picks.map((p) => (
            <button
              key={p.tmdbId}
              type="button"
              onClick={() =>
                onTogglePick(
                  question.id,
                  {
                    questionId: question.id,
                    kind: p.kind,
                    tmdbId: p.tmdbId,
                    title: p.title,
                    posterPath: p.posterPath,
                  },
                  question.maxSelections,
                )
              }
              className="inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-background hover:opacity-80"
            >
              <span className="max-w-[14ch] truncate">{p.title}</span>
              <XIcon className="size-3" />
            </button>
          ))}
        </div>
      ) : null}

      <div ref={resultsTopRef} className="scroll-mt-32" aria-hidden />

      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-2">
          {query.trim().length >= 2
            ? "Search results"
            : question.personDepartment === "Directing"
              ? "Popular directors"
              : question.personDepartment === "Acting"
                ? "Popular actors"
                : "Popular right now"}
          {isPending && results ? (
            <span
              aria-label="Loading"
              className="size-2 animate-pulse rounded-full bg-foreground"
            />
          ) : null}
        </span>
        {results && results.pageCount > 1 ? (
          <span className="font-mono tabular-nums">
            Page {results.page} / {results.pageCount}
          </span>
        ) : null}
      </div>

      {isPending && !results ? (
        <PickGridSkeleton
          count={18}
          variant={question.kind === "person" ? "person" : "film"}
        />
      ) : null}

      {results ? (
        results.kind === "film" ? (
          results.rows.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
              No films match that search. Try a different title.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {results.rows.map((film, idx) => {
                const isSelected = picks.some(
                  (p) => p.tmdbId === film.tmdb_id,
                );
                const lockedOtherId = lockedFromElsewhere.get(film.tmdb_id);
                const lockedReason =
                  lockedOtherId !== undefined
                    ? lockedLabel(lockedOtherId)
                    : undefined;
                return (
                  <li key={film.tmdb_id}>
                    <PickPosterCard
                      film={film}
                      selected={isSelected}
                      onSelect={() => handleSelectFilm(film)}
                      priority={idx < 6}
                      lockedReason={lockedReason}
                    />
                  </li>
                );
              })}
            </ul>
          )
        ) : results.rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            {query.trim().length >= 2
              ? question.personDepartment === "Directing"
                ? "No directors match that search. Try a different name."
                : question.personDepartment === "Acting"
                  ? "No actors match that search. Try a different name."
                  : "No people match that search. Try a different name."
              : "Couldn't load suggestions right now. Try searching by name."}
          </p>
        ) : (
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {results.rows.map((person) => {
              const isSelected = picks.some(
                (p) => p.tmdbId === person.tmdb_id,
              );
              const lockedOtherId = lockedFromElsewhere.get(person.tmdb_id);
              const lockedReason =
                lockedOtherId !== undefined
                  ? lockedLabel(lockedOtherId)
                  : undefined;
              return (
                <li key={person.tmdb_id}>
                  <PickPersonCard
                    person={person}
                    selected={isSelected}
                    onSelect={() => handleSelectPerson(person)}
                    lockedReason={lockedReason}
                  />
                </li>
              );
            })}
          </ul>
        )
      ) : null}

      {results && results.pageCount > 1 ? (
        <PicksPagination
          page={results.page}
          pageCount={results.pageCount}
          disabled={isPending}
          onChange={(next) => {
            setPage(next);
            resultsTopRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        />
      ) : null}

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {minOk
            ? atMax
              ? "Great — moving on automatically."
              : `Selected ${picks.length} of up to ${question.maxSelections}.`
            : `Pick at least ${question.minSelections} to continue.`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {prev ? (
            <Link
              href={prev}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
          ) : (
            <Link
              href="/cinetest"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ArrowLeftIcon className="size-4" />
              Intro
            </Link>
          )}
          <Button
            type="button"
            size="sm"
            disabled={!minOk}
            onClick={() => router.push(next)}
          >
            {isLastPick ? "Start Likert" : "Continue"}
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <p className="text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        Picks do not affect your CineType score —
        they personalise your CineMatch.
      </p>
    </div>
  );
}

export { filmPicksQuestions };
