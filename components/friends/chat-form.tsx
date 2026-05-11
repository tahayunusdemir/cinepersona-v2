"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { SendHorizonalIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendFriendMessage } from "@/lib/friends/actions";
import { FRIEND_MESSAGE_MAX_LEN } from "@/lib/friends/types";
import { cn } from "@/lib/utils";

type Props = {
  friendshipId: string;
  viewerId: string;
};

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 160;

export function FriendChatForm({ friendshipId, viewerId }: Props) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const tooLong = trimmed.length > FRIEND_MESSAGE_MAX_LEN;
  const empty = trimmed.length === 0;
  const showCounter = trimmed.length >= 1500;
  const disabled = pending || empty || tooLong;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
    el.style.height = `${next}px`;
  }, [value]);

  const submit = () => {
    if (disabled) return;
    start(async () => {
      const result = await sendFriendMessage(friendshipId, trimmed);
      if (!result.ok) {
        toast.error(errorLabel(result.error));
        return;
      }
      setValue("");
      if (ref.current) ref.current.style.height = `${MIN_HEIGHT}px`;
      ref.current?.focus();
      window.dispatchEvent(
        new CustomEvent("friends:message-sent", {
          detail: {
            id: result.id,
            friendship_id: friendshipId,
            sender_id: viewerId,
            body: trimmed,
            created_at: new Date().toISOString(),
            read_at: null,
          },
        }),
      );
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex w-full items-end gap-2"
    >
      <div className="flex-1">
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          placeholder="Message…"
          aria-label="Message"
          aria-invalid={tooLong || undefined}
          className="scrollbar-hide min-h-10 resize-none rounded-full px-4 py-2 text-sm leading-relaxed"
        />
        {showCounter ? (
          <p
            className={cn(
              "mt-1 px-2 text-right text-[11px] tabular-nums",
              tooLong ? "text-destructive" : "text-muted-foreground",
            )}
            aria-live="polite"
          >
            {trimmed.length} / {FRIEND_MESSAGE_MAX_LEN}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="icon"
        aria-label="Send message"
        disabled={disabled}
        className="size-10 shrink-0 rounded-full"
      >
        <SendHorizonalIcon className="size-4" />
      </Button>
    </form>
  );
}

function errorLabel(err: string): string {
  switch (err) {
    case "not_accepted":
      return "You need to be friends to chat.";
    case "blocked":
      return "You can't message this user.";
    case "rate_limited":
      return "You're sending messages too fast. Slow down.";
    case "too_long":
      return "Message is too long.";
    case "not_party":
      return "You aren't part of this conversation.";
    case "unauthorized":
      return "Sign in first.";
    default:
      return "Couldn't send. Try again.";
  }
}
