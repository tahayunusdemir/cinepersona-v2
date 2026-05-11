import Link from "next/link";
import { ChevronRightIcon, UsersIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CommunityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community</CardTitle>
        <CardDescription>
          Manage who can interact with you on CinePersona.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/settings/community"
          className="group flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground">
              <UsersIcon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium">Blocked users</p>
              <p className="text-sm text-muted-foreground">
                See and unblock the people you have blocked.
              </p>
            </div>
          </div>
          <ChevronRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
