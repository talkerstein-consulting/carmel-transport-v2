"use client";

import { SplitWords } from "./split-words";

/**
 * Tresmares `component--textblocklarge center`.
 *
 * On their live EN build both instances are empty — 336px of CMS slot doing
 * nothing but separating hero from stats and stats from services. Shipping
 * two blank spacers would be adapting the bug, so these carry a short
 * centred statement instead and keep the same job: a beat between sections.
 */
export function Statement({
  text,
  accent = [],
  id,
}: {
  text: string;
  accent?: string[];
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative w-full px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-[900px] text-center">
        <SplitWords
          as="p"
          text={text}
          accent={accent}
          stagger={0.04}
          className="font-display text-2xl font-bold leading-[1.25] tracking-[-0.03em] text-ink sm:text-3xl lg:text-[2.5rem] dark:text-white"
        />
      </div>
    </section>
  );
}

export default Statement;
