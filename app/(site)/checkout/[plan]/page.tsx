import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeftIcon, ShieldCheckIcon } from "lucide-react";

import { FrameTag } from "@/components/cinema/atoms";
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
    <div className="relative isolate overflow-hidden">

      <div className="mx-auto w-full max-w-5xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14">
        <Link
          href="/pricing"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-[#ecb756]"
        >
          <ChevronLeftIcon className="size-3" aria-hidden />
          Back to pricing
        </Link>

        <div className="mb-10">
          <h1 className="mt-3 font-display text-3xl tracking-tight sm:text-5xl">
            Complete your{" "}
            <span className="text-[#ecb756]">purchase.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            You’re upgrading to{" "}
            <span className="font-medium text-foreground">{plan.name}</span>{" "}
            on the {period} plan. Cancel anytime from Settings.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-foreground/10 bg-panel p-6 sm:p-7">
            <CheckoutForm
              planName={plan.name}
              amount={amount}
              period={period}
              email={userData.user.email ?? ""}
            />
          </div>

          <aside className="lg:order-last">
            <div className="sticky top-20 overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-panel-2 to-panel p-6">
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <FrameTag>Order summary</FrameTag>
                    <p className="mt-3 font-display text-2xl tracking-tight">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {plan.tagline}
                    </p>
                  </div>
                  <Badge className="border-0 bg-[#ecb756] capitalize text-[#1a1840] hover:bg-[#f3cd84]">
                    {period}
                  </Badge>
                </div>

                <Separator className="my-5 bg-foreground/10" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {plan.name} ({period})
                    </span>
                    <span className="font-medium tabular-nums">${amount}</span>
                  </div>
                  {savings > 0 ? (
                    <div className="flex items-center justify-between text-[#ecb756]">
                      <span>Yearly savings</span>
                      <span className="tabular-nums">−${savings}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span className="tabular-nums">Calculated next step</span>
                  </div>
                </div>

                <Separator className="my-5 bg-foreground/10" />

                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Total due today
                  </span>
                  <div className="text-right">
                    <p className="font-display text-3xl text-[#ecb756] tabular-nums">
                      ${amount}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      per {period === "yearly" ? "year" : "month"}
                    </p>
                  </div>
                </div>

                <p className="mt-5 flex items-start gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 text-xs text-muted-foreground">
                  <ShieldCheckIcon
                    className="mt-0.5 size-4 shrink-0 text-[#ecb756]"
                    aria-hidden
                  />
                  <span>
                    Billing isn’t live yet — this checkout is a Stripe
                    placeholder. No card will be charged.
                  </span>
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
