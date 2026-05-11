"use server";

import { contactSchema } from "@/lib/schemas/contact";
import { createClient } from "@/lib/supabase/server";

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactActionState = {
  ok?: boolean;
  error?: "validation" | "unknown";
  fieldErrors?: ContactFieldErrors;
};

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[],
): ContactFieldErrors {
  const out: ContactFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0]?.toString() as keyof ContactFieldErrors | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export async function contactAction(
  _prev: ContactActionState | undefined,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "validation",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return { ok: false, error: "unknown" };
  }

  return { ok: true };
}
