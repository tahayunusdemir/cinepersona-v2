"use client";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

/**
 * Authentic-looking Google sign-in button. Wired to a toast for now —
 * swap onClick for a real OAuth handler when the integration lands.
 *
 * Visual spec follows Google's brand guidelines: white surface, official
 * G mark, neutral border, hover surface lift.
 */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("size-[18px]", className)}
    >
      <path
        d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.89-1.741 2.981-4.305 2.981-7.351Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.964-.895 6.619-2.422l-3.232-2.51c-.895.6-2.04.955-3.387.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.404 13.9A6.013 6.013 0 0 1 6.09 12c0-.66.114-1.3.314-1.9V7.51H3.064A9.996 9.996 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49l3.34-2.59Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C16.96 2.995 14.695 2 12 2A9.997 9.997 0 0 0 3.064 7.51l3.34 2.59C7.19 7.737 9.395 5.977 12 5.977Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleButton({
  label = "Continue with Google",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        toast("Google sign-in is coming soon.", {
          description: "We're polishing the OAuth integration.",
        })
      }
      className="group relative inline-flex h-11 w-full items-center justify-center gap-3 rounded-full border border-foreground/15 bg-background px-5 text-sm font-medium text-foreground/90 shadow-sm transition-all hover:border-foreground/30 hover:bg-foreground/[0.04] hover:shadow active:translate-y-px focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40 dark:bg-white dark:text-[#1f1f1f] dark:hover:bg-zinc-100"
    >
      <GoogleMark />
      <span className="tracking-tight">{label}</span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-400"
      >
        SSO
      </span>
    </button>
  );
}

export function OAuthDivider({ label = "or continue with email" }: { label?: string }) {
  return (
    <div className="my-7 flex items-center gap-4">
      <div className="h-px flex-1 bg-foreground/10" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}
