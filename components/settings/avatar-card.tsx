"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  removeAvatarAction,
  updateAvatarAction,
  type SettingsActionState,
} from "@/lib/settings/actions";
import { authErrorMessages } from "@/lib/auth/errors";

const initialState: SettingsActionState = {};
const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,image/gif";

type Props = {
  username: string;
  initialAvatarUrl: string | null;
};

export function AvatarCard({ username, initialAvatarUrl }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateAvatarAction,
    initialState,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [removing, startRemove] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(
        authErrorMessages[state.error] ?? "Could not upload avatar.",
      );
    } else if (state?.ok && state.message === "avatar_updated") {
      toast.success("Avatar updated.");
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    }
  }, [state, router]);

  // Revoke object URLs to avoid leaks when the preview changes/unmounts.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 2 MB or smaller.");
      e.target.value = "";
      setPreview(null);
      return;
    }
    if (!ACCEPTED.split(",").includes(file.type)) {
      toast.error("Use a JPG, PNG, WebP, or GIF image.");
      e.target.value = "";
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  function handleRemove() {
    startRemove(async () => {
      const res = await removeAvatarAction();
      if (res.ok) {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("Avatar removed.");
        router.refresh();
      } else {
        toast.error("Could not remove avatar. Try again.");
      }
    });
  }

  const visible = preview ?? initialAvatarUrl;
  const fallback = username.slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>
          A square image works best. JPG, PNG, WebP, or GIF — up to 2 MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          noValidate
          className="flex flex-col gap-4 sm:flex-row sm:items-start"
        >
          <Avatar className="size-20 shrink-0 sm:size-24">
            {visible ? <AvatarImage src={visible} alt="" /> : null}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-3">
            <Field
              data-invalid={
                Boolean(state?.fieldErrors?.avatar) || undefined
              }
            >
              <FieldLabel htmlFor="settings-avatar" className="sr-only">
                Avatar image
              </FieldLabel>
              <input
                ref={fileInputRef}
                id="settings-avatar"
                name="avatar"
                type="file"
                accept={ACCEPTED}
                onChange={handleFileChange}
                className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-background file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
              />
              <FieldDescription>
                Uploading a new image replaces your current avatar.
              </FieldDescription>
              {state?.fieldErrors?.avatar ? (
                <FieldError>{state.fieldErrors.avatar}</FieldError>
              ) : null}
            </Field>
            <div className="flex justify-end gap-2">
              {initialAvatarUrl ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemove}
                  disabled={removing || pending}
                >
                  {removing ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <TrashIcon />
                  )}
                  Remove
                </Button>
              ) : null}
              <Button type="submit" disabled={pending || !preview}>
                {pending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <UploadIcon />
                )}
                Upload
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
