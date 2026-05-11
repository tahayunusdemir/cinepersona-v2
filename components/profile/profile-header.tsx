import type * as React from "react";
import Link from "next/link";
import { GlobeIcon, PencilIcon } from "lucide-react";

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

            <ProfileLink link={profile.link} />
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

type IconComponent = React.ComponentType<{ className?: string }>;

type LinkMeta = {
  Icon: IconComponent;
  label: string;
};

// Pick an icon + a short, recognisable label for the user's single link.
// Falls back to the bare host (e.g. "example.com") with a generic globe icon.
function describeLink(href: string): LinkMeta | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const path = url.pathname.replace(/\/+$/, "");
  const handle = path.split("/").filter(Boolean)[0] ?? "";

  if (host === "instagram.com") {
    return { Icon: InstagramGlyph, label: handle ? `@${handle}` : "Instagram" };
  }
  if (host === "twitter.com" || host === "x.com") {
    return { Icon: XGlyph, label: handle ? `@${handle}` : "X" };
  }
  if (host === "letterboxd.com" || host === "boxd.it") {
    return {
      Icon: LetterboxdGlyph,
      label: handle ? `Letterboxd · ${handle}` : "Letterboxd",
    };
  }
  if (host === "youtube.com" || host === "youtu.be") {
    return { Icon: YouTubeGlyph, label: "YouTube" };
  }
  if (host === "github.com") {
    return { Icon: GitHubGlyph, label: handle ? `@${handle}` : "GitHub" };
  }
  if (host === "tiktok.com") {
    return {
      Icon: TikTokGlyph,
      label: handle ? handle.replace(/^@?/, "@") : "TikTok",
    };
  }
  if (host === "threads.net" || host === "threads.com") {
    return {
      Icon: ThreadsGlyph,
      label: handle ? handle.replace(/^@?/, "@") : "Threads",
    };
  }
  if (host === "open.spotify.com" || host === "spotify.com") {
    return { Icon: SpotifyGlyph, label: "Spotify" };
  }

  // Generic fallback: trim a trailing slash, hide the scheme.
  const trimmed = `${host}${path}`.slice(0, 64);
  return { Icon: GlobeIcon, label: trimmed };
}

// Inline brand glyphs. lucide-react in this project ships no brand marks, so
// we keep tiny path-only SVGs here. They inherit `currentColor` unless a
// platform's identity hinges on colour (Letterboxd's tricolour dots).

function brandSvg(path: React.ReactNode) {
  return function Glyph({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={className}
        width="1em"
        height="1em"
        fill="currentColor"
      >
        {path}
      </svg>
    );
  };
}

const InstagramGlyph = brandSvg(
  <>
    <path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.15.4.35 1 .4 2.2.07 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.05 1.2-.25 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.15-1 .35-2.2.4-1.2.07-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.05-1.8-.25-2.2-.4a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.15-.4-.35-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.05-1.2.25-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.15 1-.35 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5 0-4.7.07-1.1.05-1.7.23-2.1.39-.5.2-.9.45-1.3.85-.4.4-.65.8-.85 1.3-.16.4-.34 1-.39 2.1C2.6 8.5 2.6 8.85 2.6 12s0 3.5.07 4.7c.05 1.1.23 1.7.39 2.1.2.5.45.9.85 1.3.4.4.8.65 1.3.85.4.16 1 .34 2.1.39 1.2.07 1.55.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.23 2.1-.39.5-.2.9-.45 1.3-.85.4-.4.65-.8.85-1.3.16-.4.34-1 .39-2.1.07-1.2.07-1.55.07-4.7s0-3.5-.07-4.7c-.05-1.1-.23-1.7-.39-2.1a3.5 3.5 0 0 0-.85-1.3 3.5 3.5 0 0 0-1.3-.85c-.4-.16-1-.34-2.1-.39C15.5 4 15.15 4 12 4Zm0 3.05a4.95 4.95 0 1 1 0 9.9 4.95 4.95 0 0 1 0-9.9Zm0 1.8a3.15 3.15 0 1 0 0 6.3 3.15 3.15 0 0 0 0-6.3Zm5.15-2.05a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
  </>,
);

const XGlyph = brandSvg(
  <path d="M18.244 2H21l-6.52 7.45L22 22h-6.81l-4.74-6.2L4.95 22H2.19l6.98-7.97L2 2h6.95l4.3 5.7L18.24 2Zm-1.19 18h1.62L7.05 4H5.34l11.71 16Z" />,
);

