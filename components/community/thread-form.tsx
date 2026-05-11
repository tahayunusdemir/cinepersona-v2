"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createThreadAction,
  updateThreadAction,
  type CommunityActionState,
} from "@/lib/community/actions";

const initial: CommunityActionState = {};

type Props = {
  mode: "create" | "edit";
  boardSlug: string;
  threadId?: string;
  defaultTitle?: string;
  defaultBody?: string;
};

export function ThreadForm({
  mode,
  boardSlug,
  threadId,
  defaultTitle = "",
  defaultBody = "",
}: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(
    mode === "create" ? createThreadAction : updateThreadAction,
    initial,
  );

  useEffect(() => {
    if (state?.ok && mode === "edit") {
      toast.success("Thread updated.");
      if (state.redirect) router.push(state.redirect);
    }
    if (state?.error === "board_locked") {
      toast.error("This board is locked.");
    } else if (state?.error === "validation") {
      toast.error("Please fix the highlighted fields.");
    } else if (state?.error === "unauthorized") {
      toast.error("Please sign in.");
    } else if (state?.error) {
      toast.error("Could not save thread.");
    }
  }, [state, mode, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="board_slug" value={boardSlug} />
      {mode === "edit" && threadId ? (
        <input type="hidden" name="thread_id" value={threadId} />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          minLength={8}
          maxLength={200}
          defaultValue={defaultTitle}
          placeholder="A clear, specific title (8–200 chars)"
          aria-invalid={Boolean(state?.fieldErrors?.title) || undefined}
        />
        {state?.fieldErrors?.title ? (
          <p className="text-xs text-destructive">{state.fieldErrors.title}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          name="body"
          required
          minLength={20}
          maxLength={10000}
          rows={12}
          defaultValue={defaultBody}
          placeholder={`Markdown supported: **bold**, *italic*, [link](https://...), \`code\`, > quote, - list`}
          aria-invalid={Boolean(state?.fieldErrors?.body) || undefined}
        />
        {state?.fieldErrors?.body ? (
          <p className="text-xs text-destructive">{state.fieldErrors.body}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Markdown supported. Links open in a new tab; images and HTML are
          stripped.
        </p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : null}
          {mode === "create" ? "Post thread" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
