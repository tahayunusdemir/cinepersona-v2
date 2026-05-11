import { Badge } from "@/components/ui/badge";
import { AxisBar } from "@/components/cinepersona/axis-bar";
import { axes } from "@/lib/cinepersona/axes";
import { getType } from "@/lib/cinepersona/personality-types";

// Frozen example result. Values chosen to clearly favour each primary letter
// so the bars read at a glance — this is a *teaching* preview, not a live
// score.
const SAMPLE_PERCENTAGES: Record<number, number> = {
  1: 72, // E
  2: 65, // S
  3: 58, // A
  4: 80, // C
};

export function SampleResult() {
  const type = getType("ESAC");
  if (!type) return null;

  return (
    <div className="space-y-5 rounded-lg border bg-background p-4 sm:p-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Sample result</Badge>
          <Badge variant="outline" className="capitalize">
            {type.group}
          </Badge>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
            {type.code}
          </span>
          <span className="text-base text-muted-foreground">{type.name}</span>
        </div>
        <p className="text-sm text-muted-foreground">{type.tagline}</p>
      </header>

      <ul className="space-y-4">
        {axes.map((axis) => (
          <li key={axis.id}>
            <AxisBar
              axisName={axis.name}
              primaryLetter={axis.primary.letter}
              primaryName={axis.primary.name}
              oppositeLetter={axis.opposite.letter}
              oppositeName={axis.opposite.name}
              primaryPct={SAMPLE_PERCENTAGES[axis.id]}
            />
          </li>
        ))}
      </ul>

      <p className="border-t pt-4 text-xs italic text-muted-foreground">
        “{type.quote}”
      </p>
    </div>
  );
}
