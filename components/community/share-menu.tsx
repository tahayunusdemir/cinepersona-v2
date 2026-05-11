"use client";

import { useSyncExternalStore } from "react";
import {
  CopyIcon,
  Share2Icon,
  SendIcon,
} from "lucide-react";
import { toast } from "sonner";

function useAbsoluteUrl(url: string): string {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return new URL(url, window.location.origin).toString();
      } catch {
        return url;
      }
    },
    () => url,
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  url: string;
  title: string;
  size?: "sm" | "default";
  variant?: "ghost" | "outline";
  label?: string;
};

export function ShareMenu({
  url,
  title,
  size = "sm",
  variant = "ghost",
  label = "Share",
}: Props) {
  const absolute = useAbsoluteUrl(url);
  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(absolute);
      toast.success("Link copied.");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const native = async () => {
    try {
      await navigator.share({ title, url: absolute });
    } catch {
      // user cancelled or unsupported
    }
  };

  const enc = encodeURIComponent;
  const tweet = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(absolute)}`;
  const wa = `https://wa.me/?text=${enc(`${title} ${absolute}`)}`;
  const tg = `https://t.me/share/url?url=${enc(absolute)}&text=${enc(title)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={variant} size={size}>
            <Share2Icon />
            <span className={size === "sm" ? "sr-only sm:not-sr-only" : ""}>
              {label}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copy}>
          <CopyIcon /> Copy link
        </DropdownMenuItem>
        {canNativeShare ? (
          <DropdownMenuItem onClick={native}>
            <SendIcon /> Share…
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          onClick={() =>
            window.open(tweet, "_blank", "noopener,noreferrer")
          }
        >
          X / Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(wa, "_blank", "noopener,noreferrer")}
        >
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(tg, "_blank", "noopener,noreferrer")}
        >
          Telegram
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
