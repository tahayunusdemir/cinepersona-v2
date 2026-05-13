/**
 * Minimal full-viewport loading overlay — covers the navbar + footer
 * with the brand mark gently breathing in and out. Pure CSS.
 */

import Image from "next/image";

import { siteConfig } from "@/lib/site";

export function ScreeningLoader() {
  const brandLead = siteConfig.name.replace("Persona", "");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-background"
      style={{ animation: "cinepersona-curtain-in 280ms ease-out both" }}
    >
      <span className="sr-only">Loading…</span>

      <Image
        src="/logo.png"
        alt=""
        width={160}
        height={160}
        priority
        className="size-32 sm:size-40"
        style={{
          animation: "cinepersona-breathe 2.4s ease-in-out infinite",
        }}
      />

      <span className="font-display text-2xl leading-none tracking-tight text-foreground/80 sm:text-3xl">
        {brandLead}
        <span className="text-[#ecb756]">Persona</span>
      </span>
    </div>
  );
}
