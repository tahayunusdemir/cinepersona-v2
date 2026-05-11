import Image from "next/image";

import type { SharedFilmPoster } from "@/lib/match/queries";

type Props = {
  films: SharedFilmPoster[];
  totalShared: number;
};

/**
 * Horizontal poster strip for "films you both watched". Up to ~8 posters,
 * then a "+N more" tile when the underlying intersection is larger.
 */
export function SharedFilmsStrip({ films, totalShared }: Props) {
  if (films.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No watched films in common yet.
      </p>
    );
  }
  const overflow = Math.max(0, totalShared - films.length);

  return (
    <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {films.map((film) => (
        <li
          key={film.id}
          className="group relative shrink-0 overflow-hidden rounded-md border bg-muted"
          style={{ width: 72, height: 108 }}
          title={film.title}
        >
          {film.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w185${film.poster_path}`}
              alt={film.title}
              fill
              sizes="72px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center p-1 text-center text-[10px] text-muted-foreground">
              {film.title}
            </span>
          )}
        </li>
      ))}
      {overflow > 0 ? (
        <li
          aria-label={`${overflow} more shared films`}
          className="flex shrink-0 items-center justify-center rounded-md border bg-muted/30 text-xs font-medium text-muted-foreground"
          style={{ width: 72, height: 108 }}
        >
          +{overflow}
        </li>
      ) : null}
    </ul>
  );
}
