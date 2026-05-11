import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

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

  if (!detail.both_consented) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
        <Link
          href={`/cine-match/${id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" /> Match detail
        </Link>
        <Alert>
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

  return (
    <div className="mx-auto flex h-[100dvh] max-h-[100dvh] w-full max-w-3xl flex-col px-4 sm:px-6">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/60 bg-background/90 py-3 backdrop-blur">
        <Link
          href={`/cine-match/${id}`}
          aria-label="Back to match detail"
          className="rounded p-1 hover:bg-accent"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <Avatar className="size-9">
          <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
          <AvatarFallback />
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{display}</span>
            {partner.type_code ? (
              <Badge variant="secondary" className="font-mono text-[10px]">
                {partner.type_code}
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {detail.similarity_pct}% match · @{username}
          </p>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        <ChatThread matchId={id} viewerId={viewerId} initial={messages} />
      </div>

      <div className="sticky bottom-0 border-t border-border/60 bg-background/90 py-3 backdrop-blur">
        <ChatForm matchId={id} />
      </div>
    </div>
  );
}
