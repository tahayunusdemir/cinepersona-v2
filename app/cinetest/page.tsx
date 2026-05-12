import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ClockIcon,
  FileTextIcon,
  ListChecksIcon,
  PencilLineIcon,
  ScaleIcon,
  SparklesIcon,
} from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { buttonVariants } from "@/components/ui/button";
import { SampleLikert } from "@/components/cinetest/sample-likert";
import { SamplePicks } from "@/components/cinetest/sample-picks";
import { SampleResult } from "@/components/cinetest/sample-result";
import { axes, FILM_PICKS_COUNT, questions } from "@/lib/cinepersona";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CineTest",
  description:
    "48 short prompts on a 7-point scale. Discover the cinema personality that fits how you actually watch.",
};

const facts = [
  {
    icon: ListChecksIcon,
    label: `${FILM_PICKS_COUNT} picks · ${questions.length} statements`,
  },
  { icon: ClockIcon, label: "≈ 10 minutes" },
  { icon: ScaleIcon, label: "7-point Likert scale" },
];

const steps = [
  {
    n: "01",
    icon: ListChecksIcon,
    eyebrow: "Picks",
    title: "Pick a few films that feel like you.",
    body: "Twelve prompts — favourites, guilty pleasures, the score you can’t stop replaying. Search by title, tap a poster. Picks don’t change your score; they personalise your matches later.",
    preview: <SamplePicks />,
    caption: "Static preview — the real step searches TMDB and shows real posters.",
  },
  {
    n: "02",
    icon: PencilLineIcon,
    eyebrow: "Likert",
    title: "Rate 48 short statements.",
    body: "Twelve questions per axis, on a 7-point scale from Strongly disagree to Strongly agree. Bigger circles mean stronger conviction. Trust your gut — there are no trick items.",
    preview: <SampleLikert />,
    caption: "Tap a circle below to feel the interaction.",
  },
  {
    n: "03",
    icon: FileTextIcon,
    eyebrow: "Result",
    title: "Read your CineType.",
    body: "A 4-letter code, four axis bars, and a short profile. One of 16 types — grouped into families like Auteurs, Pilgrims, and Wanderers — with a tagline and a quote that should feel suspiciously close to home.",
    preview: <SampleResult />,
    caption: "Sample result — ESAC, The Interpreter. Yours will differ.",
  },
];

export default function CineTestIntroPage() {
  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-4xl px-4 pb-24 sm:px-6">
        {/* HERO */}
        <section className="flex flex-col items-center pt-16 pb-12 text-center sm:pt-24">
          <h1 className="mt-5 max-w-3xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-[60px] lg:text-[68px]">
            Find the way{" "}
            <span className="text-[#ecb756]">you actually watch.</span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Pick a handful of films you love, then answer 48 short statements
            about how you watch. We map you onto four axes — and give you one
            of 16 CineTypes.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/cinetest/take"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] shadow-[0_8px_28px_-12px_#ecb75688] hover:bg-[#f3cd84] hover:text-[#1a1840]",
              )}
            >
              Start the test
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how-it-works"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
              )}
            >
              See an example first
            </Link>
          </div>
        </section>

        {/* FACTS */}
        <section
          aria-label="At a glance"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 sm:grid-cols-3"
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-center gap-3 bg-panel p-4"
            >
              <span className="grid size-8 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
                <fact.icon className="size-3.5" />
              </span>
              <span className="text-sm">{fact.label}</span>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          aria-label="How it works"
          className="mt-20 scroll-mt-20"
        >
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                How it works.
              </h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              ~10 min · 3 stages
            </span>
          </div>

          <ol className="space-y-12">
            {steps.map((step, index) => {
              const last = index === steps.length - 1;
              return (
                <li key={step.title} className="relative">
                  {!last && (
                    <span
                      aria-hidden
                      className="absolute left-[27px] top-16 bottom-[-48px] w-px bg-gradient-to-b from-foreground/20 via-foreground/10 to-transparent"
                    />
                  )}
                  <div className="flex items-start gap-5 sm:gap-6">
                    <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-foreground/10 bg-panel font-display text-xl text-[#ecb756]">
                      {step.n}
                    </span>
                    <div className="min-w-0 flex-1 pt-1.5">
                      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <step.icon className="size-3.5 text-[#ecb756]" />
                        Step {step.n} · {step.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                      <div className="mt-6 overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-4 sm:p-6">
                        {step.preview}
                      </div>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {step.caption}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* AXES */}
        <section aria-label="What we measure" className="mt-20">
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            What the test{" "}
            <span className="text-[#ecb756]">measures.</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Each axis is a continuum between two poles. Your code shows which
            side you lean toward; the percentages show how strongly.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {axes.map((axis, i) => (
              <li
                key={axis.id}
                className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Axis 0{i + 1} / {axes.length}
                  </span>
                  <span className="font-mono text-xs text-[#ecb756]">
                    {axis.primary.letter} ↔ {axis.opposite.letter}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg">{axis.name}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    <span className="text-foreground">
                      {axis.primary.name}:
                    </span>{" "}
                    {axis.primary.blurb}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-foreground">
                      {axis.opposite.name}:
                    </span>{" "}
                    {axis.opposite.blurb}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* NOTE */}
        <section
          aria-label="A note on what this is"
          className="mt-16 rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-7"
        >
          <FrameTag>Footnote</FrameTag>
          <h2 className="mt-3 font-display text-xl tracking-tight">
            Honest about the limits.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            CineType is a self-report instrument for cinema literacy and
            self-understanding — not a clinical tool. It captures the way you
            see yourself watching, which is exactly what we want it to do. Take
            it when you’re rested; the results read better that way.
          </p>
        </section>

        {/* CTA */}
        <section
          aria-label="Start the test"
          className="mt-12 overflow-hidden rounded-[28px] border border-[#ecb756]/20 bg-gradient-to-br from-panel-2 via-panel-3 to-panel p-10 text-center sm:p-14 grain-overlay"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,var(--bloom-soft)_0%,transparent_55%)] opacity-10"
          />
          <SparklesIcon className="mx-auto size-6 text-[#ecb756]" />
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
            Ready when{" "}
            <span className="text-[#ecb756]">you are.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            About ten minutes from first poster to final code. Progress is
            saved on this device, so you can step away and come back.
          </p>
          <Link
            href="/cinetest/take"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group mt-7 inline-flex h-12 rounded-full bg-[#ecb756] px-7 text-base font-medium text-[#1a1840] shadow-[0_10px_36px_-12px_#ecb756aa] hover:bg-[#f3cd84] hover:text-[#1a1840]",
            )}
          >
            Start the test
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
