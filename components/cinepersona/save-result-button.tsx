"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveResultAction } from "@/lib/cinepersona/save-result";
import type { LikertValue } from "@/lib/cinepersona";

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
    <section className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-border bg-muted/30 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p className="text-sm font-medium text-foreground">
          {signedIn ? "Save to your profile" : "Save and get a shareable link"}
        </p>
        <p className="text-sm text-muted-foreground">
          {signedIn
            ? "Keeps the result on your account so it shows up in your settings."
            : "We'll generate a permalink you can come back to. No account required."}
        </p>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : null}
      </div>
      <Button type="button" onClick={onSave} disabled={pending}>
        {pending ? (
          <>
            <CheckIcon className="size-4" /> Saving…
          </>
        ) : (
          <>
            <SaveIcon className="size-4" /> Save my result
          </>
        )}
      </Button>
    </section>
  );
}
