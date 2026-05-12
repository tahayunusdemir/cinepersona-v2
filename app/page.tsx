import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ---------- Static content ----------

const cineTypes = [
  {
    code: "AUT",
    name: "Auteurs",
    tagline: "They analyse the art.",
    description:
      "Symbolic and analytical. Director filmographies, film theory, criticism — natural territory. Open endings are pleasure, not irritation.",
    accent: "#ecb756",
    members: "4 sub-types",
  },
  {
    code: "VIS",
    name: "Visionaries",
    tagline: "They feel the art.",
    description:
      "Symbolic and immersive. They hunt meaning by feeling first — the natural audience for poetic, slow, experimental cinema.",
    accent: "#c8a4ff",
    members: "4 sub-types",
  },
  {
    code: "CON",
    name: "Connoisseurs",
    tagline: "They judge the craft.",
    description:
      "Literal and analytical. Script consistency, performance, direction — every detail is measurable. They have a definition of a good film, and can defend it.",
    accent: "#ff9a76",
    members: "4 sub-types",
  },
  {
    code: "ESC",
    name: "Escapists",
    tagline: "They live the story.",
    description:
      "Literal and immersive. Story and emotion lead. Whether a film is well made matters less than whether it carries them through.",
    accent: "#7fd1ff",
    members: "4 sub-types",
  },
];

const steps = [
  {
    n: "01",
    label: "CineTest",
    title: "12 picks, 48 statements.",
    body: "Pick films you love, then answer 48 short Likert prompts that map taste — not trivia. About ten minutes, start to finish.",
  },
  {
    n: "02",
    label: "CineType",
    title: "Your cinematic profile.",
    body: "One of 16 archetypes across four families — Auteurs, Visionaries, Connoisseurs, Escapists — with the pace, era, and feel you actually watch for.",
  },
  {
    n: "03",
    label: "CineMatch",
    title: "Films and people, matched.",
    body: "Recommendations tuned to your CineType — and a small circle of viewers who think like you.",
  },
];

const critics = [
  {
    quote:
      "Finally a film app that doesn't think a 9-star Marvel rating tells you anything about me.",
    author: "Lena R.",
    role: "Programmer, Brooklyn",
    stars: 5,
  },
  {
    quote:
      "Took the test on the train, finished before my stop. By dinner I had three new favorite directors and a friend in Lisbon.",
    author: "Aydın K.",
    role: "ELAW · Enthusiast",
    stars: 5,
  },
  {
    quote:
      "The matches feel almost rude — like it read my diary, then ignored the star ratings.",
    author: "Priya S.",
    role: "ESAC · Interpreter",
    stars: 4,
  },
];

const stats = [
  { k: "62k", v: "Cinephiles tested" },
  { k: "16", v: "CineTypes · 4 families" },
  { k: "94%", v: "Say their match held" },
  { k: "0", v: "Algorithmic blockbuster bait" },
];

