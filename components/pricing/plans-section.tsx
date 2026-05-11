"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { plans, type Plan } from "@/lib/pricing/data";
import { cn } from "@/lib/utils";

type Period = "monthly" | "yearly";

function formatPrice(value: number) {
  return `$${value.toFixed(2).replace(/\.00$/, "")}`;
}

function priceForPeriod(plan: Plan, period: Period) {
  if (plan.monthly === 0) {
    return { display: "$0", suffix: "/ month", note: null as string | null };
  }
  if (period === "monthly") {
    return {
      display: formatPrice(plan.monthly),
      suffix: "/ month",
      note: null,
    };
  }
  const fullYear = plan.monthly * 12;
  const saved = Math.round(((fullYear - plan.yearly) / fullYear) * 100);
  return {
    display: formatPrice(plan.yearly),
    suffix: "/ year",
    note: `Save ${saved}% vs monthly`,
  };
}

export function PlansSection() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section aria-label="Plans" className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-3">
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge
                variant="secondary"
                className="ml-1.5 px-1.5 text-[10px] tracking-wide"
              >
                Save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground">
          {period === "yearly"
            ? "Yearly plans bill once a year. Switch back anytime."
            : "Monthly plans renew every month. Cancel anytime."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const price = priceForPeriod(plan, period);
          return (
            <Card
              key={plan.id}
              className={cn(
                "h-full",
                plan.highlighted &&
                  "ring-2 ring-foreground/40 shadow-lg shadow-foreground/5",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.highlighted ? (
                    <Badge variant="default">Most popular</Badge>
                  ) : null}
                </div>
                <CardDescription>{plan.tagline}</CardDescription>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    {price.display}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {price.suffix}
                  </span>
                </div>
                <p className="mt-1 h-4 text-xs text-muted-foreground">
                  {price.note ?? ""}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-foreground/70"
                        aria-hidden
                      />
                      <span className="text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.id === "free" ? (
                  <Link
                    href="/register"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full",
                    )}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <Link
                    href={`/checkout/${plan.id}?period=${period}`}
                    className={cn(
                      buttonVariants({
                        variant: plan.highlighted ? "default" : "outline",
                      }),
                      "w-full",
                    )}
                  >
                    {plan.cta}
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
