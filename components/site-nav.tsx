"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { familyAt } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cinetype", label: "CineType" },
  { href: "/cinetest", label: "CineTest" },
  { href: "/cine-match", label: "CineMatch" },
  { href: "/films", label: "Films" },
  { href: "/community", label: "Community" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="hidden flex-1 items-center justify-center md:flex"
    >
      <ul className="flex items-center gap-1">
        {navItems.map((item, i) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const hue = familyAt(i);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative inline-flex items-center rounded-md px-3 py-1.5 text-[15px] font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mr-1.5 size-1 rounded-full transition-all duration-300",
                    active
                      ? "opacity-100"
                      : "opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0",
                  )}
                  style={{ background: hue }}
                />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
