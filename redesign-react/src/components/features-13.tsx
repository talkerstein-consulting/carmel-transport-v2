"use client";

import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { whatWeBring } from "@/content";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Features13() {
  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="col-grid items-start"
        >
          {/* column 1 — the text */}
          <motion.div variants={fadeUp} className="lg:sticky lg:top-28">
            <p className="inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              {whatWeBring.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl dark:text-white">
              {whatWeBring.title}{" "}
              <span className="text-steel">{whatWeBring.titleMuted}</span>
            </h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-steel">
              {whatWeBring.lede}
            </p>
          </motion.div>

          {/* columns 2-3 — the cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
            {whatWeBring.items.map((feature, i) => (
              <motion.article
                key={feature.id}
                variants={fadeUp}
                className={`group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${
                  i === whatWeBring.items.length - 1 ? "sm:col-span-2 sm:flex-row" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    i === whatWeBring.items.length - 1
                      ? "aspect-16/10 sm:aspect-auto sm:w-2/5"
                      : "aspect-16/10"
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[0.72rem] font-semibold text-ink backdrop-blur-sm">
                    {feature.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-center p-6 lg:p-7">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-[0.93rem] leading-relaxed text-steel">
                    {feature.body}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features13;
