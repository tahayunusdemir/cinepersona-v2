import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";

import { MatchListRow } from "@/components/cinematch/match-list-item";
import { PendingRequestRow } from "@/components/cinematch/pending-request-row";
import { ctaPrimary } from "@/lib/ui-tokens";
import {
  getRequestQuota,
  getViewerId,
  listMatches,
  nowMs,
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

  const pending = quota.pending;
  const isEmpty = pending.length === 0 && matches.length === 0;
  const renderedAt = nowMs();

  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-5xl">
              My matches.
            </h1>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-foreground/10 bg-foreground/[0.02] px-4 py-2">
            <span className="size-1.5 rounded-full bg-[#ecb756]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {quota.used}/{WEEKLY_REQUEST_LIMIT} requests this week
            </span>
          </div>
        </header>

        {isEmpty ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-10 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
              <Inbox className="size-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl tracking-tight">
              The reel hasn’t started.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Press “Find a new match” on CineMatch to send your first request.
            </p>
            <Link href="/cine-match" className={cn(ctaPrimary, "mt-6")}>
              Back to CineMatch
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {pending.map((req) => (
              <li key={req.id}>
                <PendingRequestRow
                  requestedAt={req.requested_at}
                  nowMs={renderedAt}
                />
              </li>
            ))}
            {matches.map((m) => (
              <li key={m.id}>
                <MatchListRow item={m} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
