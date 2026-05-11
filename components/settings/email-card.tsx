"use client";

import { useActionState, useEffect } from "react";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  updateEmailAction,
  type SettingsActionState,
} from "@/lib/settings/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: SettingsActionState = {};

type Props = {
  initialEmail: string;
};

export function EmailCard({ initialEmail }: Props) {
  const [state, formAction, pending] = useActionState(
    updateEmailAction,
    initialState,
  );

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    } else if (state?.ok && state.message === "email_updated") {
      toast.success("Email updated.");
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>
          The email address you use to sign in to CinePersona.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} noValidate>
          <FieldGroup>
            <Field
              data-invalid={Boolean(state?.fieldErrors?.email) || undefined}
            >
              <FieldLabel htmlFor="settings-email">Email</FieldLabel>
              <Input
                id="settings-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={initialEmail}
                aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
              />
              <FieldDescription>
                The change is applied immediately — no confirmation email is
                sent. Use the new address the next time you sign in.
              </FieldDescription>
              {state?.fieldErrors?.email ? (
                <FieldError>{state.fieldErrors.email}</FieldError>
              ) : null}
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2Icon className="animate-spin" /> : null}
                Update email
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
