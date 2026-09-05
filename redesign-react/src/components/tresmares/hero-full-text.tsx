"use client";

import { motion, useReducedMotion } from "motion/react";
import { SplitWords } from "./split-words";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Tresmares `component--herofulltext`.
 *
 * No image, no video, no form — the claim carries the screen on its own over
 * the ambient field. Because nothing below is visible, the scroll cue is
 * load-bearing rather than decorative.
 */
export function HeroFullText() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-between px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pt-40"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center">
        {/* All caps, so the negative tracking the display face wants at
            sentence case is dialled back — caps need room, not tightening. */}
        <SplitWords
          as="h1"
          immediate
          text="MOVE FREIGHT FORWARD"
          accent={["FORWARD"]}
          stagger={0.08}
          className="max-w-[14ch] font-display text-[2.9rem] font-bold leading-[0.98] tracking-[-0.01em] text-ink sm:text-[4.5rem] lg:text-[6rem] dark:text-white"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          className="mt-9 max-w-xl text-[1.02rem] leading-relaxed text-steel"
        >
          From port to destination, Carmel delivers reliable drayage,
          intermodal transportation, refrigerated logistics, and storage
          solutions built around your business.
        </motion.p>
      </div>

      {/* the scroll affordance is doing real work: nothing below is on screen */}
      <motion.a
        href="#scale"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mx-auto flex w-full max-w-[1400px] items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel transition-colors hover:text-ink"
      >
        <motion.span
          aria-hidden="true"
          className="block h-8 w-px bg-steel/40"
          animate={reduceMotion ? {} : { scaleY: [0.3, 1, 0.3] }}
          style={{ transformOrigin: "top" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        Scroll
      </motion.a>
    </section>
  );
}

export default HeroFullText;
