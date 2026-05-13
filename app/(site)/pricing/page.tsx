import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  Check,
  Clapperboard,
  CreditCard,
  Minus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { PlansSection } from "@/components/pricing/plans-section";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  matrix,
  planNames,
  type MatrixCellValue,
} from "@/lib/pricing/data";
import {
  badgeBrand,
  card,
  cardCtaBlock,
  cardInteractive,
  credit,
  ctaPrimaryLg,
  ctaSecondaryLg,
  FAMILY_HEX,
  familyAt,
} from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the CinePersona plan that matches how you watch — from Free to Elite Club.",
};

const upgradePrompts = [
  {
    title: "Someone liked you",
    body: "See who’s into your taste — unlock with Plus.",
  },
  {
    title: "3 people matched your taste",
    body: "Daily matches keep your roll fresh on Plus and above.",
  },
  {
    title: "Movie Night invite waiting",
    body: "Host or join group watch parties with Pro.",
  },
];

const referrals = [
  { invited: "1 friend signs up & verifies", reward: "1 week of Plus" },
  { invited: "3 friends sign up & verify", reward: "1 month of Plus" },
  { invited: "10 friends sign up & verify", reward: "3 months of Plus" },
];

const socialHooks = [
  {
    icon: CalendarHeart,
    title: "Movie Night Match",
    body: "Get paired with someone whose taste lines up, then queue the same film at the same time. Reactions show up live.",
  },
  {
    icon: Users,
    title: "Same taste squad",
    body: "Form a small circle around overlapping CineTypes. Weekly picks, shared shortlists, no lurkers.",
  },
  {
    icon: Clapperboard,
    title: "Watch together",
    body: "Synced playback, a quiet side-chat, and a shared watchlist that remembers everyone’s vetoes.",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "No payment yet",
    body: "CinePersona is in early access. Billing isn’t live — every feature is open.",
  },
  {
    icon: CreditCard,
    title: "No card on file",
    body: "Sign up with just an email. We won’t ask for payment until plans launch.",
  },
  {
    icon: Sparkles,
    title: "Cancel anytime",
    body: "When billing arrives, plans stay active until the period ends.",
  },
];

const faqs = [
  {
    q: "Are paid plans live?",
    a: "Not yet. CinePersona is in early access and every feature is open to every signed-in member while we build.",
  },
  {
    q: "Will I be charged automatically?",
    a: "No. There’s no card on file and no automatic billing. When paid plans launch, upgrading will always be opt-in.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Once billing is live you’ll be able to cancel from Settings — your plan stays active until the period ends.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yep. Move up or down whenever you like. We’ll prorate the difference so you only pay for what you use.",
  },
];

function MatrixCell({ value }: { value: MatrixCellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center text-[#ecb756]">
        <Check className="size-4" aria-label="Included" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center text-foreground/20">
        <Minus className="size-4" aria-label="Not included" />
      </span>
    );
  }
  return (
    <span className="font-mono text-[11px] text-foreground/85">{value}</span>
  );
}

