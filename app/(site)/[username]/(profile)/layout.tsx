import { notFound } from "next/navigation";

import { ProfileBanner } from "@/components/profile/profile-banner";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getProfileByUsername } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

export default async function ProfileLayout({
  children,
  params,
}: LayoutProps<"/[username]">) {
  const { username } = await params;
  const result = await getProfileByUsername(username);

  if (result.kind === "not_found") {
    notFound();
  }

  const hasBanner = Boolean(result.profile.banner?.posterPath);

  return (
    <div className="mx-auto w-full max-w-4xl pb-24">
      {hasBanner ? <ProfileBanner banner={result.profile.banner} /> : null}
      <div
        className={cn(
          "px-4 sm:px-6",
          hasBanner ? "-mt-16 sm:-mt-24" : "pt-12",
        )}
      >
        <ProfileHeader profile={result.profile} />
        <div className="mt-6">
          <ProfileTabs username={result.profile.username} />
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
