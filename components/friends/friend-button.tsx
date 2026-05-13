"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  CheckIcon,
  Loader2Icon,
  MessageCircleIcon,
  MessageCirclePlusIcon,
  UserMinusIcon,
  UserRoundCheckIcon,
  UserRoundXIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  acceptFriendRequest,
  removeFriendship,
  sendFriendRequest,
} from "@/lib/friends/actions";
import type { FriendshipState } from "@/lib/friends/types";
import { cn } from "@/lib/utils";

type Props = {
  targetId: string;
  targetUsername: string;
  state: FriendshipState;
  isAuth: boolean;
  isSelf: boolean;
  isBlockedByViewer: boolean;
  className?: string;
};

export function FriendButton({
  targetId,
  targetUsername,
  state,
  isAuth,
  isSelf,
  isBlockedByViewer,
  className,
}: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [hovered, setHovered] = useState(false);

  if (isSelf) return null;

  const loginNext = `/login?next=${encodeURIComponent(`/${targetUsername}`)}`;

  const ensureAuth = () => {
    if (!isAuth) {
      router.push(loginNext);
      return false;
    }
    return true;
  };

  if (isBlockedByViewer) {
    return (
      <Button size="default" variant="outline" disabled className={cn("text-muted-foreground", className)}>
        Blocked
      </Button>
    );
  }

  // --- not friends ---------------------------------------------------------

  if (state.kind === "none") {
    const send = () => {
      if (!ensureAuth()) return;
      start(async () => {
        const res = await sendFriendRequest(targetId, targetUsername);
        if (res.ok) {
          toast.success(`Message request sent to @${targetUsername}.`);
          router.refresh();
        } else if (res.error === "blocked") {
          toast.error("You can't message this user.");
        } else if (res.error === "already_requested") {
          toast.message("Message request already pending.");
          router.refresh();
        } else if (res.error === "already_friends") {
          toast.success(`You can already message @${targetUsername}.`);
          router.refresh();
        } else {
          toast.error("Could not send message request.");
        }
      });
    };

    return (
      <Button size="default" onClick={send} disabled={pending} className={className}>
        {pending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <MessageCirclePlusIcon />
        )}
        Message
      </Button>
    );
  }

  // --- pending outgoing ----------------------------------------------------

  if (state.kind === "pending_outgoing") {
    const cancel = () => {
      if (!ensureAuth()) return;
      start(async () => {
        const res = await removeFriendship(state.id, targetUsername);
        if (res.ok) {
          toast.message("Message request cancelled.");
          router.refresh();
        } else {
          toast.error("Could not cancel.");
        }
      });
    };

    return (
      <Button
        size="default"
        variant="outline"
        onClick={cancel}
        disabled={pending}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={className}
      >
        {pending ? (
          <Loader2Icon className="animate-spin" />
        ) : hovered ? (
          <>
            <XIcon /> Cancel request
          </>
        ) : (
          <>
            <UserRoundCheckIcon /> Request pending
          </>
        )}
      </Button>
    );
  }

  // --- pending incoming ----------------------------------------------------

  if (state.kind === "pending_incoming") {
    const accept = () => {
      if (!ensureAuth()) return;
      start(async () => {
        const res = await acceptFriendRequest(state.id, targetUsername);
        if (res.ok) {
          toast.success(`You can now message @${targetUsername}.`);
          router.refresh();
        } else {
          toast.error("Could not accept.");
        }
      });
    };
    const decline = () => {
      if (!ensureAuth()) return;
      start(async () => {
        const res = await removeFriendship(state.id, targetUsername);
        if (res.ok) {
          toast.message("Request declined.");
          router.refresh();
        } else {
          toast.error("Could not decline.");
        }
      });
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button size="default" onClick={accept} disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
          Accept
        </Button>
        <Button
          size="default"
          variant="outline"
          onClick={decline}
          disabled={pending}
        >
          <UserRoundXIcon /> Decline
        </Button>
      </div>
    );
  }

  // --- accepted ------------------------------------------------------------

  const unfriend = () => {
    if (!ensureAuth()) return;
    start(async () => {
      const res = await removeFriendship(state.id, targetUsername);
      if (res.ok) {
        toast.message(`Stopped messaging @${targetUsername}.`);
        router.refresh();
      } else {
        toast.error("Could not remove.");
      }
    });
  };

  const message = () => {
    router.push(`/messages/${targetUsername}`);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button size="default" onClick={message} disabled={pending}>
        <MessageCircleIcon /> Open chat
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              disabled={pending}
              aria-label="Message options"
            >
              {pending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <UserRoundCheckIcon />
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={6} className="min-w-44">
          <DropdownMenuItem onClick={unfriend} variant="destructive">
            <UserMinusIcon />
            Stop messaging
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
