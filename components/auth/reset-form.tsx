"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import {
  resetAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";
import { ctaPrimary } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};
const fieldClass =
  "h-11 rounded-lg border-foreground/15 bg-foreground/[0.02] px-4 text-[15px] md:text-[15px] placeholder:text-muted-foreground/60";
const fieldLabel =
  "font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground";

export function ResetForm() {
  const [state, formAction, pending] = useActionState(
    resetAction,
    initialState,
  );

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    }
  }, [state]);

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(state?.fieldErrors?.password) || undefined}>
          <FieldLabel htmlFor="reset-password" className={fieldLabel}>
            New password
          </FieldLabel>
          <PasswordInput
            id="reset-password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
            className={fieldClass}
          />
          {state?.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(state?.fieldErrors?.confirm) || undefined}>
          <FieldLabel htmlFor="reset-confirm" className={fieldLabel}>
            Confirm new password
          </FieldLabel>
          <PasswordInput
            id="reset-confirm"
            name="confirm"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            required
            aria-invalid={Boolean(state?.fieldErrors?.confirm) || undefined}
            className={fieldClass}
          />
          {state?.fieldErrors?.confirm ? (
            <FieldError>{state.fieldErrors.confirm}</FieldError>
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
          {pending ? "Updating…" : "Update password"}
          {!pending ? (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          ) : null}
        </button>
      </FieldGroup>
    </form>
  );
}
