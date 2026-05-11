import { axes as cinepersonaAxes } from "@/lib/cinepersona";
import type { MatchBreakdown } from "@/lib/match/types";

type Props = {
  breakdown: MatchBreakdown;
  sharedCount: number;
};

/**
 * One-sentence summary of *why* this is a match — picks the axis with the
 * smallest delta as the "strongest agreement" and the largest as the
 * "biggest divergence". Falls back to a watched-overlap hook when both
 * sides are close on all axes.
 */
export function SimilarityNarrative({ breakdown, sharedCount }: Props) {
  const rows = [
    { idx: 0, delta: breakdown.axes.axis_1.delta },
    { idx: 1, delta: breakdown.axes.axis_2.delta },
    { idx: 2, delta: breakdown.axes.axis_3.delta },
    { idx: 3, delta: breakdown.axes.axis_4.delta },
  ];
  const sortedAsc = [...rows].sort((a, b) => a.delta - b.delta);
  const closest = sortedAsc[0];
  const furthest = sortedAsc[sortedAsc.length - 1];

  const closestName = cinepersonaAxes[closest.idx]?.name ?? "";
  const furthestName = cinepersonaAxes[furthest.idx]?.name ?? "";

  const allClose = furthest.delta <= 10;

  return (
    <p className="text-sm text-muted-foreground">
      {allClose ? (
        <>
          Aligned across all four axes
          {sharedCount > 0 ? (
            <>
              {" "}· {sharedCount} shared film{sharedCount === 1 ? "" : "s"} in
              your watch histories.
            </>
          ) : (
            <>.</>
          )}
        </>
      ) : (
        <>
          Strongest on <span className="text-foreground">{closestName}</span>,
          you diverge most on{" "}
          <span className="text-foreground">{furthestName}</span>
          {sharedCount > 0 ? (
            <>
              {" "}· {sharedCount} shared film{sharedCount === 1 ? "" : "s"}.
            </>
          ) : (
            <>.</>
          )}
        </>
      )}
    </p>
  );
}
