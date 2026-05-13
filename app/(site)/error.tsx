"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { ctaPrimaryLg, ctaSecondaryLg } from "@/lib/ui-tokens";
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
    <main className="flex min-h-[80dvh] flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="mt-7 font-display text-4xl tracking-tight sm:text-5xl">
        Projection error
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

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className={cn(ctaPrimaryLg, "group")}
        >
          <RotateCcw className="size-4 transition-transform group-hover:-rotate-45" />
          Rewind &amp; retry
        </button>
        <Link href="/" className={ctaSecondaryLg}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
