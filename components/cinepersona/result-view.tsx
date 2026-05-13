import Link from "next/link";
import { ArrowRightIcon, RotateCcwIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { ProjectorBloom, Reveal, Stagger } from "@/components/cinema/motion";
import {
  PicksDisplay,
  type DisplayPick,
} from "@/components/cinepersona/picks-display";
import { TypeCard } from "@/components/cinepersona/type-card";
import { buttonVariants } from "@/components/ui/button";
import { ctaPrimary, FAMILY_HEX, type FamilyKey } from "@/lib/ui-tokens";
import {
  axes,
  getGroup,
  getProfile,
  getStrategy,
  getType,
  scoreTest,
  typesInGroup,
  type AxisScore,
  type GroupSlug,
  type LikertValue,
} from "@/lib/cinepersona";
import { cn } from "@/lib/utils";

type ResultViewProps = {
  answers: Record<number, LikertValue>;
  saveSlot?: React.ReactNode;
  picks?: DisplayPick[];
  picksHint?: string;
};

const FAMILY_BY_GROUP: Record<GroupSlug, FamilyKey> = {
  auteurs: "aut",
  visionaries: "vis",
  connoisseurs: "con",
  escapists: "esc",
};

export function ResultView({
  answers,
  saveSlot,
  picks,
  picksHint,
}: ResultViewProps) {
  const result = scoreTest(answers);
  const type = getType(result.code);
  const profile = type ? getProfile(type.code) : undefined;
  const group = type ? getGroup(type.group) : undefined;
  const strategy = type ? getStrategy(type.strategy) : undefined;
  const peers = type
    ? typesInGroup(type.group).filter((t) => t.code !== type.code)
    : [];

  const familyHue =
    type && group ? FAMILY_HEX[FAMILY_BY_GROUP[group.slug]] : FAMILY_HEX.aut;

  const overview = profile?.sections.find((s) => s.slug === "overview");
  const strengths = profile?.traits.filter((t) => t.kind === "strength") ?? [];
  const weaknesses =
    profile?.traits.filter((t) => t.kind === "weakness") ?? [];

  return (
    <div className="relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
        {/* HERO */}
        <header className="relative grid grid-cols-1 gap-8 pt-12 lg:grid-cols-12 lg:pt-16">
          <ProjectorBloom className="pointer-events-none absolute -top-24 left-0 -z-10 h-[420px] w-[820px] max-w-[110vw] blur-3xl" />

          <Reveal as="div" immediate className="lg:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span
                aria-hidden
                className="mr-2 inline-block size-1.5 -translate-y-[2px] rounded-full align-middle"
                style={{ background: familyHue }}
              />
              Your CineType · 4 axes scored
            </p>

            <div className="mt-6 flex items-baseline gap-5">
              <span
                className="font-display text-[88px] leading-none sm:text-[120px]"
                style={{ color: familyHue }}
              >
                {result.code}
              </span>
              {group && strategy ? (
                <div className="flex flex-wrap gap-2 pb-3">
                  <Link
                    href={`/cinetype/groups/${group.slug}`}
                    className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
                    style={{ borderColor: `${familyHue}40` }}
                  >
                    {group.name}
                  </Link>
                  <Link
                    href={`/cinetype/strategies/${strategy.slug}`}
                    className="rounded-full border border-foreground/15 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {strategy.name}
                  </Link>
                </div>
              ) : null}
            </div>

            <h1 className="mt-5 font-display text-balance text-4xl tracking-tight sm:text-6xl">
              {type ? type.name : "Unknown type"}
            </h1>
            {type ? (
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {type.tagline}
              </p>
            ) : null}
          </Reveal>

          {type ? (
            <Reveal
              immediate
              delay={0.12}
              className="lg:col-span-4 lg:flex lg:items-end"
            >
              <blockquote className="relative w-full rounded-2xl border border-foreground/10 bg-panel p-6">
                <span
                  aria-hidden
                  className="absolute left-6 top-2 font-display text-5xl leading-none"
                  style={{ color: `${familyHue}66` }}
                >
                  “
                </span>
                <p className="relative pt-5 font-display text-lg leading-snug text-foreground/90">
                  {type.quote}
                </p>
              </blockquote>
            </Reveal>
          ) : null}
        </header>

        {/* AXIS BREAKDOWN — the result-specific money shot: user's letters + %  */}
        <section aria-label="Your axis breakdown" className="mt-16">
          <Reveal>
            <FrameTag>Your scores</FrameTag>
            <h2 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
              How you scored, axis by axis.
            </h2>
          </Reveal>
          <Stagger
            as="ul"
            step={0.07}
            className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {result.axes.map((axisScore: AxisScore) => {
              const axis = axes.find((a) => a.id === axisScore.axis)!;
              const winningPole =
                axisScore.letter === axis.primary.letter
                  ? axis.primary
                  : axis.opposite;
              const losingPole =
                winningPole === axis.primary ? axis.opposite : axis.primary;
              const winningPct =
                axisScore.letter === axis.primary.letter
                  ? axisScore.primaryPct
                  : 100 - axisScore.primaryPct;
              const winsLeft = winningPole === axis.primary;
              return (
                <Reveal
                  as="li"
                  key={axisScore.axis}
                  className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-6"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full opacity-20 blur-3xl"
                    style={{ background: familyHue }}
                  />
                  <div className="relative">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {axis.name}
                    </p>

                    <div className="mt-4 flex items-baseline gap-3">
                      <span
                        className="font-display text-5xl leading-none sm:text-6xl"
                        style={{ color: familyHue }}
                      >
                        {winningPole.letter}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {winningPole.name}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {winningPct}%
                        </p>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="mt-5 space-y-1.5">
                      <div className="relative h-1.5 overflow-hidden rounded-full bg-foreground/[0.06]">
                        <div
                          aria-hidden
                          className="absolute inset-y-0 rounded-full"
                          style={{
                            background: familyHue,
                            width: `${winningPct}%`,
                            left: winsLeft ? 0 : undefined,
                            right: winsLeft ? undefined : 0,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span
                          className={
                            winsLeft
                              ? "text-foreground/80"
                              : "text-muted-foreground"
                          }
                        >
                          {axis.primary.letter} · {axis.primary.name}
                        </span>
                        <span
                          className={
                            !winsLeft
                              ? "text-foreground/80"
                              : "text-muted-foreground"
                          }
                        >
                          {axis.opposite.name} · {axis.opposite.letter}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      {winningPole.blurb}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                      Opposite · {losingPole.name}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </section>

        {/* IDENTITY — group + strategy panels */}
        {group && strategy ? (
          <Stagger
            as="section"
            step={0.1}
            aria-label="Your family and strategy"
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <Reveal className="relative overflow-hidden rounded-2xl border bg-panel p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-16 -top-16 size-44 rounded-full opacity-25 blur-3xl"
                style={{ background: familyHue }}
              />
              <div className="relative">
                <FrameTag>Family</FrameTag>
                <h3 className="mt-3 font-display text-2xl tracking-tight">
                  {group.name}
                </h3>
                <p
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: familyHue }}
                >
                  {group.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
                <Link
                  href={`/cinetype/groups/${group.slug}`}
                  className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Open family
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </Reveal>

            <Reveal className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-6">
              <div className="relative">
                <FrameTag>Strategy</FrameTag>
                <h3 className="mt-3 font-display text-2xl tracking-tight">
                  {strategy.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {strategy.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {strategy.description}
                </p>
                <Link
                  href={`/cinetype/strategies/${strategy.slug}`}
                  className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Open strategy
                  <ArrowRightIcon className="size-3" />
                </Link>
              </div>
            </Reveal>
          </Stagger>
        ) : null}

        {/* WHO THEY ARE — narrative overview */}
        {overview ? (
          <Reveal
            as="section"
            className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12"
          >
            <div className="lg:col-span-3">
              <FrameTag>Who they are</FrameTag>
              <h2 className="mt-3 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                A short read.
              </h2>
            </div>
            <div className="space-y-4 lg:col-span-9">
              {overview.body.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed text-foreground/85"
                >
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* STRENGTHS / BLIND SPOTS */}
        {strengths.length > 0 || weaknesses.length > 0 ? (
          <Stagger
            as="section"
            step={0.12}
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {strengths.length > 0 ? (
              <Reveal className="rounded-2xl border border-foreground/10 bg-panel p-6">
                <FrameTag>Strengths</FrameTag>
                <h3 className="mt-3 font-display text-xl tracking-tight">
                  What sharpens the print.
                </h3>
                <ul className="mt-5 space-y-4 text-sm">
                  {strengths.map((s) => (
                    <li
                      key={s.label}
                      className="border-l-2 pl-4"
                      style={{ borderColor: familyHue }}
                    >
                      <p className="font-medium text-foreground">{s.label}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        {s.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
            {weaknesses.length > 0 ? (
              <Reveal className="rounded-2xl border border-foreground/10 bg-panel p-6">
                <FrameTag>Blind spots</FrameTag>
                <h3 className="mt-3 font-display text-xl tracking-tight">
                  Frames that go out of focus.
                </h3>
                <ul className="mt-5 space-y-4 text-sm">
                  {weaknesses.map((s) => (
                    <li
                      key={s.label}
                      className="border-l-2 border-foreground/15 pl-4"
                    >
                      <p className="font-medium text-foreground">{s.label}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        {s.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </Stagger>
        ) : null}

        {/* PICKS (only when ResultView is rendered with stored picks) */}
        {picks ? (
          <Reveal as="div" className="mt-16">
            <PicksDisplay picks={picks} emptyHint={picksHint} />
          </Reveal>
        ) : null}

        {/* SAVE / SHARE — host-provided slot (signed-in vs anonymous handled inside) */}
        {saveSlot ? <div className="mt-12">{saveSlot}</div> : null}

        {/* READ FULL PROFILE CTA */}
        {type ? (
          <Reveal
            as="section"
            className="relative mt-16 overflow-hidden rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-7 sm:flex sm:items-center sm:justify-between sm:p-8"
          >
            <ProjectorBloom className="pointer-events-none absolute right-0 top-1/2 -z-10 size-[360px] -translate-y-1/2 blur-3xl" />
            <div>
              <FrameTag>Go deeper</FrameTag>
              <p className="mt-3 font-display text-xl tracking-tight">
                Want the full profile?
              </p>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Watching rituals, discovery habits, after-credits behaviour,
                and the directors, films, and tags {type.code} tends to love.
              </p>
            </div>
            <Link
              href={`/cinetype/${type.slug}`}
              className={cn(ctaPrimary, "group mt-5 sm:mt-0")}
            >
              Open {type.code}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        ) : null}

        {/* PEERS */}
        {peers.length > 0 && group ? (
          <section className="mt-16">
            <Reveal className="mb-5 flex items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
                Other {group.name}
              </h2>
              <Link
                href={`/cinetype/groups/${group.slug}`}
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Open family
                <ArrowRightIcon className="size-3" />
              </Link>
            </Reveal>
            <Stagger
              as="ul"
              step={0.06}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {peers.map((peer) => (
                <Reveal as="li" key={peer.code}>
                  <TypeCard type={peer} familyHue={familyHue} />
                </Reveal>
              ))}
            </Stagger>
          </section>
        ) : null}

        {/* FOOTER ACTIONS */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          <Link
            href="/cinetest/take"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <RotateCcwIcon className="size-4" />
            Retake the test
          </Link>
          <Link
            href="/cinetype"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Browse all types
          </Link>
        </div>
      </div>
    </div>
  );
}
