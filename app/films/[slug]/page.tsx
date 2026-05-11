import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ClapperboardIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { FilmActions } from "@/components/films/film-actions";
import { getFilmDetail, parseSlug } from "@/lib/films/detail";
import { filmSlug } from "@/lib/films/slug";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tmdbId = parseSlug(slug);
  if (!tmdbId) return { title: "Film not found — CinePersona" };

  const detail = await getFilmDetail(tmdbId);
  if (!detail) return { title: "Film not found — CinePersona" };

  const year = detail.release_date?.slice(0, 4);
  return {
    title: year
      ? `${detail.title} (${year}) — CinePersona`
      : `${detail.title} — CinePersona`,
    description:
      detail.tagline ||
      (detail.overview ? detail.overview.slice(0, 160) : undefined),
    alternates: { canonical: `/films/${filmSlug(detail.tmdb_id, detail.title)}` },
    openGraph: detail.backdrop_path
      ? {
          images: [
            `https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`,
          ],
        }
      : undefined,
  };
}

export default async function FilmDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tmdbId = parseSlug(slug);
  if (!tmdbId) notFound();

  const detail = await getFilmDetail(tmdbId);
  if (!detail) notFound();

  // Redirect non-canonical slugs (`/films/123`, `/films/123-old-title`) to
  // the current canonical form so we don't serve duplicate-content 200s.
  const canonicalSlug = filmSlug(detail.tmdb_id, detail.title);
  if (slug !== canonicalSlug) redirect(`/films/${canonicalSlug}`);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = Boolean(user);

  const loginHref = `/login?next=${encodeURIComponent(`/films/${canonicalSlug}`)}`;

  const year = detail.release_date?.slice(0, 4);
  const directors = detail.crew.filter((c) => c.job === "Director");
  const writers = detail.crew
    .filter((c) => c.department === "Writing")
    .slice(0, 3);
  const topCast = detail.cast.slice(0, 10);

  return (
    <article className="pb-16">
      {detail.backdrop_path ? (
        <div className="relative h-[180px] w-full overflow-hidden bg-muted sm:h-[260px] md:h-[320px]">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"
          />
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
        <Link
          href="/films"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" />
          Back to films
        </Link>

        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="shrink-0">
            <div className="overflow-hidden rounded-lg bg-muted shadow-lg">
              {detail.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${detail.poster_path}`}
                  alt={`${detail.title} poster`}
                  width={220}
                  height={330}
                  priority
                  className="h-auto w-[180px] sm:w-[220px]"
                />
              ) : (
                <div className="flex h-[330px] w-[220px] flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ClapperboardIcon className="size-8" />
                  <span className="px-3 text-center text-xs">
                    {detail.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {detail.title}
                {year ? (
                  <span className="ml-2 font-normal text-muted-foreground">
                    ({year})
                  </span>
                ) : null}
              </h1>
              {detail.original_title !== detail.title ? (
                <p className="text-sm text-muted-foreground italic">
                  {detail.original_title}
                </p>
              ) : null}
              {detail.tagline ? (
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{detail.tagline}&rdquo;
                </p>
              ) : null}
            </div>

            <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {detail.release_date ? (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-3.5" aria-hidden />
                  <dd>{formatDate(detail.release_date)}</dd>
                </div>
              ) : null}
              {detail.runtime ? (
                <div className="flex items-center gap-1">
                  <ClockIcon className="size-3.5" aria-hidden />
                  <dd>{formatRuntime(detail.runtime)}</dd>
                </div>
              ) : null}
              {detail.vote_average && detail.vote_count ? (
                <div className="flex items-center gap-1">
                  <StarIcon className="size-3.5 text-amber-500" aria-hidden />
                  <dd>
                    <span className="text-foreground font-medium tabular-nums">
                      {detail.vote_average.toFixed(1)}
                    </span>{" "}
                    <span className="text-xs">
                      ({detail.vote_count.toLocaleString("en-US")} votes)
                    </span>
                  </dd>
                </div>
              ) : null}
            </dl>

            {detail.genres.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {detail.genres.map((g) => (
                  <Badge key={g.id} variant="secondary">
                    {g.name}
                  </Badge>
                ))}
              </div>
            ) : null}

            <FilmActions
              movieId={detail.id}
              watched={detail.watched}
              inWatchlist={detail.in_watchlist}
              isAuthed={isAuthed}
              loginHref={loginHref}
            />
          </div>
        </div>

        {detail.overview ? (
          <section className="mt-10 max-w-3xl">
            <h2 className="mb-2 text-lg font-semibold">Overview</h2>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              {detail.overview}
            </p>
          </section>
        ) : null}

        {(directors.length > 0 || writers.length > 0) && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {directors.length > 0 ? (
              <CrewBlock
                label={directors.length > 1 ? "Directors" : "Director"}
                people={directors}
              />
            ) : null}
            {writers.length > 0 ? (
              <CrewBlock label="Writing" people={writers} />
            ) : null}
          </section>
        )}

        {topCast.length > 0 ? (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-semibold">Top cast</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {topCast.map((person) => (
                <li
                  key={person.credit_id}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="aspect-[2/3] bg-muted">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        width={185}
                        height={278}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center text-xs text-muted-foreground">
                        {person.name}
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-medium">{person.name}</p>
                    {person.character ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {person.character}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function CrewBlock({
  label,
  people,
}: {
  label: string;
  people: { credit_id: string; name: string; job: string | null }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </h3>
      <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
        {people.map((p) => (
          <li key={p.credit_id}>
            <span className="font-medium">{p.name}</span>
            {p.job && p.job !== label ? (
              <span className="text-muted-foreground"> · {p.job}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
