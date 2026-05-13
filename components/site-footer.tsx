import Link from "next/link";
import { Film } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { siteConfig } from "@/lib/site";
import { credit, FAMILY_HEX, familyAt } from "@/lib/ui-tokens";

const explore = [
  { href: "/cinetype", label: "CineType" },
  { href: "/cinetest", label: "CineTest" },
  { href: "/cine-match", label: "CineMatch" },
  { href: "/films", label: "Films" },
  { href: "/community", label: "Community" },
];

const account = [
  { href: "/login", label: "Sign in" },
  { href: "/register", label: "Create account" },
  { href: "/settings", label: "Settings" },
  { href: "/messages", label: "Messages" },
];

const company = [
  { href: "/badges", label: "Badges" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground/10 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:px-6 lg:pt-20">
        {/* Top label row */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="max-w-xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Until the next reel,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${FAMILY_HEX.aut}, ${FAMILY_HEX.vis} 40%, ${FAMILY_HEX.con} 70%, ${FAMILY_HEX.esc})`,
                }}
              >
                enjoy the show
              </span>
            </h2>
          </div>
          <div className="hidden text-right md:block">
            <div className={credit}>Currently</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1.5 text-xs">
              <span
                className="size-1.5 rounded-full"
                style={{ background: FAMILY_HEX.aut }}
              />
              <span className="text-foreground/80">16 CineTypes indexed</span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-5">
            <SiteLogo size="sm" />

            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              A personality test for cinephiles. Take the 10-minute CineTest,
              get your CineType, and match with films — and viewers — who
              already think like you.
            </p>

          </div>

          {/* Spacer */}
          <div className="hidden md:col-span-1 md:block" />

          {/* Link columns */}
          <FooterColumn
            label="Explore"
            number="A"
            hue={FAMILY_HEX.aut}
            items={explore}
          />
          <FooterColumn
            label="Account"
            number="B"
            hue={FAMILY_HEX.vis}
            items={account}
          />
          <FooterColumn
            label="Studio"
            number="C"
            hue={FAMILY_HEX.con}
            items={company}
          />
        </div>

        {/* Marquee separator */}
        <div className="mt-16 flex items-center gap-4">
          <span
            className="h-px flex-1"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${FAMILY_HEX.aut}40, ${FAMILY_HEX.vis}40, transparent)`,
            }}
          />
          <span
            className="font-display text-2xl tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${FAMILY_HEX.aut}b3, ${FAMILY_HEX.esc}b3)`,
            }}
          >
            Fin
          </span>
          <span
            className="h-px flex-1"
            style={{
              backgroundImage: `linear-gradient(to right, transparent, ${FAMILY_HEX.con}40, ${FAMILY_HEX.esc}40, transparent)`,
            }}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-mono uppercase tracking-[0.18em]">
              © {year} {siteConfig.name}
            </span>
            <span className="hidden text-foreground/15 sm:inline">/</span>
            <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em]">
              <Film className="size-3" style={{ color: FAMILY_HEX.esc }} />
              Made by fans for the cinephiles
            </span>
            <span className="hidden text-foreground/15 sm:inline">/</span>
            <span className="text-muted-foreground/80">
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
  hue,
  items,
}: {
  label: string;
  number: string;
  hue: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div className="col-span-1 md:col-span-2">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span style={{ color: hue }}>{number}</span>
        <span
          className="h-px w-3"
          style={{ background: `${hue}66` }}
        />
        <span>{label}</span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group inline-flex items-baseline gap-2.5 text-sm text-foreground/75 transition-colors hover:text-foreground"
            >
              <span className="relative">
                {item.label}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ background: `${hue}99` }}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
