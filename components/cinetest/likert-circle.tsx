"use client";

import { likertLabels } from "@/lib/cinepersona/scoring";
import type { LikertValue } from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

type Props = {
  value: LikertValue;
  selected: boolean;
  onSelect: () => void;
};

// Classic Likert visual: 7 circles, large-to-small as you approach neutral,
// red for disagree, gray for neutral, green for agree. Mirrors the
// "decreasing/increasing radio" pattern used by personality tests.
const SIZE: Record<LikertValue, string> = {
  [-3]: "size-10 sm:size-12",
  [-2]: "size-8 sm:size-10",
  [-1]: "size-6 sm:size-8",
  [0]: "size-5 sm:size-6",
  [1]: "size-6 sm:size-8",
  [2]: "size-8 sm:size-10",
  [3]: "size-10 sm:size-12",
};

type Side = "disagree" | "neutral" | "agree";

function side(value: LikertValue): Side {
  if (value < 0) return "disagree";
  if (value > 0) return "agree";
  return "neutral";
}

// Base (unselected) ring + dot colors.
const RING_BASE: Record<Side, string> = {
  disagree: "border-rose-400/50 hover:border-rose-500/80",
  neutral: "border-muted-foreground/30 hover:border-muted-foreground/60",
  agree: "border-emerald-400/50 hover:border-emerald-500/80",
};

const FILL_SELECTED: Record<Side, string> = {
  disagree: "bg-rose-500 border-rose-500 text-white",
  neutral: "bg-muted-foreground border-muted-foreground text-background",
  agree: "bg-emerald-500 border-emerald-500 text-white",
};

const HOVER_FILL: Record<Side, string> = {
  disagree: "hover:bg-rose-500/10",
  neutral: "hover:bg-muted",
  agree: "hover:bg-emerald-500/10",
};

export function LikertCircle({ value, selected, onSelect }: Props) {
  const s = side(value);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={likertLabels[value]}
      title={likertLabels[value]}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-2 transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        SIZE[value],
        selected
          ? FILL_SELECTED[s]
          : cn(RING_BASE[s], HOVER_FILL[s], "bg-transparent"),
      )}
    >
      <span className="sr-only">{likertLabels[value]}</span>
    </button>
  );
}
