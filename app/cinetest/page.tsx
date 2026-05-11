import type { Metadata } from "next";
import Link from "next/link";
import {
  ClockIcon,
  FileTextIcon,
  ListChecksIcon,
  PencilLineIcon,
  ScaleIcon,
  SparklesIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
    label: `${FILM_PICKS_COUNT} film picks + ${questions.length} statements`,
  },
  { icon: ClockIcon, label: "≈ 10 minutes" },
  { icon: ScaleIcon, label: "7-point Likert scale" },
];

type Step = {
  icon: typeof PencilLineIcon;
  eyebrow: string;
  title: string;
  body: string;
  preview: React.ReactNode;
  caption: string;
};

const steps: Step[] = [
  {
    icon: ListChecksIcon,
    eyebrow: "Step 01 · Picks",
    title: "Pick a few films that feel like you.",
    body: "Twelve prompts — favourites, guilty pleasures, the score you can't stop replaying. Search by title, tap a poster. Picks don't change your score; they personalise your matches later.",
    preview: <SamplePicks />,
    caption:
      "Static preview — the real step searches TMDB and shows real posters.",
  },
  {
    icon: PencilLineIcon,
    eyebrow: "Step 02 · Likert",
    title: "Rate 48 short statements.",
    body: "Twelve questions per axis, on a 7-point scale from Strongly disagree to Strongly agree. Bigger circles mean stronger conviction. Trust your gut — there are no trick items.",
    preview: <SampleLikert />,
    caption: "Tap a circle below to feel the interaction.",
  },
  {
    icon: FileTextIcon,
    eyebrow: "Step 03 · Result",
    title: "Read your CineType.",
    body: "A 4-letter code, four axis bars, and a short profile. One of 16 types — grouped into families like Auteurs, Pilgrims, and Wanderers — with a tagline and a quote that should feel suspiciously close to home.",
    preview: <SampleResult />,
    caption: "Sample result — ESAC, The Interpreter. Yours will differ.",
  },
];

export default function CineTestIntroPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
      <section className="flex flex-col items-center pt-16 pb-10 text-center sm:pt-24">
        <Badge variant="secondary" className="mb-5">
          CineTest
        </Badge>
        <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Find the way you actually watch.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          Pick a handful of films you love, then answer 48 short statements
          about how you watch. The test maps you onto four axes and gives you
          a CineType — one of 16.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/cinetest/take"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Start the test
          </Link>
          <Link
            href="#how-it-works"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See an example first
          </Link>
        </div>
      </section>

      <section
        aria-label="At a glance"
        className="mt-4 grid gap-3 sm:grid-cols-3"
      >
        {facts.map((fact) => (
          <Card key={fact.label} size="sm">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <fact.icon className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm">{fact.label}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section
        id="how-it-works"
        aria-label="How it works"
        className="mt-16 scroll-mt-20"
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            How it works
          </h2>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            ~10 min · 3 stages
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          A real preview of each stage — try the middle one without leaving
          the page.
        </p>

        <ol className="mt-8 space-y-10">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li key={step.title} className="relative">
                {!last ? (
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-10 bottom-[-40px] w-px bg-border"
                  />
                ) : null}
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1 space-y-3 pt-1">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        <step.icon className="size-3.5" />
                        {step.eyebrow}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                    <div>{step.preview}</div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {step.caption}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="What we measure" className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          What the test measures
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each axis is a continuum between two poles. Your code shows which
          side you lean toward; the percentages show how strongly.
        </p>
        <ul className="mt-5 space-y-3">
          {axes.map((axis) => (
            <li
              key={axis.id}
              className="rounded-lg border border-border/60 p-4 text-sm"
            >
              <p className="font-medium">
                {axis.name}{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  ({axis.primary.letter} ↔ {axis.opposite.letter})
                </span>
              </p>
              <p className="mt-1 text-muted-foreground">
                <span className="text-foreground">{axis.primary.name}:</span>{" "}
                {axis.primary.blurb}
              </p>
              <p className="mt-1 text-muted-foreground">
                <span className="text-foreground">{axis.opposite.name}:</span>{" "}
                {axis.opposite.blurb}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Honest about limits"
        className="mt-16 rounded-xl border border-dashed border-border p-6"
      >
        <h2 className="text-base font-semibold">A note on what this is</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          CineType is a self-report instrument for cinema literacy and self-
          understanding — not a clinical tool. It captures the way you see
          yourself watching, which is exactly what we want it to do. Take it
          when you&apos;re rested; the results read better that way.
        </p>
      </section>

      <section
        aria-label="Start the test"
        className="mt-12 flex flex-col items-center gap-4 rounded-xl border bg-muted/30 p-8 text-center"
      >
        <SparklesIcon className="size-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Ready when you are.
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          About ten minutes from first poster to final code. Your progress is
          saved on this device, so you can step away and come back.
        </p>
        <Link
          href="/cinetest/take"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "mt-2",
          )}
        >
          Start the test
        </Link>
      </section>
    </div>
  );
}
