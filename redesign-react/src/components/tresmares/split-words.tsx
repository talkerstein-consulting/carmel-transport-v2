"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * The Tresmares headline treatment: every word sits in its own box that is
 * clipped from the bottom and pushed down by the same amount, so the clipping
 * edge holds still in page space while the word rises out from under it.
 *
 * Real text stays on the wrapper via aria-label; the word boxes are hidden
 * from the accessibility tree so a screen reader hears one sentence, not a
 * pile of fragments.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const wrapper: Variants = {
  hidden: {},
  visible: ({ stagger, delay }: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 + delay },
  }),
};

const word: Variants = {
  hidden: { clipPath: "inset(0% 0% 100%)", y: "100%" },
  visible: {
    clipPath: "inset(0% 0% 0%)",
    y: "0%",
    transition: { duration: 0.85, ease: EASE },
  },
};

type Props = {
  /** The line to reveal. Split on whitespace. */
  text: string;
  /** Rendered element for the wrapper. */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Seconds between each word. Lower for long lines. */
  stagger?: number;
  /** Fire on mount instead of on scroll — use for the hero. */
  immediate?: boolean;
  /** Words to tint with the signal colour, matched case-insensitively. */
  accent?: string[];
  delay?: number;
};

export function SplitWords({
  text,
  as = "span",
  className,
  stagger = 0.055,
  immediate = false,
  accent = [],
  delay = 0,
}: Props) {
  const reduceMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);
  const accentSet = new Set(accent.map((a) => a.toLowerCase().replace(/[^a-z0-9]/g, "")));

  const Wrapper = motion[as];

  // Reduced motion: no reveal at all, just the text.
  if (reduceMotion) {
    return (
      <Wrapper className={className}>
        {words.map((w, i) => {
          const isAccent = accentSet.has(w.toLowerCase().replace(/[^a-z0-9]/g, ""));
          return (
            <span key={`${w}-${i}`} className={isAccent ? "text-signal-dk" : undefined}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </Wrapper>
    );
  }

  const motionProps = immediate
    ? { initial: "hidden" as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-15%" },
      };

  return (
    <Wrapper
      aria-label={text}
      variants={wrapper}
      custom={{ stagger, delay }}
      {...motionProps}
      className={className}
    >
      {words.map((w, i) => {
        const isAccent = accentSet.has(w.toLowerCase().replace(/[^a-z0-9]/g, ""));
        return (
          <span key={`${w}-${i}`} aria-hidden="true">
            <motion.span
              variants={word}
              className={`inline-block will-change-transform ${
                isAccent ? "text-signal-dk" : ""
              }`}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Wrapper>
  );
}

export default SplitWords;
