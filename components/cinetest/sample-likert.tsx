"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { LikertCircle } from "@/components/cinetest/likert-circle";
import {
  likertLabels,
  likertScale,
  likertShortLabels,
} from "@/lib/cinepersona/scoring";
import type { LikertValue } from "@/lib/cinepersona/types";

// One real Likert prompt from the Symbolic axis — visually identical to what
// the user sees inside the test, so the preview teaches the interaction.
const SAMPLE = {
  id: 13,
  axis: 2,
  body: "Open endings satisfy me.",
} as const;

export function SampleLikert() {
  const [value, setValue] = useState<LikertValue | undefined>(undefined);
  const answered = value !== undefined;

  return (
    <div className="rounded-lg border bg-background p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Q{SAMPLE.id} · Axis {SAMPLE.axis} · sample
          </p>
          <p className="text-base text-foreground">{SAMPLE.body}</p>
        </div>
        {answered ? (
          <Badge variant="secondary" className="shrink-0">
            {likertShortLabels[value]}
          </Badge>
        ) : null}
      </div>

      <fieldset className="mt-4" aria-label="Sample Likert response">
        <legend className="sr-only">{SAMPLE.body}</legend>
        <div className="flex items-center justify-between gap-1 px-1 sm:gap-2">
          {likertScale.map((v) => (
            <LikertCircle
              key={v}
              value={v}
              selected={value === v}
              onSelect={() => setValue(v)}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Strongly disagree</span>
          <span>Neutral</span>
          <span>Strongly agree</span>
        </div>
      </fieldset>

      <p
        aria-live="polite"
        className="mt-4 min-h-5 text-xs text-muted-foreground"
      >
        {answered
          ? `You picked “${likertLabels[value]}.” In the real test, 48 answers like this map you onto four axes.`
          : "Tap any circle to feel the scale — bigger circles mean stronger agreement."}
      </p>
    </div>
  );
}
