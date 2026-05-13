"use client";

import { useFormStatus } from "react-dom";
import { Loader2Icon, PlayIcon } from "lucide-react";

import { demoLoginAction } from "@/lib/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-foreground/15 bg-foreground/[0.03] px-5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-foreground/30 hover:bg-foreground/[0.06] hover:shadow active:translate-y-px focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
      ) : (
        <PlayIcon className="size-4" aria-hidden />
      )}
      <span className="tracking-tight">Try the demo account</span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        One-click
      </span>
    </button>
  );
}

export function DemoLoginButton({ next }: { next?: string }) {
  return (
    <form action={demoLoginAction}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <SubmitButton />
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Pre-loaded profile, watchlist, matches, and threads.
      </p>
    </form>
  );
}
