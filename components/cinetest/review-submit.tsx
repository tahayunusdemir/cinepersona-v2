"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  FilmIcon,
  RotateCcwIcon,
  UserIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FILM_PICKS_COUNT,
  filmPicksQuestions,
} from "@/lib/cinepersona/film-picks-questions";
import { questions } from "@/lib/cinepersona/questions";
import {
  saveResultAction,
  savePicksAction,
} from "@/lib/cinepersona/save-result";
import type {
  LikertValue,
  PickSelection,
  TestStateV2,
} from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

type Props = {
  state: TestStateV2;
  onReset: () => void;
};

function thumbUrl(selection: PickSelection): string | null {
  if (!selection.posterPath) return null;
  const base =
    selection.kind === "person"
      ? "https://image.tmdb.org/t/p/w185"
      : "https://image.tmdb.org/t/p/w92";
  return `${base}${selection.posterPath}`;
}

function valueColor(v: LikertValue | undefined): string {
  if (v === undefined) return "bg-muted";
  if (v >= 2) return "bg-emerald-500";
  if (v === 1) return "bg-emerald-300";
  if (v === 0) return "bg-muted-foreground/30";
  if (v === -1) return "bg-rose-300";
  return "bg-rose-500";
}

export function ReviewSubmit({ state, onReset }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const missingPicks = filmPicksQuestions.filter(
    (q) => (state.picks[q.id]?.length ?? 0) < q.minSelections,
  );
  const missingAnswers = questions.filter(
    (q) => state.answers[q.id] === undefined,
  );
  const ready = missingPicks.length === 0 && missingAnswers.length === 0;

  function submit() {
    if (!ready) return;
    setError(null);

    const answersPayload: Record<string, number> = {};
    for (const [id, v] of Object.entries(state.answers)) {
      answersPayload[id] = v;
    }

    const picksPayload = filmPicksQuestions.flatMap((q) => {
      const picks = state.picks[q.id] ?? [];
      return picks.map((p, idx) => ({
        questionId: q.id,
        questionSlug: q.slug,
        kind: p.kind,
        tmdbId: p.tmdbId,
        title: p.title,
        posterPath: p.posterPath,
        sortOrder: idx,
      }));
    });

    start(async () => {
      const result = await saveResultAction(answersPayload);
      if (!result.ok) {
        setError(
          result.error === "invalid_answers"
            ? "Your answers look incomplete — try again."
            : "Couldn't save right now. Please try again.",
        );
        return;
      }
      const picksRes = await savePicksAction(result.id, picksPayload);
      if (!picksRes.ok) {
        // Leave answers + picks in localStorage so the user can retry.
        // Without this, onReset() would wipe the very picks that just
        // failed to attach, making "Try again" impossible.
        const detail =
          picksRes.error === "movie_not_cached"
            ? "One of your film picks isn't in our cache yet. Re-pick that film from the search and resubmit."
            : picksRes.error === "no_service_role"
              ? "Server is missing the SUPABASE_SERVICE_ROLE_KEY env var — picks can't be written."
              : picksRes.error === "duplicate_pick"
                ? "The same film or person is selected in two questions. Edit one of them and resubmit."
                : picksRes.error === "invalid_picks"
                  ? "Some picks don't match the expected shape. Check counts/titles and resubmit."
                  : picksRes.error === "invalid_result"
                    ? "Result ID looks malformed — please reload and retry."
                    : picksRes.error === "save_failed"
                      ? "Database refused the picks write. Check Supabase logs."
                      : `Saved your result, but couldn't attach picks (${picksRes.error}). Tap submit again to retry.`;
        setError(detail);
        return;
      }
      onReset();
      router.push(`/cinetest/result/${result.id}`);
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Review</Badge>
          <Badge variant="outline">
            {FILM_PICKS_COUNT - missingPicks.length}/{FILM_PICKS_COUNT} picks
          </Badge>
          <Badge variant="outline">
            {questions.length - missingAnswers.length}/{questions.length}{" "}
            answers
          </Badge>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          One last look before we score this.
        </h1>
        <p className="text-sm text-muted-foreground">
          Tap any pick to edit it; tap any answered row to revisit that page.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your picks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filmPicksQuestions.map((q) => {
            const picks = state.picks[q.id] ?? [];
            const missing = picks.length < q.minSelections;
            return (
              <Link
                key={q.id}
                href={`/cinetest/take/picks/${q.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors",
                  missing
                    ? "border-dashed border-amber-400/70 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50"
                    : "border-border/60 hover:bg-muted/40",
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground">
                  {q.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {q.shortLabel}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {picks.length === 0
                      ? "Not selected yet"
                      : picks.map((p) => p.title).join(" · ")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {picks.map((p) => {
                    const url = thumbUrl(p);
                    return (
                      <span
                        key={p.tmdbId}
                        className="relative block size-10 overflow-hidden rounded bg-muted"
                      >
                        {url ? (
                          <Image
                            src={url}
                            alt={p.title}
                            width={40}
                            height={60}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                            {p.kind === "person" ? (
                              <UserIcon className="size-3" />
                            ) : (
                              <FilmIcon className="size-3" />
                            )}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((page) => {
            const start = (page - 1) * 12;
            const slice = questions.slice(start, start + 12);
            const missing = slice.filter(
              (q) => state.answers[q.id] === undefined,
            ).length;
            return (
              <Link
                key={page}
                href={`/cinetest/take/likert/${page}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-3 py-2",
                  missing > 0
                    ? "border-dashed border-amber-400/70 bg-amber-50/40 dark:bg-amber-950/20"
                    : "border-border/60 hover:bg-muted/40",
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[10px] text-muted-foreground">
                  {page}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    Likert page {page}{" "}
                    <span className="text-muted-foreground">
                      (Q{slice[0].id}–Q{slice[slice.length - 1].id})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {missing > 0
                      ? `${missing} question${missing === 1 ? "" : "s"} left`
                      : "All answered"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {slice.map((q) => (
                    <span
                      key={q.id}
                      aria-hidden
                      className={cn(
                        "block size-3 rounded-sm",
                        valueColor(state.answers[q.id]),
                      )}
                    />
                  ))}
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {ready
            ? "Ready when you are. We'll save your result and show your CineType."
            : "Finish the highlighted sections above to enable submit."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (
                confirm(
                  "Reset all picks and answers? This can't be undone in this browser.",
                )
              ) {
                onReset();
                router.push("/cinetest/take/picks/1");
              }
            }}
          >
            <RotateCcwIcon className="size-4" />
            Reset
          </Button>
          <Link
            href="/cinetest/take/likert/4"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          <Button
            type="button"
            size="sm"
            disabled={!ready || pending}
            onClick={submit}
          >
            {pending ? (
              <>
                <CheckCircle2Icon className="size-4 animate-pulse" />
                Saving…
              </>
            ) : (
              <>
                See my result
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
