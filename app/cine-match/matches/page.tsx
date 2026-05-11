import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MatchListRow } from "@/components/cinematch/match-list-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCurrentPool,
  getViewerId,
  listMatches,
  poolWindowLabel,
} from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My matches · CineMatch",
};

export default async function CineMatchListPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) {
    redirect("/login?next=/cine-match/matches");
  }

  const [pool, current, past] = await Promise.all([
    getCurrentPool(supabase),
    listMatches(supabase, viewerId, { scope: "current", limit: 50 }),
    listMatches(supabase, viewerId, { scope: "past", limit: 25 }),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <header className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My matches</h1>
        {pool ? (
          <span className="text-xs text-muted-foreground">
            {poolWindowLabel(pool)}
          </span>
        ) : null}
      </header>

      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">This month</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          {current.length === 0 ? (
            <CurrentEmpty pool={pool} />
          ) : (
            <ul className="space-y-2">
              {current.map((m) => (
                <li key={m.id}>
                  <MatchListRow item={m} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          {past.length === 0 ? (
            <Alert>
              <AlertTitle>No past matches yet.</AlertTitle>
              <AlertDescription>
                Your previous pool results will show up here.
              </AlertDescription>
            </Alert>
          ) : (
            <ul className="space-y-2">
              {past.map((m) => (
                <li key={m.id}>
                  <MatchListRow item={m} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CurrentEmpty({
  pool,
}: {
  pool: { id: number; status: string; period_start: string; period_end: string; created_at: string } | null;
}) {
  if (!pool) {
    return (
      <Alert>
        <AlertTitle>No active pool.</AlertTitle>
        <AlertDescription>
          The next pool opens on the 1st of the month.
        </AlertDescription>
      </Alert>
    );
  }
  if (pool.status === "computing" || pool.status === "locked") {
    return (
      <Alert>
        <AlertTitle>Computing matches…</AlertTitle>
        <AlertDescription>
          Results land in the next few hours.
        </AlertDescription>
      </Alert>
    );
  }
  return (
    <Alert>
      <AlertTitle>No matches yet.</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>
          Pool closes at the end of the month. Make sure you&apos;ve picked
          your films.
        </p>
        <Link
          href="/cine-match/join"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Pick films
        </Link>
      </AlertDescription>
    </Alert>
  );
}
