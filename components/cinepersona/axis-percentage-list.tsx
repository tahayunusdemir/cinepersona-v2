import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { axes } from "@/lib/cinepersona/axes";
import type { AxisScore } from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

type Props = {
  axisScores: readonly AxisScore[];
  /** Render the rows without the surrounding Card/title — for embedding
   *  inside another container (e.g. a Tabs panel). */
  embedded?: boolean;
};

function Rows({ axisScores }: { axisScores: readonly AxisScore[] }) {
  return (
    <div className="space-y-5">
      {axisScores.map((score) => {
        const def = axes.find((a) => a.id === score.axis);
        if (!def) return null;
        const primaryPct = score.primaryPct;
        const oppositePct = 100 - primaryPct;
        const primaryWins = primaryPct >= 50;
        return (
          <div key={score.axis} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium tracking-tight">{def.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Axis {score.axis}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div
                className={cn(
                  "rounded-md border px-3 py-2",
                  primaryWins
                    ? "border-foreground/40 bg-foreground/[0.04]"
                    : "border-border/60",
                )}
              >
                <p
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    primaryWins ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {def.primary.letter} · {def.primary.name}
                </p>
                <p className="mt-1 font-mono text-xl tabular-nums">
                  {primaryPct}
                  <span className="text-sm text-muted-foreground">%</span>
                </p>
              </div>
              <div
                className={cn(
                  "rounded-md border px-3 py-2",
                  !primaryWins
                    ? "border-foreground/40 bg-foreground/[0.04]"
                    : "border-border/60",
                )}
              >
                <p
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    !primaryWins ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {def.opposite.letter} · {def.opposite.name}
                </p>
                <p className="mt-1 font-mono text-xl tabular-nums">
                  {oppositePct}
                  <span className="text-sm text-muted-foreground">%</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AxisPercentageList({ axisScores, embedded = false }: Props) {
  if (embedded) {
    return <Rows axisScores={axisScores} />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">By the numbers</CardTitle>
      </CardHeader>
      <CardContent>
        <Rows axisScores={axisScores} />
      </CardContent>
    </Card>
  );
}
