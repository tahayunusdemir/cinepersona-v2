"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckIcon, MessageSquareIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { setMatchConsent } from "@/lib/match/actions";

type Props = {
  matchId: string;
  ownGranted: boolean;
  bothConsented: boolean;
};

export function ConsentButton({ matchId, ownGranted, bothConsented }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onToggle = () => {
    start(async () => {
      const result = await setMatchConsent(matchId, !ownGranted);
      if (!result.ok) {
        toast.error(
          result.error === "blocked"
            ? "You can't message this user."
            : "Couldn't update consent. Try again.",
        );
        return;
      }
      if (!ownGranted && result.both_consented) {
        toast.success("Messages unlocked.");
      } else if (ownGranted) {
        toast("Consent removed.");
      } else {
        toast.success("Consent given. Waiting on your match.");
      }
      router.refresh();
    });
  };

  if (ownGranted) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        disabled={pending}
        aria-label="Withdraw messaging consent"
      >
        {bothConsented ? (
          <CheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XIcon className="size-4" />
        )}
        {bothConsented ? "Messaging open" : "Withdraw consent"}
      </Button>
    );
  }
  return (
    <Button size="sm" onClick={onToggle} disabled={pending}>
      <MessageSquareIcon className="size-4" />
      Allow messaging
    </Button>
  );
}
