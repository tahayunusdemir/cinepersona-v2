"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendMatchMessage } from "@/lib/match/actions";
import { MESSAGE_MAX_LEN } from "@/lib/match/types";

type Props = {
  matchId: string;
};

export function ChatForm({ matchId }: Props) {
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);

  const trimmed = value.trim();
  const tooLong = trimmed.length > MESSAGE_MAX_LEN;
  const empty = trimmed.length === 0;
  const showCounter = trimmed.length >= 1500;

  const submit = () => {
    if (empty || tooLong || pending) return;
    start(async () => {
      const result = await sendMatchMessage(matchId, trimmed);
      if (!result.ok) {
        toast.error(errorLabel(result.error));
        return;
      }
      setValue("");
      ref.current?.focus();
      // Realtime listener will pick up the row; refresh to keep server state
      // in sync (e.g. read receipts from the partner).
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2"
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
          placeholder="Type your message…"
          aria-label="Message"
          className="min-h-[2.5rem] resize-none"
        />
        {showCounter ? (
          <p
            className={`mt-1 text-right text-[11px] ${
              tooLong ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {trimmed.length} / {MESSAGE_MAX_LEN}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        size="icon"
        aria-label="Send"
        disabled={pending || empty || tooLong}
      >
        <SendIcon className="size-4" />
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
