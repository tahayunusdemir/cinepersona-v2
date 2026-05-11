import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarIcon,
  FilmIcon,
  HeartIcon,
  MessagesSquareIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  daysUntilPoolClose,
  getEligibility,
  getViewerId,
  poolWindowLabel,
} from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "CineMatch",
  description:
    "Find people whose taste, personality and watching history line up with yours each month.",
};

export default async function CineMatchIntroPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) {
    redirect("/login?next=/cine-match");
  }

  const eligibility = await getEligibility(supabase, viewerId);
  const pool = "pool" in eligibility ? eligibility.pool : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <header className="text-center">
        <Badge variant="secondary" className="mb-4">
          CineMatch
        </Badge>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          A monthly match — based on how you actually watch.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
          Once a month, we cross-check everyone in the pool on three fronts:
          your CinePersona axes, the films you picked to represent you, and
          your watch history. Matches above 90% land in your inbox.
        </p>
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <FactCard icon={HeartIcon} label="4 personality axes" />
        <FactCard icon={FilmIcon} label="5–10 films you pick" />
        <FactCard icon={CalendarIcon} label="watch history overlap" />
      </section>

      <section className="mt-10">
        <PoolStatus eligibility={eligibility} />
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          href="/cine-match/join"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full",
          )}
        >
          {eligibility.ok && eligibility.alreadyJoined
            ? "Edit my picks"
            : "Join this month's pool"}
        </Link>
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

      {pool ? (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {poolWindowLabel(pool)} pool · closes in {daysUntilPoolClose(pool)}{" "}
          day{daysUntilPoolClose(pool) === 1 ? "" : "s"}
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

function PoolStatus({
  eligibility,
}: {
  eligibility: Awaited<ReturnType<typeof getEligibility>>;
}) {
  if (eligibility.ok) {
    if (eligibility.alreadyJoined) {
      return (
        <Alert>
          <AlertTitle>You&apos;re in.</AlertTitle>
          <AlertDescription>
            You&apos;re already part of the {poolWindowLabel(eligibility.pool)}{" "}
            pool. Results land when the month closes.
          </AlertDescription>
        </Alert>
      );
    }
    return (
      <Alert>
        <AlertTitle>Pool is open.</AlertTitle>
        <AlertDescription>
          {poolWindowLabel(eligibility.pool)} pool — pick 5 to 10 films and
          you&apos;re in.
        </AlertDescription>
      </Alert>
    );
  }

  if (eligibility.reason === "no_test") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Take the CineTest first.</AlertTitle>
        <AlertDescription>
          We need your personality axes to match you.{" "}
          <Link className="underline" href="/cinetest">
            Start the test
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }
  if (eligibility.reason === "watched_too_few") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Mark at least 10 watched films.</AlertTitle>
        <AlertDescription>
          You have {eligibility.watchedCount}.{" "}
          <Link className="underline" href="/films">
            Browse and mark some
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }
  if (eligibility.reason === "pool_locked") {
    return (
      <Alert>
        <AlertTitle>This month&apos;s pool is locked.</AlertTitle>
        <AlertDescription>
          We&apos;re computing matches now. Check back soon.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert>
      <AlertTitle>No active pool.</AlertTitle>
      <AlertDescription>
        The next monthly pool opens on the 1st.
      </AlertDescription>
    </Alert>
  );
}
