import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Handshake,
  MessagesSquareIcon,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { EligibilityProgress } from "@/components/cinematch/eligibility-progress";
import { JoinPoolButton } from "@/components/cinematch/join-pool-button";
import { PoolStatusCard } from "@/components/cinematch/pool-status-card";
import { QuotaCard } from "@/components/cinematch/quota-card";
import { RequestMatchButton } from "@/components/cinematch/request-match-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getEligibility,
  getPoolEntry,
  getRequestQuota,
  getViewerId,
  nowMs,
} from "@/lib/match/queries";
import {
  AXES_WEIGHT,
  FALLBACK_WAIT_DAYS,
  MATCH_THRESHOLD,
  WATCHED_MIN,
  WATCHED_WEIGHT,
  WEEKLY_REQUEST_LIMIT,
} from "@/lib/match/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CineMatch",
  description:
    "Meet people whose CinePersona axes and watch history actually line up with yours. Each match lands at 90%+ similarity.",
};

// ---------- Static marketing content ----------

const steps = [
  {
    n: "01",
    label: "Join the pool",
    title: "You become matchable.",
    body: "Your CinePersona axes and the films you’ve marked watched become visible to the matcher — no profile photo, no bio shopping.",
  },
  {
    n: "02",
    label: "Request a match",
    title: `${WEEKLY_REQUEST_LIMIT} requests per rolling week.`,
    body: `We page you the moment someone clears ${MATCH_THRESHOLD}% similarity. If nobody does, the closest candidate becomes a fallback after ${FALLBACK_WAIT_DAYS} days.`,
  },
  {
    n: "03",
    label: "Both opt in",
    title: "Chat unlocks together.",
    body: "Either party can accept. The conversation only opens once both of you tap consent — no inbox creep, no cold DMs.",
  },
];

const trustItems = [
  {
    icon: Target,
    title: `${MATCH_THRESHOLD}% minimum`,
    body: `Scored ${Math.round(AXES_WEIGHT * 100)}% on personality axes, ${Math.round(WATCHED_WEIGHT * 100)}% on the films you’ve both watched.`,
  },
  {
    icon: Handshake,
    title: "Mutual consent",
    body: "Either side can decline silently. Chat opens only when both tap accept — no rejection, no inbox spam.",
  },
  {
    icon: ShieldCheck,
    title: "No payment yet",
    body: "Free during early access. Three weekly requests is the rate while we keep the pool intentional.",
  },
];

const sampleAxes = [
  {
    label: "Connection",
    self: "Immersive",
    other: "Immersive",
    selfPct: 78,
    otherPct: 81,
    delta: 3,
    accent: "#ecb756",
  },
  {
    label: "Meaning",
    self: "Symbolic",
    other: "Symbolic",
    selfPct: 84,
    otherPct: 79,
    delta: 5,
    accent: "#c8a4ff",
  },
  {
    label: "Evaluation",
    self: "Analytical",
    other: "Analytical",
    selfPct: 72,
    otherPct: 68,
    delta: 4,
    accent: "#7fd1ff",
  },
  {
    label: "Discovery",
    self: "Curatorial",
    other: "Curatorial",
    selfPct: 88,
    otherPct: 92,
    delta: 4,
    accent: "#ff9a76",
  },
];

const stats = [
  { k: `${MATCH_THRESHOLD}%`, v: "Minimum similarity" },
  { k: `${WEEKLY_REQUEST_LIMIT}`, v: "Requests per week" },
  { k: "12", v: "Trait axes scored" },
  { k: `${FALLBACK_WAIT_DAYS}d`, v: "Search horizon" },
];

const critics = [
  {
    quote:
      "Got matched at 93%. Within a week we’d traded a Tarkovsky shortlist and an entire evening on early Kiyoshi Kurosawa.",
    author: "Mira A.",
    role: "VSAW · Lisbon",
  },
  {
    quote:
      "It’s the first matcher that didn’t hand me someone whose top film was The Notebook. Felt like meeting a programmer at a rep cinema bar.",
    author: "Joren D.",
    role: "AUAC · Antwerp",
  },
];

