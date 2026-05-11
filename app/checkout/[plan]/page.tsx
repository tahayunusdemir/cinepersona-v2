import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon, ShieldCheckIcon } from "lucide-react";

import { CheckoutForm } from "@/components/pricing/checkout-form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPlan } from "@/lib/pricing/data";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ plan: string }>;
  searchParams: Promise<{ period?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { plan: planId } = await params;
  const plan = getPlan(planId);
  if (!plan || plan.id === "free") return { title: "Checkout — CinePersona" };
  return { title: `Checkout · ${plan.name} — CinePersona` };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps) {
  const { plan: planId } = await params;
  const { period: periodParam } = await searchParams;

  const plan = getPlan(planId);
  if (!plan || plan.id === "free") notFound();

  const period: "monthly" | "yearly" =
    periodParam === "yearly" ? "yearly" : "monthly";

  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) {
    const next = encodeURIComponent(`/checkout/${plan.id}?period=${period}`);
    redirect(`/login?next=${next}`);
  }

  const amount = period === "yearly" ? plan.yearly : plan.monthly;
  const fullYear = plan.monthly * 12;
  const savings =
    period === "yearly" ? Math.max(0, fullYear - plan.yearly) : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-8 pb-24 sm:px-6 sm:pt-12">
      <Link
        href="/pricing"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" aria-hidden />
        Back to pricing
      </Link>

      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Complete your purchase
        </h1>
        <p className="text-sm text-muted-foreground">
          You&apos;re upgrading to{" "}
          <span className="font-medium text-foreground">{plan.name}</span> on
          the {period} plan. Cancel anytime from Settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <CheckoutForm
          planName={plan.name}
          amount={amount}
          period={period}
          email={userData.user.email ?? ""}
        />

        <aside className="lg:order-last">
          <div className="sticky top-20 flex flex-col gap-4 rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Order summary
                </p>
                <p className="mt-1 text-lg font-semibold">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {period}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {plan.name} ({period})
                </span>
                <span className="font-medium tabular-nums">${amount}</span>
              </div>
              {savings > 0 ? (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Yearly savings</span>
                  <span className="tabular-nums">−${savings}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="tabular-nums">Calculated at next step</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Total due today</span>
              <div className="text-right">
                <p className="text-2xl font-semibold tabular-nums">${amount}</p>
                <p className="text-xs text-muted-foreground">
                  per {period === "yearly" ? "year" : "month"}
                </p>
              </div>
            </div>

            <p className="flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
              <ShieldCheckIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <span>
                Billing isn&apos;t live yet — this checkout is a Stripe
                placeholder. No card will be charged.
              </span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
