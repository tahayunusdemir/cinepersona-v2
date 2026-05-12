import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const wordSize: Record<Size, string> = {
  sm: "text-[19px]",
  md: "text-xl",
  lg: "text-2xl",
};

const markSize: Record<Size, { px: number; cls: string }> = {
  sm: { px: 28, cls: "size-7" },
  md: { px: 32, cls: "size-8" },
  lg: { px: 32, cls: "size-8" },
};

type Props = {
  size?: Size;
  className?: string;
  href?: string;
  priority?: boolean;
};

export function SiteLogo({
  size = "sm",
  className,
  href = "/",
  priority = false,
}: Props) {
  const brandLead = siteConfig.name.replace("Persona", "");
  const mark = markSize[size];

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
    >
      <Image
        src="/logo.png"
        alt=""
        width={mark.px}
        height={mark.px}
        priority={priority}
        className={mark.cls}
      />
      <span
        className={cn(
          "font-display leading-none tracking-tight",
          wordSize[size],
        )}
      >
        {brandLead}
        <span className="text-[#ecb756]">Persona</span>
      </span>
    </Link>
  );
}
