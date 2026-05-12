import { cn } from "@/lib/utils";

export function FrameTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function AmbientBloom(_props: {
  variant?: "default" | "soft" | "centered";
  className?: string;
}) {
  return null;
}

export function PageHeader({
  reel,
  eyebrow,
  title,
  italic,
  description,
  align = "left",
  children,
}: {
  reel?: string;
  eyebrow?: string;
  title: React.ReactNode;
  italic?: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
      )}
    >
      {eyebrow && <FrameTag>{eyebrow}</FrameTag>}
      <h1
        className={cn(
          "max-w-3xl font-display text-[40px] leading-[1.04] tracking-tight sm:text-[56px] lg:text-[64px]",
          align === "center" && "mx-auto",
        )}
      >
        {title}
        {italic && (
          <>
            {" "}
            <span className="text-[#ecb756]">{italic}</span>
          </>
        )}
      </h1>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export function CinemaCard({
  className,
  children,
  variant = "default",
}: {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "highlighted" | "muted";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all",
        variant === "highlighted"
          ? "border-[#ecb756]/40 bg-gradient-to-br from-panel-2 to-panel"
          : variant === "muted"
            ? "border-foreground/5 bg-foreground/[0.015]"
            : "border-foreground/10 bg-panel hover:border-foreground/20",
        className,
      )}
    >
      {variant === "highlighted" && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#ecb756]/10 blur-3xl"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
