"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { axes } from "@/lib/cinepersona/axes";
import { questions } from "@/lib/cinepersona/questions";
import { likertScale, likertShortLabels } from "@/lib/cinepersona/scoring";
import { LikertCircle } from "@/components/cinetest/likert-circle";
import type {
  AxisId,
  LikertValue,
  TestStateV2,
} from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

const PAGES = 4;
const PER_PAGE = 12;

type Props = {
  page: number;
  state: TestStateV2;
  onSetAnswer: (id: number, value: LikertValue) => void;
};

function prevHref(page: number): string {
  if (page <= 1) {
    return "/cinetest/take/picks/12";
  }
  return `/cinetest/take/likert/${page - 1}`;
}

function nextHref(page: number, allAnsweredOnPage: boolean): string {
  if (page >= PAGES) return "/cinetest/take/review";
  if (!allAnsweredOnPage) return `/cinetest/take/likert/${page}`;
  return `/cinetest/take/likert/${page + 1}`;
}

export function LikertStep({ page, state, onSetAnswer }: Props) {
  const router = useRouter();
  const start = (page - 1) * PER_PAGE;
  const slice = questions.slice(start, start + PER_PAGE);

  const axisId = slice[0]?.axis as AxisId;
  const axis = axes.find((a) => a.id === axisId);

  const answeredOnPage = slice.filter(
    (q) => state.answers[q.id] !== undefined,
  ).length;
  const allAnsweredOnPage = answeredOnPage === slice.length;

  // Scroll to top whenever page changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [page]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            Likert · {page} / {PAGES}
          </Badge>
          {axis ? (
            <Badge variant="outline" className="font-mono">
              {axis.primary.letter} ↔ {axis.opposite.letter}
            </Badge>
          ) : null}
          <Badge variant="outline">
            {answeredOnPage} / {slice.length} answered
          </Badge>
        </div>
        {axis ? (
          <>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {axis.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground">{axis.primary.name}:</span>{" "}
              {axis.primary.blurb}
              <br />
              <span className="text-foreground">{axis.opposite.name}:</span>{" "}
              {axis.opposite.blurb}
            </p>
          </>
        ) : null}
      </header>

      <ol className="space-y-4">
        {slice.map((q) => {
          const value = state.answers[q.id];
          const answered = value !== undefined;
          return (
            <li
              key={q.id}
              id={`q-${q.id}`}
              className={cn(
                "scroll-mt-32 rounded-lg border p-4 sm:p-5",
                answered
                  ? "border-border/70 bg-background"
                  : "border-dashed border-border/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Q{q.id} · Axis {q.axis}
                  </p>
                  <p className="text-base text-foreground">{q.body}</p>
                </div>
                {answered ? (
                  <Badge variant="secondary" className="shrink-0">
                    {likertShortLabels[value]}
                  </Badge>
                ) : null}
              </div>

              <fieldset
                className="mt-4"
                aria-label={`Likert response for question ${q.id}`}
              >
                <legend className="sr-only">{q.body}</legend>
                <div className="flex items-center justify-between gap-1 px-1 sm:gap-2">
                  {likertScale.map((v) => (
                    <LikertCircle
                      key={v}
                      value={v}
                      selected={value === v}
                      onSelect={() => onSetAnswer(q.id, v)}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Strongly disagree</span>
                  <span>Neutral</span>
                  <span>Strongly agree</span>
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {allAnsweredOnPage
            ? page === PAGES
              ? "All 48 answered. Ready to review."
              : "Page complete."
            : `${slice.length - answeredOnPage} questions left on this page.`}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={prevHref(page)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          <Button
            type="button"
            size="sm"
            disabled={!allAnsweredOnPage}
            onClick={() =>
              router.push(nextHref(page, allAnsweredOnPage))
            }
          >
            {page === PAGES ? "Review & submit" : `Continue to page ${page + 1}`}
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
