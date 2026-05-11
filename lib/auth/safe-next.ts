export const RECOVERY_COOKIE = "cp_recovery";

const INTERNAL_PATH = /^\/(?!\/)/;

export function safeNext(raw: string | null | undefined): string {
  if (typeof raw !== "string") return "/";
  return INTERNAL_PATH.test(raw) ? raw : "/";
}
