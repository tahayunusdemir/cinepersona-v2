"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { joinPool } from "@/lib/match/actions";
import { WATCHED_MIN } from "@/lib/match/types";

export function JoinPoolButton() {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onClick = () => {
    start(async () => {
      const result = await joinPool();
      if (!result.ok) {
        toast.error(joinErrorLabel(result.error));
        return;
      }
      toast.success("You're in the pool.");
      router.refresh();
    });
  };

  return (
    <Button size="lg" onClick={onClick} disabled={pending} className="w-full">
      {pending ? "Joining…" : "Join the pool"}
    </Button>
  );
}

function joinErrorLabel(err: string): string {
  switch (err) {
    case "no_test":
      return "Take the CineTest first.";
    case "watched_too_few":
      return `Mark at least ${WATCHED_MIN} watched films first.`;
    case "unauthorized":
      return "Sign in first.";
    default:
      return "Something went wrong.";
  }
}
