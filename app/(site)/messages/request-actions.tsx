"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  acceptFriendRequest,
  removeFriendship,
} from "@/lib/friends/actions";

export function IncomingActions({
  friendshipId,
  targetUsername,
}: {
  friendshipId: string;
  targetUsername: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const accept = () => {
    start(async () => {
      const res = await acceptFriendRequest(friendshipId, targetUsername);
      if (res.ok) {
        toast.success(`You and @${targetUsername} are now friends.`);
        router.refresh();
      } else {
        toast.error("Could not accept.");
      }
    });
  };

  const decline = () => {
    start(async () => {
      const res = await removeFriendship(friendshipId, targetUsername);
      if (res.ok) {
        toast.message("Request declined.");
        router.refresh();
      } else {
        toast.error("Could not decline.");
      }
    });
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button size="sm" onClick={accept} disabled={pending} aria-label="Accept">
        {pending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <CheckIcon />
        )}
        Accept
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={decline}
        disabled={pending}
        aria-label="Decline"
      >
        <XIcon />
        Decline
      </Button>
    </div>
  );
}

export function OutgoingActions({
  friendshipId,
  targetUsername,
}: {
  friendshipId: string;
  targetUsername: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const cancel = () => {
    start(async () => {
      const res = await removeFriendship(friendshipId, targetUsername);
      if (res.ok) {
        toast.message("Request cancelled.");
        router.refresh();
      } else {
        toast.error("Could not cancel.");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={cancel}
      disabled={pending}
      className="shrink-0"
    >
      {pending ? <Loader2Icon className="animate-spin" /> : <XIcon />}
      Cancel
    </Button>
  );
}
