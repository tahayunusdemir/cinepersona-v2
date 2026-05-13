"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<typeof Input>, "type"> & {
  toggleAriaLabel?: string;
};

export function PasswordInput({
  className,
  toggleAriaLabel = "Show or hide password",
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(className, "pr-11")}
      />
      <button
        type="button"
        aria-label={toggleAriaLabel}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {visible ? (
          <EyeOffIcon className="size-4" aria-hidden />
        ) : (
          <EyeIcon className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
