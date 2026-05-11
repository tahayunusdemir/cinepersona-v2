"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  FlagIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  ShieldOffIcon,
  ShieldXIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  blockUser,
  reportAction,
  unblockUser,
} from "@/lib/community/actions";

type Props = {
  targetId: string;
  targetUsername: string;
  isAuth: boolean;
  isBlocked: boolean;
};

const REASONS: { value: string; label: string }[] = [
  { value: "spam", label: "Spam or self-promotion" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "hate", label: "Hate speech" },
  { value: "nsfw", label: "NSFW / sexually explicit" },
  { value: "misinformation", label: "Misinformation" },
  { value: "other", label: "Something else" },
];

export function ProfileMoreMenu({
  targetId,
  targetUsername,
  isAuth,
  isBlocked,
}: Props) {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const [, startBlockTransition] = useTransition();
  const [reportPending, startReportTransition] = useTransition();

  const loginNext = `/login?next=${encodeURIComponent(`/${targetUsername}`)}`;

  const requireAuth = () => {
    if (!isAuth) {
      router.push(loginNext);
      return false;
    }
    return true;
  };

  const handleBlock = () => {
    if (!requireAuth()) return;
    startBlockTransition(async () => {
      const res = await blockUser(targetId, targetUsername);
      if (res.ok) {
        toast.success(`@${targetUsername} blocked.`);
        router.refresh();
      } else {
        toast.error("Could not block. Please try again.");
      }
    });
  };

  const handleUnblock = () => {
    if (!requireAuth()) return;
    startBlockTransition(async () => {
      const res = await unblockUser(targetId, targetUsername);
      if (res.ok) {
        toast.success(`@${targetUsername} unblocked.`);
        router.refresh();
      } else {
        toast.error("Could not unblock. Please try again.");
      }
    });
  };

  const handleReport = () => {
    if (!requireAuth()) return;
    setReportOpen(true);
  };

  const handleReportSubmit = (formData: FormData) => {
    startReportTransition(async () => {
      const res = await reportAction(undefined, formData);
      if (res.ok) {
        toast.success("Thanks — your report was received.");
        setReportOpen(false);
      } else if (res.error === "rate_limited") {
        toast.error("You already reported this within the last 24 hours.");
      } else if (res.error === "unauthorized") {
        toast.error("You need to be signed in.");
      } else {
        toast.error("Could not submit report.");
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              aria-label="More actions"
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={6} className="min-w-44">
          <DropdownMenuItem onClick={handleReport}>
            <FlagIcon />
            Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isBlocked ? (
            <DropdownMenuItem onClick={handleUnblock}>
              <ShieldOffIcon />
              Unblock
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleBlock} variant="destructive">
              <ShieldXIcon />
              Block
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report @{targetUsername}</DialogTitle>
            <DialogDescription>
              Tell us what&apos;s wrong. Our team reviews reports manually.
            </DialogDescription>
          </DialogHeader>
          <form action={handleReportSubmit} className="space-y-4">
            <input type="hidden" name="target_type" value="user" />
            <input type="hidden" name="target_id" value={targetId} />
            <div className="space-y-2">
              <Label>Reason</Label>
              <RadioGroup name="reason" defaultValue="spam" required>
                {REASONS.map((r) => (
                  <div key={r.value} className="flex items-center gap-2">
                    <RadioGroupItem id={`pr-${r.value}`} value={r.value} />
                    <Label htmlFor={`pr-${r.value}`} className="font-normal">
                      {r.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-report-details">
                Details (optional)
              </Label>
              <Textarea
                id="profile-report-details"
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
                onClick={() => setReportOpen(false)}
                disabled={reportPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={reportPending}>
                {reportPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : null}
                Submit report
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
