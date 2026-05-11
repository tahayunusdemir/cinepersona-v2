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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const steps = [
  {
    icon: PencilLineIcon,
    title: "Pick & answer",
    body: "Choose a few favourite films, then rate 48 short statements. Be honest — answer as you actually watch, not as the cinephile you wish you were.",
  },
  {
    icon: FileTextIcon,
    title: "Read your CineType",
    body: "See your 4-letter code, axis percentages, and how your type tends to pick, pace, and rewatch films.",
  },
  {
    icon: SparklesIcon,
    title: "Go deeper",
    body: "Compare with friends, find your matches, and explore extended type guides as new features roll out.",
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
            href="/cinetype"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            See the 16 types first
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

      <section aria-label="How it works" className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          How it works
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Three short steps from first question to a type you can actually use.
        </p>
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Card size="sm" className="h-full">
                <CardHeader className="flex-row items-center gap-2 space-y-0">
                  <step.icon className="size-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <CardTitle className="text-sm">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {step.body}
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="What we measure" className="mt-12">
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
        className="mt-12 rounded-xl border border-dashed border-border p-6"
      >
        <h2 className="text-base font-semibold">A note on what this is</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          CineType is a self-report instrument for cinema literacy and self-
          understanding — not a clinical tool. It captures the way you see
          yourself watching, which is exactly what we want it to do. Take it
          when you&apos;re rested; the results read better that way.
        </p>
      </section>
    </div>
  );
}
