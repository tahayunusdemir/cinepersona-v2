"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart";
import { axes } from "@/lib/cinepersona/axes";
import type { AxisScore } from "@/lib/cinepersona/types";

type Props = {
  axisScores: readonly AxisScore[];
};

const chartConfig: ChartConfig = {
  primary: {
    label: "Primary share",
    color: "var(--foreground)",
  },
};

export function AxisRadar({ axisScores }: Props) {
  const data = axes.map((axis) => {
    const score = axisScores.find((s) => s.axis === axis.id);
    const primaryPct = score?.primaryPct ?? 50;
    return {
      axisName: axis.name,
      pole: `${axis.primary.letter} · ${axis.primary.name}`,
      opposite: `${axis.opposite.letter} · ${axis.opposite.name}`,
      primary: primaryPct,
    };
  });

  return (
    <div className="space-y-4">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-md"
      >
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="var(--border)" gridType="polygon" />
          <PolarAngleAxis
            dataKey="pole"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            stroke="transparent"
          />
          <Radar
            dataKey="primary"
            stroke="var(--foreground)"
            fill="var(--foreground)"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--foreground)" }}
          />
        </RadarChart>
      </ChartContainer>

      <ul className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        {data.map((d) => (
          <li
            key={d.axisName}
            className="flex items-baseline justify-between gap-3 rounded-md border border-border/60 px-2.5 py-1.5"
          >
            <span className="truncate">
              <span className="text-foreground">{d.pole.split(" · ")[0]}</span>{" "}
              vs {d.opposite.split(" · ")[0]}
            </span>
            <span className="font-mono tabular-nums text-foreground">
              {d.primary}%
            </span>
          </li>
        ))}
      </ul>

      <p className="text-center text-[11px] text-muted-foreground">
        Each spoke shows your share of the axis&apos; primary pole. 50% means
        balanced; closer to the edge means a stronger lean.
      </p>
    </div>
  );
}
