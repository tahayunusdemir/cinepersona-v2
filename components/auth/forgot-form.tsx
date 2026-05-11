"use client";

import { useActionState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  forgotAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: AuthActionState = {};

export function ForgotForm() {
  const [state, formAction, pending] = useActionState(
    forgotAction,
    initialState,
  );

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    } else if (state?.ok) {
      toast.success("Password reset link sent to your email.");
    }
  }, [state]);

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
          <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
          />
          <FieldDescription>
            We&apos;ll send a password reset link to this email.
          </FieldDescription>
          {state?.fieldErrors?.email ? (
            <FieldError>{state.fieldErrors.email}</FieldError>
          ) : null}
        </Field>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Send reset link
        </Button>
      </FieldGroup>
    </form>
  );
}
