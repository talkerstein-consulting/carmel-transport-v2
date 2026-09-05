"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";
import { ChevronDown } from "lucide-react";
import { whatWeBring } from "@/content";

const features = whatWeBring.items;
type FeatureId = (typeof features)[number]["id"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Photo panel — replaces the block's stock illustration vignettes. */
function ImageCard({ id }: { id: FeatureId }) {
  const feature = features.find((f) => f.id === id) ?? features[0];
  return (
    <figure className="w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-[0.7rem] font-semibold text-ink backdrop-blur-sm">
          {feature.tag}
        </span>
      </div>
      <figcaption className="px-5 py-4">
        <p className="font-display text-base font-bold tracking-tight text-ink dark:text-white">
          {feature.title}
        </p>
      </figcaption>
    </figure>
  );
}

export function Features13() {
  const [activeId, setActiveId] = useState<FeatureId>(features[0].id);
  const active = features.find((feature) => feature.id === activeId) ?? features[0];

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8 ">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 text-[0.87rem] text-steel"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
            {whatWeBring.eyebrow}
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl dark:text-white"
          >
            {whatWeBring.title}{" "}
            <span className="text-steel">{whatWeBring.titleMuted}</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-base leading-relaxed text-steel sm:text-lg"
          >
            {whatWeBring.lede}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 items-start gap-10 sm:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16"
        >
          <motion.div
            variants={container}
            className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800"
          >
            {features.map((feature, index) => {
              const isOpen = feature.id === activeId;
              return (
                <motion.div key={feature.id} variants={fadeUp}>
                  <h3>
                    <button
                      type="button"
                      id={`bring-trigger-${feature.id}`}
                      aria-expanded={isOpen}
                      aria-controls={`bring-panel-${feature.id}`}
                      onClick={() => setActiveId(feature.id)}
                      className="group flex w-full cursor-pointer items-baseline gap-4 py-5 text-left sm:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
                    >
                      <span className="w-7 shrink-0 text-xs font-medium tabular-nums text-neutral-400 dark:text-neutral-600">
                        0{index + 1}
                      </span>
                      <span
                        className={`flex-1 font-display text-lg font-bold tracking-tight transition-colors duration-200 sm:text-xl ${
                          isOpen
                            ? "text-ink dark:text-white"
                            : "text-steel group-hover:text-ink dark:group-hover:text-white"
                        }`}
                      >
                        {feature.title}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className={`self-center transition-colors duration-200 ${
                          isOpen ? "text-ink dark:text-white" : "text-neutral-400"
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={`bring-panel-${feature.id}`}
                        role="region"
                        aria-labelledby={`bring-trigger-${feature.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 sm:pb-7">
                          <p className="max-w-md pl-11 pr-8 text-base leading-relaxed text-steel">
                            {feature.body}
                          </p>
                          <div className="mt-6 lg:hidden">
                            <ImageCard id={feature.id} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="hidden min-h-[480px] flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 lg:flex dark:border-neutral-800 dark:bg-neutral-900"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex w-full flex-col items-center"
              >
                <ImageCard id={active.id} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features13;
