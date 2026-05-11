import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountCard } from "@/components/settings/account-card";
import { BannerCard } from "@/components/settings/banner-card";
import { CommunityCard } from "@/components/settings/community-card";
import { EmailCard } from "@/components/settings/email-card";
import { PasswordCard } from "@/components/settings/password-card";
import { ProfileCard } from "@/components/settings/profile-card";
import type { BannerFilmRow } from "@/lib/settings/banner-search";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect("/login?next=/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, link, banner_movie_id")
    .eq("id", userData.user.id)
    .maybeSingle<{
      username: string;
      display_name: string | null;
      bio: string | null;
      link: string | null;
      banner_movie_id: number | null;
    }>();

  if (!profile) {
    // handle_new_user trigger guarantees a row; only reachable if cascading
    // delete left an orphan session.
    redirect("/login");
  }

  let bannerFilm: BannerFilmRow | null = null;
  if (profile.banner_movie_id) {
    const { data: movie } = await supabase
      .from("movies")
      .select("id, tmdb_id, title, release_date, poster_path")
      .eq("id", profile.banner_movie_id)
      .maybeSingle<BannerFilmRow>();
    bannerFilm = movie ?? null;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Manage your profile, sign-in details, and account.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <ProfileCard
          username={profile.username}
          initialDisplayName={profile.display_name}
          initialBio={profile.bio}
          initialLink={profile.link}
        />
        <BannerCard initial={bannerFilm} />
        <PasswordCard />
        <EmailCard initialEmail={userData.user.email ?? ""} />
        <CommunityCard />
        <AccountCard />
      </div>
    </main>
  );
}
