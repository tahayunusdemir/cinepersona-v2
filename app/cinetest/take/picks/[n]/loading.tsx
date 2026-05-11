import { PickGridSkeleton } from "@/components/cinetest/pick-grid-skeleton";

export default function PicksLoading() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <div className="flex gap-2">
          <span className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <span className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <span className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="space-y-2">
          <span className="block h-8 w-2/3 animate-pulse rounded bg-muted" />
          <span className="block h-4 w-1/2 animate-pulse rounded bg-muted/70" />
        </div>
      </header>

      <span className="block h-10 w-full animate-pulse rounded-md bg-muted" />

      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
        <span>Loading…</span>
      </div>

      <PickGridSkeleton count={18} variant="film" />
    </div>
  );
}
