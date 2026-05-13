import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon, MessageCircleIcon } from "lucide-react";

import { ChatForm } from "@/components/cinematch/chat-form";
import { ChatThread } from "@/components/cinematch/chat-thread";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  getMatchDetail,
  getViewerId,
  listMessages,
} from "@/lib/match/queries";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chat · CineMatch",
};

type Params = { id: string };

export default async function CineMatchMessagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);
  if (!viewerId) redirect(`/login?next=/cine-match/${id}/messages`);

  const detail = await getMatchDetail(supabase, id, viewerId);
  if (!detail) notFound();

  const partner = detail.partner;
  const username = partner.username ?? "deleted";
  const display = partner.display_name?.trim() || `@${username}`;
  const initial = (display.replace("@", "").trim()[0] ?? "?").toUpperCase();

  if (!detail.both_consented) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <Link
          href={`/cine-match/${id}`}
          className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" /> Match detail
        </Link>
        <Alert className="border-foreground/10 bg-panel">
          <MessageCircleIcon className="size-4" />
          <AlertTitle className="font-display text-base tracking-tight">
            Messaging not unlocked yet.
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Both you and {display} need to allow messaging before chat opens.
            </p>
            <Link
              href={`/cine-match/${id}`}
              className={cn(buttonVariants({ size: "sm" }), "w-fit")}
            >
              Back to match
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const messages = await listMessages(supabase, id, 100);

  // Site header is h-16 (4rem). Lock the chat to the remaining viewport so
  // the composer can sit flush above the on-screen keyboard / safe-area inset.
  // Outer bars span the full viewport edge-to-edge; only their inner content is
  // capped with a max-width so the chat doesn't feel like a narrow column on
  // wide screens.
  return (
    <div className="relative flex h-[calc(100dvh-4rem)] w-full flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 [background:radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--color-brand-gold)_12%,transparent)_0%,transparent_70%)]"
      />

      <header className="relative border-b border-foreground/10 bg-panel/80 backdrop-blur">
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ecb756]/50 to-transparent"
        />
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3 lg:px-8 lg:py-3.5">
          <Link
            href={`/cine-match/${id}`}
            aria-label="Back to match detail"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "-ml-1 size-9 shrink-0 rounded-full hover:bg-foreground/[0.06] sm:-ml-2 lg:size-10",
            )}
          >
            <ArrowLeftIcon className="size-4 lg:size-[18px]" />
          </Link>
          <Link
            href={`/${username}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md py-1 transition-opacity hover:opacity-80 sm:gap-3"
          >
            <Avatar className="size-9 shrink-0 border border-[#ecb756]/30 shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-brand-gold)_10%,transparent)] sm:size-10 lg:size-11">
              <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
              <AvatarFallback className="text-sm font-medium">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-base tracking-tight sm:text-lg lg:text-xl">
                  {display}
                </span>
                {partner.type_code ? (
                  <Badge
                    variant="outline"
                    className="hidden border-[#ecb756]/30 bg-[#ecb756]/10 font-mono text-[10px] tracking-[0.18em] text-[#ecb756] sm:inline-flex"
                  >
                    {partner.type_code}
                  </Badge>
                ) : null}
              </div>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[11px]">
                <span className="text-[#ecb756]/90">{detail.similarity_pct}%</span> match
                <span className="hidden sm:inline"> · @{username}</span>
                {partner.type_code ? (
                  <span className="sm:hidden"> · {partner.type_code}</span>
                ) : null}
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <ChatThread matchId={id} viewerId={viewerId} initial={messages} />
        </div>
      </div>

      <div className="border-t border-foreground/10 bg-panel/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-4 lg:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <ChatForm matchId={id} viewerId={viewerId} />
        </div>
      </div>
    </div>
  );
}
