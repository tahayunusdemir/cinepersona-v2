"use client";

import Link from "next/link";
import {
  BookmarkIcon,
  BookmarkCheckIcon,
  CheckIcon,
  CheckCheckIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  isAuthed: boolean;
  loginHref: string;
  pending: boolean;
  optimisticWatched: boolean;
  optimisticWatchlist: boolean;
  onWatched: () => void;
  onWatchlist: () => void;
};

export function PosterActions({
  isAuthed,
  loginHref,
  pending,
  optimisticWatched,
  optimisticWatchlist,
  onWatched,
  onWatchlist,
}: Props) {
  if (!isAuthed) {
    return (
      <div className="absolute inset-x-2 bottom-2 flex justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Tooltip>
          <TooltipTrigger
            render={
              <Link
                href={loginHref}
                aria-label="Sign in to track films"
                className="inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
              >
                <CheckIcon className="size-4" />
                <span className="sr-only">Sign in to track</span>
              </Link>
            }
          />
          <TooltipContent>Sign in to track films</TooltipContent>
        </Tooltip>
      </div>
    );
  }

  const WatchedIcon = optimisticWatched ? CheckCheckIcon : CheckIcon;
  const BookmarkGlyph = optimisticWatchlist ? BookmarkCheckIcon : BookmarkIcon;

  return (
    <div
      className={cn(
        "absolute inset-x-2 bottom-2 z-10 flex justify-center gap-2",
        "opacity-0 transition-opacity duration-150",
        "group-hover:opacity-100 group-focus-within:opacity-100",
        "motion-reduce:transition-none [@media(hover:none)]:opacity-100",
      )}
    >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onWatched}
              disabled={pending}
              aria-label={
                optimisticWatched ? "Unmark as watched" : "Mark as watched"
              }
              aria-pressed={optimisticWatched}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background disabled:opacity-60",
                optimisticWatched ? "text-emerald-600" : "text-foreground",
              )}
            >
              <WatchedIcon className="size-4" />
              <span className="sr-only">
                {optimisticWatched ? "Unmark as watched" : "Mark as watched"}
              </span>
            </button>
          }
        />
        <TooltipContent>
          {optimisticWatched ? "Unmark as watched" : "Mark as watched"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onWatchlist}
              disabled={pending || optimisticWatched}
              aria-label={
                optimisticWatchlist
                  ? "Remove from watchlist"
                  : "Add to watchlist"
              }
              aria-pressed={optimisticWatchlist}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background disabled:opacity-60",
                optimisticWatchlist ? "text-amber-600" : "text-foreground",
              )}
            >
              <BookmarkGlyph className="size-4" />
              <span className="sr-only">
                {optimisticWatchlist
                  ? "Remove from watchlist"
                  : "Add to watchlist"}
              </span>
            </button>
          }
        />
        <TooltipContent>
          {optimisticWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
