"use client";

import Image from "next/image";
import Link from "next/link";
import { FilmIcon } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { filmSlug } from "@/lib/films/slug";
import type { MovieRow, ViewMode } from "@/lib/films/types";

import { PosterActions } from "./poster-actions";
import { useTrackingActions } from "./use-tracking-actions";

type Props = {
  movie: MovieRow;
  view: ViewMode;
  isAuthed: boolean;
  loginHref: string;
  priority?: boolean;
};

export function PosterItem({
  movie,
  view,
  isAuthed,
  loginHref,
  priority = false,
}: Props) {
  const year = movie.release_date?.slice(0, 4);
  const slug = filmSlug(movie.tmdb_id, movie.title);
  const size = view === "dense" ? "w185" : "w342";
  const width = view === "dense" ? 120 : 220;
  const height = view === "dense" ? 180 : 330;
  const tooltipText = year ? `${movie.title} (${year})` : movie.title;

  const tracking = useTrackingActions({
    movieId: movie.id,
    watched: movie.watched,
    inWatchlist: movie.in_watchlist,
  });

  const ringClass = tracking.optimisticWatched
    ? "ring-2 ring-emerald-500"
    : tracking.optimisticWatchlist
      ? "ring-2 ring-amber-400"
      : "ring-1 ring-border/50";

  const overlayClass = tracking.optimisticWatched
    ? "bg-emerald-500/20 backdrop-blur-[0.5px]"
    : tracking.optimisticWatchlist
      ? "bg-amber-400/20 backdrop-blur-[0.5px]"
      : null;

  return (
    <li className="group relative">
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={`/films/${slug}`}
              aria-label={tooltipText}
              className={cn(
                "relative block overflow-hidden rounded-md bg-muted",
                "aspect-[2/3] transition-[box-shadow,background-color] duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                ringClass,
              )}
            >
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/${size}${movie.poster_path}`}
                  alt={`${tooltipText} poster`}
                  width={width}
                  height={height}
                  priority={priority}
                  loading={priority ? undefined : "lazy"}
                  sizes="(max-width: 768px) 33vw, (max-width: 1280px) 16vw, 8vw"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-center text-muted-foreground">
                  <FilmIcon className="size-6" />
                  <span className="line-clamp-3 text-xs">{movie.title}</span>
                </div>
              )}
              {overlayClass ? (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0",
                    overlayClass,
                  )}
                />
              ) : null}
            </Link>
          }
        />
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>

      <PosterActions
        isAuthed={isAuthed}
        loginHref={loginHref}
        pending={tracking.pending}
        optimisticWatched={tracking.optimisticWatched}
        optimisticWatchlist={tracking.optimisticWatchlist}
        onWatched={tracking.onWatched}
        onWatchlist={tracking.onWatchlist}
      />
    </li>
  );
}
