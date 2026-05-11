"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2Icon, SendHorizonalIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createCommentAction,
  type CommunityActionState,
} from "@/lib/community/actions";

const initial: CommunityActionState = {};

type Props = {
  threadId: string;
  boardSlug: string;
  parentCommentId?: string;
  placeholder?: string;
  onSuccess?: () => void;
  autoFocus?: boolean;
};

export function CommentForm({
  threadId,
  boardSlug,
  parentCommentId,
  placeholder = "Share your thoughts…",
  onSuccess,
  autoFocus,
}: Props) {
  const [state, action, pending] = useActionState(
    createCommentAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      toast.success("Comment posted.");
      onSuccess?.();
    } else if (state?.error === "unauthorized") {
      toast.error("Please sign in to comment.");
    } else if (state?.error === "thread_locked") {
      toast.error("This thread is locked.");
    } else if (state?.error === "depth_exceeded") {
      toast.error("Maximum reply depth reached.");
    } else if (state?.error === "validation" && state.fieldErrors?.body) {
      toast.error(state.fieldErrors.body);
    } else if (state?.error) {
      toast.error("Could not post comment.");
    }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="thread_id" value={threadId} />
      <input type="hidden" name="board_slug" value={boardSlug} />
      {parentCommentId ? (
        <input
          type="hidden"
          name="parent_comment_id"
          value={parentCommentId}
        />
      ) : null}
      <Textarea
        name="body"
        required
        minLength={1}
        maxLength={5000}
        placeholder={placeholder}
        rows={parentCommentId ? 3 : 4}
        autoFocus={autoFocus}
        aria-invalid={Boolean(state?.fieldErrors?.body) || undefined}
      />
      <div className="flex items-center justify-end">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SendHorizonalIcon />
          )}
          {parentCommentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </form>
  );
}
