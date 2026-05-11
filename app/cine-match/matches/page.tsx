import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { MatchListRow } from "@/components/cinematch/match-list-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  getRequestQuota,
  getViewerId,
  listMatches,
} from "@/lib/match/queries";
import { WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My matches · CineMatch",
};

export default async function CineMatchListPage() {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) redirect("/login?next=/cine-match/matches");

  const [matches, quota] = await Promise.all([
    listMatches(supabase, viewerId, 50),
    getRequestQuota(supabase, viewerId),
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          My matches
        </h1>
        <span className="text-xs text-muted-foreground">
          {quota.used}/{WEEKLY_REQUEST_LIMIT} requests this week
        </span>
      </header>

      {quota.pending.length > 0 ? (
        <Alert className="mb-4">
          <AlertTitle>
            {quota.pending.length} request
            {quota.pending.length > 1 ? "s" : ""} searching…
          </AlertTitle>
          <AlertDescription>
            We&apos;ll land a 90%+ match as soon as one shows up. After 7 days
            we fall back to the closest available person.
          </AlertDescription>
        </Alert>
      ) : null}

      {matches.length === 0 ? (
        <Alert>
          <AlertTitle>No matches yet.</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Press &quot;Find a new match&quot; from CineMatch to send a
              request.
            </p>
            <Link
              href="/cine-match"
              className={cn(buttonVariants({ size: "sm" }), "w-fit")}
            >
              Back to CineMatch
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <ul className="space-y-2">
          {matches.map((m) => (
            <li key={m.id}>
              <MatchListRow item={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