// ---------- Page ----------

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO ============== */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:pb-28 lg:pt-24">
        <h1 className="font-display text-balance text-[44px] leading-[1.05] tracking-tight sm:text-[64px] lg:text-[72px]">
          Find the films{" "}
          <span className="text-[#ecb756]">that fit</span>{" "}
          the way you actually watch.
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          CinePersona is a personality test for cinephiles. Pick 12 films you
          love, answer 48 short statements, and meet your CineType — plus the
          viewers who already watch the way you do.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/cinetest"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]",
            )}
          >
            Take the CineTest
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "h-12 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 text-base hover:bg-foreground/[0.06] hover:text-foreground",
            )}
          >
            <Play className="mr-1 size-4 fill-current" />
            How it works
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>~10 min · 12 picks · 48 statements</span>
          <span className="hidden text-foreground/20 sm:inline">/</span>
          <span>Free during 2026 early access</span>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Three takes.{" "}
            <span className="text-muted-foreground">
              One cut you’ll keep.
            </span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            We don’t ask you to rate the last 200 films you watched. We ask you
            how you watch.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="group relative bg-panel p-7 transition-colors hover:bg-panel-2 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-6xl leading-none text-[#ecb756]/90">
                  {step.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {step.label}
                </span>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-2xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ============== CINETYPES ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Sixteen CineTypes.{" "}
            <span className="text-[#ecb756]">Four families.</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Four axes — connection, meaning, evaluation, and discovery — settle
            into one of sixteen profiles. Pick a family to feel the shape.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cineTypes.map((t, i) => (
            <article
              key={t.code}
              className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-7 transition-colors hover:border-foreground/20 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-7xl leading-none"
                  style={{ color: t.accent }}
                >
                  {t.code}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Family 0{i + 1} / 04
                </span>
              </div>
              <div className="mt-6 font-display text-2xl">{t.name}</div>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                “{t.tagline}”
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/80">
                {t.description}
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t.members} · 4 of 16 CineTypes
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/cinetype"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group h-11 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 hover:bg-foreground/[0.06]",
            )}
          >
            Explore all 16 CineTypes
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {/* ============== CINEMATCH DEMO ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              Strangers who watch{" "}
              <span className="text-[#ecb756]">like you do.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground">
              CineMatch pairs people by CineType, not by stars. The result feels
              less like an algorithm and more like running into someone in the
              repertory line who happens to love the same Bergman.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Compatibility scored across 12 trait axes",
                "Shared-watchlist generation in one tap",
                "Weekly double-features curated for two CineTypes",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                  <span className="text-foreground/80">{line}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/cine-match"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group mt-8 inline-flex h-10 items-center gap-1 rounded-full px-0 text-[#ecb756] hover:bg-transparent hover:text-[#f3cd84]",
              )}
            >
              See a sample pairing
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Match card */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-panel p-6 sm:p-10">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                {/* Person A */}
                <div className="flex items-center gap-4">
                  <div className="relative size-14 overflow-hidden rounded-full border border-foreground/10 bg-panel-2">
                    <Image
                      src="/avatars/asya.svg"
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display text-lg">Asya</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      ESAC · Istanbul
                    </div>
                  </div>
                </div>

                {/* % */}
                <div className="flex flex-col items-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Compatibility
                  </div>
                  <div className="mt-1 font-display text-6xl leading-none text-[#ecb756]">
                    91%
                  </div>
                </div>

                {/* Person B */}
                <div className="flex items-center gap-4 sm:flex-row-reverse">
                  <div className="relative size-14 overflow-hidden rounded-full border border-foreground/10 bg-panel-2">
                    <Image
                      src="/avatars/daichi.svg"
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="sm:text-right">
                    <div className="font-display text-lg">Daichi</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      ESAW · Kyoto
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-foreground/10" />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Shared pace", val: "Slow", bar: 92, c: "#ecb756" },
                  { label: "Shared era", val: "1965–95", bar: 84, c: "#c8a4ff" },
                  { label: "Shared lens", val: "Anamorphic", bar: 71, c: "#7fd1ff" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {m.label}
                      </span>
                      <span className="font-mono text-xs text-foreground/70">
                        {m.bar}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">{m.val}</div>
                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${m.bar}%`, background: m.c }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between rounded-2xl border border-foreground/10 bg-panel p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-4 text-[#ecb756]" />
                  <span className="text-sm">
                    Tonight’s pick for you two:{" "}
                    <span className="">Chungking Express</span>
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="hidden border-[#ecb756]/30 bg-[#ecb756]/10 text-[#ecb756] sm:inline-flex"
                >
                  Curated
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== STATS STRIP ============== */}
      <section className="border-y border-foreground/5 bg-foreground/[0.015]">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-14 sm:px-6 md:grid-cols-4 md:gap-x-10">
          {stats.map((s) => (
            <div key={s.v}>
              <div className="font-display text-5xl leading-none text-[#ecb756] sm:text-6xl">
                {s.k}
              </div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== CRITICS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            What viewers say{" "}
            <span className="text-muted-foreground">
              after the credits.
            </span>
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-[#ecb756] text-[#ecb756]"
                />
              ))}
            </div>
            <span>4.9 average · 2,847 reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {critics.map((c) => (
            <figure
              key={c.author}
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-7 sm:p-8"
            >
              <Quote className="absolute -right-2 -top-2 size-20 stroke-[1.2] text-[#ecb756]/[0.06]" />
              <div className="flex gap-0.5">
                {Array.from({ length: c.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-3.5 fill-[#ecb756] text-[#ecb756]"
                  />
                ))}
              </div>
              <blockquote className="relative mt-6 font-display text-xl leading-snug">
                “{c.quote}”
              </blockquote>
              <figcaption className="mt-8 border-t border-foreground/10 pt-4 text-sm">
                <div className="font-medium">{c.author}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {c.role}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============== PRICING TEASER ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Open during early access.{" "}
            <span className="text-muted-foreground">
              Paid plans land later in 2026.
            </span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            No card on file. Every feature is unlocked while we build — pricing
            below is a preview.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              name: "Free",
              price: "$0",
              note: "/ month",
              desc: "Everything you need to find your CineType.",
              features: [
                "Full CineTest (12 picks + 48 statements)",
                "Your CineType and family profile",
                "3 CineMatches per week",
              ],
              cta: "Sign up — free",
              href: "/register",
              highlight: false,
            },
            {
              name: "Plus",
              price: "$5",
              note: "/ month · preview price",
              desc: "More matches, smarter filters, no ads.",
              features: [
                "Daily CineMatches and recommendations",
                "Advanced filters (mood, era, pace, vibe)",
                "See who liked your profile",
                "Priority in matching system",
              ],
              cta: "See full pricing",
              href: "/pricing",
              highlight: true,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative overflow-hidden rounded-3xl border p-8 sm:p-10",
                p.highlight
                  ? "border-[#ecb756]/40 bg-panel"
                  : "border-foreground/10 bg-panel",
              )}
            >
              {p.highlight && (
                <Badge className="absolute right-6 top-6 border-0 bg-[#ecb756] text-[#1a1840] hover:bg-[#f3cd84]">
                  Most popular
                </Badge>
              )}
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {p.name}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-6xl text-[#ecb756]">
                  {p.price}
                </span>
                <span className="text-sm text-muted-foreground">{p.note}</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                {p.desc}
              </p>
              <ul className="mt-7 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-9 h-11 w-full rounded-full",
                  p.highlight
                    ? "bg-[#ecb756] text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]"
                    : "border border-foreground/15 bg-foreground/[0.02] text-foreground hover:bg-foreground/[0.06]",
                )}
              >
                {p.cta}
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="rounded-[28px] border border-[#ecb756]/20 bg-panel p-10 text-center sm:p-16">
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Your CineType is waiting.{" "}
            <span className="text-[#ecb756]">
              About ten minutes away.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground">
            Twelve picks. Forty-eight statements. One profile that finally
            describes how you actually watch.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/cinetest"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 rounded-full bg-[#ecb756] px-7 text-base font-medium text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]",
              )}
            >
              Take the CineTest
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/cinetype"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
              )}
            >
              Browse all CineTypes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
