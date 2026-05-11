export type AuthErrorKey =
  | "invalid_credentials"
  | "current_password_invalid"
  | "email_exists"
  | "username_taken"
  | "weak_password"
  | "invalid_link"
  | "rate_limited"
  | "network"
  | "unknown";

export const authErrorMessages: Record<AuthErrorKey, string> = {
  invalid_credentials: "Incorrect email or password.",
  current_password_invalid: "Current password is incorrect.",
  email_exists: "This email is already registered.",
  username_taken: "That username is already taken.",
  weak_password: "Password is too weak.",
  invalid_link: "Link is invalid or has expired.",
  rate_limited: "Too many attempts. Please wait a bit and try again.",
  network: "Network error, please try again.",
  unknown: "Something went wrong.",
};

type SupabaseLikeError = {
  code?: string | null;
  message?: string | null;
  status?: number | null;
  name?: string | null;
};

export function mapAuthError(error: SupabaseLikeError | null | undefined): AuthErrorKey {
  if (!error) return "unknown";

  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  const name = (error.name ?? "").toLowerCase();

  if (
    code === "invalid_credentials" ||
    code === "invalid_grant" ||
    message.includes("invalid login credentials")
  ) {
    return "invalid_credentials";
  }

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already registered")
  ) {
    return "email_exists";
  }

  if (code === "weak_password" || message.includes("password is too weak")) {
    return "weak_password";
  }

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    code === "too_many_requests" ||
    error.status === 429 ||
    message.includes("rate limit") ||
    message.includes("too many")
  ) {
    return "rate_limited";
  }

  if (
    code === "otp_expired" ||
    code === "otp_disabled" ||
    code === "flow_state_expired" ||
    code === "flow_state_not_found" ||
    code === "bad_code_verifier" ||
    message.includes("invalid flow state") ||
    message.includes("code verifier") ||
    message.includes("expired") ||
    message.includes("invalid token")
  ) {
    return "invalid_link";
  }

  if (
    name === "typeerror" ||
    name === "fetcherror" ||
    message.includes("failed to fetch") ||
    message.includes("network")
  ) {
    return "network";
  }

  return "unknown";
}
