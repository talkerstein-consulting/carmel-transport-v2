"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type Variants } from "motion/react";
import { stats } from "@/content";

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
    <section className="section-y w-full px-4 sm:px-6 lg:px-8 ">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 inline-flex items-center gap-2.5 text-[0.87rem] text-steel"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
          Fifty years of drayage experience, and the fleet to back it
        </motion.p>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-900 sm:grid-cols-2 lg:grid-cols-4 dark:border-neutral-800"
        >
          {stats.map((stat, i) => (
            <motion.article
              key={stat.label}
              variants={cardVariants}
              className={`flex flex-col p-7 sm:p-8 ${
                i > 0
                  ? "border-t border-neutral-200 sm:border-t-0 sm:border-l dark:border-neutral-800"
                  : ""
              } ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${
                i === 1 ? "sm:border-l" : ""
              }`}
            >
              <div className="flex items-baseline font-display text-4xl font-bold tracking-[-0.04em] tabular-nums text-ink sm:text-5xl dark:text-white">
                <CountUp value={stat.value} />
                {stat.suffix && (
                  <span className="text-signal-dk">{stat.suffix}</span>
                )}
              </div>
              <p className="mt-3 text-[0.9rem] font-medium text-ink-2 dark:text-neutral-200">
                {stat.label}
              </p>
              <p className="mt-1 text-[0.85rem] leading-relaxed text-steel">
                {stat.note}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
