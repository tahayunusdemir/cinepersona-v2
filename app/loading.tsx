export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-dvh items-center justify-center p-8"
    >
      <span className="sr-only">Loading…</span>
      <span
        aria-hidden="true"
        className="size-6 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
      />
    </div>
  );
}
