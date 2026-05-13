"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { SiteLogo } from "@/components/site-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
        className="w-[88%] max-w-sm border-r-foreground/10 bg-background p-0 text-foreground sm:max-w-sm"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
            <SiteLogo size="sm" />
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
              {navItems.map((item, i) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const hue = familyAt(i);
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
                      <span className="text-xl font-medium tracking-tight">
                        {item.label}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 rounded-full transition-all",
                          !active && "bg-foreground/15 group-hover:bg-foreground/40",
                        )}
                        style={
                          active
                            ? {
                                background: hue,
                                boxShadow: `0 0 12px ${hue}88`,
                              }
                            : undefined
                        }
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

        </div>
      </SheetContent>
    </Sheet>
  );
}
