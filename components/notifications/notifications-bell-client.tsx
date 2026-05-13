"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellIcon, CheckCheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RelativeTime } from "@/components/community/relative-time";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/actions";
import type { NotificationView } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";

type Props = {
  initialItems: NotificationView[];
  initialUnread: number;
};

export function NotificationsBellClient({ initialItems, initialUnread }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(initialItems);
  const [unread, setUnread] = React.useState(initialUnread);
  const [pendingAll, startAll] = React.useTransition();

  // Sync local optimistic state to fresh server props when the parent
  // re-renders (router.refresh()). React 19 idiom: store the previous prop
  // identity and reconcile during render rather than in an effect.
  const [prevInitialItems, setPrevInitialItems] = React.useState(initialItems);
  const [prevInitialUnread, setPrevInitialUnread] =
    React.useState(initialUnread);
  if (prevInitialItems !== initialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }
  if (prevInitialUnread !== initialUnread) {
    setPrevInitialUnread(initialUnread);
    setUnread(initialUnread);
  }

  const handleMarkAll = () => {
    if (unread === 0 || pendingAll) return;
    startAll(async () => {
      const now = new Date().toISOString();
      setItems((prev) =>
        prev.map((n) => (n.read_at ? n : { ...n, read_at: now })),
      );
      setUnread(0);
      const res = await markAllNotificationsRead();
      if (!res.ok) {
        toast.error("Could not mark notifications as read.");
        // Re-sync from server.
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  const handleClickItem = (id: string, alreadyRead: boolean) => {
    if (alreadyRead) {
      setOpen(false);
      return;
    }
    // Optimistic — close popover and mark read in the background.
    setOpen(false);
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
      ),
    );
    setUnread((u) => Math.max(0, u - 1));
    void markNotificationRead(id).then((res) => {
      if (!res.ok) router.refresh();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label={
              unread > 0 ? `Notifications (${unread} unread)` : "Notifications"
            }
            className="relative"
          >
            <BellIcon className="size-[1.05rem]" aria-hidden="true" />
            {unread > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground ring-2 ring-background"
              >
                {unread > 99 ? "99+" : unread}
              </span>
            ) : null}
          </Button>
        }
      />
      <PopoverContent
        align="end"
        sideOffset={8}
        className={cn(
          "p-0 w-[min(22rem,calc(100vw-1.5rem))]",
          "sm:w-96",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-foreground/10 px-3 py-2">
          <div className="text-sm font-medium">
            Notifications
            {unread > 0 ? (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                · {unread} new
              </span>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="xs"
            onClick={handleMarkAll}
            disabled={unread === 0 || pendingAll}
            className="text-xs"
          >
            {pendingAll ? (
              <Loader2Icon className="size-3 animate-spin" />
            ) : (
              <CheckCheckIcon className="size-3" />
            )}
            Mark all read
          </Button>
        </div>

        <ul className="max-h-[min(70vh,28rem)] divide-y divide-foreground/5 overflow-y-auto">
          {items.length === 0 ? (
            <li className="px-3 py-8 text-center text-xs text-muted-foreground">
              You&apos;re all caught up.
            </li>
          ) : (
            items.map((n) => (
              <NotificationRow
                key={n.id}
                item={n}
                onSelect={() => handleClickItem(n.id, n.read_at != null)}
              />
            ))
          )}
        </ul>

        <div className="border-t border-foreground/10 p-1.5">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="flex h-7 w-full items-center justify-center rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            View all notifications
          </Link>

        </div>
      </PopoverContent>
    </Popover>
  );
}

function NotificationRow({
  item,
  onSelect,
}: {
  item: NotificationView;
  onSelect: () => void;
}) {
  const unread = item.read_at == null;
  const body = (
    <div className="flex w-full items-start gap-2.5 px-3 py-2.5">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={item.actor?.avatar_url ?? "/user.png"} alt="" />
        <AvatarFallback />
      </Avatar>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "text-xs leading-snug break-words",
            unread ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {item.summary}
        </p>
        <RelativeTime
          date={item.created_at}
          className="text-[10px] text-muted-foreground"
        />
      </div>
      {unread ? (
        <span
          aria-hidden="true"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
        />
      ) : null}
    </div>
  );

  if (item.href) {
    return (
      <li className={cn(unread && "bg-primary/5")}>
        <Link
          href={item.href}
          onClick={onSelect}
          className="block transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
        >
          {body}
        </Link>
      </li>
    );
  }
  return (
    <li className={cn(unread && "bg-primary/5")}>
      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left transition-colors hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
      >
        {body}
      </button>
    </li>
  );
}
