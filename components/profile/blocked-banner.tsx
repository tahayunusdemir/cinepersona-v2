"use client";

import { useActionState, useEffect } from "react";
import { Loader2Icon, ShieldOffIcon, ShieldXIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  unblockUserAction,
  type BlockActionState,
} from "@/lib/community/blocks";

const initialState: BlockActionState = {};

type Props = {
  targetId: string;
  targetUsername: string;
};

export function BlockedBanner({ targetId, targetUsername }: Props) {
  const [state, formAction, pending] = useActionState(
    unblockUserAction,
    initialState,
  );

  useEffect(() => {
    if (state?.ok) {
      toast.success(`@${targetUsername} unblocked.`);
    } else if (state?.error && state.error !== "validation") {
      toast.error("Could not unblock. Please try again.");
    }
  }, [state, targetUsername]);

  return (
    <Alert>
      <ShieldXIcon />
      <AlertTitle>You blocked this user.</AlertTitle>
      <AlertDescription>
        Their threads, comments, and messages stay hidden from your feeds.
      </AlertDescription>
      <AlertAction>
        <form action={formAction}>
          <input type="hidden" name="target_id" value={targetId} />
          <input type="hidden" name="target_username" value={targetUsername} />
          <Button type="submit" variant="outline" size="sm" disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" /> : <ShieldOffIcon />}
            Unblock
          </Button>
        </form>
      </AlertAction>
    </Alert>
  );
}
