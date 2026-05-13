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
import { markMessagesRead } from "@/lib/match/actions";
import type { MatchMessage } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  matchId: string;
  viewerId: string;
  initial: MatchMessage[];
};

const GROUP_GAP_MS = 5 * 60 * 1000; // group consecutive bubbles within 5 min

export function ChatThread({ matchId, viewerId, initial }: Props) {
  const [messages, setMessages] = useState<MatchMessage[]>(initial);
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [, startTransition] = useTransition();

  // Realtime via client-to-client broadcast (no DB publication needed).
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`match:${matchId}:messages`, {
      config: { broadcast: { self: false } },
    });

    channel.on("broadcast", { event: "message_created" }, (msg) => {
      const row = msg.payload as MatchMessage;
      if (!row || row.match_id !== matchId) return;
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
  }, [matchId]);

  // Optimistic append from ChatForm; forwarded to the partner.
  useEffect(() => {
    const onSent = (e: Event) => {
      const detail = (e as CustomEvent<MatchMessage>).detail;
      if (!detail || detail.match_id !== matchId) return;
      setMessages((cur) =>
        cur.some((m) => m.id === detail.id) ? cur : [...cur, detail],
      );
      channelRef.current?.send({
        type: "broadcast",
        event: "message_created",
        payload: detail,
      });
    };
    window.addEventListener("cinematch:message-sent", onSent);
    return () => window.removeEventListener("cinematch:message-sent", onSent);
  }, [matchId]);

  // Mark partner messages as read + broadcast receipt.
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
      markMessagesRead(matchId).catch(() => {});
    });
    const senderId = unread[0].sender_id;
    channelRef.current?.send({
      type: "broadcast",
      event: "messages_read",
      payload: { sender_id: senderId, read_at: readAt },
    });
  }, [matchId, messages, viewerId]);

  // Auto-scroll on new messages.
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
            Break the ice — say hi or share what you're watching.
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
  run: MatchMessage[];
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
  message: MatchMessage;
  own: boolean;
  isFirst: boolean;
  isLast: boolean;
  showTime: boolean;
}) {
  // Fixed locale + 24h format. The browser locale differs from the server
  // locale, which would cause SSR/client hydration mismatch.
  const time = new Date(message.created_at).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Round corners except on the side that connects to neighbors in the run,
  // so a group of bubbles reads as one unit (iMessage / WhatsApp style).
  const corners = own
    ? cn(
        !isFirst && "rounded-tr-md",
        !isLast && "rounded-br-md",
      )
    : cn(
        !isFirst && "rounded-tl-md",
        !isLast && "rounded-bl-md",
      );

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

type Day = { label: string; runs: MatchMessage[][] };

function groupMessages(messages: MatchMessage[]): Day[] {
  const days = new Map<string, MatchMessage[]>();
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

// Adjacent messages from the same sender within GROUP_GAP_MS form a run.
function chunkRuns(items: MatchMessage[]): MatchMessage[][] {
  const runs: MatchMessage[][] = [];
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

// Fixed locale; do NOT use `new Date()` here — comparing the message date to
// "today" would diverge between the server (UTC) and the client (local),
// triggering a hydration mismatch. Absolute label only.
function dayKey(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