export default function PricingPage() {
  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="flex flex-col items-center text-center">
          <Badge variant="outline" className={cn("gap-1.5", badgeBrand)}>
            <Sparkles className="size-3" aria-hidden />
            Free during early access
          </Badge>

          <h1 className="mt-6 max-w-3xl font-display text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
            Pricing for{" "}
            <span className="text-[#ecb756]">the way you watch</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Start free. Upgrade when you want more matches, deeper filters, or
            your own film circle. Every plan keeps the things that make
            CinePersona feel personal.
          </p>
          <p className={cn(credit, "mt-3")}>
            Paid plans aren’t live yet — every feature is open while we build.
          </p>
        </div>
      </section>

      {/* ============== PLANS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <PlansSection />
      </section>

      {/* ============== TRUST STRIP ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 sm:grid-cols-3">
          {trustItems.map((item, i) => (
            <div
              key={item.title}
              className="flex items-start gap-3 bg-panel p-5"
            >
              <span
                className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border"
                style={{
                  borderColor: `${familyAt(i)}33`,
                  background: `${familyAt(i)}1a`,
                  color: familyAt(i),
                }}
              >
                <item.icon className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FEATURE MATRIX ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              Compare every feature
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              A side-by-side look at what each plan unlocks. Read it like a film
              specs sheet — pace, depth, and access.
            </p>
          </div>
          <div className={credit}>16 rows · 4 columns</div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
          <Table>
            <TableHeader>
              <TableRow className="border-foreground/10 hover:bg-transparent">
                <TableHead className="w-[42%] font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Feature
                </TableHead>
                {planNames.map((name, i) => (
                  <TableHead
                    key={name}
                    className="text-center font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: familyAt(i) }}
                  >
                    {name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row, i) => (
                <TableRow
                  key={row.feature}
                  className={cn(
                    "border-foreground/5",
                    i % 2 === 1 && "bg-foreground/[0.012]",
                  )}
                >
                  <TableCell className="font-medium text-foreground/90">
                    {row.feature}
                  </TableCell>
                  {row.values.map((value, index) => (
                    <TableCell
                      key={`${row.feature}-${index}`}
                      className="text-center"
                    >
                      <MatrixCell value={value} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ============== SOCIAL HOOKS ============== */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              Better with people{" "}
              <span className="text-[#ecb756]">who get it.</span>
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              CinePersona is wired for shared watching, not solo scrolling.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {socialHooks.map((hook, i) => (
              <article
                key={hook.title}
                className={cn(
                  cardInteractive,
                  "p-7",
                  i === 1 && "sm:translate-y-6",
                )}
                style={{ borderColor: `${familyAt(i)}33` }}
              >
                <span
                  className="inline-flex size-10 items-center justify-center rounded-xl border"
                  style={{
                    borderColor: `${familyAt(i)}40`,
                    background: `${familyAt(i)}1a`,
                    color: familyAt(i),
                  }}
                >
                  <hook.icon className="size-4" />
                </span>
                <h3 className="mt-6 font-display text-xl">{hook.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {hook.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== UPGRADE MOMENTS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">
            When an upgrade{" "}
            <span className="text-muted-foreground">earns the cut.</span>
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 md:grid-cols-3">
          {upgradePrompts.map((p, i) => (
            <li
              key={p.title}
              className="group bg-panel p-7 transition-colors hover:bg-panel-2"
            >
              <div className="flex justify-end">
                <ArrowRight
                  className="size-4 -translate-x-1 opacity-50 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  style={{ color: familyAt(i) }}
                />
              </div>
              <h3 className="mt-7 font-display text-xl tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============== REFERRALS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              Invite a few.{" "}
              <span className="text-[#ecb756]">
                Get Plus on the house.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Share CinePersona with people whose taste you trust. When they
              verify their email, you get rewarded automatically.
            </p>
            <Badge
              variant="outline"
              className="mt-5 border-foreground/15 bg-foreground/[0.02] text-muted-foreground"
            >
              Coming soon
            </Badge>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
              <Table>
                <TableHeader>
                  <TableRow className="border-foreground/10 hover:bg-transparent">
                    <TableHead className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Invited friends
                    </TableHead>
                    <TableHead
                      className="text-right font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: FAMILY_HEX.aut }}
                    >
                      Your reward
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((row, i) => (
                    <TableRow
                      key={row.invited}
                      className="border-foreground/5"
                    >
                      <TableCell className="text-foreground/90">
                        {row.invited}
                      </TableCell>
                      <TableCell
                        className="text-right font-medium"
                        style={{ color: familyAt(i) }}
                      >
                        {row.reward}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
        <div className="mb-10">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">
            Questions, briefly answered.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={cn(card, "p-6")}
              style={{ borderColor: `${familyAt(i)}26` }}
            >
              <h3 className="font-display text-lg">{f.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className={cn(cardCtaBlock, "p-10 text-center sm:p-16")}>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Start free.{" "}
            <span className="text-[#ecb756]">Upgrade when it clicks</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-muted-foreground">
            Take the test, find your CineType, and meet people whose watchlists
            actually surprise you.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className={cn(ctaPrimaryLg, "group")}>
              Get started — it’s free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/cinetest" className={ctaSecondaryLg}>
              Take the CineTest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
