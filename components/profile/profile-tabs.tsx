"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type Tab = {
  label: string;
  segment: string | null;
  href: (username: string) => string;
};

const TABS: Tab[] = [
  { label: "Overview", segment: null, href: (u) => `/${u}` },
  { label: "Films", segment: "films", href: (u) => `/${u}/films` },
  { label: "Watchlist", segment: "watchlist", href: (u) => `/${u}/watchlist` },
  { label: "Badges", segment: "badges", href: (u) => `/${u}/badges` },
];

type Props = {
  username: string;
};

export function ProfileTabs({ username }: Props) {
  const pathname = usePathname() ?? "";
  const base = `/${username}`;
  // Resolve current segment from pathname.
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : "";
  const currentSegment = rest.replace(/^\//, "").split("/")[0] || null;

  return (
    <nav
      aria-label="Profile sections"
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <ul className="flex min-w-max gap-1 border-b">
        {TABS.map((tab) => {
          const active = tab.segment === currentSegment;
          return (
            <li key={tab.label}>
              <Link
                href={tab.href(username)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center px-3 text-sm font-medium transition-colors",
                  active
                    ? "border-b-2 border-primary text-foreground"
                    : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
