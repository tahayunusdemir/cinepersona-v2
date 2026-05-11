import { z } from "zod";

export const usernameRegex = /^[a-z0-9_]{3,20}$/;

const emailField = z.email("Enter a valid email.").trim().toLowerCase();

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      usernameRegex,
      "Username must be 3–20 characters: lowercase letters, digits, or _.",
    ),
  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const forgotSchema = z.object({
  email: emailField,
});

export const resetSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotInput = z.infer<typeof forgotSchema>;
export type ResetInput = z.infer<typeof resetSchema>;
