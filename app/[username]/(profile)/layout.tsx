import { notFound } from "next/navigation";

import { ProfileBanner } from "@/components/profile/profile-banner";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getProfileByUsername } from "@/lib/profile/queries";

export default async function ProfileLayout({
  children,
  params,
}: LayoutProps<"/[username]">) {
  const { username } = await params;
  const result = await getProfileByUsername(username);

  if (result.kind === "not_found") {
    notFound();
  }

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
      <ProfileBanner banner={result.profile.banner} />
      <ProfileHeader profile={result.profile} />
      <div className="mt-6">
        <ProfileTabs username={result.profile.username} />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
