"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { toggleWatched, toggleWatchlist } from "@/lib/films/actions";

type Args = {
  movieId: number;
  watched: boolean;
  inWatchlist: boolean;
};

export function useTrackingActions({ movieId, watched, inWatchlist }: Args) {
  const [pending, startTransition] = useTransition();
  const [optimisticWatched, setOptimisticWatched] = useOptimistic(watched);
  const [optimisticWatchlist, setOptimisticWatchlist] =
    useOptimistic(inWatchlist);

  function onWatched() {
    if (pending) return;
    startTransition(async () => {
      setOptimisticWatched(!optimisticWatched);
      // Marking as watched implicitly drops from watchlist.
      if (!optimisticWatched && optimisticWatchlist) {
        setOptimisticWatchlist(false);
      }
      const result = await toggleWatched(movieId);
      if (!result.ok) {
        toast.error(
          result.reason === "unauthorized"
            ? "Sign in to track films"
            : "Action failed",
        );
        return;
      }
      toast.success(
        result.active ? "Marked as watched" : "Removed from watched",
      );
    });
  }

  function onWatchlist() {
    if (pending) return;
    startTransition(async () => {
      setOptimisticWatchlist(!optimisticWatchlist);
      const result = await toggleWatchlist(movieId);
      if (!result.ok) {
        toast.error(
          result.reason === "unauthorized"
            ? "Sign in to track films"
            : "Action failed",
        );
        return;
      }
      toast.success(
        result.active ? "Added to watchlist" : "Removed from watchlist",
      );
    });
  }

  return {
    pending,
    optimisticWatched,
    optimisticWatchlist,
    onWatched,
    onWatchlist,
  };
}
