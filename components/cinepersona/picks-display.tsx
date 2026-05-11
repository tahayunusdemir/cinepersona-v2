import Image from "next/image";
import { FilmIcon, UserIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { filmPicksQuestions } from "@/lib/cinepersona/film-picks-questions";
import { cn } from "@/lib/utils";

export type DisplayPick = {
  questionId: number;
  kind: "film" | "person";
  tmdbId: number;
  title: string;
  posterPath: string | null;
  sortOrder: number;
};

type Props = {
  picks: DisplayPick[];
  title?: string;
  emptyHint?: string;
};

const FAVOURITES_QUESTION_ID = 1;

function posterUrl(pick: DisplayPick): string | null {
  if (!pick.posterPath) return null;
  return `https://image.tmdb.org/t/p/w185${pick.posterPath}`;
}

function PickThumb({
  pick,
  className,
  sizes,
}: {
  pick: DisplayPick;
  className?: string;
  sizes: string;
}) {
  const url = posterUrl(pick);
  return (
    <span
      className={cn(
        "relative block aspect-[2/3] overflow-hidden rounded-md border border-border/60 bg-muted",
        className,
      )}
    >
      {url ? (
        <Image
          src={url}
          alt={pick.title}
          fill
          unoptimized
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-muted-foreground">
          {pick.kind === "person" ? (
            <UserIcon className="size-5" />
          ) : (
            <FilmIcon className="size-5" />
          )}
        </span>
      )}
    </span>
  );
}

export function PicksDisplay({
  picks,
  title = "Your picks",
  emptyHint,
}: Props) {
  const byQuestion = new Map<number, DisplayPick[]>();
  for (const p of picks) {
    const arr = byQuestion.get(p.questionId) ?? [];
    arr.push(p);
    byQuestion.set(p.questionId, arr);
  }
  for (const arr of byQuestion.values()) {
    arr.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const hasAny = picks.length > 0;
  const favouritesQuestion = filmPicksQuestions.find(
    (q) => q.id === FAVOURITES_QUESTION_ID,
  );
  const favouritePicks = byQuestion.get(FAVOURITES_QUESTION_ID) ?? [];
  const otherOrdered = filmPicksQuestions
    .filter((q) => q.id !== FAVOURITES_QUESTION_ID)
    .flatMap((q) => {
      const items = byQuestion.get(q.id) ?? [];
      return items.map((p) => ({ pick: p, question: q }));
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAny ? (
          <p className="text-sm text-muted-foreground">
            {emptyHint ?? "No picks attached to this result."}
          </p>
        ) : (
          <div className="space-y-5">
            {favouritePicks.length > 0 && favouritesQuestion ? (
              <section>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {favouritesQuestion.shortLabel}
                </p>
                <ul className="grid grid-cols-4 gap-3">
                  {favouritePicks.map((pick) => (
                    <li
                      key={`fav-${pick.kind}-${pick.tmdbId}`}
                      className="flex flex-col gap-1.5"
                    >
                      <PickThumb
                        pick={pick}
                        sizes="(min-width: 640px) 14vw, 22vw"
                      />
                      <p
                        className="line-clamp-1 text-xs leading-snug text-foreground/90"
                        title={pick.title}
                      >
                        {pick.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {otherOrdered.length > 0 ? (
              <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {otherOrdered.map(({ pick, question }) => (
                  <li
                    key={`${pick.kind}-${pick.tmdbId}-${question.id}`}
                    className="flex flex-col gap-1.5"
                  >
                    <PickThumb
                      pick={pick}
                      sizes="(min-width: 640px) 10vw, 22vw"
                    />
                    <p className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {question.shortLabel}
                    </p>
                    <p
                      className="-mt-1 line-clamp-1 text-xs leading-snug text-foreground/90"
                      title={pick.title}
                    >
                      {pick.title}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
