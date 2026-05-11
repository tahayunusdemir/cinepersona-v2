import { cn } from "@/lib/utils";
import type { AxisLetter } from "@/lib/cinepersona";

type AxisBarProps = {
  axisName: string;
  primaryLetter: AxisLetter;
  primaryName: string;
  oppositeLetter: AxisLetter;
  oppositeName: string;
  primaryPct: number;
  className?: string;
};

export function AxisBar({
  axisName,
  primaryLetter,
  primaryName,
  oppositeLetter,
  oppositeName,
  primaryPct,
  className,
}: AxisBarProps) {
  const oppositePct = 100 - primaryPct;
  const winningLeft = primaryPct >= 50;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between text-xs uppercase tracking-wider text-muted-foreground">
        <span>{axisName}</span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex flex-col items-start text-sm",
            winningLeft ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span className="font-medium">
            {primaryLetter}
          </span>
          <span className="text-xs">{primaryName}</span>
        </div>

        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 bg-foreground/80"
            style={{ width: `${primaryPct}%` }}
            aria-hidden
          />
          <div
            className="absolute inset-y-0 top-0 h-full w-px bg-background/80"
            style={{ left: "50%" }}
            aria-hidden
          />
        </div>

        <div
          className={cn(
            "flex flex-col items-end text-sm",
            !winningLeft ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span className="font-medium">{oppositeLetter}</span>
          <span className="text-xs">{oppositeName}</span>
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{primaryPct}%</span>
        <span>{oppositePct}%</span>
      </div>
    </div>
  );
}
