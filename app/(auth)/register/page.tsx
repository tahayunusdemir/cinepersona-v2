import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { DemoLoginButton } from "@/components/auth/demo-login-button";
import { OAuthDivider, OAuthGrid } from "@/components/auth/oauth-buttons";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Sign up" };

type SearchParams = Promise<{ next?: string | string[] }>;

function pickFirst(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = pickFirst(params.next);
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;
  const signInHref = safeNext
    ? `/login?next=${encodeURIComponent(safeNext)}`
    : "/login";

  return (
    <AuthShell
      title="Find your CineType."
      description="Twelve picks, forty-eight statements, one profile."
      footer={
        <span>
          Already have an account?{" "}
          <Link
            href={signInHref}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
          .
        </span>
      }
    >
      <DemoLoginButton next={safeNext} />

      <div className="my-7 flex items-center gap-4">
        <div className="h-px flex-1 bg-foreground/10" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          or create your own account
        </span>
        <div className="h-px flex-1 bg-foreground/10" />
      </div>

      <RegisterForm next={safeNext} />

      <OAuthDivider />
      <OAuthGrid />
    </AuthShell>
  );
}
