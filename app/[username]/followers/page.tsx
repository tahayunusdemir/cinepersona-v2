import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, UserSearchIcon } from "lucide-react";

import { PaginationBar } from "@/components/community/pagination-bar";
import { PeopleCard } from "@/components/community/people-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  getViewerBlockedIds,
  getViewerFollowingIds,
  getViewerId,
} from "@/lib/community/queries";
import { PAGE_SIZE } from "@/lib/community/types";
import { profileHeading } from "@/lib/profile/queries";
import { createClient } from "@/lib/supabase/server";

type Params = { username: string };
type Search = { page?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: `Followers · @${username}`, robots: { index: false } };
}

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type StatsRow = {
  id: string;
  followers_count: number;
  following_count: number;
};

function pgUuidList(ids: Iterable<string>): string {
  return `(${[...ids].join(",")})`;
}

export default async function FollowersPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { username } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const supabase = await createClient();
  const { data: target } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .is("deactivated_at", null)
    .maybeSingle<{
      id: string;
      username: string;
      display_name: string | null;
    }>();
  if (!target) notFound();

  const viewerId = await getViewerId(supabase);
  const blockedIds = await getViewerBlockedIds(supabase, viewerId);
  const followingIds = await getViewerFollowingIds(supabase, viewerId);

  let countQuery = supabase
    .from("follows")
    .select("follower_id", { count: "exact", head: true })
    .eq("following_id", target.id);
  if (blockedIds.size > 0) {
    countQuery = countQuery.not(
      "follower_id",
      "in",
      pgUuidList(blockedIds),
    );
  }
  const { count } = await countQuery;
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let edgesQuery = supabase
    .from("follows")
    .select("follower_id, created_at")
    .eq("following_id", target.id)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (blockedIds.size > 0) {
    edgesQuery = edgesQuery.not(
      "follower_id",
      "in",
      pgUuidList(blockedIds),
    );
  }
  const { data: edges } = await edgesQuery;

  const ids = ((edges ?? []) as { follower_id: string }[]).map(
    (r) => r.follower_id,
  );

  let people: ProfileRow[] = [];
  let statsMap = new Map<string, StatsRow>();
  if (ids.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, bio")
      .in("id", ids)
      .is("deactivated_at", null);
    people = (profiles ?? []) as ProfileRow[];
    const order = new Map(ids.map((id, i) => [id, i]));
    people.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    if (people.length > 0) {
      const { data: stats } = await supabase
        .from("profile_stats")
        .select("id, followers_count, following_count")
        .in(
          "id",
          people.map((p) => p.id),
        );
      statsMap = new Map(((stats ?? []) as StatsRow[]).map((s) => [s.id, s]));
    }
  }

  const heading = profileHeading(target.display_name, target.username);

  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
        <header className="mb-8">
          <Link
            href={`/${target.username}`}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
          >
            <ArrowLeftIcon className="size-3" />
            {heading}
          </Link>
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
            Followers ·{" "}
            <span className="text-[#ecb756]">{total}</span>
          </h1>
        </header>

      {people.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserSearchIcon />
            </EmptyMedia>
            <EmptyTitle>No followers yet</EmptyTitle>
            <EmptyDescription>
              When members follow this user, they will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="space-y-3">
          {people.map((p) => {
            const s = statsMap.get(p.id);
            return (
              <li key={p.id}>
                <PeopleCard
                  user={{
                    id: p.id,
                    username: p.username,
                    display_name: p.display_name,
                    avatar_url: p.avatar_url,
                    bio: p.bio,
                    followers_count: s?.followers_count ?? 0,
                    following_count: s?.following_count ?? 0,
                  }}
                  viewerId={viewerId}
                  isFollowing={followingIds.has(p.id)}
                  isBlockedByViewer={false}
                />
              </li>
            );
          })}
        </ul>
      )}

        <PaginationBar
          page={page}
          pageCount={pageCount}
          baseHref={`/${target.username}/followers`}
        />
      </div>
    </div>
  );
}
