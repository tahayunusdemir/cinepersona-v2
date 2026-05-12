"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, AtSign, Loader2Icon, User } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleButton, OAuthDivider } from "@/components/auth/oauth-buttons";
import {
  registerAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";
import { ctaPrimary } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};
const fieldClass =
  "h-11 rounded-lg border-foreground/15 bg-foreground/[0.02] pl-10 pr-4 text-[15px] md:text-[15px] placeholder:text-muted-foreground/60";
const fieldClassPlain =
  "h-11 rounded-lg border-foreground/15 bg-foreground/[0.02] px-4 text-[15px] md:text-[15px] placeholder:text-muted-foreground/60";
const fieldLabel =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground";

export function RegisterForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    }
  }, [state]);

  return (
    <div className="space-y-1">
      <GoogleButton label="Sign up with Google" />
      <OAuthDivider />

      <form action={formAction} noValidate>
        <FieldGroup>
          {next ? <input type="hidden" name="next" value={next} /> : null}

          <Field data-invalid={Boolean(state?.fieldErrors?.username) || undefined}>
            <FieldLabel htmlFor="register-username" className={fieldLabel}>
              Username
            </FieldLabel>
            <div className="relative">
              <User
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="cinephile_42"
                required
                aria-invalid={Boolean(state?.fieldErrors?.username) || undefined}
                className={fieldClass}
              />
            </div>
            <FieldDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              3–20 chars · lowercase, digits, _ · permanent
            </FieldDescription>
            {state?.fieldErrors?.username ? (
              <FieldError>{state.fieldErrors.username}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
            <FieldLabel htmlFor="register-email" className={fieldLabel}>
              Email
            </FieldLabel>
            <div className="relative">
              <AtSign
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
                className={fieldClass}
              />
            </div>
            {state?.fieldErrors?.email ? (
              <FieldError>{state.fieldErrors.email}</FieldError>
            ) : null}
          </Field>

          <Field data-invalid={Boolean(state?.fieldErrors?.password) || undefined}>
            <FieldLabel htmlFor="register-password" className={fieldLabel}>
              Password
            </FieldLabel>
            <PasswordInput
              id="register-password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              required
              aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
              className={fieldClassPlain}
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
            {pending ? "Creating account…" : "Create account"}
            {!pending ? (
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            ) : null}
          </button>
        </FieldGroup>
      </form>
    </div>
  );
}
