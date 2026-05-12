"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/cinetype", label: "CineType", code: "01" },
  { href: "/cinetest", label: "CineTest", code: "02" },
  { href: "/cine-match", label: "CineMatch", code: "03" },
  { href: "/films", label: "Films", code: "04" },
  { href: "/community", label: "Community", code: "05" },
  { href: "/pricing", label: "Pricing", code: "06" },
  { href: "/about", label: "About", code: "07" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="md:hidden -ml-1 text-foreground/80 hover:text-foreground"
          >
            <Menu className="size-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="w-[88%] max-w-sm overflow-hidden border-r-foreground/10 bg-panel p-0 text-foreground sm:max-w-sm"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,var(--bloom)_0%,transparent_72%)] opacity-60 blur-[6px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-10 h-[260px] w-[260px] rounded-full bg-[radial-gradient(closest-side,#ecb756_0%,transparent_70%)] opacity-15 blur-[8px]"
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-md"
              />
              <span className="font-display text-lg tracking-tight">
                {siteConfig.name.replace("Persona", "")}
                <span className="text-[#ecb756]">Persona</span>
              </span>
            </Link>
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-5" />
                </Button>
              }
            />
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-colors",
                        active
                          ? "bg-foreground/[0.04] text-foreground"
                          : "text-foreground/85 hover:bg-foreground/[0.03]",
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            "font-mono text-[10px] tracking-[0.18em]",
                            active
                              ? "text-[#ecb756]"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.code}
                        </span>
                        <span className="font-display text-2xl tracking-tight">
                          {item.label}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full transition-all",
                          active
                            ? "bg-[#ecb756] shadow-[0_0_12px_#ecb75688]"
                            : "bg-foreground/15 group-hover:bg-foreground/40",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-foreground/10 px-5 py-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              — Fin —
            </div>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              A small, sharp test for how you actually watch.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
