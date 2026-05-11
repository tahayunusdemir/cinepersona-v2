"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FILM_PICKS_COUNT,
  filmPicksQuestions,
} from "@/lib/cinepersona/film-picks-questions";
import { questions } from "@/lib/cinepersona/questions";
import { cn } from "@/lib/utils";
import type { TestStateV2 } from "@/lib/cinepersona/types";

const LIKERT_PAGES = 4;
const LIKERT_PER_PAGE = 12;

type Props = {
  state: TestStateV2;
};

function answeredOnLikertPage(
  state: TestStateV2,
  page: number,
): { answered: number; total: number } {
  const start = (page - 1) * LIKERT_PER_PAGE;
  const slice = questions.slice(start, start + LIKERT_PER_PAGE);
  let answered = 0;
  for (const q of slice) {
    if (state.answers[q.id] !== undefined) answered += 1;
  }
  return { answered, total: slice.length };
}

function pickCompleted(state: TestStateV2, questionId: number): boolean {
  const q = filmPicksQuestions.find((x) => x.id === questionId);
  if (!q) return false;
  const picks = state.picks[questionId] ?? [];
  return picks.length >= q.minSelections;
}

export function TakeProgress({ state }: Props) {
  const pathname = usePathname() ?? "";

  const picksDone = filmPicksQuestions.filter((q) =>
    pickCompleted(state, q.id),
  ).length;
  const likertAnswered = Object.keys(state.answers).length;
  const totalAnswered = picksDone + likertAnswered;
  const totalCount = FILM_PICKS_COUNT + questions.length;
  const pct = Math.round((totalAnswered / totalCount) * 100);

  return (
    <div className="sticky top-14 z-30 -mx-4 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>
            Picks {picksDone}/{FILM_PICKS_COUNT}
          </span>
          <span className="font-mono tabular-nums text-foreground">
            {pct}%
          </span>
          <span>
            Likert {likertAnswered}/{questions.length}
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-2 sm:grid-cols-[auto_1fr_auto_1fr]">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
            A
          </span>
          <ol className="flex gap-1">
            {filmPicksQuestions.map((q) => {
              const href = `/cinetest/take/picks/${q.id}`;
              const active = pathname === href;
              const done = pickCompleted(state, q.id);
              return (
                <li key={q.id} className="flex-1">
                  <Link
                    href={href}
                    aria-label={`Pick ${q.id}: ${q.shortLabel}`}
                    className={cn(
                      "block h-1.5 rounded-full",
                      done
                        ? "bg-foreground"
                        : active
                          ? "bg-foreground/40 ring-1 ring-foreground"
                          : "bg-muted",
                    )}
                  />
                </li>
              );
            })}
          </ol>

          <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:inline sm:text-xs">
            B
          </span>
          <ol className="col-span-2 flex gap-1 sm:col-span-1">
            {Array.from({ length: LIKERT_PAGES }, (_, i) => i + 1).map(
              (page) => {
                const href = `/cinetest/take/likert/${page}`;
                const active = pathname === href;
                const { answered, total } = answeredOnLikertPage(state, page);
                const pctPage = total === 0 ? 0 : (answered / total) * 100;
                return (
                  <li
                    key={page}
                    className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                  >
                    <Link
                      href={href}
                      aria-label={`Likert page ${page}`}
                      className="absolute inset-0"
                    />
                    <span
                      aria-hidden
                      className={cn(
                        "block h-full",
                        active ? "bg-foreground/70" : "bg-foreground/80",
                      )}
                      style={{ width: `${pctPage}%` }}
                    />
                  </li>
                );
              },
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
