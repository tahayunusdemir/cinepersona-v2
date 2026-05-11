import type { Metadata } from "next";
import Link from "next/link";

import { ResultView } from "@/components/cinepersona/result-view";
import { SaveResultButton } from "@/components/cinepersona/save-result-button";
import { buttonVariants } from "@/components/ui/button";
import { questions, type LikertValue } from "@/lib/cinepersona";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type SearchParams = Promise<{ a?: string | string[] }>;

export const metadata: Metadata = {
  title: "Your CineType",
  description: "The type that matches the way you watch.",
};

function decodeAnswers(raw: string | undefined) {
  if (!raw || raw.length !== questions.length) return null;
  const answers: Record<number, LikertValue> = {};
  for (let i = 0; i < questions.length; i++) {
    const ch = raw[i];
    const n = Number.parseInt(ch, 10);
    if (Number.isNaN(n) || n < 0 || n > 6) return null;
    answers[questions[i].id] = (n - 3) as LikertValue;
  }
  return answers;
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.a) ? sp.a[0] : sp.a;
  const answers = decodeAnswers(raw);

  if (!answers) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 pt-16 pb-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          We couldn&apos;t read your result.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The link looks incomplete. Take the test again to get your CineType.
        </p>
        <Link
          href="/cinetest/take"
          className={cn(buttonVariants({ variant: "default" }), "mt-6 inline-flex")}
        >
          Take the CineTest
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ResultView
      answers={answers}
      saveSlot={
        <SaveResultButton answers={answers} signedIn={Boolean(user)} />
      }
    />
  );
}
