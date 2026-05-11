"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type FlashKind = "success" | "error" | "info";

const FLASH_MESSAGES: Record<string, { kind: FlashKind; text: string }> = {
  deactivated: {
    kind: "success",
    text: "Your account is deactivated. Sign in again to reactivate.",
  },
};

function FlashToastInner() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const flash = params.get("flash");

  useEffect(() => {
    if (!flash) return;

    const msg = FLASH_MESSAGES[flash];
    if (msg) {
      toast[msg.kind](msg.text);
    }

    // Strip the flash param so a refresh / back-nav doesn't replay it.
    const next = new URLSearchParams(params.toString());
    next.delete("flash");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [flash, params, pathname, router]);

  return null;
}

export function FlashToast() {
  // useSearchParams requires a Suspense boundary in app router.
  return (
    <Suspense fallback={null}>
      <FlashToastInner />
    </Suspense>
  );
}
