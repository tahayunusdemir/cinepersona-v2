import type { Metadata } from "next";
import Link from "next/link";
import { ActivityIcon, FilmIcon } from "lucide-react";

import { CinePersonaCard } from "@/components/profile/cinepersona-card";
import { ComingSoon } from "@/components/profile/coming-soon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-10 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
            <FilmIcon className="size-5" />
          </div>
          <Badge
            variant="outline"
            className="mt-5 border-foreground/15 bg-foreground/[0.02] font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            No CineType yet
          </Badge>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            {result.profile.isSelf
              ? "Take the CineTest to see your type and pin your film picks here."
              : `@${result.profile.username} hasn’t saved a CineType result yet.`}
          </p>
          {result.profile.isSelf ? (
            <Link
              href="/cinetest/take"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 inline-flex h-11 rounded-full bg-[#ecb756] px-6 text-sm font-medium text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]",
              )}
            >
              Take the CineTest
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
