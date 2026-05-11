"use client";

import Link from "next/link";
import {
  BookmarkIcon,
  BookmarkCheckIcon,
  CheckIcon,
  CheckCheckIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTrackingActions } from "./use-tracking-actions";

type Props = {
  movieId: number;
  watched: boolean;
  inWatchlist: boolean;
  isAuthed: boolean;
  loginHref: string;
};

export function FilmActions({
  movieId,
  watched,
  inWatchlist,
  isAuthed,
  loginHref,
}: Props) {
  const {
    pending,
    optimisticWatched,
    optimisticWatchlist,
    onWatched,
    onWatchlist,
  } = useTrackingActions({ movieId, watched, inWatchlist });

  if (!isAuthed) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href={loginHref}
          className={cn(buttonVariants({ variant: "default", size: "default" }))}
        >
          <CheckIcon className="size-4" />
          Sign in to track
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={optimisticWatched ? "default" : "outline"}
        onClick={onWatched}
        disabled={pending}
        aria-pressed={optimisticWatched}
      >
        {optimisticWatched ? (
          <>
            <CheckCheckIcon className="size-4" />
            Watched
          </>
        ) : (
          <>
            <CheckIcon className="size-4" />
            Mark as watched
          </>
        )}
      </Button>

      <Button
        type="button"
        variant={optimisticWatchlist ? "default" : "outline"}
        onClick={onWatchlist}
        disabled={pending || optimisticWatched}
        aria-pressed={optimisticWatchlist}
      >
        {optimisticWatchlist ? (
          <>
            <BookmarkCheckIcon className="size-4" />
            On watchlist
          </>
        ) : (
          <>
            <BookmarkIcon className="size-4" />
            Add to watchlist
          </>
        )}
      </Button>
    </div>
  );
}
