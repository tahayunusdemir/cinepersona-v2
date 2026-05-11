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
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/auth/password-input";
import {
  loginAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: AuthActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    }
  }, [state]);

  return (
    <form action={formAction} noValidate>
      <FieldGroup>
        {next ? <input type="hidden" name="next" value={next} /> : null}

        <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
          <FieldLabel htmlFor="login-email">Email</FieldLabel>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
          />
          {state?.fieldErrors?.email ? (
            <FieldError>{state.fieldErrors.email}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(state?.fieldErrors?.password) || undefined}>
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <PasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            required
            aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
          />
          {state?.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Sign in
        </Button>
      </FieldGroup>
    </form>
  );
}
