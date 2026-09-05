"use client";

import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { welcome } from "@/content";

const studies = [
  {
    tag: "Experience",
    title: "Fifty Years of Drayage",
    metric: "50 years, owner-led",
    summary: welcome.paragraphs[0],
    image: "/img/carmel-team.jpg",
  },
  {
    tag: "Pricing",
    title: "Quotes Without Surprises",
    metric: "No extra charges",
    summary: welcome.paragraphs[1],
    image: "/img/truck7.jpg",
  },
  {
    tag: "Equipment",
    title: "Fleet and Chassis",
    metric: "300 units, 800+ chassis",
    summary: welcome.paragraphs[2],
    image: "/img/containers-3.jpg",
  },
  {
    tag: "Storage",
    title: "Secured Yard Storage",
    metric: "Near port and rail",
    summary: welcome.paragraphs[3],
    image: "/img/storage-facility.jpg",
  },
];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Showcase7() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 xl:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-16"
          >
            <p className="mb-4 inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              {welcome.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl dark:text-white">
              {welcome.title}{" "}
              <span className="text-steel">{welcome.titleMuted}</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-steel text-pretty sm:text-lg">
              Carmel USA brings 50 years of experience in Drayage trucking from
              it&rsquo;s owners.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand dark:text-white"
            >
              More About Us
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <div className="relative mt-10 sm:mt-12 aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              {studies.map((study, index) => (
                <motion.div
                  key={study.title}
                  initial={false}
                  animate={{
                    opacity: active === index ? 1 : 0,
                    scale: active === index ? 1 : 1.06,
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={active !== index}
                  className="absolute inset-0"
                >
                  <img
                    src={study.image}
                    alt={study.title}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/25 to-transparent px-5 sm:px-6 pb-5 sm:pb-6 pt-16">
                    <p className="text-sm font-medium text-white">
                      {study.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-300">
                      {study.metric}
                    </p>
                  </div>
                </motion.div>
              ))}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-neutral-950/80 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-neutral-900 dark:text-white backdrop-blur-sm">
                {studies[active].tag}
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="border-t border-neutral-200 dark:border-neutral-800"
          >
            {studies.map((study, index) => (
              <motion.button
                type="button"
                key={study.title}
                variants={rowVariants}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                className="group grid w-full grid-cols-[auto_1fr] items-start gap-5 border-b border-neutral-200 py-7 text-left sm:gap-8 sm:py-9 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand dark:border-neutral-800"
              >
                <span
                  className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
                    active === index ? "bg-signal" : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                />
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl dark:text-white">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-sm text-steel">
                    {study.tag} &middot; {study.metric}
                  </p>
                  <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-400 text-pretty">
                    {study.summary}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Showcase7;
