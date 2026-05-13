"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { SendHorizonalIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMatchMessage } from "@/lib/match/actions";
import { MESSAGE_MAX_LEN } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  matchId: string;
  viewerId: string;
};

const MIN_HEIGHT = 40; // px — matches a single-line textarea
const MAX_HEIGHT = 160; // px — ~6 lines before it scrolls

export function ChatForm({ matchId, viewerId }: Props) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const tooLong = trimmed.length > MESSAGE_MAX_LEN;
  const empty = trimmed.length === 0;
  const showCounter = trimmed.length >= 1500;
  const disabled = pending || empty || tooLong;

  // Auto-grow the textarea to fit content, capped by MAX_HEIGHT.
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
      const result = await sendMatchMessage(matchId, trimmed);
      if (!result.ok) {
        toast.error(errorLabel(result.error));
        return;
      }
      setValue("");
      // Reset height after clearing.
      if (ref.current) ref.current.style.height = `${MIN_HEIGHT}px`;
      ref.current?.focus();
      window.dispatchEvent(
        new CustomEvent("cinematch:message-sent", {
          detail: {
            id: result.id,
            match_id: matchId,
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
      className="flex w-full items-end gap-2 sm:gap-2.5"
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
          className="scrollbar-hide min-h-10 resize-none rounded-2xl border-foreground/15 bg-card/70 px-4 py-2.5 text-base leading-relaxed shadow-none focus-visible:ring-2 focus-visible:ring-[#ecb756]/60 focus-visible:ring-offset-0 sm:rounded-full sm:py-2 sm:text-sm lg:px-5 lg:py-2.5"
        />
        {showCounter ? (
          <p
            className={cn(
              "mt-1 px-2 text-right text-[11px] tabular-nums",
              tooLong ? "text-destructive" : "text-muted-foreground",
            )}
            aria-live="polite"
          >
            {trimmed.length} / {MESSAGE_MAX_LEN}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="icon"
        aria-label="Send message"
        disabled={disabled}
        className="size-10 shrink-0 rounded-full bg-[#ecb756] text-[#1a1840] shadow-[0_1px_0_color-mix(in_oklch,var(--color-brand-gold)_55%,transparent)] transition-transform hover:bg-[#f3cd84] active:scale-95 disabled:bg-foreground/15 disabled:text-foreground/40 disabled:shadow-none lg:size-11"
      >
        <SendHorizonalIcon className="size-4 lg:size-[18px]" />
      </Button>
    </form>
  );
}

function errorLabel(err: string): string {
  switch (err) {
    case "no_consent":
      return "Both sides need to allow messaging first.";
    case "blocked":
      return "You can't message this user.";
    case "rate_limited":
      return "You're sending messages too fast. Slow down.";
    case "too_long":
      return "Message is too long.";
    case "not_party":
      return "You aren't part of this match.";
    case "unauthorized":
      return "Sign in first.";
    default:
      return "Couldn't send. Try again.";
  }
}
