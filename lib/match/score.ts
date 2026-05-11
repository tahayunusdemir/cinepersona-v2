// Pure scoring functions for the match compute path.
// Spec: docs/specs/cinematch.md §4.

export type Pcts = readonly [number, number, number, number];

export type SimilarityInput = {
  axesA: Pcts;
  axesB: Pcts;
  picksA: number[]; // movie_id (DB pk)
  picksB: number[];
  watchedA: number[]; // movie_id, capped at WATCHED_RECENT_CAP most recent
  watchedB: number[];
};

export type Similarity = {
  total: number;
  axes: number;
  picks: number;
  watched: number;
};

export function axesScore(a: Pcts, b: Pcts): number {
  const avgDiff =
    (Math.abs(a[0] - b[0]) +
      Math.abs(a[1] - b[1]) +
      Math.abs(a[2] - b[2]) +
      Math.abs(a[3] - b[3])) /
    4;
  return Math.max(0, Math.round(100 - avgDiff));
}

export function jaccard(a: number[], b: number[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const A = new Set(a);
  const B = new Set(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = new Set([...A, ...B]).size;
  return union === 0 ? 0 : Math.round((inter / union) * 100);
}

export function similarity(input: SimilarityInput): Similarity {
  const axes = axesScore(input.axesA, input.axesB);
  const picks = jaccard(input.picksA, input.picksB);
  const watched = jaccard(input.watchedA, input.watchedB);
  const total = Math.round(axes * 0.4 + picks * 0.3 + watched * 0.3);
  return { total, axes, picks, watched };
}

export function sharedSorted(a: number[], b: number[]): number[] {
  const B = new Set(b);
  const seen = new Set<number>();
  const out: number[] = [];
  for (const x of a) {
    if (!seen.has(x) && B.has(x)) {
      seen.add(x);
      out.push(x);
    }
  }
  return out;
}
