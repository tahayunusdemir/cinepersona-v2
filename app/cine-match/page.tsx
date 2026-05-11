import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FilmIcon,
  HeartIcon,
  MessagesSquareIcon,
  SparklesIcon,
} from "lucide-react";

import { JoinPoolButton } from "@/components/cinematch/join-pool-button";
import { PoolStatusCard } from "@/components/cinematch/pool-status-card";
import { RequestMatchButton } from "@/components/cinematch/request-match-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getEligibility,
  getPoolEntry,
  getRequestQuota,
  getViewerId,
} from "@/lib/match/queries";
import { WATCHED_MIN, WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CineMatch",
  description:
    "Find people whose personality and watch history line up with yours. Three match requests per week.",
};

export default async function CineMatchIntroPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) redirect("/login?next=/cine-match");

  const eligibility = await getEligibility(supabase, viewerId);
  const quota = eligibility.ok
    ? await getRequestQuota(supabase, viewerId)
    : null;
  const poolEntry =
    eligibility.ok && eligibility.alreadyJoined
      ? await getPoolEntry(supabase, viewerId)
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <header className="text-center">
        <Badge variant="secondary" className="mb-4">
          CineMatch
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Find people whose taste lines up with yours.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          We match on your CinePersona axes and the films you&apos;ve actually
          watched. Each match lands at 90%+ similarity. You get{" "}
          {WEEKLY_REQUEST_LIMIT} requests per rolling week.
        </p>
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <FactCard icon={HeartIcon} label="4 personality axes" />
        <FactCard icon={FilmIcon} label={`${WATCHED_MIN}+ watched films`} />
        <FactCard icon={SparklesIcon} label="90%+ similarity" />
      </section>

      <section className="mt-10">
        {eligibility.ok ? (
          <PoolStatusCard entry={poolEntry} />
        ) : (
          <StatusBlock eligibility={eligibility} />
        )}
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {eligibility.ok ? (
          eligibility.alreadyJoined ? (
            <RequestMatchButton
              remaining={quota?.remaining ?? WEEKLY_REQUEST_LIMIT}
              nextSlotAt={quota?.nextSlotAt ?? null}
              pendingCount={quota?.pending.length ?? 0}
            />
          ) : (
            <JoinPoolButton />
          )
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "w-full cursor-not-allowed opacity-50",
            )}
            aria-disabled
          >
            Join the pool
          </span>
        )}
        <Link
          href="/cine-match/matches"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "w-full",
          )}
        >
          <MessagesSquareIcon className="size-4" />
          See my matches
        </Link>
      </section>

      {eligibility.ok && quota ? (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {quota.used} of {WEEKLY_REQUEST_LIMIT} requests used this week
          {quota.pending.length > 0
            ? ` · ${quota.pending.length} pending`
            : ""}
        </p>
      ) : null}
    </div>
  );
}

function FactCard({
  icon: Icon,
  label,
}: {
  icon: typeof HeartIcon;
  label: string;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Icon className="size-4 text-muted-foreground" />
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
    </Card>
  );
}

type IneligibleState = Extract<
  Awaited<ReturnType<typeof getEligibility>>,
  { ok: false }
>;

function StatusBlock({ eligibility }: { eligibility: IneligibleState }) {
  if (eligibility.reason === "no_test") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Take the CineTest first.</AlertTitle>
        <AlertDescription>
          The match depends on your personality axes.{" "}
          <Link className="underline" href="/cinetest">
            Start the test
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert variant="destructive">
      <AlertTitle>Mark {WATCHED_MIN} watched films.</AlertTitle>
      <AlertDescription>
        You have {eligibility.watchedCount}. We need at least {WATCHED_MIN}{" "}
        watched films to measure overlap.{" "}
        <Link className="underline" href="/films">
          Browse films
        </Link>
        .
      </AlertDescription>
    </Alert>
  );
}
