/**
 * Shared design tokens for CinePersona's UI surface — keeps CTAs, badges,
 * cards, and hover treatments visually identical across pages.
 *
 * Compose with `cn()` (and `buttonVariants` where a Link is being styled as
 * a button) when applying. Don't append page-specific shadows or radii —
 * use the variants here and add layout-only utilities (mt-, w-full, etc.).
 */

// ---------- CTAs ----------

/** Primary gold button, hero / page-level. ~48px tall. */
export const ctaPrimaryLg =
  "inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-[#ecb756] px-7 text-base font-medium leading-none text-[#1a1840] transition-colors hover:bg-[#f3cd84] hover:text-[#1a1840]";

/** Primary gold button, inline / card-level. ~44px tall. */
export const ctaPrimary =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#ecb756] px-6 text-sm font-medium leading-none text-[#1a1840] transition-colors hover:bg-[#f3cd84] hover:text-[#1a1840]";

/** Compact gold button, header-level. ~36px tall. */
export const ctaPrimarySm =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#ecb756] px-4 text-[13px] font-medium leading-none text-[#1a1840] transition-colors hover:bg-[#f3cd84] hover:text-[#1a1840]";

/** Secondary outline button, hero / page-level. */
export const ctaSecondaryLg =
  "inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 text-base font-medium leading-none text-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground";

/** Secondary outline button, inline / card-level. */
export const ctaSecondary =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/[0.02] px-6 text-sm font-medium leading-none text-foreground/85 transition-colors hover:bg-foreground/[0.06] hover:text-foreground";

// ---------- Cards ----------

/** Default surface card. Add `p-7 sm:p-8` (or your preferred padding) per use. */
export const card =
  "rounded-2xl border border-foreground/10 bg-panel transition-colors";

/** Card with hover lift. */
export const cardInteractive =
  "rounded-2xl border border-foreground/10 bg-panel transition-colors hover:border-foreground/20";

/** Highlighted / featured card (gold border). */
export const cardFeatured =
  "rounded-2xl border border-[#ecb756]/40 bg-panel transition-colors";

/** Large CTA block (final-section panels). Add padding per use. */
export const cardCtaBlock =
  "rounded-[28px] border border-[#ecb756]/20 bg-panel";

// ---------- Badges ----------

/** Soft brand badge (outline + tint). */
export const badgeBrand =
  "border-[#ecb756]/30 bg-[#ecb756]/10 text-[#ecb756]";

/** Solid brand badge. */
export const badgeBrandSolid =
  "border-0 bg-[#ecb756] text-[#1a1840] hover:bg-[#f3cd84]";

/** Muted outline badge. */
export const badgeMuted =
  "border-foreground/15 bg-foreground/[0.02] text-muted-foreground";

// ---------- Type — micro-credits / eyebrow labels ----------

export const credit =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground";

export const creditAccent =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]";

// ---------- CineType family accents ----------
// Four group colors — AUT amber, VIS lavender, CON coral, ESC sky.
// Used to alternate accents across rows of equivalent UI (stats,
// step numerals, plan cards, list items) so the four families are
// felt across the whole product, not just on the CineType page.

export const FAMILY_HEX = {
  aut: "#ecb756",
  vis: "#c8a4ff",
  con: "#ff9a76",
  esc: "#7fd1ff",
} as const;

export type FamilyKey = keyof typeof FAMILY_HEX;

/** Canonical rotation order used to walk a list of N items through the four
 *  family hues. AUT first (it is the brand-primary). */
export const familyCycle: FamilyKey[] = ["aut", "vis", "con", "esc"];

/** Pick the i-th family color (wraps). */
export function familyAt(i: number): string {
  return FAMILY_HEX[familyCycle[i % familyCycle.length]];
}

/** Soft tinted pill — outline + 10% bg + text in the family color. */
export const FAMILY_TINT: Record<FamilyKey, string> = {
  aut: "border-[#ecb756]/30 bg-[#ecb756]/10 text-[#ecb756]",
  vis: "border-[#c8a4ff]/30 bg-[#c8a4ff]/10 text-[#c8a4ff]",
  con: "border-[#ff9a76]/30 bg-[#ff9a76]/10 text-[#ff9a76]",
  esc: "border-[#7fd1ff]/30 bg-[#7fd1ff]/10 text-[#7fd1ff]",
};

/** Tint pill for the i-th family in cycle order. */
export function familyTintAt(i: number): string {
  return FAMILY_TINT[familyCycle[i % familyCycle.length]];
}
