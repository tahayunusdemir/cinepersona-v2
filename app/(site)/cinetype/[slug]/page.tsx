import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowRight,
  ArrowRightIcon,
  ClapperboardIcon,
  FilmIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { ProjectorBloom, Reveal, Stagger } from "@/components/cinema/motion";
import { TypeCard } from "@/components/cinepersona/type-card";
import { ctaPrimary } from "@/lib/ui-tokens";
import {
  axes,
  getGroup,
  getProfile,
  getStrategy,
  getType,
  personalityTypes,
  typesInGroup,
  typesWithStrategy,
} from "@/lib/cinepersona";
import { resolveRecommendations } from "@/lib/cinepersona/recommendations-tmdb";
import { cn } from "@/lib/utils";

type PageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return personalityTypes.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const type = getType(slug);
  if (!type) return { title: "Type not found" };
  return {
    title: `${type.code} — ${type.name}`,
    description: type.tagline,
  };
}

const NARRATIVE_SECTIONS = new Set([
  "overview",
  "watching-style",
  "discovery",
  "conversation",
  "conclusion",
]);

export default async function TypeProfilePage({ params }: PageParams) {
  const { slug } = await params;
  const type = getType(slug);
  if (!type) notFound();

  const profile = getProfile(type.code);
  if (!profile) notFound();

  const group = getGroup(type.group)!;
  const strategy = getStrategy(type.strategy)!;

  const strengths = profile.traits.filter((t) => t.kind === "strength");
  const weaknesses = profile.traits.filter((t) => t.kind === "weakness");

  const resolved = await resolveRecommendations(profile.recommendations);
  const directors = resolved.filter((r) => r.kind === "director");
  const films = resolved.filter((r) => r.kind === "film");
  const genres = resolved.filter((r) => r.kind === "genre");

  const peers = typesInGroup(group.slug).filter((t) => t.code !== type.code);

  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
        <nav aria-label="Breadcrumb" className="pt-8">
          <Link
            href="/cinetype"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
          >
            <ArrowLeftIcon className="size-3" />
            All types
          </Link>
        </nav>

        {/* HEADER */}
        <header className="relative mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <ProjectorBloom className="pointer-events-none absolute -top-24 left-0 -z-10 h-[420px] w-[820px] max-w-[110vw] blur-3xl" />
          <Reveal as="div" immediate className="lg:col-span-8">
            <div className="relative size-40 overflow-hidden rounded-full border border-[#ecb756]/30 bg-foreground/[0.02] sm:size-56">
              <Image
                src={type.image}
                alt={`${type.name} portrait`}
                fill
                priority
                sizes="224px"
                className="object-cover"
              />
            </div>

            <div className="mt-6 flex items-baseline gap-5">
              <span className="font-display text-[88px] leading-none text-[#ecb756] sm:text-[120px]">
                {type.code}
              </span>
              <div className="flex flex-wrap gap-2 pb-3">
                <Link
                  href={`/cinetype/groups/${group.slug}`}
                  className="rounded-full border border-foreground/15 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-[#ecb756]/40 hover:text-foreground"
                >
                  {group.name}
                </Link>
                <Link
                  href={`/cinetype/strategies/${strategy.slug}`}
                  className="rounded-full border border-foreground/15 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-[#ecb756]/40 hover:text-foreground"
                >
                  {strategy.name}
                </Link>
              </div>
            </div>

            <h1 className="mt-5 font-display text-balance text-4xl tracking-tight sm:text-6xl">
              {type.name}
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              {type.tagline}
            </p>
          </Reveal>

          <Reveal immediate delay={0.12} className="lg:col-span-4 lg:flex lg:items-end">
            <blockquote className="relative rounded-2xl border border-foreground/10 bg-panel p-6">
              <span
                aria-hidden
                className="absolute left-6 top-2 font-display text-5xl leading-none text-[#ecb756]/30"
              >
                “
              </span>
              <p className="relative pt-5 font-display text-lg leading-snug text-foreground/90">
                {type.quote}
              </p>
            </blockquote>
          </Reveal>
        </header>

        {/* TYPE BREAKDOWN */}
        <section className="mt-12">
          <Reveal>
            <h2 className="mt-3 font-display text-2xl tracking-tight">
              Type breakdown
            </h2>
          </Reveal>
          <Stagger as="ul" step={0.07} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {axes.map((axis) => {
              const letter =
                axis.id === 1
                  ? type.axes.a1
                  : axis.id === 2
                    ? type.axes.a2
                    : axis.id === 3
                      ? type.axes.a3
                      : type.axes.a4;
              const pole =
                axis.primary.letter === letter ? axis.primary : axis.opposite;
              return (
                <Reveal
                  as="li"
                  key={axis.id}
                  className="rounded-xl border border-foreground/10 bg-panel p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {axis.name}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-4xl leading-none text-[#ecb756]">
                      {letter}
                    </span>
                    <span className="text-sm text-foreground/85">
                      {pole.name}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </section>

        {/* NARRATIVE */}
        <section className="mt-16 space-y-12">
          {profile.sections
            .filter((s) => NARRATIVE_SECTIONS.has(s.slug))
            .map((section, i) => (
              <Reveal as="article" key={section.slug} className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4 lg:col-span-9">
                  {section.body.split("\n\n").map((para, j) => (
                    <p
                      key={j}
                      className="text-base leading-relaxed text-foreground/85"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
        </section>

        {/* STRENGTHS / BLIND SPOTS */}
        <Stagger as="section" step={0.12} className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal className="rounded-2xl border border-foreground/10 bg-panel p-6">
            <FrameTag>Strengths</FrameTag>
            <h3 className="mt-3 font-display text-xl tracking-tight">
              What sharpens the print.
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              {strengths.map((s) => (
                <li key={s.label} className="border-l-2 border-[#ecb756] pl-4">
                  <p className="font-medium text-foreground">{s.label}</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {s.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="rounded-2xl border border-foreground/10 bg-panel p-6">
            <FrameTag>Blind spots</FrameTag>
            <h3 className="mt-3 font-display text-xl tracking-tight">
              Frames that go out of focus.
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              {weaknesses.map((s) => (
                <li
                  key={s.label}
                  className="border-l-2 border-foreground/15 pl-4"
                >
                  <p className="font-medium text-foreground">{s.label}</p>
                  <p className="mt-0.5 text-muted-foreground">
                    {s.description}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Stagger>

        {/* RECOMMENDATIONS */}
        <section className="mt-16">
          <Reveal>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              What they’d love.
            </h2>
          </Reveal>
          {profile.sections
            .filter((s) => s.slug === "recommendations")
            .map((s) => (
              <p
                key={s.slug}
                className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
              >
                {s.body}
              </p>
            ))}

          {/* Directors */}
          <div className="mt-8 rounded-2xl border border-foreground/10 bg-panel p-6">
            <div className="flex items-center gap-2">
              <ClapperboardIcon className="size-4 text-[#ecb756]" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Directors
              </h3>
            </div>
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {directors.map((r, i) => (
                <Reveal as="li" key={r.title} delay={i * 0.04} className="flex flex-col gap-2">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                    {r.imagePath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${r.imagePath}`}
                        alt={`${r.title} portrait`}
                        fill
                        sizes="(max-width: 768px) 33vw, 200px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <UserIcon className="size-7" />
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm font-medium">
                    {r.title}
                  </p>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Films */}
          <div className="mt-4 rounded-2xl border border-foreground/10 bg-panel p-6">
            <div className="flex items-center gap-2">
              <FilmIcon className="size-4 text-[#ecb756]" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Films
              </h3>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {films.map((r, i) => (
                <Reveal as="li" key={r.title} delay={i * 0.04} className="flex flex-col gap-2">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02]">
                    {r.imagePath ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w342${r.imagePath}`}
                        alt={`${r.title} poster`}
                        fill
                        sizes="(max-width: 768px) 45vw, 180px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <FilmIcon className="size-6" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="line-clamp-2 text-sm font-medium">
                      {r.title}
                    </p>
                    {r.year ? (
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {r.year}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="mt-4 rounded-2xl border border-foreground/10 bg-panel p-6">
            <div className="flex items-center gap-2">
              <TagIcon className="size-4 text-[#ecb756]" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Tags
              </h3>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {genres.map((r) => (
                <span
                  key={r.title}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 px-3 py-1 font-mono text-[11px] lowercase text-[#ecb756]"
                >
                  #{r.title.replace(/\s+/g, "-")}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PEERS */}
        {peers.length > 0 && (
          <section className="mt-16">
            <div className="mb-5 flex items-baseline justify-between gap-2">
              <div>
                <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
                  Other {group.name}
                </h2>
              </div>
              <Link
                href={`/cinetype/groups/${group.slug}`}
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
              >
                Open group
                <ArrowRightIcon className="size-3" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {peers.map((peer) => (
                <TypeCard key={peer.code} type={peer} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Reveal as="section" className="relative mt-16 overflow-hidden rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-7 sm:flex sm:items-center sm:justify-between sm:p-8">
          <ProjectorBloom className="pointer-events-none absolute right-0 top-1/2 -z-10 size-[360px] -translate-y-1/2 blur-3xl" />
          <div>
            <FrameTag>Curious?</FrameTag>
            <p className="mt-3 font-display text-xl tracking-tight">
              Not sure if this is you?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Take the 48-question CineTest — you’ll know in about ten minutes.
            </p>
          </div>
          <Link
            href="/cinetest"
            className={cn(ctaPrimary, "group mt-5 sm:mt-0")}
          >
            Take the test
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Strategy · {strategy.name} — {strategy.tagline}{" "}
          <Link
            href={`/cinetype/strategies/${strategy.slug}`}
            className="underline-offset-4 hover:text-[#ecb756] hover:underline"
          >
            Learn more
          </Link>{" "}
          ({typesWithStrategy(strategy.slug).length} types share it)
        </p>
      </div>
    </div>
  );
}
