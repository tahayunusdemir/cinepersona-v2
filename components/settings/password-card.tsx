"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/auth/password-input";
import {
  updatePasswordAction,
  type SettingsActionState,
} from "@/lib/settings/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: SettingsActionState = {};

export function PasswordCard() {
  const [state, formAction, pending] = useActionState(
    updatePasswordAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    } else if (state?.ok && state.message === "password_updated") {
      toast.success("Password updated.");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Confirm your current password to choose a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} noValidate>
          <FieldGroup>
            <Field
              data-invalid={
                Boolean(state?.fieldErrors?.current_password) || undefined
              }
            >
              <FieldLabel htmlFor="settings-current-password">
                Current password
              </FieldLabel>
              <PasswordInput
                id="settings-current-password"
                name="current_password"
                autoComplete="current-password"
                required
                minLength={8}
                aria-invalid={
                  Boolean(state?.fieldErrors?.current_password) || undefined
                }
              />
              {state?.fieldErrors?.current_password ? (
                <FieldError>{state.fieldErrors.current_password}</FieldError>
              ) : null}
            </Field>

            <Field
              data-invalid={
                Boolean(state?.fieldErrors?.new_password) || undefined
              }
            >
              <FieldLabel htmlFor="settings-new-password">
                New password
              </FieldLabel>
              <PasswordInput
                id="settings-new-password"
                name="new_password"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={
                  Boolean(state?.fieldErrors?.new_password) || undefined
                }
              />
              {state?.fieldErrors?.new_password ? (
                <FieldError>{state.fieldErrors.new_password}</FieldError>
              ) : null}
            </Field>

            <Field
              data-invalid={Boolean(state?.fieldErrors?.confirm) || undefined}
            >
              <FieldLabel htmlFor="settings-confirm-password">
                Confirm new password
              </FieldLabel>
              <PasswordInput
                id="settings-confirm-password"
                name="confirm"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={
                  Boolean(state?.fieldErrors?.confirm) || undefined
                }
              />
              {state?.fieldErrors?.confirm ? (
                <FieldError>{state.fieldErrors.confirm}</FieldError>
              ) : null}
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2Icon className="animate-spin" /> : null}
                Update password
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
