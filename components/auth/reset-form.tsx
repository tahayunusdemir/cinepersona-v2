"use client";

import { useActionState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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

const initialState: AuthActionState = {};

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
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <PasswordInput
            id="reset-password"
            name="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
          />
          {state?.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(state?.fieldErrors?.confirm) || undefined}>
          <FieldLabel htmlFor="reset-confirm">Confirm new password</FieldLabel>
          <PasswordInput
            id="reset-confirm"
            name="confirm"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(state?.fieldErrors?.confirm) || undefined}
          />
          {state?.fieldErrors?.confirm ? (
            <FieldError>{state.fieldErrors.confirm}</FieldError>
          ) : null}
        </Field>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Update password
        </Button>
      </FieldGroup>
    </form>
  );
}
