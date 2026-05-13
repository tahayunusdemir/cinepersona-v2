"use client";

/**
 * Page-load reveal + stagger primitives, plus a few cinema-specific motion
 * helpers (FilmStripScroll, ProjectorBloom). Built on Motion v12.
 *
 * Usage:
 *   <Reveal>...</Reveal>                     // single fade-up
 *   <Stagger>                                // staggered children
 *     <Reveal>...</Reveal>
 *     <Reveal>...</Reveal>
 *   </Stagger>
 *
 * All animations respect prefers-reduced-motion via Motion's reducedMotion="user".
 */

import {
  motion,
  MotionConfig,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import * as React from "react";

const easeFilm = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeFilm },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

type RevealProps = Omit<HTMLMotionProps<"div">, "variants"> & {
  as?:
    | "div"
    | "section"
    | "header"
    | "article"
    | "li"
    | "ul"
    | "ol"
    | "p"
    | "span"
    | "dl"
    | "footer"
    | "blockquote";
  delay?: number;
  /** When true, plays once on mount instead of on viewport entry. */
  immediate?: boolean;
};

export function Reveal({
  as = "div",
  delay,
  immediate,
  children,
  transition,
  ...rest
}: RevealProps) {
  const Cmp = motion[as] as typeof motion.div;
  const viewport = immediate ? undefined : { once: true, amount: 0.2 };

  return (
    <Cmp
      variants={revealVariants}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport })}
      transition={
        delay !== undefined
          ? { duration: 0.7, ease: easeFilm, delay, ...(transition ?? {}) }
          : transition
      }
      {...rest}
    >
      {children}
    </Cmp>
  );
}

type StaggerProps = Omit<HTMLMotionProps<"div">, "variants" | "initial"> & {
  as?: "div" | "section" | "ul" | "ol" | "header";
  /** Time between each child reveal (s). Default 0.07. */
  step?: number;
  /** Initial delay before the first child (s). Default 0.05. */
  initial?: number;
  /** When true, plays once on mount; otherwise on viewport entry. */
  immediate?: boolean;
  /** Threshold for in-view trigger when not immediate. */
  amount?: number;
};

export function Stagger({
  as = "div",
  step = 0.07,
  initial = 0.05,
  immediate,
  amount = 0.15,
  children,
  ...rest
}: StaggerProps) {
  const Cmp = motion[as] as typeof motion.div;
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: initial },
    },
  };

  return (
    <Cmp
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, amount } })}
      {...rest}
    >
      {children}
    </Cmp>
  );
}

/**
 * MotionShell — wraps content in a MotionConfig that honours OS reduced-motion
 * preferences. Drop near the root of a client tree.
 */
export function MotionShell({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * ProjectorBloom — kept as a no-op so existing hero markup doesn't break.
 * The site-wide background (Alucard cream / Dracula slate) is now flat;
 * no gold/lavender wash is rendered. Both props are accepted and ignored.
 */
export function ProjectorBloom(_props: { className?: string; color?: string }) {
  void _props;
  return null;
}

export { motion as Motion };
