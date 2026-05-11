"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { CheckIcon, FilmIcon, SearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinPool, updatePoolPicks } from "@/lib/match/actions";
import type { MovieRow } from "@/lib/films/types";
import { PICKS_MAX, PICKS_MIN } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  library: MovieRow[];
  initialPicks: number[];
  mode: "join" | "edit";
};

export function JoinWizard({ library, initialPicks, mode }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<number[]>(initialPicks);
  const [pending, start] = useTransition();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return library;
    return library.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.original_title.toLowerCase().includes(term),
    );
  }, [library, query]);

  const togglePick = (id: number) => {
    setPicked((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= PICKS_MAX) {
        toast(`You can pick at most ${PICKS_MAX} films.`);
        return cur;
      }
      return [...cur, id];
    });
  };

  const onSubmit = () => {
    if (picked.length < PICKS_MIN || picked.length > PICKS_MAX) {
      toast.error(`Pick between ${PICKS_MIN} and ${PICKS_MAX} films.`);
      return;
    }
    start(async () => {
      const result =
        mode === "join"
          ? await joinPool({ picks: picked })
          : await updatePoolPicks({ picks: picked });
      if (!result.ok) {
        toast.error(errorLabel(result.error));
        return;
      }
      toast.success(
        mode === "join" ? "You're in this month's pool." : "Picks updated.",
      );
      router.push("/cine-match/matches");
      router.refresh();
    });
  };

  const pickedRows = useMemo(() => {
    const map = new Map(library.map((m) => [m.id, m]));
    return picked
      .map((id) => map.get(id))
      .filter((m): m is MovieRow => Boolean(m));
  }, [library, picked]);

  const tooFew = picked.length < PICKS_MIN;
  const tooMany = picked.length > PICKS_MAX;
  const submitDisabled = pending || tooFew || tooMany;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">
              {picked.length} / {PICKS_MAX} picked
            </p>
            <p className="text-xs text-muted-foreground">
              Pick at least {PICKS_MIN} films that represent your taste this
              month. Order doesn&apos;t matter.
            </p>
          </div>
          <Button onClick={onSubmit} disabled={submitDisabled}>
            {mode === "join" ? "Join the pool" : "Save changes"}
          </Button>
        </div>

        {pickedRows.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {pickedRows.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => togglePick(m.id)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs",
                    "hover:bg-secondary/80",
                  )}
                >
                  <span className="max-w-[12rem] truncate">{m.title}</span>
                  <XIcon className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your watched + watchlist…"
          className="pl-9"
        />
      </div>

      {library.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          You haven&apos;t marked any films yet. Browse{" "}
          <Link className="underline" href="/films">
            /films
          </Link>{" "}
          and mark some as watched first.
        </div>
      ) : (
        <ul
          className={cn(
            "grid gap-3",
            "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
          )}
        >
          {filtered.map((m) => {
            const selected = picked.includes(m.id);
            const disabled = !selected && picked.length >= PICKS_MAX;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => togglePick(m.id)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={cn(
                    "group relative block w-full overflow-hidden rounded-md text-left",
                    "ring-1 ring-border/50 transition",
                    selected && "ring-2 ring-primary",
                    disabled && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <div className="relative aspect-[2/3] bg-muted">
                    {m.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                        alt={m.title}
                        fill
                        sizes="(max-width: 768px) 33vw, 16vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                        <FilmIcon className="size-6" />
                        <span className="line-clamp-3 px-2 text-center text-[10px]">
                          {m.title}
                        </span>
                      </div>
                    )}
                    {selected ? (
                      <span
                        className="absolute right-1.5 top-1.5 rounded-full bg-primary p-1 text-primary-foreground"
                        aria-hidden
                      >
                        <CheckIcon className="size-3" />
                      </span>
                    ) : null}
                    {(m.watched || m.in_watchlist) ? (
                      <Badge
                        variant="secondary"
                        className="absolute bottom-1.5 left-1.5 px-1.5 text-[9px]"
                      >
                        {m.watched ? "watched" : "watchlist"}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-1 px-1 text-[11px] font-medium">
                    {m.title}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function errorLabel(err: string): string {
  switch (err) {
    case "no_test":
      return "Take the CineTest first.";
    case "watched_too_few":
      return "Mark at least 10 watched films.";
    case "no_pool":
      return "There's no active pool right now.";
    case "pool_locked":
      return "This month's pool is locked.";
    case "already_joined":
      return "You're already in this pool.";
    case "not_joined":
      return "Join the pool first.";
    case "invalid_picks":
      return "Pick between 5 and 10 films from your library.";
    case "unauthorized":
      return "Sign in first.";
    default:
      return "Something went wrong.";
  }
}
