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
      <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 sm:px-6">
        <Link
          href={`/cine-match/${id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" /> Match detail
        </Link>
        <Alert>
          <MessageCircleIcon className="size-4" />
          <AlertTitle>Messaging not unlocked yet.</AlertTitle>
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

  // Site header is h-14 (3.5rem). Lock the chat to the remaining viewport so
  // the composer can sit flush above the on-screen keyboard / safe-area inset.
  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col">
      <header className="flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
        <Link
          href={`/cine-match/${id}`}
          aria-label="Back to match detail"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "-ml-2 size-9 shrink-0",
          )}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <Link
          href={`/${username}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md py-1 transition-opacity hover:opacity-80"
        >
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
            <AvatarFallback className="text-sm font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold">{display}</span>
              {partner.type_code ? (
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] tracking-wide"
                >
                  {partner.type_code}
                </Badge>
              ) : null}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {detail.similarity_pct}% match · @{username}
            </p>
          </div>
        </Link>
      </header>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        <ChatThread matchId={id} viewerId={viewerId} initial={messages} />
      </div>

      <div className="border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
        <ChatForm matchId={id} viewerId={viewerId} />
      </div>
    </div>
  );
}
