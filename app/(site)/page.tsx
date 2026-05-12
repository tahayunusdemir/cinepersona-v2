import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Quote, Star } from "lucide-react";

import { ProjectorBloom, Reveal, Stagger } from "@/components/cinema/motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  badgeBrandSolid,
  cardCtaBlock,
  cardFeatured,
  cardInteractive,
  credit,
  ctaPrimary,
  ctaPrimaryLg,
  ctaSecondary,
  ctaSecondaryLg,
  FAMILY_HEX,
  familyAt,
} from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

// ---------- Static content ----------

const cineTypes = [
  {
    code: "AUT",
    name: "Auteurs",
    tagline: "They analyse the art.",
    description:
      "Symbolic and analytical. Director filmographies, film theory, criticism — natural territory. Open endings are pleasure, not irritation.",
    accent: FAMILY_HEX.aut,
    members: "4 sub-types",
  },
  {
    code: "VIS",
    name: "Visionaries",
    tagline: "They feel the art.",
    description:
      "Symbolic and immersive. They hunt meaning by feeling first — the natural audience for poetic, slow, experimental cinema.",
    accent: FAMILY_HEX.vis,
    members: "4 sub-types",
  },
  {
    code: "CON",
    name: "Connoisseurs",
    tagline: "They judge the craft.",
    description:
      "Literal and analytical. Script consistency, performance, direction — every detail is measurable. They have a definition of a good film, and can defend it.",
    accent: FAMILY_HEX.con,
    members: "4 sub-types",
  },
  {
    code: "ESC",
    name: "Escapists",
    tagline: "They live the story.",
    description:
      "Literal and immersive. Story and emotion lead. Whether a film is well made matters less than whether it carries them through.",
    accent: FAMILY_HEX.esc,
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
    <div className="relative bg-background text-foreground">
      {/* ============== HERO ============== */}
      <section className="relative isolate mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:pb-28 lg:pt-24">
        <ProjectorBloom className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[920px] max-w-[120vw] -translate-x-1/2 blur-3xl" />
        <Stagger immediate step={0.09} initial={0.05}>
          <Reveal as="p" className={cn(credit, "mb-5 text-[10px]")}>
            <span className="mr-2 inline-block size-1.5 -translate-y-[2px] rounded-full bg-[#ecb756] align-middle" />
            CinePersona · Early access 2026
          </Reveal>
          <Reveal as="header">
            <h1 className="font-display text-balance text-[44px] leading-[1.05] tracking-tight sm:text-[64px] lg:text-[72px]">
              Find the films{" "}
              <span className="text-[#ecb756]">that fit</span>{" "}
              the way you actually watch
            </h1>
          </Reveal>
          <Reveal as="p" className="mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            CinePersona is a personality test for cinephiles. Pick 12 films you
            love, answer 48 short statements, and meet your CineType — plus the
            viewers who already watch the way you do.
          </Reveal>
          <Reveal className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link href="/cinetest" className={cn(ctaPrimaryLg, "group")}>
              Take the CineTest
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/about" className={ctaSecondaryLg}>
              <Play className="size-4 fill-current" />
              How it works
            </Link>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <span>~10 min · 12 picks · 48 statements</span>
            <span className="hidden text-foreground/20 sm:inline">/</span>
            <span>Free during 2026 early access</span>
          </Reveal>
        </Stagger>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </Reveal>

        <Stagger as="ol" step={0.1} className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              className="group relative bg-panel p-7 transition-colors hover:bg-panel-2 sm:p-8"
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="font-display text-6xl leading-none"
                  style={{ color: familyAt(i) }}
                >
                  {step.n}
                </span>
                <span className={credit}>{step.label}</span>
              </div>
              <div className="mt-8">
                <h3 className="font-display text-2xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* ============== CINETYPES ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Sixteen CineTypes.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${FAMILY_HEX.aut}, ${FAMILY_HEX.vis} 40%, ${FAMILY_HEX.con} 70%, ${FAMILY_HEX.esc})`,
              }}
            >
              Four families.
            </span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Four axes — connection, meaning, evaluation, and discovery — settle
            into one of sixteen profiles. Pick a family to feel the shape.
          </p>
        </Reveal>

        <Stagger step={0.09} className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cineTypes.map((t, i) => (
            <Reveal
              as="article"
              key={t.code}
              className={cn(cardInteractive, "group relative overflow-hidden p-7 sm:p-8")}
              style={{ borderColor: `${t.accent}40` }}
            >
              {/* Per-family bloom that warms on hover. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: `${t.accent}28` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="font-display text-7xl leading-none"
                    style={{ color: t.accent }}
                  >
                    {t.code}
                  </span>
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: t.accent }}
                  >
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
                <div className={cn(credit, "mt-6")}>
                  {t.members} · 4 of 16 CineTypes
                </div>
              </div>
            </Reveal>
          ))}
        </Stagger>

        <Reveal className="mt-10 flex justify-center">
          <Link href="/cinetype" className={cn(ctaSecondary, "group")}>
            Explore all 16 CineTypes
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </section>

      {/* ============== CINEMATCH DEMO ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <Reveal className="lg:col-span-5">
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
              ].map((line, i) => (
                <li key={line} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: familyAt(i) }}
                  />
                  <span className="text-foreground/80">{line}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/cine-match"
              className="group mt-8 inline-flex h-10 items-center gap-1 text-sm font-medium text-[#ecb756] transition-colors hover:text-[#f3cd84]"
            >
              See a sample pairing
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          {/* Match card */}
          <Reveal delay={0.1} className="lg:col-span-7">
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
                  { label: "Shared pace", val: "Slow", bar: 92, c: FAMILY_HEX.aut },
                  { label: "Shared era", val: "1965–95", bar: 84, c: FAMILY_HEX.vis },
                  { label: "Shared lens", val: "Anamorphic", bar: 71, c: FAMILY_HEX.con },
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

            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== STATS STRIP ============== */}
      <section className="border-y border-foreground/5 bg-foreground/[0.015]">
        <Stagger step={0.08} className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-14 sm:px-6 md:grid-cols-4 md:gap-x-10">
          {stats.map((s, i) => (
            <Reveal key={s.v}>
              <div
                className="font-display text-5xl leading-none sm:text-6xl"
                style={{ color: familyAt(i) }}
              >
                {s.k}
              </div>
              <div className={cn(credit, "mt-2")}>{s.v}</div>
            </Reveal>
          ))}
        </Stagger>
      </section>

      {/* ============== CRITICS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        </Reveal>

        <Stagger step={0.1} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {critics.map((c, i) => {
            const tint = familyAt(i);
            return (
              <Reveal
                as="article"
                key={c.author}
                className="relative overflow-hidden rounded-2xl border bg-panel p-7 sm:p-8"
                style={{ borderColor: `${tint}30` }}
              >
                <Quote
                  className="absolute -right-2 -top-2 size-20 stroke-[1.2]"
                  style={{ color: `${tint}14` }}
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: c.stars }).map((_, j) => (
                    <Star
                      key={j}
                      className="size-3.5"
                      style={{ fill: tint, color: tint }}
                    />
                  ))}
                </div>
                <blockquote className="relative mt-6 font-display text-xl leading-snug">
                  “{c.quote}”
                </blockquote>
                <figcaption className="mt-8 border-t border-foreground/10 pt-4 text-sm">
                  <div className="font-medium">{c.author}</div>
                  <div className={cn(credit, "mt-0.5")}>{c.role}</div>
                </figcaption>
              </Reveal>
            );
          })}
        </Stagger>
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
              accent: FAMILY_HEX.esc, // sky — the "open / free" hue
            },
            {
              name: "Plus",
              price: "$4.99",
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
              accent: FAMILY_HEX.aut, // amber — the highlighted plan
            },
          ].map((p) => (
            <div
              key={p.name}
              className={cn(
                "relative p-8 sm:p-10",
                p.highlight ? cardFeatured : cardInteractive,
              )}
              style={!p.highlight ? { borderColor: `${p.accent}33` } : undefined}
            >
              {p.highlight && (
                <Badge className={cn("absolute right-6 top-6", badgeBrandSolid)}>
                  Most popular
                </Badge>
              )}
              <div className={credit} style={{ color: p.accent }}>
                {p.name}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span
                  className="font-display text-6xl"
                  style={{ color: p.accent }}
                >
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
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full"
                      style={{ background: p.accent }}
                    />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className={cn(p.highlight ? ctaPrimary : ctaSecondary, "mt-9 w-full")}
              >
                {p.cta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className={cn(cardCtaBlock, "p-10 text-center sm:p-16")}>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Your CineType is waiting.{" "}
            <span className="text-[#ecb756]">About ten minutes away</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground">
            Twelve picks. Forty-eight statements. One profile that finally
            describes how you actually watch.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/cinetest" className={cn(ctaPrimaryLg, "group")}>
              Take the CineTest
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/cinetype" className={ctaSecondaryLg}>
              Browse all CineTypes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
