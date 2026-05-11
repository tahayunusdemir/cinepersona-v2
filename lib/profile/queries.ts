import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type ProfileBanner = {
  posterPath: string | null;
  title: string;
};

export type ProfileViewModel = {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  link: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  followersCount: number;
  followingCount: number;
  isSelf: boolean;
  isAuth: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  banner: ProfileBanner | null;
};

export type ProfileFetchResult =
  | { kind: "ok"; profile: ProfileViewModel }
  | { kind: "not_found" };

export const getProfileByUsername = cache(_getProfileByUsername);

async function _getProfileByUsername(
  username: string,
): Promise<ProfileFetchResult> {
  const supabase = await createClient();

  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, username, display_name, bio, link, avatar_url, is_admin, deactivated_at, banner:movies!profiles_banner_movie_id_fkey(title, poster_path)",
    )
    .eq("username", username)
    .maybeSingle<{
      id: string;
      username: string;
      display_name: string | null;
      bio: string | null;
      link: string | null;
      avatar_url: string | null;
      is_admin: boolean;
      deactivated_at: string | null;
      banner:
        | { title: string; poster_path: string | null }
        | { title: string; poster_path: string | null }[]
        | null;
    }>();

  if (profileError || !profileRow) return { kind: "not_found" };

  const bannerRow = Array.isArray(profileRow.banner)
    ? (profileRow.banner[0] ?? null)
    : profileRow.banner;
  const banner: ProfileBanner | null =
    bannerRow && bannerRow.poster_path
      ? { posterPath: bannerRow.poster_path, title: bannerRow.title }
      : null;

  const { data: userData } = await supabase.auth.getUser();
  const viewerId = userData.user?.id ?? null;
  const isSelf = viewerId === profileRow.id;

  if (profileRow.deactivated_at && !isSelf) return { kind: "not_found" };

  // Spec §7.2: when the profile owner has blocked the viewer, the profile
  // page still opens — the viewer must not learn about the block. We render
  // the profile as-is and rely on RLS to silently reject any interaction.

  const { data: stats } = await supabase
    .from("profile_stats")
    .select("followers_count, following_count")
    .eq("id", profileRow.id)
    .maybeSingle();

  let isFollowing = false;
  let isBlocked = false;

  if (viewerId && !isSelf) {
    const [{ data: follow }, { data: block }] = await Promise.all([
      supabase
        .from("follows")
        .select("follower_id")
        .eq("follower_id", viewerId)
        .eq("following_id", profileRow.id)
        .maybeSingle(),
      supabase
        .from("blocks")
        .select("blocker_id")
        .eq("blocker_id", viewerId)
        .eq("blocked_id", profileRow.id)
        .maybeSingle(),
    ]);
    isFollowing = Boolean(follow);
    isBlocked = Boolean(block);
  }

  return {
    kind: "ok",
    profile: {
      id: profileRow.id,
      username: profileRow.username,
      displayName: profileRow.display_name,
      bio: profileRow.bio,
      avatarUrl: profileRow.avatar_url,
      isAdmin: profileRow.is_admin,
      followersCount: Number(stats?.followers_count ?? 0),
      followingCount: Number(stats?.following_count ?? 0),
      isSelf,
      isAuth: Boolean(viewerId),
      isFollowing,
      isBlocked,
      banner,
    },
  };
}

export function profileInitials(
  displayName: string | null | undefined,
  username: string,
): string {
  const source = (displayName ?? "").trim() || username;
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return letters || username.slice(0, 1).toUpperCase() || "?";
}

export function profileHeading(
  displayName: string | null | undefined,
  username: string,
): string {
  const trimmed = (displayName ?? "").trim();
  return trimmed || `@${username}`;
}
