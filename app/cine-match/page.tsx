import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessagesSquareIcon } from "lucide-react";

import { EligibilityProgress } from "@/components/cinematch/eligibility-progress";
import { HowItWorks } from "@/components/cinematch/how-it-works";
import { JoinPoolButton } from "@/components/cinematch/join-pool-button";
import { PoolStatusCard } from "@/components/cinematch/pool-status-card";
import { QuotaCard } from "@/components/cinematch/quota-card";
import { RequestMatchButton } from "@/components/cinematch/request-match-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getEligibility,
  getPoolEntry,
  getRequestQuota,
  getViewerId,
  nowMs,
} from "@/lib/match/queries";
import { WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";
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

      <section className="mt-10" aria-label="How CineMatch works">
        <HowItWorks />
      </section>

      <section className="mt-8 space-y-3">
        {eligibility.ok ? (
          <>
            <PoolStatusCard entry={poolEntry} />
            {quota ? (
              <QuotaCard
                used={quota.used}
                pending={quota.pending.length}
                nextSlotAt={quota.nextSlotAt}
                nowMs={nowMs()}
              />
            ) : null}
          </>
        ) : (
          <EligibilityProgress
            reason={eligibility.reason}
            watchedCount={eligibility.watchedCount}
          />
        )}
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2">
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

      {eligibility.ok && quota?.pending.length ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          We&apos;ll page you the moment a 90%+ match lands. After 7 days the
          closest available person becomes a fallback.
        </p>
      ) : null}
    </div>
  );
}
