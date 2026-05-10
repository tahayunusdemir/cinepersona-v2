import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "CineType",
    description:
      "Discover the cinematic personality that fits how you actually watch.",
  },
  {
    title: "CineTest",
    description:
      "Short, sharp prompts that map your taste in minutes, not hours.",
  },
  {
    title: "CineMatch",
    description:
      "Get film recommendations that line up with your CineType — no noise.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {siteConfig.name}
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Find the films that fit your personality.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
          {siteConfig.description}. Take a short test, learn your CineType, and
          get matches that actually feel like you.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            Get started
          </Link>
          <Link
            href="/about"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Learn more
          </Link>
        </div>
      </section>

      <section
        aria-label="Features"
        className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-28"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
