"use client";

import { useActionState, useEffect, useState } from "react";
import { FlagIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  reportAction,
  type CommunityActionState,
} from "@/lib/community/actions";

const reasons = [
  { value: "spam", label: "Spam or self-promotion" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "nsfw", label: "NSFW / sexually explicit" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Something else" },
];

const initial: CommunityActionState = {};

type Props = {
  targetType: "user" | "thread" | "comment";
  targetId: string;
  trigger?: React.ReactNode;
};

export function ReportDialog({ targetType, targetId, trigger }: Props) {
  const [open, setOpen] = useState(false);

  const wrappedAction = async (
    _prev: CommunityActionState | undefined,
    fd: FormData,
  ): Promise<CommunityActionState> => {
    const result = await reportAction(_prev, fd);
    if (result.ok) setOpen(false);
    return result;
  };

  const [state, action, pending] = useActionState(wrappedAction, initial);

  useEffect(() => {
    if (state?.ok) {
      toast.success("Thanks — your report was received.");
    } else if (state?.error === "rate_limited") {
      toast.error("You already reported this recently.");
    } else if (state?.error === "unauthorized") {
      toast.error("Please sign in to report.");
    } else if (state?.error) {
      toast.error("Could not submit report.");
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          (trigger as React.ReactElement) ?? (
            <Button variant="ghost" size="sm">
              <FlagIcon /> Report
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>
            Tell us what is wrong. Our team reviews reports manually.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="target_type" value={targetType} />
          <input type="hidden" name="target_id" value={targetId} />
          <div className="space-y-2">
            <Label>Reason</Label>
            <RadioGroup name="reason" defaultValue="spam" required>
              {reasons.map((r) => (
                <div key={r.value} className="flex items-center gap-2">
                  <RadioGroupItem id={`r-${r.value}`} value={r.value} />
                  <Label htmlFor={`r-${r.value}`} className="font-normal">
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Details (optional)</Label>
            <Textarea
              id="details"
              name="details"
              rows={4}
              maxLength={1000}
              placeholder="Add context if it helps."
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2Icon className="animate-spin" /> : null}
              Submit report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
