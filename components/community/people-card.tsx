import Link from "next/link";

import { FollowButton } from "@/components/community/follow-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    followers_count: number;
    following_count: number;
  };
  viewerId: string | null;
  isFollowing: boolean;
  isBlockedByViewer: boolean;
};

export function PeopleCard({
  user,
  viewerId,
  isFollowing,
  isBlockedByViewer,
}: Props) {
  const isSelf = viewerId === user.id;
  const displayName = user.display_name?.trim() || `@${user.username}`;

  return (
    <article className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-card/80">
      <Link href={`/${user.username}`} aria-label={displayName}>
        <Avatar className="size-12 sm:size-14">
          <AvatarImage src={user.avatar_url ?? "/user.png"} alt="" />
          <AvatarFallback />
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold sm:text-base">
          <Link
            href={`/${user.username}`}
            className="hover:underline"
          >
            {displayName}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">@{user.username}</p>
        {user.bio ? (
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {user.bio}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          <Link
            href={`/${user.username}/followers`}
            className="hover:text-foreground"
          >
            {user.followers_count}{" "}
            {user.followers_count === 1 ? "follower" : "followers"}
          </Link>
          <span className="mx-1.5">·</span>
          <Link
            href={`/${user.username}/following`}
            className="hover:text-foreground"
          >
            {user.following_count} following
          </Link>
        </p>
      </div>
      <FollowButton
        targetId={user.id}
        username={user.username}
        initiallyFollowing={isFollowing}
        isSelf={isSelf}
        isAuthed={Boolean(viewerId)}
        isBlockedByViewer={isBlockedByViewer}
        size="sm"
      />
    </article>
  );
}
