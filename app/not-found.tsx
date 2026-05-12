import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { ctaPrimaryLg, ctaSecondaryLg } from "@/lib/ui-tokens";

export default function NotFound() {
  return (
    <main className="flex min-h-[80dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mt-8 font-display text-[140px] leading-none tracking-tight text-[#ecb756] sm:text-[200px]">
        404
      </div>

      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
        Cut from the final print
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        This frame doesn’t exist — or it’s already on the cutting-room floor.
        Let’s get you back to the screening.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className={ctaPrimaryLg + " group"}>
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
        <Link href="/films" className={ctaSecondaryLg}>
          <Compass className="size-4" />
          Browse films
        </Link>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        — End of reel —
      </p>
    </main>
  );
}
