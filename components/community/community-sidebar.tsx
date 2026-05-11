"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClockIcon, LayoutGridIcon, LockIcon, UsersIcon } from "lucide-react";

import { BoardIcon } from "@/components/community/board-icon";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Board = {
  id: number;
  slug: string;
  name: string;
  locked: boolean;
};

type Props = {
  boards: Board[];
};

export function CommunitySidebar({ boards }: Props) {
  const pathname = usePathname() ?? "";
  const isHome = pathname === "/community";
  const isPeople = pathname.startsWith("/community/people");
  const isMe = pathname.startsWith("/community/me");
  const boardMatch = pathname.match(/^\/community\/([^/]+)/);
  const activeSlug =
    boardMatch && !["people", "me"].includes(boardMatch[1])
      ? boardMatch[1]
      : null;

  return (
    <nav
      aria-label="Community navigation"
      className="flex flex-col gap-4 text-sm"
    >
      <div>
        <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Discover
        </p>
        <ul className="flex flex-col gap-0.5">
          <SidebarLink
            href="/community"
            icon={<LayoutGridIcon className="size-4" />}
            label="All boards"
            active={isHome}
          />
          <SidebarLink
            href="/community/people"
            icon={<UsersIcon className="size-4" />}
            label="People"
            active={isPeople}
          />
          <SidebarLink
            href="/community/me"
            icon={<ClockIcon className="size-4" />}
            label="My activity"
            active={isMe}
          />
        </ul>
      </div>

      <Separator />

      <div>
        <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Boards
        </p>
        <ul className="flex flex-col gap-0.5">
          {boards.map((b) => {
            const isActive = activeSlug === b.slug;
            return (
              <li key={b.id}>
                <Link
                  href={`/community/${b.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <BoardIcon
                    slug={b.slug}
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <span className="truncate">{b.name}</span>
                  {b.locked ? (
                    <LockIcon className="ml-auto size-3 shrink-0 text-muted-foreground" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
          active
            ? "bg-secondary text-secondary-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
