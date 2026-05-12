"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleButton, OAuthDivider } from "@/components/auth/oauth-buttons";
import {
  loginAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";
import { ctaPrimary } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};
const fieldClass =
  "h-11 rounded-lg border-foreground/15 bg-foreground/[0.02] px-4 text-[15px] md:text-[15px] placeholder:text-muted-foreground/60";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    }
  }, [state]);

  return (
    <div className="space-y-1">
      <GoogleButton />
      <OAuthDivider />

      <form action={formAction} noValidate>
        <FieldGroup>
          {next ? <input type="hidden" name="next" value={next} /> : null}

          <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
            <FieldLabel
              htmlFor="login-email"
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
            >
              Email
            </FieldLabel>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
              className={fieldClass}
            />
            {state?.fieldErrors?.email ? (
              <FieldError>{state.fieldErrors.email}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={Boolean(state?.fieldErrors?.password) || undefined}>
            <div className="flex items-baseline justify-between">
              <FieldLabel
                htmlFor="login-password"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
              >
                Forgot?
              </Link>
            </div>
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
              className={fieldClass}
            />
            {state?.fieldErrors?.password ? (
              <FieldError>{state.fieldErrors.password}</FieldError>
            ) : null}
          </Field>

          <button
            type="submit"
            disabled={pending}
            className={cn(
              ctaPrimary,
              "group mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : null}
            {pending ? "Signing in…" : "Sign in"}
            {!pending ? (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </button>
        </FieldGroup>
      </form>
    </div>
  );
}
