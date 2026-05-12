import Link from "next/link";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { authErrorMessages, type AuthErrorKey } from "@/lib/auth/errors";

export const metadata: Metadata = { title: "Sign in" };

const VALID_ERROR_KEYS = new Set<AuthErrorKey>([
  "invalid_credentials",
  "invalid_link",
  "network",
  "unknown",
]);

function pickFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const next = pickFirst(params.next);
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : undefined;

  const errorParam = pickFirst(params.error) as AuthErrorKey | undefined;
  const initialError =
    errorParam && VALID_ERROR_KEYS.has(errorParam)
      ? authErrorMessages[errorParam]
      : undefined;

  return (
    <AuthShell
      title="Welcome back."
      description="Sign in to pick up where you left off."
      footer={
        <span>
          New here?{" "}
          <Link
            href={safeNext ? `/register?next=${encodeURIComponent(safeNext)}` : "/register"}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
          .
        </span>
      }
    >
      {initialError ? (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {initialError}
        </p>
      ) : null}

      <LoginForm next={safeNext} />
    </AuthShell>
  );
}
