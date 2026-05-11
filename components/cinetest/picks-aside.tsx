"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckIcon, FilmIcon, UserIcon } from "lucide-react";

import { filmPicksQuestions } from "@/lib/cinepersona/film-picks-questions";
import { cn } from "@/lib/utils";
import type { PickSelection, TestStateV2 } from "@/lib/cinepersona/types";

type Props = {
  state: TestStateV2;
  activeQuestionId?: number;
};

function thumbUrl(selection: PickSelection): string | null {
  if (!selection.posterPath) return null;
  const base =
    selection.kind === "person"
      ? "https://image.tmdb.org/t/p/w185"
      : "https://image.tmdb.org/t/p/w92";
  return `${base}${selection.posterPath}`;
}

export function PicksAside({ state, activeQuestionId }: Props) {
  return (
    <aside
      aria-label="Your film picks"
      className="space-y-2 rounded-xl border border-border/60 bg-background/50 p-3"
    >
      <header className="flex items-center justify-between px-1 pb-1">
        <h2 className="text-sm font-semibold tracking-tight">Your picks</h2>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          12 prompts
        </p>
      </header>

      <ol className="space-y-1.5">
        {filmPicksQuestions.map((q) => {
          const picks = state.picks[q.id] ?? [];
          const done = picks.length >= q.minSelections;
          const isActive = activeQuestionId === q.id;
          return (
            <li key={q.id}>
              <Link
                href={`/cinetest/take/picks/${q.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-2 py-2 transition-colors",
                  isActive
                    ? "border-foreground/70 bg-muted"
                    : done
                      ? "border-border/70 hover:bg-muted/60"
                      : "border-dashed border-border/60 hover:bg-muted/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-mono tabular-nums",
                    done
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <CheckIcon className="size-3" /> : q.id}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">
                    {q.shortLabel}
                  </p>
                  {picks.length > 0 ? (
                    <p className="truncate text-[11px] text-muted-foreground">
                      {picks.map((p) => p.title).join(" · ")}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground">
                      {q.maxSelections === 1
                        ? "Pick one"
                        : `Pick ${q.maxSelections}`}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-0.5">
                  {picks.slice(0, q.maxSelections).map((p) => {
                    const url = thumbUrl(p);
                    return (
                      <span
                        key={p.tmdbId}
                        className="relative block size-9 overflow-hidden rounded bg-muted"
                      >
                        {url ? (
                          <Image
                            src={url}
                            alt={p.title}
                            width={36}
                            height={54}
                            className="h-full w-full object-cover"
                            unoptimized
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
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