const LetterboxdGlyph = function LetterboxdGlyph({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      width="1em"
      height="1em"
    >
      <circle cx="5" cy="12" r="3.2" fill="#00e054" />
      <circle cx="12" cy="12" r="3.2" fill="#40bcf4" />
      <circle cx="19" cy="12" r="3.2" fill="#ff8000" />
    </svg>
  );
};

const YouTubeGlyph = brandSvg(
  <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.6 4.6 12 4.6 12 4.6s-7.6 0-9.4.5A3 3 0 0 0 .5 7.2C0 9 0 12 0 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" />,
);

const GitHubGlyph = brandSvg(
  <path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.8 10.8.6.1.8-.25.8-.55v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.2 1.2A11 11 0 0 1 12 6c1 0 2 .15 3 .4 2.2-1.5 3.2-1.2 3.2-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.55a11.4 11.4 0 0 0 7.8-10.8C23.4 5.6 18.3.5 12 .5Z" />,
);

const TikTokGlyph = brandSvg(
  <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .55.05.8.13v-3.1a5.7 5.7 0 0 0-.8-.06 5.74 5.74 0 1 0 5.74 5.73V8.6a7.4 7.4 0 0 0 4.46 1.5V7.05A4.4 4.4 0 0 1 16.5 2Z" />,
);

const ThreadsGlyph = brandSvg(
  <path d="M17.7 11.2c-.1 0-.2-.1-.3-.1a8 8 0 0 0-.15-.65c-.5-2.4-2.16-3.7-4.74-3.75h-.04c-1.55 0-2.83.66-3.62 1.86l1.42.97c.6-.9 1.5-1.1 2.2-1.1h.03c.87 0 1.53.27 1.93.78.3.38.5.9.6 1.55-.74-.13-1.5-.18-2.3-.13-2.3.13-3.78 1.47-3.68 3.33.05.94.52 1.75 1.32 2.27.68.44 1.55.65 2.46.6 1.2-.07 2.14-.53 2.8-1.36.5-.63.82-1.45.96-2.5.6.36.96.83 1.17 1.4.34.96.36 2.55-.93 3.84-1.14 1.13-2.5 1.62-4.55 1.63-2.27-.02-4-.74-5.13-2.16-1.06-1.32-1.6-3.23-1.63-5.66.02-2.43.57-4.34 1.63-5.66 1.13-1.42 2.86-2.14 5.13-2.16 2.3.02 4.04.74 5.2 2.17.57.7 1 1.58 1.28 2.6l1.66-.44a8 8 0 0 0-1.6-3.23C18 1.93 15.85 1.04 13.06 1h-.02c-2.78.04-4.92.93-6.36 2.7-1.28 1.56-1.93 3.74-1.96 6.5v.02c.03 2.76.68 4.94 1.96 6.5 1.44 1.77 3.58 2.67 6.36 2.7h.02c2.47-.02 4.2-.66 5.65-2.1 1.86-1.84 1.8-4.16 1.2-5.59-.45-1.02-1.3-1.85-2.46-2.43Zm-4.72 4.04c-1 .06-2.04-.4-2.1-1.37-.04-.72.5-1.52 2.18-1.62.2-.01.39-.02.58-.02.6 0 1.17.06 1.68.17-.2 2.4-1.32 2.78-2.34 2.84Z" />,
);

const SpotifyGlyph = brandSvg(
  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.62.62 0 0 1-.86.2c-2.34-1.43-5.3-1.76-8.78-.96a.62.62 0 0 1-.28-1.22c3.8-.87 7.07-.5 9.7 1.12.3.18.4.57.22.86Zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.68-1.65-6.76-2.13-9.92-1.17a.78.78 0 1 1-.46-1.5c3.6-1.1 8.1-.56 11.18 1.34.37.23.5.7.27 1.07Zm.1-2.85c-3.2-1.9-8.5-2.08-11.56-1.15a.93.93 0 1 1-.54-1.79c3.5-1.06 9.36-.85 13.05 1.34a.93.93 0 1 1-.95 1.6Z" />,
);

function ProfileLink({ link }: { link: string | null }) {
  const href = (link ?? "").trim();
  if (!href) return null;
  const meta = describeLink(href);
  if (!meta) return null;
  const { Icon, label } = meta;
  return (
    <a
      href={href}
      target="_blank"
      rel="me noopener noreferrer ugc"
      className="inline-flex w-fit max-w-full items-center gap-1.5 truncate text-sm font-medium text-foreground/90 underline-offset-4 hover:text-foreground hover:underline"
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </a>
  );
}
