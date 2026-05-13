import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowRightIcon } from "lucide-react";

import { ProjectorBloom, Reveal, Stagger } from "@/components/cinema/motion";
import { TypeCard } from "@/components/cinepersona/type-card";
import {
  axes,
  groups,
  personalityTypes,
  questions,
  strategies,
  typesInGroup,
} from "@/lib/cinepersona";
import {
  cardCtaBlock,
  ctaPrimaryLg,
  ctaSecondaryLg,
  FAMILY_HEX,
  familyAt,
} from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

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
        <section className="relative flex flex-col items-center pt-16 pb-12 text-center sm:pt-24">
          <ProjectorBloom className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[920px] max-w-[120vw] -translate-x-1/2 blur-3xl" />
          <Stagger immediate step={0.09}>
            <Reveal as="p" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="mr-2 inline-flex items-center gap-1">
                {[FAMILY_HEX.aut, FAMILY_HEX.vis, FAMILY_HEX.con, FAMILY_HEX.esc].map((c) => (
                  <span key={c} className="inline-block size-1.5 rounded-full" style={{ background: c }} />
                ))}
              </span>
              CineType atlas · 16 types · 4 families
            </Reveal>
            <Reveal as="header">
              <h1 className="mt-5 max-w-3xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
                16 ways of{" "}
                <span className="text-[#ecb756]">watching cinema</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              CineType maps how you actually watch films on four axes —
              connection, meaning, evaluation, discovery — and gives you a
              four-letter code you’ll recognise immediately.
            </Reveal>
            <Reveal className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/cinetest" className={cn(ctaPrimaryLg, "group")}>
                Take the test
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="#types" className={ctaSecondaryLg}>
                Browse all 16 types
              </Link>
            </Reveal>
          </Stagger>
        </section>

        {/* AXES */}
        <section aria-label="Axes" className="mt-12">
          <Reveal className="mb-8">
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              The four axes.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Every type code is a single letter from each axis.
            </p>
          </Reveal>
          <Stagger step={0.08} className="grid gap-4 sm:grid-cols-2">
            {axes.map((axis, i) => {
              const hue = familyAt(i);
              return (
                <Reveal
                  as="article"
                  key={axis.id}
                  className="rounded-2xl border bg-panel p-6"
                  style={{ borderColor: `${hue}30` }}
                >
                  <div className="flex items-baseline justify-end">
                    <span
                      className="font-mono text-xs"
                      style={{ color: hue }}
                    >
                      {axis.primary.letter} ↔ {axis.opposite.letter}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl">{axis.name}</h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-display text-2xl"
                          style={{ color: hue }}
                        >
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
                </Reveal>
              );
            })}
          </Stagger>
        </section>

        {/* GROUPS + STRATEGIES */}
        <section aria-label="Groups & strategies" className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
            <Reveal>
              <h2 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
                Four groups —{" "}
                <span className="text-[#ecb756]">what you seek.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The inner layer of the type.
              </p>
              <div className="mt-6 grid gap-3">
                {groups.map((group, i) => {
                  const hue = familyAt(i);
                  return (
                    <Link
                      key={group.slug}
                      href={`/cinetype/groups/${group.slug}`}
                      className="group flex items-start gap-4 rounded-xl border bg-panel p-4 transition-all"
                      style={{ borderColor: `${hue}33` }}
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-2 shrink-0 rounded-full"
                        style={{ background: hue }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-lg">{group.name}</h3>
                          <ArrowRightIcon
                            className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5"
                            style={{ color: hue }}
                          />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {group.tagline}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
                Four strategies —{" "}
                <span className="text-[#ecb756]">how you watch.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The outer layer of the type.
              </p>
              <div className="mt-6 grid gap-3">
                {strategies.map((strategy, i) => {
                  const hue = familyAt(i);
                  return (
                    <Link
                      key={strategy.slug}
                      href={`/cinetype/strategies/${strategy.slug}`}
                      className="group flex items-start gap-4 rounded-xl border bg-panel p-4 transition-all"
                      style={{ borderColor: `${hue}33` }}
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-2 shrink-0 rounded-full"
                        style={{ background: hue }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-lg">{strategy.name}</h3>
                          <ArrowRightIcon
                            className="size-3.5 text-muted-foreground transition-all group-hover:translate-x-0.5"
                            style={{ color: hue }}
                          />
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {strategy.tagline}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ALL 16 */}
        <section id="types" aria-label="Types" className="mt-20 scroll-mt-20">
          <Reveal className="mb-8">
            <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              All 16 types.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Group × strategy = a single distinctive way of watching.
            </p>
          </Reveal>

          <div className="space-y-12">
            {groups.map((group, gi) => {
              const hue = familyAt(gi);
              return (
              <Reveal key={group.slug}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: hue }}
                    >
                      {group.name}
                    </span>
                    <span
                      className="h-px flex-1"
                      style={{
                        backgroundImage: `linear-gradient(to right, ${hue}55, transparent)`,
                      }}
                    />
                  </div>
                  <Link
                    href={`/cinetype/groups/${group.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Open group
                    <ArrowRightIcon className="size-3" />
                  </Link>
                </div>
                <Stagger step={0.06} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {typesInGroup(group.slug).map((type) => (
                    <Reveal key={type.code}>
                      <TypeCard type={type} familyHue={hue} />
                    </Reveal>
                  ))}
                </Stagger>
              </Reveal>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <Reveal
          as="section"
          aria-label="Take the test"
          className={cn(cardCtaBlock, "relative mt-20 overflow-hidden p-10 sm:p-14")}
        >
          <ProjectorBloom className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[460px] -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h3 className="font-display text-3xl tracking-tight sm:text-4xl">
                Find your CineType
              </h3>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                {questions.length} short prompts, 7-point scale, ~10 minutes.
                No account needed — you can save your result and get a
                shareable link either way.
              </p>
            </div>
            <Link
              href="/cinetest"
              className={cn(ctaPrimaryLg, "group sm:justify-self-end")}
            >
              Start the test
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {personalityTypes.length} types · {axes.length} axes ·{" "}
          {questions.length} questions
        </p>
      </div>
    </div>
  );
}
