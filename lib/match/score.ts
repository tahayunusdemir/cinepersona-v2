// Pure scoring helpers — mirror the SQL matcher in 08_cinematch.sql.
// Kept in TS so the breakdown view in the UI can recompute axis deltas
// without an extra round-trip.

import { AXES_WEIGHT, WATCHED_WEIGHT } from "./types";

export type Pcts = readonly [number, number, number, number];

export function axesScore(a: Pcts, b: Pcts): number {
  const avgDiff =
    (Math.abs(a[0] - b[0]) +
      Math.abs(a[1] - b[1]) +
      Math.abs(a[2] - b[2]) +
      Math.abs(a[3] - b[3])) /
    4;
  return Math.max(0, Math.round(100 - avgDiff));
}

export function watchedOverlapPct(
  sharedCount: number,
  countA: number,
  countB: number,
): number {
  const denom = Math.min(countA, countB);
  if (denom === 0) return 0;
  return Math.min(100, Math.round((sharedCount / denom) * 100));
}

export function similarityPct(axesPct: number, watchedPct: number): number {
  return Math.round(axesPct * AXES_WEIGHT + watchedPct * WATCHED_WEIGHT);
}
