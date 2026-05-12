import Link from "next/link";

import type { PersonalityType } from "@/lib/cinepersona";

export function TypeCard({ type }: { type: PersonalityType }) {
  return (
    <Link
      href={`/cinetype/${type.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-5 transition-all hover:border-[#ecb756]/40 focus:outline-none focus-visible:border-[#ecb756]/60"
      aria-label={`${type.code} — ${type.name}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#ecb756]/[0.06] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-3xl leading-none text-[#ecb756]">
            {type.code}
          </span>
          <span className="rounded-full border border-foreground/10 bg-foreground/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground capitalize">
            {type.strategy.replace("-", " ")}
          </span>
        </div>
        <h3 className="mt-5 font-display text-lg leading-snug tracking-tight">
          {type.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {type.tagline}
        </p>
      </div>
    </Link>
  );
}
