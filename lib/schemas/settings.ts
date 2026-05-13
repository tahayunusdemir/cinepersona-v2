import { z } from "zod";

const emailField = z.email("Enter a valid email.").trim().toLowerCase();

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be ${max} characters or fewer.`)
    .transform((v) => (v.length === 0 ? null : v))
    .nullable();

const LINK_MAX = 200;

// Accepts a bare host like `instagram.com/foo` and upgrades it to `https://`
// before validating. Rejects non-http(s) schemes (e.g. `javascript:`).
const optionalLink = z
  .string()
  .trim()
  .transform((v) => {
    if (v.length === 0) return "";
    return /^https?:\/\//i.test(v) ? v : `https://${v}`;
  })
  .pipe(
    z
      .string()
      .max(LINK_MAX, `Link must be ${LINK_MAX} characters or fewer.`)
      .refine(
        (v) => v.length === 0 || /^https?:\/\/[^\s]+\.[^\s]+/i.test(v),
        { message: "Enter a valid URL." },
      ),
  )
  .transform((v) => (v.length === 0 ? null : v))
  .nullable();

export const profileSchema = z.object({
  display_name: optionalText(50, "Display name"),
  bio: optionalText(160, "Bio"),
  link: optionalLink,
  location: optionalText(60, "Location"),
});

export const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, "Password must be at least 8 characters."),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.new_password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

export const emailSchema = z.object({
  email: emailField,
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
