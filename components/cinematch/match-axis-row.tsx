import { cn } from "@/lib/utils";
import type { AxisBreakdown } from "@/lib/match/types";

type Props = {
  axisName: string;
  data: AxisBreakdown;
};

export function MatchAxisRow({ axisName, data }: Props) {
  const opposite = data.label_self !== data.label_other;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>{axisName}</span>
        {opposite ? (
          <span className="text-amber-600 dark:text-amber-400 normal-case tracking-normal">
            opposite poles
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <BarSide
          letter={data.label_self}
          pct={data.self_pct}
          label="You"
          align="left"
        />
        <BarSide
          letter={data.label_other}
          pct={data.other_pct}
          label="Match"
          align="right"
        />
      </div>
    </div>
  );
}

function BarSide({
  letter,
  pct,
  label,
  align,
}: {
  letter: string;
  pct: number;
  label: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "space-y-1",
        align === "right" ? "items-end text-right" : "items-start text-left",
      )}
    >
      <div className="flex items-baseline gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{letter}</span>
        <span className="font-mono tabular-nums">{pct}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "absolute inset-y-0 bg-foreground/80",
            align === "right" ? "right-0" : "left-0",
          )}
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}
