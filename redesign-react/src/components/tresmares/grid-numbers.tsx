"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { SplitWords } from "./split-words";
import { scaleStats } from "@/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Counts up only once the card is actually on screen, and only for stats
 * that are a plain number — "24/7" is printed as-is.
 */
function StatValue({
  display,
  count,
  suffix,
}: {
  display: string;
  count?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (count === undefined || reduceMotion || !inView) {
      el.textContent = count === undefined ? display : String(count);
      return;
    }
    const controls = animate(0, count, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [count, display, inView, reduceMotion]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>{count === undefined ? display : "0"}</span>
      {suffix && <span className="text-signal-dk">{suffix}</span>}
    </span>
  );
}

/**
 * Tresmares `component--gridnumbers vertical`.
 *
 * The left column pins while six offset stat cards scroll past it — the
 * pattern that turns what would be a skimmed stat bar into a section-and-a-half
 * of held attention. Tresmares drives the pin with GSAP ScrollTrigger; plain
 * `position: sticky` does the same job here with no library.
 *
 * The vertical offset on alternating cards is what stops it reading as a
 * table. It only applies from `lg` up, where there is room for it.
 */
export function GridNumbers() {
  return (
    <section
      id="scale"
      className="relative w-full px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-20">
        {/* Pinned column. The grid item has to stay full-height (no self-start,
            no h-fit) or sticky has nothing to travel inside — the sticky rule
            goes on the inner div. */}
        <div className="lg:relative">
          <div className="lg:sticky lg:top-32">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-7 flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-steel"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            The fleet
          </motion.p>

          <SplitWords
            as="h2"
            text="Fifty years of drayage, and the equipment to back every quote we give."
            accent={["Fifty"]}
            stagger={0.04}
            className="font-display text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[2.1rem] dark:text-white"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-sm text-[0.92rem] leading-relaxed text-steel"
          >
            We run our own power units, our own chassis pool and our own
            secured yards close to the New Jersey seaports and rail terminals.
            Nothing gets subcontracted out from under you.
          </motion.p>

          <motion.a
            href="#services"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="group mt-8 inline-flex items-center gap-2 border-b border-ink/25 pb-1 text-[0.82rem] font-semibold text-ink transition-colors hover:border-signal-dk dark:border-white/25 dark:text-white"
          >
            See what we run
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
            </motion.a>
          </div>
        </div>

        {/* scrolling column — offset grid, each card on its own trigger */}
        <ul className="grid list-none grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:gap-y-24">
          {scaleStats.map((stat, i) => (
            <motion.li
              key={stat.label}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-18%" }}
              transition={{ duration: 0.75, ease: EASE }}
              /* every second card drops half a step — this is what keeps it
                 from reading as a table */
              className={i % 2 === 1 ? "lg:mt-28" : undefined}
            >
              <div className="border-t border-ink/12 pt-6 dark:border-white/15">
                <div className="font-display text-[3.4rem] font-bold leading-none tracking-[-0.045em] text-ink lg:text-[4.2rem] dark:text-white">
                  <StatValue
                    display={stat.display}
                    count={stat.count}
                    suffix={"suffix" in stat ? stat.suffix : undefined}
                  />
                </div>
                <p className="mt-5 text-[0.95rem] font-semibold text-ink-2 dark:text-neutral-100">
                  {stat.label}
                </p>
                <p className="mt-1.5 max-w-[26ch] text-[0.85rem] leading-relaxed text-steel">
                  {stat.note}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default GridNumbers;
