import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, Film, Mail } from "lucide-react";

import { siteConfig } from "@/lib/site";

const explore = [
  { href: "/cinetype", label: "CineType", code: "01" },
  { href: "/cinetest", label: "CineTest", code: "02" },
  { href: "/cine-match", label: "CineMatch", code: "03" },
  { href: "/films", label: "Films", code: "04" },
  { href: "/community", label: "Community", code: "05" },
];

const account = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
  { href: "/pricing", label: "Pricing" },
  { href: "/settings", label: "Settings" },
  { href: "/messages", label: "Messages" },
];

const company = [
  { href: "/about", label: "About" },
  { href: "/badges", label: "Badges" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const brandLead = siteConfig.name.replace("Persona", "");

  return (
    <footer className="relative isolate overflow-hidden border-t border-foreground/10 bg-panel text-foreground dark:bg-[#070514]">
      {/* Atmospheric glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-260px] h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--bloom)_0%,var(--bloom)_45%,transparent_72%)] opacity-50 blur-[2px]" />
        <div className="absolute -right-32 top-10 h-[320px] w-[320px] rounded-full bg-[radial-gradient(closest-side,#ecb756_0%,transparent_70%)] opacity-[0.08] blur-[18px]" />
      </div>

      {/* Hair-thin gold leader */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ecb756]/50 to-transparent"
      />

      {/* Perforation strip */}
      <div
        aria-hidden
        className="flex h-3 items-center justify-between gap-2 border-b border-foreground/5 px-6"
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="size-1 rounded-full bg-foreground/10"
            style={{ opacity: 0.35 + (i % 4) * 0.12 }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:pt-20">
        {/* Top label row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="max-w-xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Until the next reel,{" "}
              <span className="text-[#ecb756]">enjoy the show.</span>
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Currently
            </div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5 text-xs">
              <span className="size-1.5 rounded-full bg-[#ecb756] animate-pulse-dot" />
              <span className="text-foreground/80">16 CineTypes indexed</span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label={`${siteConfig.name} home`}
            >
              <span className="grid size-9 place-items-center rounded-lg border border-foreground/10 bg-panel">
                <Image
                  src="/logo.png"
                  alt=""
                  width={22}
                  height={22}
                  className="size-[22px]"
                />
              </span>
              <span className="font-display text-2xl leading-none tracking-tight">
                {brandLead}
                <span className="text-[#ecb756]">Persona</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              A personality test for cinephiles. Take the 60-second CineTest,
              get your CineType, and match with films — and viewers — who
              already think like you.
            </p>

            {/* Newsletter / dispatch card */}
            <div className="mt-7 max-w-md overflow-hidden rounded-2xl border border-foreground/10 bg-panel/80 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <Clapperboard className="size-3 text-[#ecb756]" />
                  Weekly dispatch
                </span>
              </div>
              <form
                aria-label="Subscribe to the weekly dispatch"
                className="mt-3 flex items-center gap-2"
                action="/community"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email
                </label>
                <div className="flex flex-1 items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-2 transition-colors focus-within:border-[#ecb756]/40">
                  <Mail
                    aria-hidden
                    className="size-3.5 shrink-0 text-muted-foreground"
                  />
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="you@inthemoodfor.love"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-[#ecb756] px-4 text-xs font-medium text-[#1a1840] transition-colors hover:bg-[#f3cd84]"
                >
                  Subscribe
                  <ArrowUpRight className="size-3.5" />
                </button>
              </form>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                One double-feature, one essay, every Friday. No spam, no
                blockbuster bait.
              </p>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:col-span-1 md:block" />

          {/* Link columns */}
          <FooterColumn
            label="Explore"
            number="A"
            items={explore.map((i) => ({
              href: i.href,
              label: i.label,
              prefix: i.code,
            }))}
          />
          <FooterColumn label="Account" number="B" items={account} />
          <FooterColumn label="Studio" number="C" items={company} />
        </div>

        {/* Marquee separator */}
        <div className="mt-16 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
          <span className="font-display text-2xl tracking-tight text-[#ecb756]/70">
            Fin
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono uppercase tracking-[0.18em]">
              © {year} {siteConfig.name}
            </span>
            <span className="hidden text-foreground/15 sm:inline">/</span>
            <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em]">
              <Film className="size-3 text-[#ecb756]" />
              Made by fans for the cinephiles
            </span>
            <span className="hidden text-foreground/15 sm:inline">/</span>
            <span className="font-mono normal-case tracking-normal text-muted-foreground/80">
              Film data and posters from{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                TMDB
              </a>
              . This product uses the TMDB API but is not endorsed or certified
              by TMDB.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/privacy"
              className="font-mono uppercase tracking-[0.18em] transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <span className="text-foreground/15">·</span>
            <Link
              href="/terms"
              className="font-mono uppercase tracking-[0.18em] transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  label,
  number,
  items,
}: {
  label: string;
  number: string;
  items: { href: string; label: string; prefix?: string }[];
}) {
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="text-[#ecb756]">{number}</span>
        <span className="h-px w-3 bg-foreground/15" />
        <span>{label}</span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group inline-flex items-baseline gap-2.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
            >
              {item.prefix && (
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground transition-colors group-hover:text-[#ecb756]">
                  {item.prefix}
                </span>
              )}
              <span className="relative">
                {item.label}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#ecb756]/60 transition-all duration-300 group-hover:w-full"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
