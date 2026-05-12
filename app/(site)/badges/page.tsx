import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FrameTag } from "@/components/cinema/atoms";
import { BadgeGrid } from "@/components/badges/badge-grid";
import { getAchievementsForUser } from "@/lib/badges/queries";
import { getViewerId } from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Badges",
  description:
    "Track your achievements across genres, eras, discovery, matches and more.",
};

export default async function BadgesPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) {
    redirect("/login?next=/badges");
  }

  const { sections, unlockedCount, totalVisible } =
    await getAchievementsForUser(supabase, viewerId, { includeSecret: true });

  const pct =
    totalVisible === 0 ? 0 : Math.round((unlockedCount / totalVisible) * 100);

  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <header className="mb-10">
          <h1 className="mt-4 font-display text-balance text-4xl tracking-tight sm:text-5xl">
            Your{" "}
            <span className="text-[#ecb756]">badges.</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Earn badges across watching, discovery, matches and rewatching.
            Secret achievements stay hidden until unlocked.
          </p>
        </header>

        {/* Progress card */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-[#ecb756]/20 bg-gradient-to-br from-panel-2 to-panel p-7 sm:p-8">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 size-72 rounded-full bg-[#ecb756]/10 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <FrameTag>Progress</FrameTag>
              <h2 className="mt-3 font-display text-2xl tracking-tight">
                Collection complete
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pct}% unlocked — keep watching, keep matching.
              </p>
            </div>
            <div className="text-right">
              <div className="font-display text-5xl leading-none text-[#ecb756] tabular-nums sm:text-6xl">
                {unlockedCount}
                <span className="text-foreground/30"> / {totalVisible}</span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Earned
              </div>
            </div>
          </div>

          <div
            className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ecb756] to-[#f3cd84]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <BadgeGrid sections={sections} />
      </div>
    </div>
  );
}
