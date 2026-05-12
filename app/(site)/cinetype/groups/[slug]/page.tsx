import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { TypeCard } from "@/components/cinepersona/type-card";
import { Badge } from "@/components/ui/badge";
import { groups, getGroup, typesInGroup } from "@/lib/cinepersona";
import { familyAt } from "@/lib/ui-tokens";

type PageParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return groups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) return { title: "Group not found" };
  return {
    title: `${group.name} — CineType group`,
    description: group.description,
  };
}

export default async function GroupPage({ params }: PageParams) {
  const { slug } = await params;
  const group = getGroup(slug);
  if (!group) notFound();
  const types = typesInGroup(group.slug);
  const groupIndex = groups.findIndex((g) => g.slug === group.slug);
  const hue = familyAt(groupIndex);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6">
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
          <Badge
            variant="secondary"
            style={{
              borderColor: `${hue}40`,
              background: `${hue}1a`,
              color: hue,
            }}
          >
            Group
          </Badge>
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          <span style={{ color: hue }}>{group.name}</span>
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {group.tagline}
        </p>
        <p className="text-base leading-relaxed text-foreground/90">
          {group.description}
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Types in {group.name}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {types.map((type) => (
            <TypeCard key={type.code} type={type} familyHue={hue} />
          ))}
        </div>
      </section>
    </div>
  );
}
