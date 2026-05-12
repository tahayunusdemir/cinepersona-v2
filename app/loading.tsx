export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="relative isolate flex min-h-[60dvh] items-center justify-center overflow-hidden p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--bloom)_0%,var(--bloom)_45%,transparent_72%)] opacity-60 blur-[2px] animate-drift" />
      </div>
      <span className="sr-only">Loading…</span>
      <div className="flex flex-col items-center gap-5">
        <div className="relative size-12">
          <span className="absolute inset-0 rounded-full border-2 border-foreground/10" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#ecb756]" />
          <span className="absolute inset-2 rounded-full bg-[#ecb756]/10" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          Loading reel
        </span>
      </div>
    </div>
  );
}
