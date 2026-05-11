import Link from "next/link";
import { PencilIcon } from "lucide-react";

import { FollowButton } from "@/components/community/follow-button";
import { ShareMenu } from "@/components/community/share-menu";
import { BlockedBanner } from "@/components/profile/blocked-banner";
import { ProfileMoreMenu } from "@/components/profile/profile-more-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  profileHeading,
  type ProfileViewModel,
} from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

type Props = {
  profile: ProfileViewModel;
};

export function ProfileHeader({ profile }: Props) {
  const heading = profileHeading(profile.displayName, profile.username);
  const sharePath = `/${profile.username}`;
  const shareTitle = `${heading} on CinePersona`;

  return (
    <div className="flex flex-col gap-4">
      {profile.isBlocked ? (
        <BlockedBanner
          targetId={profile.id}
          targetUsername={profile.username}
        />
      ) : null}

      <Card className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-6">
          <Avatar className="size-16 shrink-0 md:size-24">
            <AvatarImage
              src={profile.avatarUrl ?? "/user.png"}
              alt={heading}
            />
            <AvatarFallback />
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                  {heading}
                </h1>
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {profile.isSelf ? (
                  <>
                    <Link
                      href="/settings"
                      className={cn(buttonVariants({ variant: "outline" }))}
                    >
                      <PencilIcon />
                      Edit profile
                    </Link>
                    <ShareMenu
                      url={sharePath}
                      title={shareTitle}
                      variant="outline"
                      size="default"
                    />
                  </>
                ) : profile.isBlocked ? (
                  <ShareMenu
                    url={sharePath}
                    title={shareTitle}
                    variant="outline"
                    size="default"
                  />
                ) : (
                  <>
                    <FollowButton
                      targetId={profile.id}
                      username={profile.username}
                      initiallyFollowing={profile.isFollowing}
                      isSelf={false}
                      isAuthed={profile.isAuth}
                      isBlockedByViewer={profile.isBlocked}
                    />
                    <ShareMenu
                      url={sharePath}
                      title={shareTitle}
                      variant="outline"
                      size="default"
                    />
                    <ProfileMoreMenu
                      targetId={profile.id}
                      targetUsername={profile.username}
                      isAuth={profile.isAuth}
                      isBlocked={profile.isBlocked}
                    />
                  </>
                )}
              </div>
            </div>

            <CounterRow
              username={profile.username}
              followers={profile.followersCount}
              following={profile.followingCount}
            />

            <Bio bio={profile.bio} isSelf={profile.isSelf} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function CounterRow({
  username,
  followers,
  following,
}: {
  username: string;
  followers: number;
  following: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      <Link
        href={`/${username}/followers`}
        className="text-muted-foreground hover:text-foreground hover:underline"
      >
        <span className="font-semibold text-foreground tabular-nums">
          {formatCount(followers)}
        </span>{" "}
        {followers === 1 ? "follower" : "followers"}
      </Link>
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      <Link
        href={`/${username}/following`}
        className="text-muted-foreground hover:text-foreground hover:underline"
      >
        <span className="font-semibold text-foreground tabular-nums">
          {formatCount(following)}
        </span>{" "}
        following
      </Link>
    </div>
  );
}

function Bio({ bio, isSelf }: { bio: string | null; isSelf: boolean }) {
  const trimmed = (bio ?? "").trim();
  if (trimmed.length > 0) {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
        {trimmed}
      </p>
    );
  }
  if (isSelf) {
    return (
      <p className="text-sm text-muted-foreground">
        No bio yet.{" "}
        <Link
          href="/settings"
          className="font-medium text-primary hover:underline"
        >
          Add one
        </Link>
        .
      </p>
    );
  }
  return <p className="text-sm italic text-muted-foreground">No bio yet.</p>;
}

function formatCount(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}
