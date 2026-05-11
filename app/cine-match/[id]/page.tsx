import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

import { ConsentButton } from "@/components/cinematch/consent-button";
import { HideMatchButton } from "@/components/cinematch/hide-button";
import { MatchAxisRow } from "@/components/cinematch/match-axis-row";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { axes as cinepersonaAxes } from "@/lib/cinepersona";
import {
  AXES_WEIGHT,
  WATCHED_WEIGHT,
} from "@/lib/match/types";
import { getMatchDetail, getViewerId } from "@/lib/match/queries";
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
  const axesWeightPct = Math.round(AXES_WEIGHT * 100);
  const watchedWeightPct = Math.round(WATCHED_WEIGHT * 100);

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
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {display}
            </h1>
            <span className="text-sm text-muted-foreground">@{username}</span>
            {partner.type_code ? (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {partner.type_code}
              </Badge>
            ) : null}
            {detail.is_fallback ? (
              <Badge
                variant="outline"
                className="gap-1 px-1.5 text-[10px]"
                aria-label="Fallback match"
              >
                <SparklesIcon className="size-3" />
                closest available
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Matched{" "}
            {new Date(detail.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
              <Badge variant="default" className="ml-1 px-1.5 text-[10px]">
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
                {axesWeightPct}% · {detail.axes_pct}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <MatchAxisRow
              axisName={cinepersonaAxes[0]?.name ?? "Connection"}
              data={breakdown.axes.axis_1}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[1]?.name ?? "Meaning"}
              data={breakdown.axes.axis_2}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[2]?.name ?? "Evaluation"}
              data={breakdown.axes.axis_3}
            />
            <MatchAxisRow
              axisName={cinepersonaAxes[3]?.name ?? "Discovery"}
              data={breakdown.axes.axis_4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-baseline justify-between">
              <span>Watched-films overlap</span>
              <span className="text-xs font-normal text-muted-foreground">
                {watchedWeightPct}% · {detail.watched_pct}%
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {breakdown.watched.shared_count} shared film
              {breakdown.watched.shared_count === 1 ? "" : "s"} between your
              watch histories.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
