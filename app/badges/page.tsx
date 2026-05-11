import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { BadgeGrid } from "@/components/badges/badge-grid";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const pct = totalVisible === 0 ? 0 : Math.round((unlockedCount / totalVisible) * 100);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-24 pt-12 sm:px-6">
      <header className="mb-8">
        <Badge variant="secondary" className="mb-3">
          Badges
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your achievements
        </h1>
        <p className="mt-2 text-muted-foreground">
          Earn badges across watching, discovery, matches and rewatching.
          Secret achievements stay hidden until unlocked.
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-baseline justify-between">
            <span>Progress</span>
            <span className="font-mono text-2xl font-semibold tabular-nums">
              {unlockedCount} / {totalVisible}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-foreground/80"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{pct}% unlocked</p>
        </CardContent>
      </Card>

      <BadgeGrid sections={sections} />
    </div>
  );
}
