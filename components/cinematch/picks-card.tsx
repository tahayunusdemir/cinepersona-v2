import Image from "next/image";
import Link from "next/link";
import { FilmIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { filmSlug } from "@/lib/films/slug";
import type { MovieRow } from "@/lib/films/types";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  weightLabel?: string;
  description?: string;
  groups: { label: string; movies: MovieRow[] }[];
};

export function PicksCard({ title, weightLabel, description, groups }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <span>{title}</span>
          {weightLabel ? (
            <span className="text-xs font-normal text-muted-foreground">
              {weightLabel}
            </span>
          ) : null}
        </CardTitle>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {groups.map((g) =>
          g.movies.length === 0 ? null : (
            <section key={g.label} aria-label={g.label}>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                {g.label} ({g.movies.length})
              </p>
              <ul className="flex gap-2 overflow-x-auto pb-1">
                {g.movies.map((m) => (
                  <li key={m.id} className="shrink-0">
                    <PosterTile movie={m} />
                  </li>
                ))}
              </ul>
            </section>
          ),
        )}
      </CardContent>
    </Card>
  );
}

function PosterTile({ movie }: { movie: MovieRow }) {
  const slug = filmSlug(movie.tmdb_id, movie.title);
  return (
    <Link
      href={`/films/${slug}`}
      className={cn(
        "block w-[88px] overflow-hidden rounded-md bg-muted ring-1 ring-border/50",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      )}
      title={movie.title}
    >
      <div className="relative aspect-[2/3]">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
            alt={`${movie.title} poster`}
            fill
            sizes="88px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-1 text-muted-foreground">
            <FilmIcon className="size-5" />
            <span className="line-clamp-2 text-center text-[10px]">
              {movie.title}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
