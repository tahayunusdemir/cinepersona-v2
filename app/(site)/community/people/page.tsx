import type { Metadata } from "next";
import { UserSearchIcon } from "lucide-react";

import { PaginationBar } from "@/components/community/pagination-bar";
import { PeopleCard } from "@/components/community/people-card";
import { PeopleSearch } from "@/components/community/people-search";
import { SortTabs } from "@/components/community/sort-tabs";
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
import {
  firstParam,
  PAGE_SIZE,
  type PeopleSort,
  type SearchValue,
} from "@/lib/community/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "People",
  description: "Browse the CinePersona community.",
};

type Search = {
  sort?: SearchValue;
  q?: SearchValue;
  page?: SearchValue;
};

const SORTS: PeopleSort[] = ["popular", "new", "active"];

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  last_activity_at: string | null;
};

type StatsRow = {
  id: string;
  followers_count: number;
  following_count: number;
};

// PostgREST `not.in.(uuid1,uuid2,...)` value list. UUIDs are validated by the
// blocks table column type, so direct interpolation is safe here.
function pgUuidList(ids: Iterable<string>): string {
  return `(${[...ids].join(",")})`;
}

// Hard cap on candidates considered for the "popular" sort. Pagination
// beyond this many active users would require a server-side join with
// profile_stats. Bumped above the per-page size so a few full pages work.
const POPULAR_CANDIDATE_CAP = 1000;

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const sortParam = firstParam(sp.sort);
  const pageParam = firstParam(sp.page);
  const qParam = firstParam(sp.q);
  const sort: PeopleSort = SORTS.includes(sortParam as PeopleSort)
    ? (sortParam as PeopleSort)
    : "popular";
  const page = Math.max(1, Number(pageParam) || 1);
  const rawQ = (qParam ?? "").trim();
  // PostgREST .or() splits on commas and treats parentheses as grouping.
  // Strip them from user input so the filter expression stays well-formed
  // and untrusted text can't smuggle additional filters.
  const q = rawQ.length >= 2 ? rawQ.replace(/[,()]/g, "") : "";

  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  const blockedIds = await getViewerBlockedIds(supabase, viewerId);

  const blockList = blockedIds.size > 0 ? pgUuidList(blockedIds) : null;

  // Total count — must apply the same block filter so pageCount matches the
  // actual number of rows we'll render.
  let countQuery = supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .is("deactivated_at", null);
  if (q) {
    countQuery = countQuery.or(
      `username.ilike.%${q}%,display_name.ilike.%${q}%`,
    );
  }
  if (blockList) {
    countQuery = countQuery.not("id", "in", blockList);
  }
  const { count: rawCount } = await countQuery;
  const baseTotal = rawCount ?? 0;
  // For "popular" we paginate over a hard-capped candidate window; clamp
  // the visible total so pagination doesn't promise pages we cannot serve.
  const total =
    sort === "popular"
      ? Math.min(baseTotal, POPULAR_CANDIDATE_CAP)
      : baseTotal;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let baseQuery = supabase
    .from("profiles")
    .select(
      "id, username, display_name, avatar_url, bio, created_at, last_activity_at",
    )
    .is("deactivated_at", null);

  if (q) {
    baseQuery = baseQuery.or(
      `username.ilike.%${q}%,display_name.ilike.%${q}%`,
    );
  }
  if (blockList) {
    baseQuery = baseQuery.not("id", "in", blockList);
  }

  if (sort === "new") {
    baseQuery = baseQuery
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, to);
  } else if (sort === "active") {
    baseQuery = baseQuery
      .order("last_activity_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, to);
  }

  let rows: ProfileRow[] = [];

  if (sort === "popular") {
    // Materialize the candidate window, join profile_stats, sort by
    // followers_count, then slice the page locally. The cap above keeps
    // this bounded; once the directory outgrows it we'll move to an RPC.
    const candidates = await baseQuery
      .order("created_at", { ascending: false })
      .limit(POPULAR_CANDIDATE_CAP);
    const all = (candidates.data ?? []) as ProfileRow[];
    if (all.length > 0) {
      const { data: stats } = await supabase
        .from("profile_stats")
        .select("id, followers_count, following_count")
        .in(
          "id",
          all.map((p) => p.id),
        );
      const statsMap = new Map<string, StatsRow>();
      for (const s of (stats ?? []) as StatsRow[]) statsMap.set(s.id, s);
      const sorted = all.sort((a, b) => {
        const ac = statsMap.get(a.id)?.followers_count ?? 0;
        const bc = statsMap.get(b.id)?.followers_count ?? 0;
        if (bc !== ac) return bc - ac;
        return b.created_at.localeCompare(a.created_at);
      });
      rows = sorted.slice(from, to + 1);
    }
  } else {
    const { data } = await baseQuery;
    rows = (data ?? []) as ProfileRow[];
  }

  // Stats join for visible rows
  let statsByUser = new Map<string, StatsRow>();
  if (rows.length > 0) {
    const { data: stats } = await supabase
      .from("profile_stats")
      .select("id, followers_count, following_count")
      .in(
        "id",
        rows.map((r) => r.id),
      );
    statsByUser = new Map(
      ((stats ?? []) as StatsRow[]).map((s) => [s.id, s]),
    );
  }

  const followingIds = await getViewerFollowingIds(supabase, viewerId);

  return (
    <div>
      <header className="mb-8">
        <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
          People.
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Find members to follow on CinePersona.
        </p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PeopleSearch />
        <SortTabs
          items={[
            { value: "popular", label: "Popular" },
            { value: "new", label: "New" },
            { value: "active", label: "Active" },
          ]}
          active={sort}
          baseHref="/community/people"
          searchParams={{ sort: sortParam, q: qParam }}
        />
      </div>

      {rows.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UserSearchIcon />
            </EmptyMedia>
            <EmptyTitle>
              {q ? "No matching users" : "No users yet"}
            </EmptyTitle>
            <EmptyDescription>
              {q
                ? "Try a different search term or sort."
                : "Be the first to post and grow the community."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map((p) => {
            const s = statsByUser.get(p.id);
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
                  isBlockedByViewer={blockedIds.has(p.id)}
                />
              </li>
            );
          })}
        </ul>
      )}

      <PaginationBar
        page={page}
        pageCount={pageCount}
        baseHref="/community/people"
        searchParams={{
          ...(sort !== "popular" ? { sort } : {}),
          ...(q ? { q } : {}),
        }}
      />
    </div>
  );
}
