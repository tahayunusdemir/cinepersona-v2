import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

import { AxisBar } from "@/components/cinepersona/axis-bar";
import { AxisPercentageList } from "@/components/cinepersona/axis-percentage-list";
import { AxisRadar } from "@/components/cinepersona/axis-radar";
import {
  PicksDisplay,
  type DisplayPick,
} from "@/components/cinepersona/picks-display";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { axes } from "@/lib/cinepersona/axes";
import { getType } from "@/lib/cinepersona/personality-types";
import type { AxisId, AxisLetter, AxisScore } from "@/lib/cinepersona/types";
import { cn } from "@/lib/utils";

type Props = {
  typeCode: string;
  axisPercents: [number, number, number, number];
  picks: DisplayPick[];
  picksVisible: boolean;
  isSelf: boolean;
  username: string;
};

function buildAxisScores(
  typeCode: string,
  axisPercents: [number, number, number, number],
): AxisScore[] {
  return axes.map((axis, i) => {
    const primaryPct = axisPercents[i];
    const userLetter = (typeCode[i] ?? axis.primary.letter) as AxisLetter;
    return {
      axis: axis.id as AxisId,
      primary: axis.primary.letter,
      letter: userLetter,
      primaryPct,
      raw: 0,
    };
  });
}

export function CinePersonaCard({
  typeCode,
  axisPercents,
  picks,
  picksVisible,
  isSelf,
  username,
}: Props) {
  const type = getType(typeCode);
  const axisScores = buildAxisScores(typeCode, axisPercents);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <SparklesIcon className="size-3.5" /> CineType
          </p>
          <CardTitle className="text-lg">
            {type ? type.name : typeCode}{" "}
            <span className="font-mono text-sm text-muted-foreground">
              {typeCode}
            </span>
          </CardTitle>
          {type ? (
            <p className="text-sm text-muted-foreground">{type.tagline}</p>
          ) : null}
        </div>
        {isSelf ? (
          <Link
            href="/cinetest/take"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "shrink-0",
            )}
          >
            Retake
            <ArrowRightIcon className="size-4" />
          </Link>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-5">
        <Tabs defaultValue="bars">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="bars">Bars</TabsTrigger>
            <TabsTrigger value="numbers">Numbers</TabsTrigger>
            <TabsTrigger value="radar">Radar</TabsTrigger>
          </TabsList>

          <TabsContent value="bars" className="pt-4">
            <div className="space-y-5">
              {axisScores.map((score) => {
                const def = axes.find((a) => a.id === score.axis)!;
                return (
                  <AxisBar
                    key={score.axis}
                    axisName={def.name}
                    primaryLetter={def.primary.letter}
                    primaryName={def.primary.name}
                    oppositeLetter={def.opposite.letter}
                    oppositeName={def.opposite.name}
                    primaryPct={score.primaryPct}
                  />
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="numbers" className="pt-4">
            <AxisPercentageList axisScores={axisScores} embedded />
          </TabsContent>

          <TabsContent value="radar" className="pt-4">
            <AxisRadar axisScores={axisScores} />
          </TabsContent>
        </Tabs>

        {picksVisible || isSelf ? (
          <PicksDisplay
            title="Film picks"
            picks={picks}
            emptyHint={
              isSelf
                ? "You haven't attached any picks yet. Retake the test to add them."
                : `@${username} hasn't attached any picks yet.`
            }
          />
        ) : (
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              Private
            </Badge>
            @{username} keeps their film picks private.
          </div>
        )}

        {type ? (
          <div className="flex justify-end">
            <Link
              href={`/cinetype/${type.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Open {type.code} profile
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
