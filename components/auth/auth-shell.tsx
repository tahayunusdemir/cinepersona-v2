import type { ReactNode } from "react";
import Link from "next/link";
import { Clapperboard, Sparkles } from "lucide-react";

import { siteConfig } from "@/lib/site";

type Props = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

const sidePoints = [
  "60-second CineTest. No long quizzes.",
  "16 archetypes. 4 trait axes. Zero star ratings.",
  "CineMatch with people who watch like you.",
];

export function AuthShell({ title, description, children, footer }: Props) {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Ambient bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-220px] h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--bloom)_0%,var(--bloom)_45%,transparent_72%)] opacity-80 blur-[2px] animate-drift" />
        <div className="absolute right-[-120px] top-[140px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,#ecb756_0%,transparent_70%)] opacity-20 blur-[10px]" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        {/* Brand panel */}
        <aside className="hidden lg:col-span-6 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {siteConfig.name}
            </Link>

            <h1 className="mt-8 font-display text-[56px] leading-[1.02] tracking-tight text-foreground">
              Sign in to find{" "}
              <span className="text-[#ecb756]">your kind</span>{" "}
              of cinema.
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              CinePersona turns how you watch into a profile — and pairs you
              with films and viewers who think the same way.
            </p>

            <ul className="mt-10 space-y-3.5 text-[15px]">
              {sidePoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ecb756]" />
                  <span className="text-foreground/85">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini CineType preview */}
          <div className="mt-12 max-w-md">
            <div className="rounded-2xl border border-foreground/10 bg-panel/80 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>CineType</span>
                <span>04 / 16</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl leading-none text-[#ecb756]">
                  AUT
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="font-display text-lg text-foreground/85">
                  The Auteur
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-[#ecb756]" />
                <span>Today’s match: 96% · In the Mood for Love</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="lg:col-span-6">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile brand strip */}
            <div className="mb-6 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                <Clapperboard className="size-3.5 text-[#ecb756]" />
                {siteConfig.name}
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel/90 p-7 shadow-2xl backdrop-blur-xl sm:p-8">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ecb756]/40 to-transparent"
              />
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {title}
              </div>
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                {title === "Sign in"
                  ? "Welcome back."
                  : title === "Create your account"
                    ? "Make it yours."
                    : title === "Forgot password"
                      ? "Let’s get you back in."
                      : title === "Reset password" ||
                          title === "Set a new password"
                        ? "Pick a new one."
                        : title}
              </h2>
              {description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              ) : null}

              <div className="mt-7">{children}</div>

              {footer ? (
                <div className="mt-7 border-t border-foreground/10 pt-5 text-center text-sm text-muted-foreground">
                  {footer}
                </div>
              ) : null}
            </div>

            <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              No 1–10 ratings. No noise. Just your CineType.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
