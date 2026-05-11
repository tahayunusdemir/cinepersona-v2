import Link from "next/link";

import { cn } from "@/lib/utils";

type Item = { value: string; label: string };

type Props = {
  items: Item[];
  active: string;
  baseHref: string;
  paramKey?: string;
  searchParams?: Record<string, string | undefined>;
};

export function SortTabs({
  items,
  active,
  baseHref,
  paramKey = "sort",
  searchParams = {},
}: Props) {
  return (
    <nav
      aria-label="Sort"
      className="flex flex-wrap items-center gap-1 rounded-md border bg-card p-1"
    >
      {items.map((item) => {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(searchParams)) {
          if (v && k !== paramKey && k !== "page") params.set(k, v);
        }
        // Default value: omit param to keep canonical URL clean.
        if (item.value !== items[0].value) params.set(paramKey, item.value);
        const qs = params.toString();
        const href = qs ? `${baseHref}?${qs}` : baseHref;
        const isActive = item.value === active;
        return (
          <Link
            key={item.value}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded px-3 py-1 text-sm font-medium transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
