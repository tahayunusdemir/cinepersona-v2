import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";

type Props = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, description, children, footer }: Props) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Top bar — back affordance + brand. */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="size-3 transition-transform group-hover:-translate-x-0.5"
              aria-hidden
            />
            Back
          </Link>
          <SiteLogo size="sm" />
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center px-5 pb-12 pt-28 sm:px-8 sm:pb-16 sm:pt-24">
        <div className="w-full max-w-sm animate-fade-up">
          <h1 className="font-display text-3xl leading-[1.08] tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}

          <div className="mt-9">{children}</div>

          {footer ? (
            <div className="mt-9 border-t border-foreground/10 pt-6 text-sm text-muted-foreground">
              {footer}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
