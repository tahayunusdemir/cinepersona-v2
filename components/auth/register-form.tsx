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
import { PasswordInput } from "@/components/auth/password-input";
import {
  registerAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: AuthActionState = {};

export function RegisterForm() {
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
    <form action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(state?.fieldErrors?.username) || undefined}>
          <FieldLabel htmlFor="register-username">Username</FieldLabel>
          <Input
            id="register-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            aria-invalid={Boolean(state?.fieldErrors?.username) || undefined}
          />
          <FieldDescription>
            3–20 characters: lowercase letters, digits, or _. Cannot be changed later.
          </FieldDescription>
          {state?.fieldErrors?.username ? (
            <FieldError>{state.fieldErrors.username}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
          <FieldLabel htmlFor="register-email">Email</FieldLabel>
          <Input
            id="register-email"
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
          <FieldLabel htmlFor="register-password">Password</FieldLabel>
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(state?.fieldErrors?.password) || undefined}
          />
          {state?.fieldErrors?.password ? (
            <FieldError>{state.fieldErrors.password}</FieldError>
          ) : null}
        </Field>

        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Create account
        </Button>
      </FieldGroup>
    </form>
  );
}
