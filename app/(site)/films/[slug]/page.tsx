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

import { FrameTag } from "@/components/cinema/atoms";
import { Reveal, Stagger } from "@/components/cinema/motion";
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
    <article className="relative isolate overflow-hidden pb-20">
      {/* Backdrop */}
      {detail.backdrop_path ? (
        <div className="relative h-[220px] w-full overflow-hidden bg-panel sm:h-[320px] md:h-[420px]">
          <Image
            src={`https://image.tmdb.org/t/p/w1280${detail.backdrop_path}`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-panel/40 via-panel/70 to-background"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--panel)_85%)]"
          />
        </div>
      ) : (
        <div className="h-[120px] w-full bg-panel" />
      )}

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Link
          href="/films"
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
        >
          <ChevronLeftIcon className="size-3" />
          Back to films
        </Link>

        <div
          className={
            detail.backdrop_path
              ? "relative -mt-24 flex flex-col gap-7 sm:-mt-32 sm:flex-row"
              : "mt-8 flex flex-col gap-7 sm:flex-row"
          }
        >
          {/* Poster */}
          <Reveal as="div" immediate className="shrink-0">
            <div className="overflow-hidden rounded-xl border border-foreground/10 bg-panel shadow-2xl ring-1 ring-[#ecb756]/10">
              {detail.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w342${detail.poster_path}`}
                  alt={`${detail.title} poster`}
                  width={240}
                  height={360}
                  priority
                  className="h-auto w-[200px] sm:w-[240px]"
                />
              ) : (
                <div className="flex h-[360px] w-[240px] flex-col items-center justify-center gap-2 text-muted-foreground">
                  <ClapperboardIcon className="size-8" />
                  <span className="px-3 text-center text-xs">
                    {detail.title}
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Meta */}
          <Stagger as="div" immediate step={0.07} initial={0.1} className="flex min-w-0 flex-1 flex-col gap-5 pt-6 sm:pt-24">
            <Reveal as="div" className="flex flex-col gap-2">
              <FrameTag>
                {detail.tmdb_id} · {year ?? "—"}
              </FrameTag>
              <h1 className="font-display text-balance text-4xl leading-[1.04] tracking-tight sm:text-5xl">
                {detail.title}
                {year ? (
                  <span className="ml-3 font-display text-3xl text-muted-foreground sm:text-4xl">
                    ({year})
                  </span>
                ) : null}
              </h1>
              {detail.original_title !== detail.title ? (
                <p className="text-sm text-muted-foreground">
                  {detail.original_title}
                </p>
              ) : null}
              {detail.tagline ? (
                <p className="mt-2 max-w-xl text-base text-foreground/70">
                  “{detail.tagline}”
                </p>
              ) : null}
            </Reveal>

            <Reveal as="dl" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {detail.release_date ? (
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="size-3.5 text-[#ecb756]" aria-hidden />
                  <dd>{formatDate(detail.release_date)}</dd>
                </div>
              ) : null}
              {detail.runtime ? (
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="size-3.5 text-[#ecb756]" aria-hidden />
                  <dd>{formatRuntime(detail.runtime)}</dd>
                </div>
              ) : null}
              {detail.vote_average && detail.vote_count ? (
                <div className="flex items-center gap-1.5">
                  <StarIcon
                    className="size-3.5 fill-[#ecb756] text-[#ecb756]"
                    aria-hidden
                  />
                  <dd>
                    <span className="font-medium tabular-nums text-foreground">
                      {detail.vote_average.toFixed(1)}
                    </span>{" "}
                    <span className="text-xs">
                      ({detail.vote_count.toLocaleString("en-US")})
                    </span>
                  </dd>
                </div>
              ) : null}
            </Reveal>

            {detail.genres.length > 0 ? (
              <Reveal className="flex flex-wrap gap-1.5">
                {detail.genres.map((g) => (
                  <span
                    key={g.id}
                    className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    {g.name}
                  </span>
                ))}
              </Reveal>
            ) : null}

            <Reveal>
              <FilmActions
                movieId={detail.id}
                watched={detail.watched}
                inWatchlist={detail.in_watchlist}
                isAuthed={isAuthed}
                loginHref={loginHref}
              />
            </Reveal>
          </Stagger>
        </div>

        {detail.overview ? (
          <Reveal as="section" className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <FrameTag>Synopsis</FrameTag>
              <h2 className="mt-3 font-display text-2xl tracking-tight">
                Overview
              </h2>
            </div>
            <div className="lg:col-span-9">
              <p className="max-w-3xl text-pretty text-base leading-relaxed text-foreground/85">
                {detail.overview}
              </p>
            </div>
          </Reveal>
        ) : null}

        {(directors.length > 0 || writers.length > 0) && (
          <Stagger as="section" step={0.1} className="mt-12 grid gap-4 sm:grid-cols-2">
            {directors.length > 0 ? (
              <Reveal>
                <CrewBlock
                  label={directors.length > 1 ? "Directors" : "Director"}
                  people={directors}
                />
              </Reveal>
            ) : null}
            {writers.length > 0 ? (
              <Reveal>
                <CrewBlock label="Writing" people={writers} />
              </Reveal>
            ) : null}
          </Stagger>
        )}

        {topCast.length > 0 ? (
          <section className="mt-14">
            <Reveal>
              <FrameTag>Cast list</FrameTag>
              <h2 className="mt-3 font-display text-2xl tracking-tight">
                Top cast
              </h2>
            </Reveal>
            <ul className="mt-6 grid grid-cols-2 gap-3 grid-stagger sm:grid-cols-4 md:grid-cols-5">
              {topCast.map((person) => (
                <li
                  key={person.credit_id}
                  className="overflow-hidden rounded-xl border border-foreground/10 bg-panel"
                >
                  <div className="aspect-[2/3] bg-foreground/[0.02]">
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
                  <div className="px-3 py-2">
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
    <div className="rounded-2xl border border-foreground/10 bg-panel p-5">
      <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
        {label}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm">
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
