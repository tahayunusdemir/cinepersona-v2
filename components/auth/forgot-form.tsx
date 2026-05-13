"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, Loader2Icon, Mail } from "lucide-react";
import { toast } from "sonner";

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
import { ctaPrimary } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

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
          <FieldLabel
            htmlFor="forgot-email"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Email
          </FieldLabel>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(state?.fieldErrors?.email) || undefined}
              className="h-11 rounded-lg border-foreground/15 bg-foreground/[0.02] pl-10 pr-4 text-[15px] md:text-[15px] placeholder:text-muted-foreground/60"
            />
          </div>
          <FieldDescription className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Link expires in 60 minutes.
          </FieldDescription>
          {state?.fieldErrors?.email ? (
            <FieldError>{state.fieldErrors.email}</FieldError>
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
          {pending ? "Sending…" : "Send reset link"}
          {!pending ? (
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          ) : null}
        </button>
      </FieldGroup>
    </form>
  );
}
