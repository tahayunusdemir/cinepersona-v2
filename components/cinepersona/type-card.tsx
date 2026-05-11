import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PersonalityType } from "@/lib/cinepersona";

export function TypeCard({ type }: { type: PersonalityType }) {
  return (
    <Link
      href={`/cinetype/${type.slug}`}
      className="group block focus:outline-none"
      aria-label={`${type.code} — ${type.name}`}
    >
      <Card className="h-full transition-colors group-hover:border-foreground/40 group-focus-visible:border-foreground/70">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {type.code}
            </span>
            <Badge variant="outline" className="capitalize text-[10px]">
              {type.strategy.replace("-", " ")}
            </Badge>
          </div>
          <CardTitle className="text-base font-semibold">{type.name}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {type.tagline}
        </CardContent>
      </Card>
    </Link>
  );
}
