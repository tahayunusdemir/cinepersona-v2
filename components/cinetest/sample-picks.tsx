import { FilmIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FILM_PICKS_COUNT } from "@/lib/cinepersona/film-picks-questions";

// Static preview of the first picks step. The real step uses TMDB search;
// here we show the question header + a row of empty poster slots so the
// flow is legible at a glance.
const SAMPLE_TITLES = [
  "Your #1 favourite",
  "Then another",
  "And another",
  "Round out four",
];

export function SamplePicks() {
  return (
    <div className="space-y-4 rounded-lg border bg-background p-4 sm:p-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Picks · 1 / {FILM_PICKS_COUNT}</Badge>
          <Badge variant="outline" className="font-mono uppercase">
            Film
          </Badge>
          <Badge variant="outline">Pick 4</Badge>
        </div>
        <p className="text-base font-medium text-foreground">
          Pick your four all-time favourite films.
        </p>
        <p className="text-xs text-muted-foreground">
          The four films you&apos;d take to a desert island.
        </p>
      </header>

      <div className="relative rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2"
        />
        <span className="ml-5">Search films by title…</span>
      </div>

      <ul className="grid grid-cols-4 gap-2 sm:gap-3">
        {SAMPLE_TITLES.map((label, idx) => (
          <li
            key={label}
            className="group relative flex aspect-[2/3] flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border/70 bg-muted/30 px-1 text-center"
          >
            <FilmIcon
              aria-hidden
              className="size-4 text-muted-foreground/70"
            />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground/80">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Picks don&apos;t change your score — they personalise your CineMatch.
      </p>
    </div>
  );
}
