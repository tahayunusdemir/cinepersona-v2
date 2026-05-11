import type { Metadata } from "next";
import Link from "next/link";
import { ActivityIcon, FilmIcon } from "lucide-react";

import { CinePersonaCard } from "@/components/profile/cinepersona-card";
import { ComingSoon } from "@/components/profile/coming-soon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCinePersonaForUser } from "@/lib/profile/cinepersona-queries";
import {
  getProfileByUsername,
  profileHeading,
} from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[username]">): Promise<Metadata> {
  const { username } = await params;
  const result = await getProfileByUsername(username);
  if (result.kind !== "ok") {
    return { title: "Profile not found" };
  }
  const heading = profileHeading(result.profile.displayName, username);
  return {
    title: `${heading} (@${result.profile.username})`,
    description:
      result.profile.bio?.trim() ||
      `${heading}'s profile on CinePersona.`,
    openGraph: {
      title: `${heading} (@${result.profile.username})`,
      description:
        result.profile.bio?.trim() || `${heading}'s profile on CinePersona.`,
      type: "profile",
    },
  };
}

export default async function ProfileOverviewPage({
  params,
}: PageProps<"/[username]">) {
  const { username } = await params;
  const result = await getProfileByUsername(username);
  if (result.kind !== "ok") {
    return (
      <ComingSoon
        icon={ActivityIcon}
        title="Profile not found"
        description="This profile may have been removed."
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const viewerId = user?.id ?? null;

  const cinepersona = await getCinePersonaForUser(result.profile.id, viewerId);

  return (
    <div className="space-y-6">
      {cinepersona ? (
        <CinePersonaCard
          typeCode={cinepersona.typeCode}
          axisPercents={cinepersona.axisPercents}
          picks={cinepersona.picks}
          picksVisible={cinepersona.picksVisible}
          isSelf={result.profile.isSelf}
          username={result.profile.username}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <FilmIcon className="size-8 text-muted-foreground" />
            <div className="space-y-1">
              <Badge variant="secondary">No CineType yet</Badge>
              <p className="text-sm text-muted-foreground">
                {result.profile.isSelf
                  ? "Take the CineTest to see your type and pin your film picks here."
                  : `@${result.profile.username} hasn't saved a CineType result yet.`}
              </p>
            </div>
            {result.profile.isSelf ? (
              <Link
                href="/cinetest/take"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Take the CineTest
              </Link>
            ) : null}
          </CardContent>
        </Card>
      )}

      <ComingSoon
        icon={ActivityIcon}
        title="Activity feed"
        description="Recent reviews, lists, and ratings will appear here once the films section ships."
      />
    </div>
  );
}
