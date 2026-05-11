import Link from "next/link";
import { ChevronRightIcon, MessageCircleIcon, SparklesIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MatchListItem } from "@/lib/match/types";

type Props = {
  item: MatchListItem;
};

export function MatchListRow({ item }: Props) {
  const partner = item.partner;
  const username = partner.username ?? "deleted";
  const display = partner.display_name?.trim() || `@${username}`;
  const showInbox = item.both_consented;
  const partnerHinted = item.partner_consented && !item.both_consented;

  return (
    <Link
      href={`/cine-match/${item.id}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3",
        "transition-colors hover:bg-accent/40 focus-visible:outline-2",
        "focus-visible:outline-offset-2 focus-visible:outline-primary",
      )}
    >
      <Avatar className="size-10 shrink-0">
        <AvatarImage src={partner.avatar_url ?? "/user.png"} alt={display} />
        <AvatarFallback />
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium">{display}</span>
          {partner.type_code ? (
            <Badge variant="secondary" className="font-mono text-[10px]">
              {partner.type_code}
            </Badge>
          ) : null}
          {item.is_fallback ? (
            <Badge
              variant="outline"
              className="gap-1 px-1.5 text-[10px]"
              aria-label="Fallback match"
            >
              <SparklesIcon className="size-3" />
              closest
            </Badge>
          ) : null}
          {partnerHinted ? (
            <Badge
              variant="outline"
              className="gap-1 px-1.5 text-[10px] text-amber-600 dark:text-amber-400"
              aria-label="They opened messaging"
            >
              <MessageCircleIcon className="size-3" />
              wants to chat
            </Badge>
          ) : null}
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">@{username}</span>
          {showInbox && item.unread_count > 0 ? (
            <Badge variant="default" className="px-1.5 text-[10px]">
              {item.unread_count} new
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="text-right">
        <div className="font-mono text-lg leading-none tabular-nums">
          {item.similarity_pct}%
        </div>
        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          match
        </div>
      </div>

      <ChevronRightIcon className="size-4 text-muted-foreground" />
    </Link>
  );
}
