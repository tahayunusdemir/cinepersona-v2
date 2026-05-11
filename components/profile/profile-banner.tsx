import Image from "next/image";

import type { ProfileBanner as ProfileBannerData } from "@/lib/profile/queries";

type Props = {
  banner: ProfileBannerData | null;
};

/**
 * Soft poster background that sits behind the profile header.
 *
 * The poster fades to transparent toward the sides and bottom (and is
 * lightly blurred) so the foreground header card stays readable — the
 * intent is "hint of the film," not a billboard.
 */
export function ProfileBanner({ banner }: Props) {
  if (!banner || !banner.posterPath) return null;

  // Two-axis mask: fade out at the sides AND down the page. We intersect
  // the two gradients so the visible region is a soft horizontal band that
  // also dissolves toward the bottom.
  const sideFade =
    "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%)";
  const bottomFade =
    "linear-gradient(to bottom, black 0%, black 35%, transparent 100%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-12 -z-10 h-[420px] overflow-hidden sm:h-[480px]"
    >
      <div
        className="relative h-full w-full"
        style={{
          WebkitMaskImage: `${bottomFade}, ${sideFade}`,
          maskImage: `${bottomFade}, ${sideFade}`,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
        }}
      >
        <Image
          src={`https://image.tmdb.org/t/p/w1280${banner.posterPath}`}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="scale-110 object-cover object-top opacity-55 blur-xl saturate-110 dark:opacity-45"
        />
      </div>
    </div>
  );
}
