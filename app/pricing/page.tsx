import type { Metadata } from "next";
import Link from "next/link";
import {
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
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the Cinepersona plan that matches how you watch — from Free to Elite Club.",
};

const upgradePrompts = [
  {
    title: "Someone liked you",
    body: "See who's into your taste — unlock with Plus.",
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
    title: "Watch together experience",
    body: "Synced playback, a quiet side-chat, and a shared watchlist that remembers everyone's vetoes.",
  },
];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "No payment yet",
    body: "Cinepersona is in early access. Billing isn't live — every feature is open.",
  },
  {
    icon: CreditCard,
    title: "No card on file",
    body: "Sign up with just an email. We won't ask for payment until plans launch.",
  },
  {
    icon: Sparkles,
    title: "Cancel anytime",
    body: "When billing arrives, plans stay active until the period ends.",
  },
];

function MatrixCell({ value }: { value: MatrixCellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center text-foreground">
        <Check className="size-4" aria-label="Included" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center justify-center text-muted-foreground/40">
        <Minus className="size-4" aria-label="Not included" />
      </span>
    );
  }
  return <span className="text-xs font-medium text-foreground">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
      <section className="flex flex-col items-center px-0 pt-16 pb-12 text-center sm:pt-24">
        <Badge variant="secondary" className="mb-5 gap-1.5">
          <Sparkles className="size-3" aria-hidden />
          Free during early access
        </Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Pricing built for the way you watch.
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Start free, upgrade when you want more matches, deeper filters, or
          your own film circle. Every plan keeps the things that make
          Cinepersona feel personal.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Paid plans aren&apos;t live yet — every feature is open while we
          build.
        </p>
      </section>

      <PlansSection />

      <section
        aria-label="Trust"
        className="mt-12 grid gap-3 rounded-xl border border-foreground/10 bg-muted/30 p-5 sm:grid-cols-3"
      >
        {trustItems.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-foreground/80 ring-1 ring-foreground/10">
              <item.icon className="size-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </section>

      <section aria-label="Feature comparison" className="mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Compare every feature
          </h2>
          <p className="text-sm text-muted-foreground">
            A side-by-side look at what each plan unlocks.
          </p>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%] font-medium text-foreground">
                  Feature
                </TableHead>
                {planNames.map((name) => (
                  <TableHead
                    key={name}
                    className="text-center font-medium text-foreground"
                  >
                    {name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row) => (
                <TableRow key={row.feature}>
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
        </Card>
      </section>

      <section aria-label="Social hooks" className="mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Better with people who get it
          </h2>
          <p className="text-sm text-muted-foreground">
            Cinepersona is wired for shared watching, not solo scrolling.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {socialHooks.map((hook) => (
            <Card key={hook.title} className="h-full">
              <CardHeader>
                <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-foreground/5 text-foreground/80 ring-1 ring-foreground/10">
                  <hook.icon className="size-4" aria-hidden />
                </span>
                <CardTitle>{hook.title}</CardTitle>
                <CardDescription>{hook.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Upgrade moments" className="mt-20">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            When an upgrade pays off
          </h2>
          <p className="text-sm text-muted-foreground">
            Little nudges you&apos;ll see across the app once paid plans go
            live.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {upgradePrompts.map((prompt) => (
            <Card key={prompt.title} size="sm" className="h-full">
              <CardHeader>
                <CardTitle className="text-sm">{prompt.title}</CardTitle>
                <CardDescription>{prompt.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section aria-label="Referrals" className="mt-20">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-xl">
                  Invite friends, earn Plus
                </CardTitle>
                <CardDescription>
                  Share Cinepersona with people whose taste you trust. When
                  they verify their email, you get rewarded.
                </CardDescription>
              </div>
              <Badge variant="outline">Coming soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium text-foreground">
                    Invited friends
                  </TableHead>
                  <TableHead className="font-medium text-foreground">
                    Your reward
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((row) => (
                  <TableRow key={row.invited}>
                    <TableCell>{row.invited}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      {row.reward}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section
        aria-label="FAQ"
        className="mt-20 grid gap-6 rounded-xl bg-muted/30 p-8 sm:grid-cols-2"
      >
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Are paid plans live?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Not yet. Cinepersona is in early access and every feature is open
            to every signed-in member while we build.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Will I be charged automatically?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No. There&apos;s no card on file and no automatic billing. When
            paid plans launch, upgrading will always be opt-in.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Can I cancel anytime?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Yes. Once billing is live you&apos;ll be able to cancel from
            Settings — your plan stays active until the period ends.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Can I switch plans later?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Yep. Move up or down whenever you like. We&apos;ll prorate the
            difference so you only pay for what you use.
          </p>
        </div>
      </section>

      <section
        aria-label="Get started"
        className="mt-20 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground text-background"
      >
        <div className="flex flex-col items-center gap-6 px-8 py-14 text-center sm:py-20">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Start free. Upgrade when it clicks.
          </h2>
          <p className="max-w-xl text-balance text-sm text-background/70 sm:text-base">
            Take the test, find your CineType, and meet people whose
            watchlists actually surprise you.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "bg-background text-foreground hover:bg-background/90",
              )}
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/cinetest"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background",
              )}
            >
              Take the CineTest
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
