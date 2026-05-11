import Image from "next/image";

import type { ProfileBanner as ProfileBannerData } from "@/lib/profile/queries";

type Props = {
  banner: ProfileBannerData | null;
};

/**
 * Hero poster band that sits above the profile header.
 *
 * The poster occupies the top of the page and dissolves toward the sides
 * and bottom so the page background takes back over. The header card is
 * pulled up into the lower edge of the fade by the parent layout's
 * negative margin.
 */
export function ProfileBanner({ banner }: Props) {
  if (!banner || !banner.posterPath) return null;

  // Vertical fade (mostly visible up top, vanishing by the bottom) combined
  // with a side fade (visible in the middle, vanishing at the edges).
  // Two stacked linear gradients with `mask-composite: intersect` give a
  // soft halo without the radial gradient hiding most of the poster.
  const verticalFade =
    "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)";
  const sideFade =
    "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)";

  return (
    <div
      aria-hidden
      className="relative h-80 w-full overflow-hidden sm:h-[28rem]"
    >
      <Image
        src={`https://image.tmdb.org/t/p/w1280${banner.posterPath}`}
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover object-top"
        style={{
          maskImage: `${verticalFade}, ${sideFade}`,
          WebkitMaskImage: `${verticalFade}, ${sideFade}`,
          maskRepeat: "no-repeat, no-repeat",
          WebkitMaskRepeat: "no-repeat, no-repeat",
          maskSize: "100% 100%, 100% 100%",
          WebkitMaskSize: "100% 100%, 100% 100%",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}
