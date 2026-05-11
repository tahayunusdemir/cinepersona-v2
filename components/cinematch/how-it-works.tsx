import { SparklesIcon, UserPlusIcon, MessageSquareIcon } from "lucide-react";

import { WEEKLY_REQUEST_LIMIT } from "@/lib/match/types";

type Step = {
  icon: typeof UserPlusIcon;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    icon: UserPlusIcon,
    title: "Join the pool",
    body: "Your CinePersona axes and watched films become discoverable to the matcher.",
  },
  {
    icon: SparklesIcon,
    title: "Request a match",
    body: `Spend one of ${WEEKLY_REQUEST_LIMIT} weekly requests. We page you the moment someone hits 90%+.`,
  },
  {
    icon: MessageSquareIcon,
    title: "Both opt in to chat",
    body: "Either party can accept. Chat unlocks the moment both of you tap consent.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <li
          key={step.title}
          className="relative rounded-lg border bg-card p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <span
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-[10px] tabular-nums"
              aria-hidden
            >
              {i + 1}
            </span>
            <step.icon className="size-4" aria-hidden />
          </div>
          <p className="mt-3 text-sm font-semibold">{step.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {step.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
