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
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-2xl flex-col">
      <header className="flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
        <Link
          href="/messages"
          aria-label="Back to messages"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "-ml-2 size-9 shrink-0",
          )}
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <Link
          href={`/${partnerUsername}`}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-md py-1 transition-opacity hover:opacity-80"
        >
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold">{display}</div>
            <p className="truncate text-xs text-muted-foreground">
              @{partnerUsername}
            </p>
          </div>
        </Link>
      </header>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
        <FriendChatThread
          friendshipId={detail.id}
          viewerId={viewerId}
          initial={messages}
        />
      </div>

      <div className="border-t bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
        <FriendChatForm friendshipId={detail.id} viewerId={viewerId} />
      </div>
    </div>
  );
}
