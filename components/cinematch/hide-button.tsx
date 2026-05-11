"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { hideMatch, unhideMatch } from "@/lib/match/actions";

type Props = {
  matchId: string;
  hidden: boolean;
};

export function HideMatchButton({ matchId, hidden }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onToggle = () => {
    start(async () => {
      const result = hidden ? await unhideMatch(matchId) : await hideMatch(matchId);
      if (!result.ok) {
        toast.error("Couldn't update visibility.");
        return;
      }
      toast(hidden ? "Match restored to your list." : "Match hidden.");
      router.refresh();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      disabled={pending}
    >
      {hidden ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
      {hidden ? "Unhide" : "Hide match"}
    </Button>
  );
}
