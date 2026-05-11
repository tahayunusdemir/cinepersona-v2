"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { CheckIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { markMessagesRead } from "@/lib/match/actions";
import type { MatchMessage } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  matchId: string;
  viewerId: string;
  initial: MatchMessage[];
};

export function ChatThread({ matchId, viewerId, initial }: Props) {
  const [messages, setMessages] = useState<MatchMessage[]>(initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Realtime: subscribe to inserts on this match.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`match-messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const row = payload.new as MatchMessage;
          setMessages((cur) =>
            cur.some((m) => m.id === row.id) ? cur : [...cur, row],
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "match_messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const row = payload.new as MatchMessage;
          setMessages((cur) =>
            cur.map((m) => (m.id === row.id ? { ...m, read_at: row.read_at } : m)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  // Mark partner messages as read whenever new ones arrive.
  useEffect(() => {
    const hasUnread = messages.some(
      (m) => m.sender_id !== viewerId && !m.read_at,
    );
    if (!hasUnread) return;
    startTransition(() => {
      markMessagesRead(matchId).catch(() => {});
    });
  }, [matchId, messages, viewerId]);

  // Auto-scroll on new messages.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const grouped = useMemo(() => groupByDay(messages), [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        <p>No messages yet.</p>
        <p>Send the first message — break the ice.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {grouped.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <div className="my-2 flex items-center gap-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span>{group.label}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <ul className="space-y-2">
            {group.items.map((m) => (
              <Bubble key={m.id} message={m} viewerId={viewerId} />
            ))}
          </ul>
        </section>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function Bubble({
  message,
  viewerId,
}: {
  message: MatchMessage;
  viewerId: string;
}) {
  const own = message.sender_id === viewerId;
  const time = new Date(message.created_at).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <li
      className={cn(
        "flex w-full",
        own ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words",
          own
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        <div>{message.body}</div>
        <div
          className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            own ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          <span>{time}</span>
          {own ? (
            <span aria-label={message.read_at ? "Read" : "Sent"}>
              <CheckIcon className="size-3" />
              {message.read_at ? <CheckIcon className="size-3 -ml-2" /> : null}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

type Group = { label: string; items: MatchMessage[] };

function groupByDay(messages: MatchMessage[]): Group[] {
  const groups = new Map<string, MatchMessage[]>();
  for (const m of messages) {
    const d = new Date(m.created_at);
    const key = d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({
    label,
    items,
  }));
}
