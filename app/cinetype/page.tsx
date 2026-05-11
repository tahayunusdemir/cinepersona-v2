import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { TypeCard } from "@/components/cinepersona/type-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  axes,
  groups,
  personalityTypes,
  questions,
  strategies,
  typesInGroup,
} from "@/lib/cinepersona";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "CineType",
  description:
    "16 cinema personalities mapped on 4 axes. Discover the type that fits how you actually watch.",
};

export default function CineTypePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <section className="flex flex-col items-center px-0 pt-16 pb-12 text-center sm:pt-24">
        <Badge variant="secondary" className="mb-5">
          {siteConfig.name} · personality model
        </Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          16 ways of watching cinema.
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          CineType maps how you actually watch films on four axes — connection,
          meaning, evaluation, discovery — and gives you a four-letter code
          you&apos;ll recognise immediately.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/cinetest"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Take the test
          </Link>
          <Link
            href="#types"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Browse all 16 types
          </Link>
        </div>
      </section>

      <section aria-label="Axes" className="mt-8">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            The four axes
          </h2>
          <p className="text-sm text-muted-foreground">
            Every type code is a single letter from each axis.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {axes.map((axis) => (
            <Card key={axis.id} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between gap-2 text-base">
                  <span>{axis.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {axis.primary.letter} ↔ {axis.opposite.letter}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-foreground">
                    {axis.primary.letter} · {axis.primary.name}
                  </span>
                  <p className="text-muted-foreground">{axis.primary.blurb}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    {axis.opposite.letter} · {axis.opposite.name}
                  </span>
                  <p className="text-muted-foreground">{axis.opposite.blurb}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Groups" className="mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Four groups
          </h2>
          <p className="text-sm text-muted-foreground">
            What you seek from a film — the inner layer of the type.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((group) => (
            <Link
              key={group.slug}
              href={`/cinetype/groups/${group.slug}`}
              className="group focus:outline-none"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/40 group-focus-visible:border-foreground/70">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {group.tagline}
                  </p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {group.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Strategies" className="mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Four strategies
          </h2>
          <p className="text-sm text-muted-foreground">
            How you approach cinema — the outer layer of the type.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {strategies.map((strategy) => (
            <Link
              key={strategy.slug}
              href={`/cinetype/strategies/${strategy.slug}`}
              className="group focus:outline-none"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/40 group-focus-visible:border-foreground/70">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {strategy.tagline}
                  </p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {strategy.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="types" aria-label="Types" className="mt-20 scroll-mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            All 16 types
          </h2>
          <p className="text-sm text-muted-foreground">
            Group × strategy = a single distinctive way of watching.
          </p>
        </div>
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group.slug} className="space-y-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <Link
                  href={`/cinetype/groups/${group.slug}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Open group
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {typesInGroup(group.slug).map((type) => (
                  <TypeCard key={type.code} type={type} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-label="Take the test"
        className="mt-20 grid gap-6 rounded-xl bg-muted/30 p-8 sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <div>
          <h3 className="text-xl font-semibold">Find your CineType</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {questions.length} short prompts, 7-point scale, takes about 10
            minutes. No account needed — you can save your result and get a
            shareable link either way.
          </p>
        </div>
        <Link
          href="/cinetest"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "justify-self-start sm:justify-self-end",
          )}
        >
          Start the test
        </Link>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Total types: {personalityTypes.length} · {axes.length} axes ·{" "}
        {questions.length} questions
      </p>
    </div>
  );
}
