"use client";

import { useActionState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  contactAction,
  type ContactActionState,
} from "@/lib/contact/actions";

const initialState: ContactActionState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    contactAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Message sent. Thanks for reaching out!");
      formRef.current?.reset();
    } else if (state?.error && state.error !== "validation") {
      toast.error("Could not send your message. Please try again.");
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <FieldGroup>
        <Field data-invalid={Boolean(state?.fieldErrors?.name) || undefined}>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <Input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={50}
            required
            aria-invalid={Boolean(state?.fieldErrors?.name) || undefined}
          />
          {state?.fieldErrors?.name ? (
            <FieldError>{state.fieldErrors.name}</FieldError>
          ) : null}
        </Field>

        <Field data-invalid={Boolean(state?.fieldErrors?.email) || undefined}>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <Input
            id="contact-email"
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

        <Field data-invalid={Boolean(state?.fieldErrors?.message) || undefined}>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            rows={5}
            minLength={10}
            maxLength={1000}
            required
            aria-invalid={Boolean(state?.fieldErrors?.message) || undefined}
          />
          {state?.fieldErrors?.message ? (
            <FieldError>{state.fieldErrors.message}</FieldError>
          ) : null}
        </Field>

        <Button
          type="submit"
          disabled={pending}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          Send message
        </Button>
      </FieldGroup>
    </form>
  );
}
