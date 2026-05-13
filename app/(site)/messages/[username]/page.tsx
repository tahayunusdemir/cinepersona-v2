import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { FriendChatForm } from "@/components/friends/chat-form";
import { FriendChatThread } from "@/components/friends/chat-thread";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  getFriendshipForChat,
  listFriendMessages,
} from "@/lib/friends/queries";
import { createClient } from "@/lib/supabase/server";
import { profileHeading, profileInitials } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chat",
};

type Params = { username: string };

export default async function FriendChatPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const viewerId = data.user?.id ?? null;
  if (!viewerId) redirect(`/login?next=/messages/${username}`);

  const detail = await getFriendshipForChat(supabase, viewerId, username);
  if (!detail) notFound();

  const partner = detail.partner;
  const partnerUsername = partner.username ?? username;
  const display = profileHeading(partner.display_name, partnerUsername);
  const initials = profileInitials(partner.display_name, partnerUsername);

  const messages = await listFriendMessages(supabase, detail.id, 100);

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
            href="/messages"
            aria-label="Back to messages"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "-ml-1 size-9 shrink-0 rounded-full hover:bg-foreground/[0.06] sm:-ml-2 lg:size-10",
            )}
          >
            <ArrowLeftIcon className="size-4 lg:size-[18px]" />
          </Link>
          <Link
            href={`/${partnerUsername}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md py-1 transition-opacity hover:opacity-80 sm:gap-3"
          >
            <Avatar className="size-9 shrink-0 border border-[#ecb756]/30 shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-brand-gold)_10%,transparent)] sm:size-10 lg:size-11">
              <AvatarImage
                src={partner.avatar_url ?? "/user.png"}
                alt={display}
              />
              <AvatarFallback className="text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate font-display text-base tracking-tight sm:text-lg lg:text-xl">
                {display}
              </div>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[11px]">
                @{partnerUsername}
              </p>
            </div>
          </Link>
        </div>
      </header>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-5xl px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          <FriendChatThread
            friendshipId={detail.id}
            viewerId={viewerId}
            initial={messages}
          />
        </div>
      </div>

      <div className="border-t border-foreground/10 bg-panel/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:px-6 sm:pt-3 sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-8 lg:pt-4 lg:pb-[max(1rem,env(safe-area-inset-bottom))]">
          <FriendChatForm friendshipId={detail.id} viewerId={viewerId} />
        </div>
      </div>
    </div>
  );
}
