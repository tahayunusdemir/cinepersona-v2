"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
    <section aria-label="Plans" className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3">
        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <TabsList className="rounded-full border border-foreground/10 bg-foreground/[0.03] p-1">
            <TabsTrigger
              value="monthly"
              className="rounded-full px-5 data-[state=active]:bg-foreground/10 data-[state=active]:text-foreground"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="rounded-full px-5 data-[state=active]:bg-[#ecb756] data-[state=active]:text-[#1a1840] data-[state=active]:hover:bg-[#f3cd84]"
            >
              Yearly
              <Badge
                variant="secondary"
                className="ml-1.5 border-0 bg-foreground/15 px-1.5 text-[10px] tracking-wide text-foreground data-[state=active]:bg-[#1a1840]/15"
              >
                Save 20%
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {period === "yearly"
            ? "Yearly bills once · switch back anytime"
            : "Monthly renews · cancel anytime"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => {
          const price = priceForPeriod(plan, period);
          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all",
                plan.highlighted
                  ? "border-[#ecb756]/40 bg-gradient-to-b from-panel-2 to-panel"
                  : "border-foreground/10 bg-panel hover:border-foreground/20",
              )}
            >
              {plan.highlighted ? (
                <div
                  aria-hidden
                  className="absolute -right-24 -top-24 size-72 rounded-full bg-[#ecb756]/10 blur-3xl"
                />
              ) : null}
              <div className="relative flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      Plan 0{i + 1} / 04
                    </div>
                    <h3 className="mt-2 font-display text-2xl tracking-tight">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.highlighted ? (
                    <Badge className="border-0 bg-[#ecb756] text-[#1a1840] hover:bg-[#f3cd84]">
                      Popular
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl leading-none text-[#ecb756]">
                    {price.display}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {price.suffix}
                  </span>
                </div>
                <p className="mt-1 h-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {price.note ?? ""}
                </p>

                <p className="mt-5 text-sm text-foreground/85">
                  {plan.description}
                </p>

                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-[#ecb756]"
                        aria-hidden
                      />
                      <span className="text-foreground/85">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  {plan.id === "free" ? (
                    <Link
                      href="/register"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 w-full rounded-full border border-foreground/15 bg-foreground/[0.02] text-foreground hover:bg-foreground/[0.06]",
                      )}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <Link
                      href={`/checkout/${plan.id}?period=${period}`}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 w-full rounded-full",
                        plan.highlighted
                          ? "bg-[#ecb756] text-[#1a1840] hover:bg-[#f3cd84] hover:text-[#1a1840]"
                          : "border border-foreground/15 bg-foreground/[0.02] text-foreground hover:bg-foreground/[0.06]",
                      )}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
