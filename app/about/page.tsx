import type { Metadata } from "next";
import {
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { siteConfig } from "@/lib/site";
import { team, type TeamMember } from "@/lib/team";

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
    title: "Take the test",
    body: "A short set of focused prompts — no long quizzes or homework. Answer honestly; there are no right answers.",
  },
  {
    icon: SparklesIcon,
    title: "Learn your CineType",
    body: "We translate your answers into a CineType: a compact profile of how you watch and what you respond to on screen.",
  },
  {
    icon: WandSparklesIcon,
    title: "Get matches",
    body: "CineMatch turns your CineType into film recommendations that feel like you — without the noise of generic top-100 lists.",
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
    a: `${siteConfig.name} is in early access — every feature is open and there's no card on file. Paid plans aren't live yet; when they launch, upgrading will always be opt-in.`,
  },
  {
    q: "How is my data handled?",
    a: "We store the minimum needed to run your account and produce recommendations. We don't sell your data. You can deactivate your account from settings at any time.",
  },
  {
    q: "Is this an official film database?",
    a: `No. ${siteConfig.name} is an independent project built by a small team. We're not affiliated with any studio, streaming service, or rating site.`,
  },
  {
    q: "Found a bug or have feedback?",
    a: "Use the contact form on this page — it goes straight to us. We read every message, even if it sometimes takes us a few days to reply.",
  },
];

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <Card className="h-full">
      <CardHeader className="items-center text-center">
        <Badge variant="secondary">{member.role}</Badge>
        <h3 className="mt-2 text-base font-medium leading-snug">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground">{member.department}</p>
        <p className="text-sm">{member.university}</p>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-center gap-4 pt-0">
        <a
          href={`mailto:${member.email}`}
          aria-label={`Email ${member.name}`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <MailIcon className="size-5" />
        </a>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <LinkedinIcon className="size-5" />
        </a>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-4 pt-12 pb-24 sm:px-6 md:space-y-16">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About {siteConfig.name}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {siteConfig.name} is a small project with a simple goal: help you
          discover films that genuinely fit your taste. We turn the way you
          watch into a CineType and recommend movies that feel made for you —
          built by a team that cares as much about cinema as it does about the
          craft behind the product.
        </p>
      </section>

      <section className="space-y-4 md:space-y-6">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          How it works
        </h2>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-medium leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.body}
                    </p>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-4 md:space-y-6">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          The team
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {team.map((member) => (
            <MemberCard key={member.email} member={member} />
          ))}
        </div>
      </section>

      <section className="space-y-4 md:space-y-6">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          Frequently asked questions
        </h2>
        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`faq-${index}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
            Get in touch
          </h2>
          <p className="text-sm text-muted-foreground">
            Have feedback, an idea, or just want to say hello? Send us a
            message and we&apos;ll get back to you.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
