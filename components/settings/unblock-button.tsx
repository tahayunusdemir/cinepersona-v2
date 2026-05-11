"use client";

import { useActionState, useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  unblockUserAction,
  type BlockActionState,
} from "@/lib/community/blocks";

const initialState: BlockActionState = {};

type Props = {
  targetId: string;
  username: string;
};

export function UnblockButton({ targetId, username }: Props) {
  const [state, formAction, pending] = useActionState(
    unblockUserAction,
    initialState,
  );

  useEffect(() => {
    if (state?.ok && state.message === "unblocked") {
      toast.success(`Unblocked @${username}.`);
    } else if (state?.error === "unauthorized") {
      toast.error("You need to be signed in.");
    } else if (state?.error === "unknown") {
      toast.error("Could not unblock. Please try again.");
    }
  }, [state, username]);

  return (
    <form action={formAction}>
      <input type="hidden" name="target_id" value={targetId} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Unblock
      </Button>
    </form>
  );
}
