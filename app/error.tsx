"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative isolate flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">


      <h1 className="mt-7 font-display text-4xl tracking-tight sm:text-5xl">
        Projection error.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Something snapped in the projector. The team has been notified — you
        can try the reel again, or head back to the lobby.
      </p>

      {error.digest && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <span className="size-1 rounded-full bg-[#ecb756]" />
          Ref · {error.digest}
        </p>
      )}

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] shadow-[0_8px_28px_-12px_#ecb75688] hover:bg-[#f3cd84] hover:text-[#1a1840]",
          )}
        >
          <RotateCcw className="mr-1 size-4 transition-transform group-hover:-rotate-45" />
          Rewind &amp; retry
        </button>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "h-12 rounded-full border border-foreground/15 px-6 text-base hover:bg-foreground/[0.06]",
          )}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
