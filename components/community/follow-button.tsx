"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, UserMinusIcon, UserPlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/community/actions";
import { cn } from "@/lib/utils";

type Props = {
  targetId: string;
  username: string;
  initiallyFollowing: boolean;
  isSelf: boolean;
  isAuthed: boolean;
  isBlockedByViewer: boolean;
  size?: "sm" | "default";
  className?: string;
};

export function FollowButton({
  targetId,
  username,
  initiallyFollowing,
  isSelf,
  isAuthed,
  isBlockedByViewer,
  size = "default",
  className,
}: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [, startTransition] = useTransition();
  const [following, setFollowing] = useOptimistic(
    initiallyFollowing,
    (_cur, next: boolean) => next,
  );

  if (isSelf) return null;

  if (isBlockedByViewer) {
    return (
      <Button
        size={size}
        variant="outline"
        disabled
        className={cn("text-muted-foreground", className)}
      >
        Blocked
      </Button>
    );
  }

  const handle = () => {
    if (!isAuthed) {
      router.push(
        `/login?next=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }
    startTransition(async () => {
      const next = !following;
      setFollowing(next);
      const res = next
        ? await followUser(targetId)
        : await unfollowUser(targetId);
      if (!res.ok) {
        if (res.error === "blocked") {
          toast.error("You can't follow this user.");
        } else if (res.error === "unauthorized") {
          toast.error("Please sign in to follow.");
        } else {
          toast.error("Could not update follow.");
        }
        setFollowing(!next);
      } else {
        toast.success(
          next ? `Following @${username}.` : `Unfollowed @${username}.`,
        );
        router.refresh();
      }
    });
  };

  if (following) {
    return (
      <Button
        size={size}
        variant="outline"
        onClick={handle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={className}
      >
        {hovered ? (
          <>
            <UserMinusIcon /> Unfollow
          </>
        ) : (
          <>Following</>
        )}
      </Button>
    );
  }

  return (
    <Button size={size} onClick={handle} className={className}>
      <UserPlusIcon /> Follow
    </Button>
  );
}

export function FollowButtonPending() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Loader2Icon className="animate-spin" />
    </Button>
  );
}
