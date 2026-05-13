"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCheckIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RelativeTime } from "@/components/community/relative-time";
import {
  deleteNotification,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/actions";
import type { NotificationView } from "@/lib/notifications/types";
import { cn } from "@/lib/utils";

type Props = {
  initialItems: NotificationView[];
  initialUnread: number;
};

export function NotificationsList({ initialItems, initialUnread }: Props) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialItems);
  const [unread, setUnread] = React.useState(initialUnread);
  const [pendingAll, startAll] = React.useTransition();

  // Reconcile local optimistic state with fresh server props on re-render.
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
        router.refresh();
      } else {
        router.refresh();
      }
    });
  };

  const handleMarkOne = (id: string, alreadyRead: boolean) => {
    if (alreadyRead) return;
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

  const handleDelete = (id: string, alreadyRead: boolean) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    if (!alreadyRead) setUnread((u) => Math.max(0, u - 1));
    void deleteNotification(id).then((res) => {
      if (!res.ok) {
        toast.error("Could not delete notification.");
        router.refresh();
      }
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-foreground/5 px-4 py-3 sm:px-5">
        <div className="text-xs text-muted-foreground">
          Showing the most recent {items.length}
          {unread > 0 ? ` · ${unread} unread` : ""}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAll}
          disabled={unread === 0 || pendingAll}
        >
          {pendingAll ? (
            <Loader2Icon className="size-3.5 animate-spin" />
          ) : (
            <CheckCheckIcon className="size-3.5" />
          )}
          Mark all read
        </Button>
      </div>

      <ul className="divide-y divide-white/5">
        {items.map((n) => (
          <NotificationRow
            key={n.id}
            item={n}
            onMarkRead={() => handleMarkOne(n.id, n.read_at != null)}
            onDelete={() => handleDelete(n.id, n.read_at != null)}
          />
        ))}
      </ul>
    </section>
  );
}

function NotificationRow({
  item,
  onMarkRead,
  onDelete,
}: {
  item: NotificationView;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const unread = item.read_at == null;

  const inner = (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={item.actor?.avatar_url ?? "/user.png"} alt="" />
        <AvatarFallback />
      </Avatar>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "text-sm leading-snug break-words",
            unread ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {item.summary}
        </p>
        <RelativeTime
          date={item.created_at}
          className="text-[11px] text-muted-foreground"
        />
      </div>
      {unread ? (
        <span
          aria-hidden="true"
          className="mt-2 size-2 shrink-0 rounded-full bg-primary"
        />
      ) : null}
    </div>
  );

  return (
    <li
      className={cn(
        "flex items-center gap-2 px-4 py-3 sm:px-5",
        unread && "bg-primary/5",
      )}
    >
      {item.href ? (
        <Link
          href={item.href}
          onClick={onMarkRead}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onMarkRead}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {inner}
        </button>
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete notification"
        onClick={onDelete}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2Icon className="size-3.5" />
      </Button>
    </li>
  );
}
