import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { ConsentButton } from "@/components/cinematch/consent-button";
import { ConsentStatus } from "@/components/cinematch/consent-status";
import { HideMatchButton } from "@/components/cinematch/hide-button";
import { MatchAxisRow } from "@/components/cinematch/match-axis-row";
import { SharedFilmsStrip } from "@/components/cinematch/shared-films-strip";
import { SimilarityNarrative } from "@/components/cinematch/similarity-narrative";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axes as cinepersonaAxes } from "@/lib/cinepersona";
import {
  AXES_WEIGHT,
  WATCHED_WEIGHT,
} from "@/lib/match/types";
import {
  getMatchDetail,
  getViewerId,
  listSharedWatched,
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
  const axesWeightPct = Math.round(AXES_WEIGHT * 100);
  const watchedWeightPct = Math.round(WATCHED_WEIGHT * 100);

  const sharedFilms = await listSharedWatched(supabase, viewerId, partner.id);

  return (
    <TooltipProvider>
      <div className="relative isolate overflow-hidden">

        <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
          <Link
            href="/cine-match/matches"
            className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
          >
            <ArrowLeftIcon className="size-3" /> My matches
          </Link>

          {/* HEADER */}
          <header className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-panel p-6 sm:p-7">
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ecb756]/40 to-transparent"
            />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <Avatar className="size-16 shrink-0 border-2 border-[#ecb756]/30">
                <AvatarImage
                  src={partner.avatar_url ?? "/user.png"}
                  alt={display}
                />
                <AvatarFallback />
              </Avatar>

              <div className="min-w-0 flex-1">
                <FrameTag>Match · {partner.type_code ?? "—"}</FrameTag>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
                    {display}
                  </h1>
                  <span className="text-sm text-muted-foreground">
                    @{username}
                  </span>
                  {detail.is_fallback ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Badge
                            variant="outline"
                            className="gap-1 border-foreground/15 bg-foreground/[0.02] px-1.5 text-[10px] text-muted-foreground"
                            aria-label="Fallback match"
                          >
                            <SparklesIcon className="size-3" />
                            closest available
                          </Badge>
                        }
                      />
                      <TooltipContent className="max-w-xs">
                        We didn’t find a 90%+ match within 7 days, so this is
                        the closest available person from the pool.
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Matched{" "}
                  {new Date(detail.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <div className="mt-3">
                  <SimilarityNarrative
                    breakdown={breakdown}
                    sharedCount={breakdown.watched.shared_count}
                  />
                </div>
              </div>

              <div className="text-right sm:min-w-[110px]">
                <div className="font-display text-5xl leading-none text-[#ecb756] tabular-nums sm:text-6xl">
                  {detail.similarity_pct}%
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Similarity
                </div>
              </div>
            </div>
          </header>

          {/* CONSENT + ACTIONS */}
          <div className="mt-5 space-y-3">
            {!detail.both_consented ? (
              <ConsentStatus
                viewer={detail.viewer_consented}
                partner={detail.partner_consented}
                partnerLabel={`@${username}`}
              />
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <ConsentButton
                matchId={detail.id}
                ownGranted={ownGranted}
                bothConsented={detail.both_consented}
              />
              {detail.both_consented ? (
                <Link
                  href={`/cine-match/${detail.id}/messages`}
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "rounded-full border border-foreground/10 bg-foreground/[0.04] hover:bg-foreground/[0.08]",
                  )}
                >
                  <MessageSquareIcon className="size-4" />
                  Open chat
                  {detail.unread_count > 0 ? (
                    <Badge
                      variant="default"
                      className="ml-1 border-0 bg-[#ecb756] px-1.5 text-[10px] text-[#1a1840]"
                    >
                      {detail.unread_count}
                    </Badge>
                  ) : null}
                </Link>
              ) : null}
              {partner.username ? (
                <Link
                  href={`/${partner.username}`}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "rounded-full hover:bg-foreground/[0.06]",
                  )}
                >
                  <UserIcon className="size-4" />
                  Profile
                </Link>
              ) : null}
              <HideMatchButton matchId={detail.id} hidden={!!detail.hidden_at} />
            </div>
          </div>

          {/* AXES + WATCHED */}
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-foreground/10 bg-panel p-6">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="mt-2 font-display text-xl tracking-tight">
                    Where you align.
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
                  {axesWeightPct}% · {detail.axes_pct}%
                </span>
              </div>
              <div className="mt-6 space-y-5">
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
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-panel p-6">
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <h2 className="mt-2 font-display text-xl tracking-tight">
                    Films you both have on the shelf.
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ecb756]">
                  {watchedWeightPct}% · {detail.watched_pct}%
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {breakdown.watched.shared_count} shared film
                {breakdown.watched.shared_count === 1 ? "" : "s"} between your
                watch histories.
              </p>
              <div className="mt-5">
                <SharedFilmsStrip
                  films={sharedFilms}
                  totalShared={breakdown.watched.shared_count}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
