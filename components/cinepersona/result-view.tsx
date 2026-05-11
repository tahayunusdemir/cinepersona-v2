import Link from "next/link";
import { ArrowRightIcon, RotateCcwIcon } from "lucide-react";

import { AxisBar } from "@/components/cinepersona/axis-bar";
import { AxisPercentageList } from "@/components/cinepersona/axis-percentage-list";
import { AxisRadar } from "@/components/cinepersona/axis-radar";
import {
  PicksDisplay,
  type DisplayPick,
} from "@/components/cinepersona/picks-display";
import { TypeCard } from "@/components/cinepersona/type-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  axes,
  getGroup,
  getProfile,
  getStrategy,
  getType,
  scoreTest,
  typesInGroup,
  type LikertValue,
} from "@/lib/cinepersona";
import { cn } from "@/lib/utils";

type ResultViewProps = {
  answers: Record<number, LikertValue>;
  saveSlot?: React.ReactNode;
  picks?: DisplayPick[];
  picksHint?: string;
};

export function ResultView({
  answers,
  saveSlot,
  picks,
  picksHint,
}: ResultViewProps) {
  const result = scoreTest(answers);
  const type = getType(result.code);
  const profile = type ? getProfile(type.code) : undefined;
  const group = type ? getGroup(type.group) : undefined;
  const strategy = type ? getStrategy(type.strategy) : undefined;
  const peers = type
    ? typesInGroup(type.group).filter((t) => t.code !== type.code)
    : [];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-12 pb-24 sm:px-6">
      <section className="text-center">
        <Badge variant="secondary" className="mb-4">
          Your CineType
        </Badge>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {result.code}
        </p>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {type ? type.name : "Unknown type"}
        </h1>
        {type ? (
          <p className="mt-4 max-w-2xl mx-auto text-balance text-base text-muted-foreground sm:text-lg">
            {type.tagline}
          </p>
        ) : null}
        {group && strategy ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href={`/cinetype/groups/${group.slug}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {group.name}
              </Badge>
            </Link>
            <Link href={`/cinetype/strategies/${strategy.slug}`}>
              <Badge variant="outline" className="hover:bg-muted">
                {strategy.name}
              </Badge>
            </Link>
          </div>
        ) : null}
      </section>

      <Card className="mt-10">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">Your axis profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bars">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="bars">Bars</TabsTrigger>
              <TabsTrigger value="numbers">Numbers</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
            </TabsList>

            <TabsContent value="bars" className="pt-6">
              <div className="space-y-6">
                {result.axes.map((axisScore) => {
                  const axis = axes.find((a) => a.id === axisScore.axis)!;
                  return (
                    <AxisBar
                      key={axisScore.axis}
                      axisName={axis.name}
                      primaryLetter={axis.primary.letter}
                      primaryName={axis.primary.name}
                      oppositeLetter={axis.opposite.letter}
                      oppositeName={axis.opposite.name}
                      primaryPct={axisScore.primaryPct}
                    />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="numbers" className="pt-6">
              <AxisPercentageList axisScores={result.axes} embedded />
            </TabsContent>

            <TabsContent value="radar" className="pt-6">
              <AxisRadar axisScores={result.axes} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {picks ? (
        <div className="mt-8">
          <PicksDisplay picks={picks} emptyHint={picksHint} />
        </div>
      ) : null}

      {saveSlot}

      {profile ? (
        <section className="mt-10 space-y-4">
          {profile.sections
            .filter((s) => s.slug === "overview")
            .map((s) => (
              <div key={s.slug} className="space-y-3">
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Who they are
                </h2>
                {s.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-base leading-relaxed text-foreground/90">
                    {para}
                  </p>
                ))}
              </div>
            ))}
        </section>
      ) : null}

      {type ? (
        <section className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium text-foreground">
              Read the full profile
            </p>
            <p className="text-sm text-muted-foreground">
              Strengths, blind spots, viewing rituals, and films and directors
              they&apos;d love.
            </p>
          </div>
          <Link
            href={`/cinetype/${type.slug}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Open {type.code}
            <ArrowRightIcon className="size-4" />
          </Link>
        </section>
      ) : null}

      {peers.length > 0 && group ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">
            Other {group.name}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {peers.map((peer) => (
              <TypeCard key={peer.code} type={peer} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/cinetest/take"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <RotateCcwIcon className="size-4" />
          Retake the test
        </Link>
        <Link
          href="/cinetype"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          Browse all types
        </Link>
      </div>
    </div>
  );
}
