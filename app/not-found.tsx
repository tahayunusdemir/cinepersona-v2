import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">


      <div className="relative mt-8">
        <div className="font-display text-[140px] leading-none tracking-tight text-[#ecb756] sm:text-[200px]">
          404
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,.08) 3px 4px)",
          }}
        />
      </div>

      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
        Cut from the final print.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        This frame doesn’t exist — or it’s already on the cutting-room floor.
        Let’s get you back to the screening.
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] shadow-[0_8px_28px_-12px_#ecb75688] hover:bg-[#f3cd84] hover:text-[#1a1840]",
          )}
        >
          <ArrowLeft className="mr-1 size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
        <Link
          href="/films"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
          )}
        >
          <Compass className="mr-1 size-4" />
          Browse films
        </Link>
      </div>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        — End of reel —
      </p>
    </main>
  );
}
