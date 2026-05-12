import Link from "next/link";

import type { PersonalityType } from "@/lib/cinepersona";
import { FAMILY_HEX } from "@/lib/ui-tokens";

type Props = {
  type: PersonalityType;
  /** Optional family accent — when not passed, falls back to the brand amber.
   *  Pages that render types grouped by family pass the group's hue so each
   *  card inherits its family's color in border, code-letter, and bloom. */
  familyHue?: string;
};

export function TypeCard({ type, familyHue = FAMILY_HEX.aut }: Props) {
  return (
    <Link
      href={`/cinetype/${type.slug}`}
      className="group relative block overflow-hidden rounded-2xl border bg-panel p-5 transition-all focus:outline-none"
      style={{ borderColor: `${familyHue}33` }}
      aria-label={`${type.code} — ${type.name}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `${familyHue}26` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-display text-3xl leading-none"
            style={{ color: familyHue }}
          >
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
