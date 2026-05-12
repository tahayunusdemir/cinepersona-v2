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
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6">
          <h1 className="mt-5 font-display text-3xl tracking-tight sm:text-5xl">
            We couldn’t read{" "}
            <span className="text-[#ecb756]">your result.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            The link looks incomplete. Take the test again to get your CineType.
          </p>
          <Link
            href="/cinetest/take"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 inline-flex h-12 rounded-full bg-[#ecb756] px-6 text-base font-medium text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]",
            )}
          >
            Take the CineTest
          </Link>
        </div>
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
