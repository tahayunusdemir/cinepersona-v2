"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, RotateCcwIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  likertScale,
  likertLabels,
  likertShortLabels,
  questions,
  unansweredQuestionIds,
  type LikertValue,
} from "@/lib/cinepersona";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cinepersona:test-answers:v1";

type Answers = Record<number, LikertValue>;

export function TestForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hydrate from localStorage after mount. setState here is intentional —
  // SSR has no window, so we have to defer the read to a client effect.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Answers;
        if (parsed && typeof parsed === "object") {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAnswers(parsed);
        }
      }
    } catch {
      // Unreadable storage — start fresh.
    }
    setHydrated(true);
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Quota or private mode — silently ignore; the test still works in-memory.
    }
  }, [answers, hydrated]);

  const unanswered = useMemo(() => unansweredQuestionIds(answers), [answers]);
  const totalCount = questions.length;
  const answeredCount = totalCount - unanswered.length;
  const progress = Math.round((answeredCount / totalCount) * 100);
  const allAnswered = unanswered.length === 0;

  function setAnswer(id: number, value: LikertValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function reset() {
    setAnswers({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpToFirstUnanswered() {
    const nextId = unanswered[0];
    if (nextId === undefined) return;
    const el = document.getElementById(`q-${nextId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function submit() {
    if (!allAnswered) {
      jumpToFirstUnanswered();
      return;
    }
    setSubmitting(true);
    // Encode answers compactly: a=<48 chars from -3..+3, mapped to 0..6>
    const compact = questions
      .map((q) => answers[q.id] + 3)
      .join("");
    router.push(`/cinetest/result?a=${compact}`);
  }

  return (
    <div className="space-y-8">
      <div className="sticky top-14 z-30 -mx-4 border-b bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <Progress value={progress} className="flex-1" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {answeredCount} / {totalCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={jumpToFirstUnanswered}
            disabled={allAnswered || answeredCount === 0}
          >
            Next unanswered
          </Button>
        </div>
      </div>

      <ol className="space-y-6">
        {questions.map((q) => {
          const value = answers[q.id];
          const answered = value !== undefined;
          return (
            <li
              key={q.id}
              id={`q-${q.id}`}
              className={cn(
                "scroll-mt-32 rounded-lg border p-4 sm:p-5",
                answered
                  ? "border-border/70 bg-background"
                  : "border-dashed border-border/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Q{q.id} · Axis {q.axis}
                  </p>
                  <p className="text-base text-foreground">{q.body}</p>
                </div>
                {answered ? (
                  <Badge variant="secondary" className="shrink-0">
                    {likertShortLabels[value]}
                  </Badge>
                ) : null}
              </div>
              <fieldset
                className="mt-4"
                aria-label={`Likert response for question ${q.id}`}
              >
                <legend className="sr-only">{q.body}</legend>
                <div className="grid grid-cols-7 gap-1">
                  {likertScale.map((v) => {
                    const selected = value === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAnswer(q.id, v)}
                        aria-pressed={selected}
                        title={likertLabels[v]}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[11px] transition-colors",
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                        )}
                      >
                        <span className="font-mono text-sm">
                          {v > 0 ? `+${v}` : v}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  <span>Strongly disagree</span>
                  <span>Neutral</span>
                  <span>Strongly agree</span>
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 p-5 sm:flex-row sm:justify-between">
        <div className="text-sm">
          {allAnswered ? (
            <p className="text-foreground">
              All {totalCount} answered. Ready when you are.
            </p>
          ) : (
            <p className="text-muted-foreground">
              {totalCount - answeredCount} questions left.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            type="button"
          >
            <RotateCcwIcon className="size-4" />
            Reset
          </Button>
          <Link
            href="/cinetest"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
          <Button
            type="button"
            onClick={submit}
            disabled={submitting}
          >
            See my result
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
