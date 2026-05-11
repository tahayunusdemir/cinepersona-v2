import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { JoinWizard } from "@/components/cinematch/join-wizard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  getEligibility,
  getOwnLibraryForPicker,
  getOwnPoolPicks,
  getViewerId,
  poolWindowLabel,
} from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Join the pool · CineMatch",
};

export default async function CineMatchJoinPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) {
    redirect("/login?next=/cine-match/join");
  }

  const eligibility = await getEligibility(supabase, viewerId);

  if (!eligibility.ok) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Almost there.
        </h1>

        {eligibility.reason === "no_test" ? (
          <NotEligible
            title="Finish the CineTest"
            body="The match relies on your personality axes."
            ctaHref="/cinetest"
            ctaLabel="Take the test"
          />
        ) : null}
        {eligibility.reason === "watched_too_few" ? (
          <NotEligible
            title="Mark 10 watched films"
            body={`You have ${eligibility.watchedCount}. Watched films give the match its shared-history layer.`}
            ctaHref="/films"
            ctaLabel="Browse films"
          />
        ) : null}
        {eligibility.reason === "pool_locked" ? (
          <NotEligible
            title="Pool is locked"
            body="This month's pool stopped accepting entries. The next one opens on the 1st."
            ctaHref="/cine-match"
            ctaLabel="Back to CineMatch"
          />
        ) : null}
        {eligibility.reason === "no_pool" ? (
          <NotEligible
            title="No active pool"
            body="The next monthly pool opens on the 1st."
            ctaHref="/cine-match"
            ctaLabel="Back to CineMatch"
          />
        ) : null}
      </div>
    );
  }

  const library = await getOwnLibraryForPicker(supabase, viewerId);
  const initialPicks = eligibility.alreadyJoined
    ? (await getOwnPoolPicks(supabase, eligibility.pool.id, viewerId)).map(
        (m) => m.id,
      )
    : [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {eligibility.alreadyJoined
            ? "Edit your picks"
            : "Pick films that represent you"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {poolWindowLabel(eligibility.pool)} pool · 5 to 10 films from your
          watched + watchlist.
        </p>
      </header>

      <JoinWizard
        library={library}
        initialPicks={initialPicks}
        mode={eligibility.alreadyJoined ? "edit" : "join"}
      />
    </div>
  );
}

function NotEligible({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <Alert className="mt-6">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{body}</p>
        <Link
          href={ctaHref}
          className={cn(buttonVariants({ size: "sm" }), "w-fit")}
        >
          {ctaLabel}
        </Link>
      </AlertDescription>
    </Alert>
  );
}
