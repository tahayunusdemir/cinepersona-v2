import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareIcon, UserRoundCheckIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  countUnreadFromPartner,
  listFriends,
  listIncomingRequests,
  listOutgoingRequests,
} from "@/lib/friends/queries";
import type { FriendshipView } from "@/lib/friends/types";
import { createClient } from "@/lib/supabase/server";
import { profileHeading, profileInitials } from "@/lib/profile/queries";

import { IncomingActions, OutgoingActions } from "./request-actions";

export const metadata: Metadata = {
  title: "Messages",
};

export default async function MessagesIndexPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const viewerId = data.user?.id ?? null;
  if (!viewerId) redirect("/login?next=/messages");

  const [friends, incoming, outgoing] = await Promise.all([
    listFriends(supabase, viewerId),
    listIncomingRequests(supabase, viewerId),
    listOutgoingRequests(supabase, viewerId),
  ]);

  const unreadCounts = new Map<string, number>(
    await Promise.all(
      friends.map(
        async (f) =>
          [f.id, await countUnreadFromPartner(supabase, f.id, viewerId)] as const,
      ),
    ),
  );

  return (
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12 sm:px-6">
        <header className="mb-8">
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
            Messages.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Chat with friends. Add someone from their profile to start a
            conversation.
          </p>
        </header>

        {incoming.length > 0 ? (
          <section className="mb-5 overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
            <div className="flex items-center justify-between border-b border-foreground/5 px-5 py-3">
              <FrameTag>Friend requests</FrameTag>
              <Badge
                variant="secondary"
                className="border-0 bg-[#ecb756] tabular-nums text-[#1a1840]"
              >
                {incoming.length}
              </Badge>
            </div>
            <ul className="divide-y divide-white/5">
              {incoming.map((r) => (
                <RequestRow key={r.id} row={r} direction="incoming" />
              ))}
            </ul>
          </section>
        ) : null}

        {outgoing.length > 0 ? (
          <section className="mb-5 overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
            <div className="flex items-center justify-between border-b border-foreground/5 px-5 py-3">
              <FrameTag>Pending requests</FrameTag>
              <Badge
                variant="outline"
                className="border-foreground/15 bg-foreground/[0.02] tabular-nums text-muted-foreground"
              >
                {outgoing.length}
              </Badge>
            </div>
            <ul className="divide-y divide-white/5">
              {outgoing.map((r) => (
                <RequestRow key={r.id} row={r} direction="outgoing" />
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mb-4 flex items-baseline gap-3">
          <FrameTag>Conversations</FrameTag>
          <span className="h-px flex-1 bg-gradient-to-r from-foreground/15 to-transparent" />
        </div>

        {friends.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-foreground/[0.015] p-10 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full border border-[#ecb756]/20 bg-[#ecb756]/10 text-[#ecb756]">
              <MessageSquareIcon className="size-5" />
            </div>
            <h2 className="mt-5 font-display text-2xl tracking-tight">
              No conversations yet.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a friend from their profile to start chatting.
            </p>
          </div>
        ) : (
          <ul className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel divide-y divide-white/5">
            {friends.map((f) => (
              <FriendRow
                key={f.id}
                row={f}
                unread={unreadCounts.get(f.id) ?? 0}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FriendRow({
  row,
  unread,
}: {
  row: FriendshipView;
  unread: number;
}) {
  const username = row.partner.username ?? "deleted";
  const heading = profileHeading(row.partner.display_name, username);
  const initials = profileInitials(row.partner.display_name, username);

  return (
    <li>
      <Link
        href={`/messages/${username}`}
        className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-foreground/[0.03]"
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={row.partner.avatar_url ?? "/user.png"}
            alt={heading}
          />
          <AvatarFallback className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{heading}</span>
            <span className="truncate text-xs text-muted-foreground">
              @{username}
            </span>
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {unread > 0
              ? `${unread} new message${unread === 1 ? "" : "s"}`
              : "Open conversation"}
          </p>
        </div>
        {unread > 0 ? (
          <Badge className="border-0 bg-[#ecb756] tabular-nums text-[#1a1840] hover:bg-[#f3cd84]">
            {unread}
          </Badge>
        ) : (
          <UserRoundCheckIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
}

function RequestRow({
  row,
  direction,
}: {
  row: FriendshipView;
  direction: "incoming" | "outgoing";
}) {
  const username = row.partner.username ?? "deleted";
  const heading = profileHeading(row.partner.display_name, username);
  const initials = profileInitials(row.partner.display_name, username);

  return (
    <li className="flex items-center gap-3 px-4 py-3 sm:px-5">
      <Link
        href={`/${username}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage
            src={row.partner.avatar_url ?? "/user.png"}
            alt={heading}
          />
          <AvatarFallback className="text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{heading}</div>
          <div className="truncate text-xs text-muted-foreground">
            @{username}
          </div>
        </div>
      </Link>
      {direction === "incoming" ? (
        <IncomingActions friendshipId={row.id} targetUsername={username} />
      ) : (
        <OutgoingActions friendshipId={row.id} targetUsername={username} />
      )}
    </li>
  );
}

