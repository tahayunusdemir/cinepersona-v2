import Link from "next/link";
import { CheckIcon, FilmIcon, SparklesIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { WATCHED_MIN } from "@/lib/match/types";
import { cn } from "@/lib/utils";

type Props = {
  reason: "no_test" | "watched_too_few";
  watchedCount: number;
};

/**
 * Onboarding progress for users who can't join the pool yet.
 *
 * Replaces a destructive alert with a 2-step progress card. The first step
 * (CineTest) is required for axes; the second (≥20 watched films) is required
 * for the overlap component of the score.
 */
export function EligibilityProgress({ reason, watchedCount }: Props) {
  const testDone = reason !== "no_test";
  const watchedDone = watchedCount >= WATCHED_MIN;
  const completed = (testDone ? 1 : 0) + (watchedDone ? 1 : 0);
  const watchedPct = Math.min(
    100,
    Math.round((watchedCount / WATCHED_MIN) * 100),
  );

  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold sm:text-base">
          Two steps to unlock matches
        </p>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {completed} / 2
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        <Step
          icon={SparklesIcon}
          title="Take the CineTest"
          body="Sets your 4-axis personality snapshot."
          done={testDone}
          cta={!testDone ? { href: "/cinetest", label: "Start" } : null}
        />
        <Step
          icon={FilmIcon}
          title={`Mark ${WATCHED_MIN} watched films`}
          body={
            watchedDone
              ? `You have ${watchedCount}.`
              : `${watchedCount} / ${WATCHED_MIN} so far. We need this to score watched-overlap.`
          }
          done={watchedDone}
          cta={
            !watchedDone ? { href: "/films", label: "Browse films" } : null
          }
          progress={!watchedDone ? watchedPct : null}
        />
      </ul>
    </Card>
  );
}

function Step({
  icon: Icon,
  title,
  body,
  done,
  cta,
  progress,
}: {
  icon: typeof FilmIcon;
  title: string;
  body: string;
  done: boolean;
  cta: { href: string; label: string } | null;
  progress?: number | null;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full border",
          done
            ? "border-foreground bg-foreground text-background"
            : "bg-background text-muted-foreground",
        )}
        aria-hidden
      >
        {done ? <CheckIcon className="size-3.5" /> : <Icon className="size-3.5" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p
            className={cn(
              "text-sm font-medium",
              done && "text-muted-foreground line-through",
            )}
          >
            {title}
          </p>
          {cta ? (
            <Link
              href={cta.href}
              className="text-xs font-medium underline underline-offset-2 hover:no-underline"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
        {typeof progress === "number" ? (
          <Progress value={progress} className="mt-2 h-1.5" />
        ) : null}
      </div>
    </li>
  );
}
