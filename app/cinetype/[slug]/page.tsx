import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, FilmIcon, ClapperboardIcon, TagIcon } from "lucide-react";

import { TypeCard } from "@/components/cinepersona/type-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

// Render only the narrative arc here — overview / watching style /
// discovery / conversation / conclusion. Strengths & weaknesses live in
// their own dedicated cards below; recommendations have their own card too.
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

  const directors = profile.recommendations.filter((r) => r.kind === "director");
  const films = profile.recommendations.filter((r) => r.kind === "film");
  const genres = profile.recommendations.filter((r) => r.kind === "genre");

  const peers = typesInGroup(group.slug).filter((t) => t.code !== type.code);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
      <nav aria-label="Breadcrumb" className="pt-8">
        <Link
          href="/cinetype"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3" />
          All types
        </Link>
      </nav>

      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {type.code}
          </span>
          <Link href={`/cinetype/groups/${group.slug}`}>
            <Badge variant="secondary" className="hover:bg-secondary/80">
              {group.name}
            </Badge>
          </Link>
          <Link href={`/cinetype/strategies/${strategy.slug}`}>
            <Badge variant="outline" className="hover:bg-muted">
              {strategy.name}
            </Badge>
          </Link>
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {type.name}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {type.tagline}
        </p>
        <blockquote className="mt-2 border-l-2 border-foreground/30 pl-4 text-base italic text-foreground/80">
          “{type.quote}”
        </blockquote>
      </header>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Type breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                <li key={axis.id} className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {axis.name}
                  </p>
                  <p className="font-medium">
                    <span className="font-mono text-foreground">{letter}</span>{" "}
                    · {pole.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-10" />

      {profile.sections
        .filter((s) => NARRATIVE_SECTIONS.has(s.slug))
        .map((section) => (
          <section key={section.slug} className="mt-10 space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {section.title}
            </h2>
            {section.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-foreground/90">
                {para}
              </p>
            ))}
          </section>
        ))}

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {strengths.map((s) => (
                <li key={s.label}>
                  <p className="font-medium text-foreground">{s.label}</p>
                  <p className="text-muted-foreground">{s.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Blind Spots</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {weaknesses.map((s) => (
                <li key={s.label}>
                  <p className="font-medium text-foreground">{s.label}</p>
                  <p className="text-muted-foreground">{s.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          What they&apos;d love
        </h2>
        {profile.sections
          .filter((s) => s.slug === "recommendations")
          .map((s) => (
            <p
              key={s.slug}
              className="mt-3 text-base leading-relaxed text-foreground/80"
            >
              {s.body}
            </p>
          ))}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <ClapperboardIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm">Directors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-foreground/90">
                {directors.map((r) => (
                  <li key={r.title}>{r.title}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <FilmIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm">Films</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-foreground/90">
                {films.map((r) => (
                  <li key={r.title}>
                    {r.title}
                    {r.year ? (
                      <span className="text-muted-foreground"> ({r.year})</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <TagIcon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm">Genres</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-foreground/90">
                {genres.map((r) => (
                  <li key={r.title}>{r.title}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {peers.length > 0 ? (
        <section className="mt-12">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Other {group.name}
            </h2>
            <Link
              href={`/cinetype/groups/${group.slug}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
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
      ) : null}

      <section className="mt-12 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm font-medium text-foreground">
            Not sure if this is you?
          </p>
          <p className="text-sm text-muted-foreground">
            Take the 48-question CineTest — you&apos;ll know in about ten
            minutes.
          </p>
        </div>
        <Link
          href="/cinetest"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Take the test
        </Link>
      </section>

      <p className="mt-8 text-xs text-muted-foreground">
        Strategy: <span className="text-foreground">{strategy.name}</span> —{" "}
        {strategy.tagline}{" "}
        <Link
          href={`/cinetype/strategies/${strategy.slug}`}
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Learn more
        </Link>
        {" "}({typesWithStrategy(strategy.slug).length} types share it).
      </p>
    </div>
  );
}
