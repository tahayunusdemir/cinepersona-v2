import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, MessageSquareIcon, UserIcon } from "lucide-react";

import { ConsentButton } from "@/components/cinematch/consent-button";
import { HideMatchButton } from "@/components/cinematch/hide-button";
import { MatchAxisRow } from "@/components/cinematch/match-axis-row";
import { PicksCard } from "@/components/cinematch/picks-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axes as cinepersonaAxes } from "@/lib/cinepersona";
import {
  getMatchDetail,
  getMoviesByTmdbIds,
  getViewerId,
  poolWindowLabel,
} from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Match · CineMatch",
};

type Params = { id: string };

export default async function CineMatchDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) redirect(`/login?next=/cine-match/${id}`);

  const detail = await getMatchDetail(supabase, id, viewerId);
  if (!detail) notFound();

  const partner = detail.partner;
  const username = partner.username ?? "deleted";
  const display = partner.display_name?.trim() || `@${username}`;
  const ownGranted = detail.viewer_consented;

  const breakdown = detail.breakdown;

  const allTmdbIds = Array.from(
    new Set([
      ...breakdown.picks.self,
      ...breakdown.picks.other,
      ...breakdown.picks.shared,
      ...breakdown.watched.top_shared_tmdb_ids,
    ]),
  );
  const movies = await getMoviesByTmdbIds(supabase, allTmdbIds);
  const byTmdb = new Map(movies.map((m) => [m.tmdb_id, m]));
  const sharedSet = new Set(breakdown.picks.shared);
  const selfOnly = breakdown.picks.self
    .filter((id) => !sharedSet.has(id))
    .map((id) => byTmdb.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const otherOnly = breakdown.picks.other
    .filter((id) => !sharedSet.has(id))
    .map((id) => byTmdb.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const shared = breakdown.picks.shared
    .map((id) => byTmdb.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const sharedWatched = breakdown.watched.top_shared_tmdb_ids
    .map((id) => byTmdb.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <Link
        href="/cine-match/matches"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" /> My matches
      </Link>

      <header className="flex items-start gap-4">
        <Avatar className="size-14 shrink-0">
          <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
          <AvatarFallback />
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{display}</h1>
            <span className="text-sm text-muted-foreground">@{username}</span>
            {partner.type_code ? (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {partner.type_code}
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {poolWindowLabel(detail.pool)} pool
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-3xl font-semibold tabular-nums">
            {detail.similarity_pct}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            similarity
          </div>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ConsentButton
          matchId={detail.id}
          ownGranted={ownGranted}
          bothConsented={detail.both_consented}
        />
        {detail.both_consented ? (
          <Link
            href={`/cine-match/${detail.id}/messages`}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            <MessageSquareIcon className="size-4" />
            Open chat
            {detail.unread_count > 0 ? (
              <Badge
                variant="default"
                className="ml-1 px-1.5 text-[10px]"
              >
                {detail.unread_count}
              </Badge>
            ) : null}
          </Link>
        ) : null}
        {partner.username ? (
          <Link
            href={`/${partner.username}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <UserIcon className="size-4" />
            Profile
          </Link>
        ) : null}
        <HideMatchButton matchId={detail.id} hidden={!!detail.hidden_at} />
      </div>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-baseline justify-between">
              <span>Personality axes</span>
              <span className="text-xs font-normal text-muted-foreground">
                40% · {detail.axes_pct}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <MatchAxisRow
              axisName={cinepersonaAxes[0]?.name ?? "Connection"}
              data={breakdown.axes.axis_1}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[1]?.name ?? "Reading"}
              data={breakdown.axes.axis_2}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[2]?.name ?? "Engagement"}
              data={breakdown.axes.axis_3}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[3]?.name ?? "Discovery"}
              data={breakdown.axes.axis_4}
            />
          </CardContent>
        </Card>

        <PicksCard
          title="Picked films"
          weightLabel={`30% · ${detail.picks_pct}%`}
          description={`${breakdown.picks.shared_count} shared of ${breakdown.picks.union_count} total · Jaccard ${breakdown.picks.jaccard_pct}%`}
          groups={[
            { label: "Shared", movies: shared },
            { label: "Only you", movies: selfOnly },
            { label: "Only them", movies: otherOnly },
          ]}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-baseline justify-between">
              <span>Watch history</span>
              <span className="text-xs font-normal text-muted-foreground">
                30% · {detail.watched_pct}%
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {breakdown.watched.shared_count} shared films · Jaccard{" "}
              {breakdown.watched.jaccard_pct}%
            </p>
          </CardHeader>
          <CardContent>
            {sharedWatched.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No overlap to highlight.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {sharedWatched.slice(0, 8).map((m) => (
                  <li key={m.id} className="w-[88px]">
                    <span className="block w-[88px] overflow-hidden rounded-md bg-muted ring-1 ring-border/50">
                      {m.poster_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                          alt={m.title}
                          className="aspect-[2/3] w-full object-cover"
                        />
                      ) : (
                        <span className="flex aspect-[2/3] w-full items-center justify-center p-2 text-center text-[10px] text-muted-foreground">
                          {m.title}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
