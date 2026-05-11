import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareIcon, UserRoundCheckIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
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
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chat with friends. Add someone from their profile to start a
          conversation.
        </p>
      </header>

      {incoming.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              Friend requests
              <Badge variant="secondary" className="ml-2 tabular-nums">
                {incoming.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {incoming.map((r) => (
                <RequestRow key={r.id} row={r} direction="incoming" />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {outgoing.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">
              Pending requests
              <Badge variant="outline" className="ml-2 tabular-nums">
                {outgoing.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {outgoing.map((r) => (
                <RequestRow key={r.id} row={r} direction="outgoing" />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <Separator className="my-4" />

      <h2 className="mb-3 text-sm font-medium text-muted-foreground">
        Conversations
      </h2>
      {friends.length === 0 ? (
        <Empty className="my-8 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareIcon />
            </EmptyMedia>
            <EmptyTitle>No conversations yet</EmptyTitle>
            <EmptyDescription>
              Add a friend from their profile to start chatting.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {friends.map((f) => (
                <FriendRow
                  key={f.id}
                  row={f}
                  unread={unreadCounts.get(f.id) ?? 0}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
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
        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/40 sm:px-5"
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
          <Badge className="tabular-nums">{unread}</Badge>
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

