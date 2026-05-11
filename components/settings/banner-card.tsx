"use client";

import Image from "next/image";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { FilmIcon, Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  clearBannerFilmAction,
  setBannerFilmAction,
} from "@/lib/settings/actions";
import {
  searchBannerFilms,
  type BannerFilmRow,
} from "@/lib/settings/banner-search";
import { cn } from "@/lib/utils";

type Props = {
  initial: BannerFilmRow | null;
};

const SEARCH_DEBOUNCE_MS = 300;

export function BannerCard({ initial }: Props) {
  const [current, setCurrent] = useState<BannerFilmRow | null>(initial);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [results, setResults] = useState<BannerFilmRow[]>([]);
  const [searching, startSearch] = useTransition();
  const [saving, startSave] = useTransition();
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const handle = setTimeout(() => {
      const q = deferred.trim();
      // Skip empty queries — we don't want to dump the popular list here.
      if (q.length < 2) {
        setResults([]);
        lastQueryRef.current = q;
        return;
      }
      lastQueryRef.current = q;
      startSearch(async () => {
        const res = await searchBannerFilms(q, 1);
        // Guard against out-of-order resolutions.
        if (lastQueryRef.current === q) {
          setResults(res.rows);
        }
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [deferred]);

  const handleSelect = useCallback((film: BannerFilmRow) => {
    startSave(async () => {
      const res = await setBannerFilmAction(film.id);
      if (res.ok) {
        setCurrent(film);
        setQuery("");
        setResults([]);
        toast.success(`Banner set to ${film.title}.`);
      } else {
        toast.error("Could not update banner. Try again.");
      }
    });
  }, []);

  const handleClear = useCallback(() => {
    startSave(async () => {
      const res = await clearBannerFilmAction();
      if (res.ok) {
        setCurrent(null);
        toast.success("Banner removed.");
      } else {
        toast.error("Could not remove banner. Try again.");
      }
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile banner</CardTitle>
        <CardDescription>
          Pick one film whose poster will sit softly behind your profile
          header — blurred and fading toward the edges. You can change it
          anytime.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {current ? (
          <div className="flex items-center gap-3 rounded-lg border p-3">
            {current.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${current.poster_path}`}
                alt=""
                width={46}
                height={69}
                className="h-[69px] w-[46px] shrink-0 rounded object-cover"
              />
            ) : (
              <div className="flex h-[69px] w-[46px] shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                <FilmIcon className="size-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{current.title}</p>
              {current.release_date ? (
                <p className="text-xs tabular-nums text-muted-foreground">
                  {current.release_date.slice(0, 4)}
                </p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                Currently set as your banner.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={saving}
            >
              {saving ? <Loader2Icon className="animate-spin" /> : null}
              Remove
            </Button>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            No banner film yet. Search for one below.
          </p>
        )}

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search films by title…"
            className="pl-9"
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          ) : null}
        </div>

        {query.trim().length >= 2 ? (
          searching && results.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              Searching…
            </div>
          ) : results.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No films match that title.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {results.map((film) => {
                const isCurrent = current?.id === film.id;
                const year = film.release_date?.slice(0, 4);
                const label = year ? `${film.title} (${year})` : film.title;
                return (
                  <li key={film.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(film)}
                      disabled={saving || isCurrent}
                      aria-label={`Set banner to ${label}`}
                      className={cn(
                        "group relative block aspect-[2/3] w-full overflow-hidden rounded-md bg-muted ring-1 ring-border/40 transition",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                        isCurrent
                          ? "ring-2 ring-primary"
                          : "hover:ring-foreground/50",
                        saving && "opacity-60",
                      )}
                    >
                      {film.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
                          alt=""
                          width={220}
                          height={330}
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-muted-foreground">
                          <FilmIcon className="size-5" />
                          <span className="line-clamp-3 text-xs">
                            {film.title}
                          </span>
                        </div>
                      )}
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-2 pb-1.5 pt-5 text-left text-[11px] font-medium leading-tight text-white opacity-0 transition group-hover:opacity-100">
                        <span className="line-clamp-2">{film.title}</span>
                        {year ? (
                          <span className="block text-[10px] tabular-nums opacity-80">
                            {year}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : (
          <p className="text-xs text-muted-foreground">
            Type at least 2 letters to search.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
