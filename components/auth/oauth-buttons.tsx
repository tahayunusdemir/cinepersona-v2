"use client";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

type Provider = "google" | "apple" | "microsoft";

const PROVIDER_LABEL: Record<Provider, string> = {
  google: "Google",
  apple: "Apple",
  microsoft: "Microsoft",
};

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[18px]", className)}>
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

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[18px] fill-foreground", className)}>
      <path d="M17.564 12.65c-.027-2.74 2.236-4.057 2.336-4.121-1.27-1.857-3.247-2.111-3.948-2.142-1.68-.17-3.28.99-4.135.99-.86 0-2.173-.965-3.575-.939-1.84.027-3.537 1.07-4.483 2.717-1.911 3.314-.487 8.213 1.371 10.9.91 1.317 1.99 2.795 3.404 2.742 1.367-.054 1.882-.886 3.534-.886 1.652 0 2.114.886 3.554.86 1.466-.026 2.396-1.342 3.292-2.665 1.04-1.527 1.467-3.005 1.486-3.082-.033-.014-2.852-1.094-2.879-4.34l.043-.034ZM14.93 4.794c.756-.917 1.265-2.193 1.124-3.46-1.085.044-2.4.722-3.181 1.638-.7.812-1.314 2.111-1.149 3.353 1.21.094 2.45-.614 3.206-1.531Z" />
    </svg>
  );
}

function MicrosoftMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[18px]", className)}>
      <path d="M2 2h9.5v9.5H2V2Z" fill="#F25022" />
      <path d="M12.5 2H22v9.5h-9.5V2Z" fill="#7FBA00" />
      <path d="M2 12.5h9.5V22H2v-9.5Z" fill="#00A4EF" />
      <path d="M12.5 12.5H22V22h-9.5v-9.5Z" fill="#FFB900" />
    </svg>
  );
}

function ProviderMark({ provider }: { provider: Provider }) {
  if (provider === "google") return <GoogleMark />;
  if (provider === "apple") return <AppleMark />;
  return <MicrosoftMark />;
}

function OAuthTile({ provider }: { provider: Provider }) {
  const label = PROVIDER_LABEL[provider];
  return (
    <button
      type="button"
      aria-label={`Continue with ${label}`}
      onClick={() =>
        toast(`${label} sign-in is coming soon.`, {
          description: "We're polishing the OAuth integration.",
        })
      }
      className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-foreground/15 bg-background text-sm text-foreground/80 transition-all hover:border-foreground/30 hover:bg-foreground/[0.04] active:translate-y-px focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <ProviderMark provider={provider} />
      <span className="sr-only sm:not-sr-only sm:text-[13px]">{label}</span>
    </button>
  );
}

export function OAuthGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <OAuthTile provider="google" />
      <OAuthTile provider="apple" />
      <OAuthTile provider="microsoft" />
    </div>
  );
}

export function OAuthDivider({ label = "or continue with" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-4">
      <div className="h-px flex-1 bg-foreground/10" />
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-foreground/10" />
    </div>
  );
}
