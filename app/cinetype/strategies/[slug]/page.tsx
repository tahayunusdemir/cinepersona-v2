import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { TypeCard } from "@/components/cinepersona/type-card";
import { Badge } from "@/components/ui/badge";
import {
  strategies,
  getStrategy,
  typesWithStrategy,
} from "@/lib/cinepersona";

type PageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return strategies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) return { title: "Strategy not found" };
  return {
    title: `${strategy.name} — CineType strategy`,
    description: strategy.description,
  };
}

export default async function StrategyPage({ params }: PageParams) {
  const { slug } = await params;
  const strategy = getStrategy(slug);
  if (!strategy) notFound();
  const types = typesWithStrategy(strategy.slug);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 sm:px-6">
      <nav aria-label="Breadcrumb" className="pt-8">
        <Link
          href="/cinetype"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3" />
          All types
        </Link>
      </nav>

      <header className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Strategy</Badge>
        </div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {strategy.name}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {strategy.tagline}
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          {strategy.description}
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Types with this strategy
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {types.map((type) => (
            <TypeCard key={type.code} type={type} />
          ))}
        </div>
      </section>
    </div>
  );
}
