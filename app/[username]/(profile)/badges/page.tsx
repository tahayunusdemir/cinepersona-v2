import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BadgeGrid } from "@/components/badges/badge-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAchievementsForUser } from "@/lib/badges/queries";
import { getProfileByUsername } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

type Params = { username: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `Badges · @${username}` };
}

export default async function ProfileBadgesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;
  const result = await getProfileByUsername(username);
  if (result.kind !== "ok") notFound();

  const supabase = await createClient();
  const { sections, unlockedCount, totalVisible } =
    await getAchievementsForUser(supabase, result.profile.id, {
      includeSecret: result.profile.isSelf,
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-baseline justify-between">
            <span>Achievements</span>
            <span className="font-mono text-xl font-semibold tabular-nums">
              {unlockedCount} / {totalVisible}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {result.profile.isSelf
              ? "Earn badges across watching, discovery and matches. Secret achievements stay hidden until unlocked."
              : `Public badges unlocked by @${username}.`}
          </p>
        </CardContent>
      </Card>

      <BadgeGrid sections={sections} hideSecret={!result.profile.isSelf} />
    </div>
  );
}
