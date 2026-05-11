"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { ExternalLinkIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateProfileAction,
  type SettingsActionState,
} from "@/lib/settings/actions";
import { authErrorMessages } from "@/lib/auth/errors";
import { cn } from "@/lib/utils";

const initialState: SettingsActionState = {};

const DISPLAY_NAME_MAX = 50;
const BIO_MAX = 160;
const LINK_MAX = 200;

type Props = {
  username: string;
  initialDisplayName: string | null;
  initialBio: string | null;
  initialLink: string | null;
};

function counterTone(length: number, max: number): string {
  if (length >= max) return "text-destructive";
  if (length >= max - Math.max(5, Math.round(max * 0.1))) return "text-amber-500";
  return "text-muted-foreground";
}

export function ProfileCard({
  username,
  initialDisplayName,
  initialBio,
  initialLink,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [bio, setBio] = useState(initialBio ?? "");
  const [link, setLink] = useState(initialLink ?? "");

  useEffect(() => {
    if (state?.error && state.error !== "validation") {
      toast.error(authErrorMessages[state.error]);
    } else if (state?.ok && state.message === "profile_updated") {
      toast.success("Profile updated.");
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          How you appear on CinePersona. Your username{" "}
          <span className="font-medium text-foreground">@{username}</span> cannot
          be changed.
        </CardDescription>
        <CardAction>
          <Link
            href={`/${username}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            View profile
            <ExternalLinkIcon />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form action={formAction} noValidate>
          <FieldGroup>
            <Field
              data-invalid={
                Boolean(state?.fieldErrors?.display_name) || undefined
              }
            >
              <FieldLabel htmlFor="settings-display-name">
                <span>Display name</span>
                <span
                  className={cn(
                    "ml-auto text-xs tabular-nums",
                    counterTone(displayName.length, DISPLAY_NAME_MAX),
                  )}
                  aria-live="polite"
                >
                  {displayName.length}/{DISPLAY_NAME_MAX}
                </span>
              </FieldLabel>
              <Input
                id="settings-display-name"
                name="display_name"
                type="text"
                maxLength={DISPLAY_NAME_MAX}
                autoComplete="nickname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                aria-invalid={
                  Boolean(state?.fieldErrors?.display_name) || undefined
                }
              />
              <FieldDescription>
                Up to 50 characters. Leave blank to fall back to @{username}.
              </FieldDescription>
              {state?.fieldErrors?.display_name ? (
                <FieldError>{state.fieldErrors.display_name}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(state?.fieldErrors?.bio) || undefined}>
              <FieldLabel htmlFor="settings-bio">
                <span>Bio</span>
                <span
                  className={cn(
                    "ml-auto text-xs tabular-nums",
                    counterTone(bio.length, BIO_MAX),
                  )}
                  aria-live="polite"
                >
                  {bio.length}/{BIO_MAX}
                </span>
              </FieldLabel>
              <Textarea
                id="settings-bio"
                name="bio"
                maxLength={BIO_MAX}
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                aria-invalid={Boolean(state?.fieldErrors?.bio) || undefined}
              />
              <FieldDescription>
                A short description shown on your profile. Up to 160 characters.
              </FieldDescription>
              {state?.fieldErrors?.bio ? (
                <FieldError>{state.fieldErrors.bio}</FieldError>
              ) : null}
            </Field>

            <Field data-invalid={Boolean(state?.fieldErrors?.link) || undefined}>
              <FieldLabel htmlFor="settings-link">
                <span>Link</span>
                <span
                  className={cn(
                    "ml-auto text-xs tabular-nums",
                    counterTone(link.length, LINK_MAX),
                  )}
                  aria-live="polite"
                >
                  {link.length}/{LINK_MAX}
                </span>
              </FieldLabel>
              <Input
                id="settings-link"
                name="link"
                type="url"
                inputMode="url"
                maxLength={LINK_MAX}
                autoComplete="url"
                placeholder="instagram.com/yourhandle"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                aria-invalid={Boolean(state?.fieldErrors?.link) || undefined}
              />
              <FieldDescription>
                One link to show under your bio — Instagram, X, Letterboxd,
                your site, anything. We&apos;ll add https:// for you.
              </FieldDescription>
              {state?.fieldErrors?.link ? (
                <FieldError>{state.fieldErrors.link}</FieldError>
              ) : null}
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={pending}>
                {pending ? <Loader2Icon className="animate-spin" /> : null}
                Save profile
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
