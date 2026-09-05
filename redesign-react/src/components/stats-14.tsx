"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type Variants } from "motion/react";
import { leadStat, stats } from "@/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shouldReduceMotion) {
      el.textContent = String(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.5,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, shouldReduceMotion]);

  return <span ref={ref}>0</span>;
}

export default function Stats14() {
  return (
    /* lifted so the panel overlaps the bottom of the hero */
    <section className="relative z-20 -mt-32 w-full px-4 sm:px-6 lg:-mt-44 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="col-grid gap-0! overflow-hidden rounded-3xl bg-white ring-4 ring-white shadow-[0_30px_70px_rgba(16,30,54,0.18)] dark:bg-neutral-900 dark:ring-neutral-900"
        >
          {/* column 1 — the headline figure */}
          <motion.article
            variants={cardVariants}
            className="flex flex-col justify-center bg-ink p-8 text-white lg:p-10"
          >
            <div className="flex items-baseline font-display text-6xl font-bold tracking-[-0.04em] tabular-nums lg:text-7xl">
              <CountUp value={leadStat.value} />
              <span className="ml-1 text-signal">+</span>
            </div>
            <p className="mt-4 font-display text-xl font-bold tracking-tight text-signal">
              {leadStat.label}
            </p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-white/65">
              {leadStat.note}
            </p>
          </motion.article>

          {/* columns 2-3 — the supporting figures, 2 x 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2">
            {stats.map((stat, i) => (
              <motion.article
                key={stat.label}
                variants={cardVariants}
                className={`border-neutral-200 p-7 lg:p-8 dark:border-neutral-800 ${
                  i % 2 === 0 ? "sm:border-r" : ""
                } ${i < 2 ? "sm:border-b" : ""} ${i > 0 ? "border-t sm:border-t-0" : ""}`}
              >
                <div className="flex items-baseline font-display text-4xl font-bold tracking-[-0.04em] tabular-nums text-ink lg:text-[2.75rem] dark:text-white">
                  <CountUp value={stat.value} />
                  {stat.suffix && <span className="text-signal-dk">{stat.suffix}</span>}
                </div>
                <p className="mt-2.5 text-[0.95rem] font-medium text-ink-2 dark:text-neutral-200">
                  {stat.label}
                </p>
                <p className="mt-1 text-[0.85rem] leading-relaxed text-steel">{stat.note}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
