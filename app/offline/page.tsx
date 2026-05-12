import { WifiOff } from "lucide-react";


export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="relative isolate flex min-h-[80dvh] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center">


      <div className="mt-7 grid size-16 place-items-center rounded-full border border-foreground/10 bg-foreground/[0.02] text-[#ecb756]">
        <WifiOff className="size-7" />
      </div>

      <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl">
        You’re offline.
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        Reconnect to the internet to continue using CinePersona. We’ll pick up
        right where you left off.
      </p>

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        — Standby for the projector —
      </p>
    </main>
  );
}
