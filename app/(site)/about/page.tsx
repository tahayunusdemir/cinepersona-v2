import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClapperboardIcon,
  MailIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";
import { team, type TeamMember } from "@/lib/team";
import {
  cardCtaBlock,
  cardInteractive,
  credit,
  ctaPrimaryLg,
  ctaSecondaryLg,
  familyAt,
} from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — the people behind it and how to reach us.`,
};

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const steps = [
  {
    icon: ClapperboardIcon,
    title: "Take the CineTest",
    body: "A short, focused set of prompts — no long quizzes or homework. Answer honestly; there are no right answers.",
  },
  {
    icon: SparklesIcon,
    title: "Learn your CineType",
    body: "We translate your answers into a CineType: a compact profile of how you watch and what you respond to on screen.",
  },
  {
    icon: WandSparklesIcon,
    title: "Get CineMatches",
    body: "CineMatch pairs you with viewers whose CineType and watch history line up with yours — 90%+ similarity, mutual consent before any chat opens.",
  },
];

const principles = [
  {
    n: "I.",
    title: "No 1–10 ratings.",
    body: "A film is more than a score. We map texture, pace, era, and feel — not a single number that flattens it all.",
  },
  {
    n: "II.",
    title: "No favorite-director gatekeeping.",
    body: "You don’t have to name-drop Tarkovsky to belong. The test reads how you watch, not what you’ve memorized.",
  },
  {
    n: "III.",
    title: "Small over scale.",
    body: "We’d rather a sharp circle of viewers who get you than a billion ratings sliding past in a feed.",
  },
  {
    n: "IV.",
    title: "Matches you can defend.",
    body: "Every match comes with reasoning you can read — the axes you share and the films you both rated. No black box. No engagement bait.",
  },
];

const faqs = [
  {
    q: `What is ${siteConfig.name}?`,
    a: `${siteConfig.name} is a film personality and recommendation tool. Take a short test, get a CineType that captures your taste, and receive matches that line up with how you actually watch.`,
  },
  {
    q: "Do I need an account?",
    a: "You can browse the site without one. An account is required to save your CineType, post in the community, and keep your matches synced across devices.",
  },
  {
    q: "Is it free?",
    a: `${siteConfig.name} is in early access — every feature is open and there’s no card on file. Paid plans aren’t live yet; when they launch, upgrading will always be opt-in.`,
  },
  {
    q: "How is my data handled?",
    a: "We store the minimum needed to run your account and produce recommendations. We don’t sell your data. You can deactivate your account from settings at any time.",
  },
  {
    q: "Is this an official film database?",
    a: `No. ${siteConfig.name} is an independent project built by a small team. We’re not affiliated with any studio, streaming service, or rating site.`,
  },
  {
    q: "Found a bug or have feedback?",
    a: "Use the contact form on this page — it goes straight to us. We read every message, even if it sometimes takes us a few days to reply.",
  },
];

const milestones = [
  { date: "Spring 2025", label: "Idea sketched on a napkin in a film cafe." },
  { date: "Summer 2025", label: "First CineTest prototype with 8 traits." },
  { date: "Autumn 2025", label: "16 CineTypes finalized. Closed alpha opens." },
  { date: "Winter 2026", label: "CineMatch launches. Early access public." },
  { date: "Spring 2026", label: "Movie Night sessions enter private beta." },
];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className={cn(cardInteractive, "p-7")}>
      <div className="flex items-center justify-between">
        <span className={credit}>{member.role}</span>
        <div className="flex items-center gap-3 text-muted-foreground">
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="transition-colors hover:text-[#ecb756]"
          >
            <MailIcon className="size-5" />
          </a>
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="transition-colors hover:text-[#ecb756]"
          >
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <div className="relative size-36 shrink-0 overflow-hidden rounded-full border border-foreground/10 bg-foreground/[0.03]">
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            sizes="144px"
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-display text-xl leading-tight tracking-tight">
            {member.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {member.department}
          </p>
        </div>
      </div>

      <p className="mt-5 border-t border-foreground/10 pt-4 text-xs text-muted-foreground">
        {member.university}
      </p>
    </article>
  );
}

export default function AboutPage() {
  return (
    <div>
      {/* ============== HERO ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="font-display text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[72px]">
              A film app that{" "}
              <span className="text-[#ecb756]">
                reads how you watch
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {siteConfig.name} is a small project with one clean goal: turn
              the way you watch into a CineType and pair you with viewers
              who actually watch like you — not with a feed.
            </p>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-12">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">
            How it works,{" "}
            <span className="text-muted-foreground">
              in three takes.
            </span>
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 md:grid-cols-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group bg-panel p-7 transition-colors hover:bg-panel-2 sm:p-8"
              >
                <div className="flex items-baseline justify-end">
                  <span
                    className="inline-flex size-9 items-center justify-center rounded-full border"
                    style={{
                      borderColor: `${familyAt(i)}33`,
                      background: `${familyAt(i)}1a`,
                      color: familyAt(i),
                    }}
                  >
                    <Icon className="size-4" />
                  </span>
                </div>
                <h3 className="mt-8 font-display text-2xl tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ============== PRINCIPLES ============== */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
                Four rules{" "}
                <span className="text-[#ecb756]">
                  we keep on the wall.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground">
                The things we don’t compromise on — even when shipping faster
                would feel good.
              </p>
            </div>
            <div className="lg:col-span-7">
              <ol className="space-y-px overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
                {principles.map((p, i) => (
                  <li
                    key={p.n}
                    className="grid grid-cols-[64px_1fr] items-start gap-5 bg-panel p-6 sm:grid-cols-[88px_1fr] sm:p-7"
                  >
                    <span
                      className="font-display text-2xl sm:text-3xl"
                      style={{ color: familyAt(i) }}
                    >
                      {p.n}
                    </span>
                    <div>
                      <h3 className="font-display text-xl tracking-tight">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TIMELINE ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-12">
          <h2 className="max-w-2xl font-display text-3xl tracking-tight sm:text-5xl">
            How we got here.
          </h2>
        </div>
        <ol className="relative ml-3 border-l border-foreground/10 sm:ml-5">
          {milestones.map((m, i) => {
            const last = i === milestones.length - 1;
            const hue = familyAt(i);
            return (
              <li
                key={m.date}
                className="relative pb-10 pl-8 last:pb-0 sm:pl-10"
              >
                <span
                  className="absolute left-[-7px] top-1 size-3.5 rounded-full ring-4 ring-background"
                  style={{
                    background: hue,
                    boxShadow: last ? `0 0 18px ${hue}66` : undefined,
                  }}
                />
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: hue }}
                >
                  {m.date}
                </div>
                <p className="mt-2 font-display text-lg leading-snug sm:text-xl">
                  {m.label}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ============== TEAM ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              The team behind{" "}
              <span className="text-[#ecb756]">the cut.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            A small group who care as much about cinema as they do about the
            craft behind the product.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <MemberCard key={member.email} member={member} />
          ))}
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              Frequently asked.
            </h2>
            <p className="mt-5 max-w-sm text-muted-foreground">
              Short answers to the things people write in most. Can’t find it?
              The contact form is right below.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-panel">
              <Accordion>
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.q}
                    value={`faq-${index}`}
                    className="border-foreground/5 last:border-b-0 [&_button]:px-5 [&_button]:py-4 [&_div]:px-5 [&_div]:pb-4"
                  >
                    <AccordionTrigger className="text-left font-display text-lg hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CONTACT ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
              Get in touch.
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Have feedback, an idea, or just want to say hello? Send us a
              message — every note lands in our shared inbox.
            </p>
            <div className="mt-8 space-y-3 text-sm text-muted-foreground">
              {[
                "We reply within 1–3 business days.",
                "Bug reports get triaged the same week.",
                "Press & partnerships welcome.",
              ].map((line, i) => (
                <div key={line} className="flex items-center gap-3">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: familyAt(i) }}
                  />
                  {line}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-foreground/10 bg-panel p-7 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className={cn(cardCtaBlock, "p-10 text-center sm:p-16")}>
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Curious what your CineType is?{" "}
            <span className="text-[#ecb756]">About ten minutes</span>
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/cinetest" className={cn(ctaPrimaryLg, "group")}>
              Take the CineTest
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/pricing" className={ctaSecondaryLg}>
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
