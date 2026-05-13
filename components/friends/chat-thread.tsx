"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CheckIcon, CheckCheckIcon, MessageSquareIcon } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { createClient } from "@/lib/supabase/client";
import { markFriendMessagesRead } from "@/lib/friends/actions";
import type { FriendMessage } from "@/lib/friends/types";
import { cn } from "@/lib/utils";

type Props = {
  friendshipId: string;
  viewerId: string;
  initial: FriendMessage[];
};

const GROUP_GAP_MS = 5 * 60 * 1000;

export function FriendChatThread({ friendshipId, viewerId, initial }: Props) {
  const [messages, setMessages] = useState<FriendMessage[]>(initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`friend:${friendshipId}:messages`, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "message_created" }, (msg) => {
      const row = msg.payload as FriendMessage;
      if (!row || row.friendship_id !== friendshipId) return;
      setMessages((cur) =>
        cur.some((m) => m.id === row.id) ? cur : [...cur, row],
      );
    });
    channel.on("broadcast", { event: "messages_read" }, (msg) => {
      const payload = msg.payload as { sender_id: string; read_at: string };
      if (!payload) return;
      setMessages((cur) =>
        cur.map((m) =>
          m.sender_id !== payload.sender_id || m.read_at
            ? m
            : { ...m, read_at: payload.read_at },
        ),
      );
    });

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [friendshipId]);

  useEffect(() => {
    const onSent = (e: Event) => {
      const detail = (e as CustomEvent<FriendMessage>).detail;
      if (!detail || detail.friendship_id !== friendshipId) return;
      setMessages((cur) =>
        cur.some((m) => m.id === detail.id) ? cur : [...cur, detail],
      );
      channelRef.current?.send({
        type: "broadcast",
        event: "message_created",
        payload: detail,
      });
    };
    window.addEventListener("friends:message-sent", onSent);
    return () => window.removeEventListener("friends:message-sent", onSent);
  }, [friendshipId]);

  useEffect(() => {
    const unread = messages.filter(
      (m) => m.sender_id !== viewerId && !m.read_at,
    );
    if (unread.length === 0) return;
    const readAt = new Date().toISOString();
    setMessages((cur) =>
      cur.map((m) =>
        m.sender_id !== viewerId && !m.read_at ? { ...m, read_at: readAt } : m,
      ),
    );
    startTransition(() => {
      markFriendMessagesRead(friendshipId).catch(() => {});
    });
    const senderId = unread[0].sender_id;
    channelRef.current?.send({
      type: "broadcast",
      event: "messages_read",
      payload: { sender_id: senderId, read_at: readAt },
    });
  }, [friendshipId, messages, viewerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const groups = useMemo(() => groupMessages(messages), [messages]);

  if (messages.length === 0) {
    return (
      <Empty className="mx-auto my-8 max-w-sm border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MessageSquareIcon />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription>
            Say hi — this is the start of your conversation.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((day) => (
        <section key={day.label} aria-label={day.label}>
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-foreground/15" />
            <span
              className="font-credits text-[10px] text-muted-foreground"
              suppressHydrationWarning
            >
              {day.label}
            </span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-foreground/15" />
          </div>
          <ul className="flex flex-col gap-0.5">
            {day.runs.map((run, runIdx) => (
              <RunGroup key={runIdx} run={run} viewerId={viewerId} />
            ))}
          </ul>
        </section>
      ))}
      <div ref={bottomRef} aria-hidden />
    </div>
  );
}

function RunGroup({
  run,
  viewerId,
}: {
  run: FriendMessage[];
  viewerId: string;
}) {
  const own = run[0].sender_id === viewerId;
  return (
    <>
      {run.map((m, i) => {
        const isFirst = i === 0;
        const isLast = i === run.length - 1;
        return (
          <Bubble
            key={m.id}
            message={m}
            own={own}
            isFirst={isFirst}
            isLast={isLast}
            showTime={isLast}
          />
        );
      })}
    </>
  );
}

function Bubble({
  message,
  own,
  isFirst,
  isLast,
  showTime,
}: {
  message: FriendMessage;
  own: boolean;
  isFirst: boolean;
  isLast: boolean;
  showTime: boolean;
}) {
  const time = new Date(message.created_at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const corners = own
    ? cn(!isFirst && "rounded-tr-md", !isLast && "rounded-br-md")
    : cn(!isFirst && "rounded-tl-md", !isLast && "rounded-bl-md");

  return (
    <li
      className={cn(
        "flex w-full",
        own ? "justify-end" : "justify-start",
        isFirst ? "mt-2 first:mt-0" : "mt-0.5",
      )}
    >
      <div className="flex max-w-[82%] flex-col gap-1 sm:max-w-[70%] lg:max-w-[60%]">
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-[15px] leading-relaxed whitespace-pre-wrap break-words sm:text-sm lg:px-4 lg:py-2.5",
            own
              ? "bg-[#ecb756] text-[#1a1840] shadow-[0_1px_0_color-mix(in_oklch,var(--color-brand-gold)_45%,transparent)]"
              : "bg-panel-2 text-foreground shadow-sm ring-1 ring-foreground/[0.04]",
            corners,
          )}
        >
          {message.body}
        </div>
        {showTime ? (
          <div
            className={cn(
              "flex items-center gap-1 px-1 text-[10px] text-muted-foreground",
              own ? "justify-end" : "justify-start",
            )}
          >
            <span suppressHydrationWarning>{time}</span>
            {own ? (
              message.read_at ? (
                <CheckCheckIcon
                  className="size-3 text-[#ecb756]"
                  aria-label="Read"
                />
              ) : (
                <CheckIcon className="size-3" aria-label="Sent" />
              )
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

type Day = { label: string; runs: FriendMessage[][] };

function groupMessages(messages: FriendMessage[]): Day[] {
  const days = new Map<string, FriendMessage[]>();
  for (const m of messages) {
    const key = dayKey(new Date(m.created_at));
    if (!days.has(key)) days.set(key, []);
    days.get(key)!.push(m);
  }
  return Array.from(days.entries()).map(([label, items]) => ({
    label,
    runs: chunkRuns(items),
  }));
}

function chunkRuns(items: FriendMessage[]): FriendMessage[][] {
  const runs: FriendMessage[][] = [];
  for (const m of items) {
    const last = runs[runs.length - 1];
    const prev = last?.[last.length - 1];
    const sameSender = prev?.sender_id === m.sender_id;
    const closeInTime =
      prev !== undefined &&
      new Date(m.created_at).getTime() -
        new Date(prev.created_at).getTime() <
        GROUP_GAP_MS;
    if (last && sameSender && closeInTime) {
      last.push(m);
    } else {
      runs.push([m]);
    }
  }
  return runs;
}

function dayKey(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
