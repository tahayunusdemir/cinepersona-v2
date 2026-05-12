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
  useReducedMotion,
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
  as?: "div" | "section" | "header" | "article" | "li" | "ul" | "p" | "span";
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

type StaggerProps = Omit<HTMLMotionProps<"div">, "variants"> & {
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
 * ProjectorBloom — a soft animated radial bloom that breathes behind hero
 * sections. Pure decoration; pointer-events: none.
 */
export function ProjectorBloom({
  className,
  color = "#ecb756",
}: {
  className?: string;
  color?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: reduce ? 0.18 : [0.16, 0.28, 0.18] }}
      transition={
        reduce
          ? { duration: 0.8 }
          : { duration: 9, repeat: Infinity, ease: "easeInOut" }
      }
      className={className}
      style={{
        background: `radial-gradient(circle at center, ${color}55 0%, ${color}22 28%, transparent 65%)`,
      }}
    />
  );
}

export { motion as Motion };
