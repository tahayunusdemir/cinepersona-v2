import Image from "next/image";
import { LockIcon, MedalIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  BADGE_ASSETS,
  TIER_LABELS,
  TIER_STYLES,
  type AchievementWithStatus,
} from "@/lib/badges/types";

type Props = {
  achievement: AchievementWithStatus;
  hideSecret?: boolean;
};

export function BadgeCard({ achievement, hideSecret }: Props) {
  const styles = TIER_STYLES[achievement.tier];
  const isLocked = !achievement.unlocked;
  const isSecret = achievement.secret && hideSecret && isLocked;
  const asset = BADGE_ASSETS[achievement.code];

  const name = isSecret ? "???" : achievement.name;
  const label = isSecret
    ? "Hidden achievement"
    : achievement.requirement_label ?? "—";

  return (
    <div
      className={cn(
        "relative flex flex-col items-start gap-3 rounded-lg border border-border/60 p-4",
        achievement.unlocked ? styles.bg : "bg-card",
      )}
    >
      <div
        className={cn(
          "relative flex size-12 items-center justify-center overflow-hidden rounded-full",
          asset && !isSecret
            ? achievement.unlocked
              ? "ring-2 " + styles.ring
              : "ring-1 ring-border/60"
            : cn(
                "ring-2",
                achievement.unlocked
                  ? styles.ring
                  : "ring-border/60 text-muted-foreground",
              ),
        )}
        aria-hidden
      >
        {asset && !isSecret ? (
          <>
            <Image
              src={asset}
              alt=""
              fill
              sizes="48px"
              className={cn(
                "object-cover",
                isLocked && "scale-110 blur-[3px] grayscale brightness-75",
              )}
            />
            {isLocked ? (
              <span className="absolute inset-0 grid place-items-center bg-background/40">
                <LockIcon className="size-4 text-foreground/80" />
              </span>
            ) : null}
          </>
        ) : isLocked ? (
          <LockIcon className="size-4" />
        ) : (
          <MedalIcon className={cn("size-5", styles.text)} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{name}</p>
        <p
          className={cn(
            "mt-0.5 text-xs",
            isLocked ? "text-muted-foreground" : styles.text,
          )}
        >
          {TIER_LABELS[achievement.tier]} · {label}
        </p>
      </div>

      {achievement.unlocked && achievement.unlocked_at ? (
        <span className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          unlocked
        </span>
      ) : null}
    </div>
  );
}
