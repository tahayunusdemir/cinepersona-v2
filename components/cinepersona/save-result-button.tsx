"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckIcon, LinkIcon, SaveIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
import { ctaPrimary } from "@/lib/ui-tokens";
import { saveResultAction } from "@/lib/cinepersona/save-result";
import type { LikertValue } from "@/lib/cinepersona";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cinepersona:test-answers:v1";

type Props = {
  answers: Record<number, LikertValue>;
  signedIn: boolean;
};

export function SaveResultButton({ answers, signedIn }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSave() {
    setError(null);
    const payload: Record<string, number> = {};
    for (const [k, v] of Object.entries(answers)) payload[k] = v;
    start(async () => {
      const res = await saveResultAction(payload);
      if (!res.ok) {
        setError(
          res.error === "invalid_answers"
            ? "Your answers look incomplete. Take the test again."
            : "Couldn't save right now — please try again.",
        );
        return;
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      router.push(`/cinetest/result/${res.id}`);
    });
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#ecb756]/25 bg-panel p-7 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-[#ecb756]/15 blur-3xl"
      />
      <div className="relative">
        <FrameTag>{signedIn ? "Save to profile" : "Keep this result"}</FrameTag>
        <p className="mt-3 font-display text-xl tracking-tight">
          {signedIn
            ? "Pin this to your profile."
            : "Get a permalink you can come back to."}
        </p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {signedIn
            ? "Your CineType will appear in your account and on your community profile."
            : "We'll mint a shareable link to this result — no account needed."}
        </p>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className={cn(
          ctaPrimary,
          "group relative mt-5 disabled:opacity-70 sm:mt-0",
        )}
      >
        {pending ? (
          <>
            <CheckIcon className="size-4" /> Saving…
          </>
        ) : signedIn ? (
          <>
            <SaveIcon className="size-4" /> Save to profile
          </>
        ) : (
          <>
            <LinkIcon className="size-4" /> Save & get link
          </>
        )}
      </button>
    </section>
  );
}
