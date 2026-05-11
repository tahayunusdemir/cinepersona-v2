"use client";

import Link from "next/link";
import { LogOutIcon, MessageSquareIcon, SettingsIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/auth/actions";

type Props = {
  username: string;
  displayName: string | null;
  avatarUrl?: string | null;
};

export function UserMenu({ username, displayName, avatarUrl }: Props) {
  const label = displayName?.trim() || `@${username}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="default" aria-label="Account menu">
            <Avatar className="-ml-1 size-6 shrink-0">
              <AvatarImage src={avatarUrl ?? "/user.png"} alt="" />
              <AvatarFallback />
            </Avatar>
            <span className="text-sm">{label}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>@{username}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={`/${username}`} />}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/messages" />}>
            <MessageSquareIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            render={
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2"
                >
                  <LogOutIcon />
                  Sign out
                </button>
              </form>
            }
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