const faqs = [
  {
    q: `Why a ${MATCH_THRESHOLD}% threshold?`,
    a: `Below ${MATCH_THRESHOLD}% the overlap feels generic — same family, different room. The bar is set high so the first hour of conversation skips the small talk.`,
  },
  {
    q: `What if nobody clears ${MATCH_THRESHOLD}%?`,
    a: `Your request keeps searching for ${FALLBACK_WAIT_DAYS} days. If the bar isn’t cleared by then, the closest available person is offered as a fallback — clearly labelled so you can pass.`,
  },
  {
    q: "Can my match see my real name?",
    a: "Only your display name and CineType show up in the match. Profile details — avatar, full bio, films — are visible once both of you opt in to chat.",
  },
  {
    q: "How do I leave the pool?",
    a: "One tap on your pool status card. You stop being matchable immediately. Existing matches remain visible until you hide them.",
  },
];

// ---------- Page ----------

export default async function CineMatchIntroPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);

  const eligibility = viewerId ? await getEligibility(supabase, viewerId) : null;
  const quota =
    viewerId && eligibility?.ok
      ? await getRequestQuota(supabase, viewerId)
      : null;
  const poolEntry =
    viewerId && eligibility?.ok && eligibility.alreadyJoined
      ? await getPoolEntry(supabase, viewerId)
      : null;

  const isGuest = !viewerId;

  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO ============== */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 mx-auto h-[520px] max-w-5xl opacity-60">
          <div className="absolute left-1/2 top-10 size-[420px] -translate-x-1/2 rounded-full bg-[#ecb756]/10 blur-3xl" />
          <div className="absolute left-[18%] top-32 size-[260px] rounded-full bg-[#c8a4ff]/10 blur-3xl" />
          <div className="absolute right-[14%] top-40 size-[240px] rounded-full bg-[#7fd1ff]/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-16 text-center sm:px-6 sm:pt-24">
          <Badge
            variant="outline"
            className="gap-1.5 border-[#ecb756]/30 bg-[#ecb756]/10 text-[#ecb756]"
          >
            <Sparkles className="size-3" aria-hidden />
            CineMatch · taste-based pairing
          </Badge>

          <h1 className="mt-6 font-display text-balance text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[76px]">
            Find people whose taste{" "}
            <span className="text-[#ecb756]">lines up with yours.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            CineMatch pairs you on your CinePersona axes and the films
            you&rsquo;ve actually watched. Every introduction clears{" "}
            <span className="text-foreground/90">
              {MATCH_THRESHOLD}% similarity
            </span>{" "}
            — never a stranger who just happens to share three blockbusters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{WEEKLY_REQUEST_LIMIT} requests / 7 days</span>
            <span className="text-foreground/20">·</span>
            <span>Mutual consent only</span>
            <span className="hidden text-foreground/20 sm:inline">·</span>
            <span className="hidden sm:inline">No card on file</span>
          </div>
        </div>
      </section>

      {/* ============== ACTION PANEL ============== */}
      <section
        aria-label={isGuest ? "Get started" : "Your CineMatch status"}
        className="mx-auto w-full max-w-3xl px-4 sm:px-6"
      >
        {isGuest ? (
          <GuestActionPanel />
        ) : (
          <MemberActionPanel
            eligibility={eligibility!}
            quota={quota}
            poolEntry={poolEntry}
          />
        )}
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            How a match{" "}
            <span className="text-muted-foreground">actually happens.</span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Three steps, in order. No swiping, no ranking strangers&rsquo;
            faces, no decoy options.
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

      {/* ============== TRUST STRIP ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 sm:grid-cols-3">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 bg-panel p-5"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
                <item.icon className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== ANATOMY OF A MATCH ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
              Anatomy of a match
            </span>
            <h2 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              What a{" "}
              <span className="text-[#ecb756]">93% pairing</span> looks like.
            </h2>
            <p className="mt-5 max-w-md text-pretty text-muted-foreground">
              Similarity is one number, but the breakdown is four. Each axis
              shows where two viewers actually meet — and how far apart they
              still are. The smaller the delta, the closer the read.
            </p>

            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                <span className="text-foreground/80">
                  {Math.round(AXES_WEIGHT * 100)}% of the score is personality
                  axes
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                <span className="text-foreground/80">
                  {Math.round(WATCHED_WEIGHT * 100)}% is the films
                  you&rsquo;ve both marked watched
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                <span className="text-foreground/80">
                  Below {MATCH_THRESHOLD}%, nothing is shown — quiet pool, no
                  noise
                </span>
              </li>
            </ul>

            <Link
              href={isGuest ? "/register?next=/cine-match" : "/cine-match/matches"}
              className="group mt-8 inline-flex h-10 items-center gap-1 text-sm font-medium text-[#ecb756] transition-colors hover:text-[#f3cd84]"
            >
              {isGuest ? "Sign up to get matched" : "See my matches"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Sample match card */}
          <div className="lg:col-span-7">
            <div
              aria-label="Sample 93% match"
              className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-panel p-6 sm:p-9"
            >
              <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
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
                    <div className="font-display text-lg">You</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      VSAC · Berlin
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Similarity
                  </div>
                  <div className="mt-1 font-display text-6xl leading-none text-[#ecb756]">
                    93%
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.22em] text-emerald-500/90">
                    <CheckCircle2 className="size-3" /> Above threshold
                  </div>
                </div>

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
                    <div className="font-display text-lg">Mira</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      VSAW · Lisbon
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-foreground/10" />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sampleAxes.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {m.label}
                      </span>
                      <span className="font-mono text-[10px] text-foreground/60">
                        Δ {m.delta}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-3">
                      <span className="text-sm text-foreground/90">
                        {m.self}
                      </span>
                      <span className="text-sm text-foreground/60">
                        / {m.other}
                      </span>
                    </div>
                    <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-foreground/10">
                      <span
                        className="absolute inset-y-0 left-0 block rounded-full"
                        style={{
                          width: `${m.selfPct}%`,
                          background: m.accent,
                        }}
                      />
                      <span
                        className="absolute inset-y-0 block w-px bg-foreground/70"
                        style={{ left: `${m.otherPct}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-foreground/5 bg-foreground/[0.02] px-4 py-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Shared watched
                  </div>
                  <div className="mt-0.5 text-sm">
                    <span className="font-display text-xl text-foreground">
                      37
                    </span>{" "}
                    films in common
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {["#ecb756", "#c8a4ff", "#7fd1ff", "#ff9a76", "#9fe6a0"].map(
                    (c, i) => (
                      <span
                        key={i}
                        className="block size-7 rounded-md border border-foreground/10"
                        style={{ background: c, opacity: 0.55 }}
                        aria-hidden
                      />
                    ),
                  )}
                </div>
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

      {/* ============== TESTIMONIALS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            Early matches{" "}
            <span className="text-muted-foreground">in their own words.</span>
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            From the closed beta — names shortened, types intact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {critics.map((c) => (
            <figure
              key={c.author}
              className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-7 sm:p-8"
            >
              <Quote className="absolute -right-2 -top-2 size-20 stroke-[1.2] text-[#ecb756]/[0.06]" />
              <blockquote className="relative font-display text-xl leading-snug">
                &ldquo;{c.quote}&rdquo;
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

      {/* ============== FAQ ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-10">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">
            Quick questions,{" "}
            <span className="text-muted-foreground">briefly answered.</span>
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="rounded-2xl border border-foreground/10 bg-panel p-6"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
                  Q.0{i + 1}
                </span>
                <h3 className="font-display text-lg">{f.q}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="relative overflow-hidden rounded-[28px] border border-[#ecb756]/20 bg-panel p-10 text-center sm:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -top-20 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-[#ecb756]/[0.06] blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              {isGuest ? (
                <>
                  Your taste twin{" "}
                  <span className="text-[#ecb756]">is on the other side.</span>
                </>
              ) : (
                <>
                  Ready when{" "}
                  <span className="text-[#ecb756]">you are.</span>
                </>
              )}
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
              {isGuest
                ? "Take the CineTest, mark twenty films you’ve watched, and let the matcher do the quiet work."
                : `${WEEKLY_REQUEST_LIMIT} requests every rolling week. Use one when a ${MATCH_THRESHOLD}%+ stranger feels worth the search.`}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {isGuest ? (
                <>
                  <Link
                    href="/register?next=/cine-match"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group h-12 rounded-full bg-[#ecb756] px-7 text-base font-medium text-[#1a1840] shadow-[0_10px_36px_-12px_#ecb756aa] hover:bg-[#f3cd84] hover:text-[#1a1840]",
                    )}
                  >
                    Sign up — it&rsquo;s free
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/cinetest"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
                    )}
                  >
                    Take the CineTest
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/cine-match/matches"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group h-12 rounded-full bg-[#ecb756] px-7 text-base font-medium text-[#1a1840] shadow-[0_10px_36px_-12px_#ecb756aa] hover:bg-[#f3cd84] hover:text-[#1a1840]",
                    )}
                  >
                    Open my matches
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/films"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
                    )}
                  >
                    Mark more films
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------- Action panels ----------

function GuestActionPanel() {
  const bullets = [
    { icon: Sparkles, label: "Take the CineTest" },
    { icon: Target, label: `Mark ${WATCHED_MIN} films watched` },
    { icon: MessagesSquareIcon, label: `${MATCH_THRESHOLD}%+ matches only` },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ecb756]/25 bg-panel p-6 sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -right-12 -top-12 size-64 rounded-full bg-[#ecb756]/[0.08] blur-3xl" />
      </div>
      <div className="relative grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
            Two-minute setup · free
          </div>
          <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
            Sign in to join the matching pool.
          </h3>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {bullets.map((b) => (
              <li key={b.label} className="inline-flex items-center gap-2">
                <b.icon className="size-3.5 text-[#ecb756]" aria-hidden />
                {b.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/register?next=/cine-match"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 w-full justify-center rounded-full bg-[#ecb756] px-7 text-base font-medium text-[#1a1840] shadow-[0_10px_36px_-12px_#ecb756aa] hover:bg-[#f3cd84] hover:text-[#1a1840] sm:w-auto",
            )}
          >
            Create a free account
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login?next=/cine-match"
            className="text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground sm:text-right"
          >
            Already a member? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

type MemberActionPanelProps = {
  eligibility: NonNullable<Awaited<ReturnType<typeof getEligibility>>>;
  quota: Awaited<ReturnType<typeof getRequestQuota>> | null;
  poolEntry: Awaited<ReturnType<typeof getPoolEntry>> | null;
};

function MemberActionPanel({
  eligibility,
  quota,
  poolEntry,
}: MemberActionPanelProps) {
  const inPool = eligibility.ok && eligibility.alreadyJoined;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-panel p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
          Your dashboard
        </span>
        {eligibility.ok ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Clock3 className="size-3" />
            Rolling 7-day window
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        {eligibility.ok ? (
          <>
            <PoolStatusCard entry={poolEntry} />
            {quota ? (
              <QuotaCard
                used={quota.used}
                pending={quota.pending.length}
                nextSlotAt={quota.nextSlotAt}
                nowMs={nowMs()}
              />
            ) : null}
          </>
        ) : (
          <EligibilityProgress
            reason={eligibility.reason}
            watchedCount={eligibility.watchedCount}
          />
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {eligibility.ok ? (
          inPool ? (
            <RequestMatchButton
              remaining={quota?.remaining ?? WEEKLY_REQUEST_LIMIT}
              nextSlotAt={quota?.nextSlotAt ?? null}
              pendingCount={quota?.pending.length ?? 0}
            />
          ) : (
            <JoinPoolButton />
          )
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-12 w-full cursor-not-allowed rounded-full border border-foreground/10 bg-foreground/[0.02] opacity-50",
            )}
            aria-disabled
          >
            Join the pool
          </span>
        )}
        <Link
          href="/cine-match/matches"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 w-full rounded-full border border-foreground/15 bg-foreground/[0.02] hover:bg-foreground/[0.06]",
          )}
        >
          <MessagesSquareIcon className="size-4" />
          See my matches
        </Link>
      </div>

      {eligibility.ok && quota?.pending.length ? (
        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          We&rsquo;ll page you the moment a {MATCH_THRESHOLD}%+ match lands ·
          After {FALLBACK_WAIT_DAYS} days the closest available person becomes a
          fallback
        </p>
      ) : null}
    </div>
  );
}
