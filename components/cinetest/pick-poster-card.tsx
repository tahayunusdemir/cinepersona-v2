"use client";

import Image from "next/image";
import { useState } from "react";
import { CheckIcon, FilmIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PickFilmRow } from "@/lib/cinepersona/film-picks-search";

type Props = {
  film: PickFilmRow;
  selected: boolean;
  onSelect: () => void;
  priority?: boolean;
  lockedReason?: string;
};

export function PickPosterCard({
  film,
  selected,
  onSelect,
  priority = false,
  lockedReason,
}: Props) {
  const locked = Boolean(lockedReason);
  const [imgLoaded, setImgLoaded] = useState(false);
  const year = film.release_date?.slice(0, 4);
  const label = year ? `${film.title} (${year})` : film.title;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-disabled={locked}
      disabled={locked}
      title={lockedReason}
      aria-label={
        locked
          ? `${label} — ${lockedReason}`
          : `${selected ? "Deselect" : "Select"} ${label}`
      }
      className={cn(
        "group relative block overflow-hidden rounded-md bg-muted text-left transition",
        "aspect-[2/3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "ring-2 ring-primary"
          : locked
            ? "ring-1 ring-border/40 cursor-not-allowed opacity-50"
            : "ring-1 ring-border/40 hover:ring-foreground/50",
      )}
    >
      {film.poster_path ? (
        <>
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/10 to-muted transition-opacity duration-500",
              imgLoaded ? "opacity-0" : "opacity-100",
            )}
          />
          <Image
            src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
            alt={`${label} poster`}
            width={220}
            height={330}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 768px) 33vw, (max-width: 1280px) 18vw, 12vw"
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-300",
              imgLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center text-muted-foreground">
          <FilmIcon className="size-6" />
          <span className="line-clamp-3 text-xs">{film.title}</span>
        </div>
      )}

      {selected ? (
        <span className="absolute left-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <CheckIcon className="size-4" />
        </span>
      ) : null}

      {locked ? (
        <span className="absolute inset-x-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-center text-[10px] font-medium uppercase tracking-wider text-white">
          {lockedReason}
        </span>
      ) : null}

      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pb-2 pt-6 text-white",
          "translate-y-1 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100",
          selected && "translate-y-0 opacity-100",
        )}
      >
        <span className="line-clamp-2 text-xs font-medium leading-tight">
          {film.title}
        </span>
        {year ? (
          <span className="text-[10px] tabular-nums opacity-80">{year}</span>
        ) : null}
      </span>
    </button>
  );
}
