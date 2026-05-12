import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowRightIcon } from "lucide-react";

import { TypeCard } from "@/components/cinepersona/type-card";
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
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        {/* HERO */}
        <section className="flex flex-col items-center pt-16 pb-12 text-center sm:pt-24">
          <h1 className="mt-5 max-w-3xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
            16 ways of{" "}
            <span className="text-[#ecb756]">watching cinema.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            CineType maps how you actually watch films on four axes —
            connection, meaning, evaluation, discovery — and gives you a
            four-letter code you’ll recognise immediately.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/cinetest"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] shadow-[0_8px_28px_-12px_#ecb75688] hover:bg-[#f3cd84] hover:text-[#1a1840]",
              )}
            >
              Take the test
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#types"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
              )}
            >
              Browse all 16 types
            </Link>
          </div>
        </section>

        {/* AXES */}
        <section aria-label="Axes" className="mt-12">
          <div className="mb-8">
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              The four axes.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Every type code is a single letter from each axis.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {axes.map((axis, i) => (
              <article
                key={axis.id}
                className="rounded-2xl border border-foreground/10 bg-panel p-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Axis 0{i + 1} / {axes.length}
                  </span>
                  <span className="font-mono text-xs text-[#ecb756]">
                    {axis.primary.letter} ↔ {axis.opposite.letter}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl">{axis.name}</h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl text-[#ecb756]">
                        {axis.primary.letter}
                      </span>
                      <span className="text-sm">{axis.primary.name}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {axis.primary.blurb}
                    </p>
                  </div>
                  <div className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl text-foreground/70">
                        {axis.opposite.letter}
                      </span>
                      <span className="text-sm">{axis.opposite.name}</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {axis.opposite.blurb}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* GROUPS + STRATEGIES */}
        <section aria-label="Groups & strategies" className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
                Four groups —{" "}
                <span className="text-[#ecb756]">what you seek.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The inner layer of the type.
              </p>
              <div className="mt-6 grid gap-3">
                {groups.map((group, i) => (
                  <Link
                    key={group.slug}
                    href={`/cinetype/groups/${group.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-foreground/10 bg-panel p-4 transition-all hover:border-[#ecb756]/40"
                  >
                    <span className="font-display text-3xl leading-none text-[#ecb756]/90">
                      0{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg">{group.name}</h3>
                        <ArrowRightIcon className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[#ecb756]" />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {group.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
                Four strategies —{" "}
                <span className="text-[#ecb756]">how you watch.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The outer layer of the type.
              </p>
              <div className="mt-6 grid gap-3">
                {strategies.map((strategy, i) => (
                  <Link
                    key={strategy.slug}
                    href={`/cinetype/strategies/${strategy.slug}`}
                    className="group flex items-start gap-4 rounded-xl border border-foreground/10 bg-panel p-4 transition-all hover:border-[#ecb756]/40"
                  >
                    <span className="font-display text-3xl leading-none text-[#ecb756]/90">
                      0{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg">{strategy.name}</h3>
                        <ArrowRightIcon className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[#ecb756]" />
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {strategy.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ALL 16 */}
        <section id="types" aria-label="Types" className="mt-20 scroll-mt-20">
          <div className="mb-8">
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              All 16 types.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Group × strategy = a single distinctive way of watching.
            </p>
          </div>

          <div className="space-y-12">
            {groups.map((group) => (
              <div key={group.slug}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
                      {group.name}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
                  </div>
                  <Link
                    href={`/cinetype/groups/${group.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Open group
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {typesInGroup(group.slug).map((type) => (
                    <TypeCard key={type.code} type={type} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          aria-label="Take the test"
          className="relative mt-20 overflow-hidden rounded-[28px] border border-[#ecb756]/20 bg-gradient-to-br from-panel-2 via-panel-3 to-panel p-10 sm:p-14 grain-overlay"
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,var(--bloom-soft)_0%,transparent_55%)] opacity-10"
          />
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h3 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                Find your CineType.
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {questions.length} short prompts, 7-point scale, ~10 minutes.
                No account needed — you can save your result and get a
                shareable link either way.
              </p>
            </div>
            <Link
              href="/cinetest"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] shadow-[0_10px_36px_-12px_#ecb756aa] hover:bg-[#f3cd84] hover:text-[#1a1840] sm:justify-self-end",
              )}
            >
              Start the test
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {personalityTypes.length} types · {axes.length} axes ·{" "}
          {questions.length} questions
        </p>
      </div>
    </div>
  );
}
