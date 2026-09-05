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
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Showcase7() {
  const [active, setActive] = useState(0);

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="col-grid items-start">
          {/* columns 1-2 — the heading block, sticky */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 lg:col-span-2"
          >
            <p className="mb-5 inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              {welcome.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.04] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl dark:text-white">
              {welcome.title} <span className="text-steel">{welcome.titleMuted}</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-steel text-pretty">
              Carmel USA brings 50 years of experience in Drayage trucking from
              it&rsquo;s owners.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-brand transition-colors duration-200 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              More About Us
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <div className="relative mt-8 aspect-16/10 max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
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
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 via-ink/25 to-transparent px-5 pb-5 pt-16">
                    <p className="text-sm font-medium text-white">{study.title}</p>
                    <p className="mt-1 text-xs text-white/70">{study.metric}</p>
                  </div>
                </motion.div>
              ))}
              <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-ink backdrop-blur-sm">
                {studies[active].tag}
              </span>
            </div>
          </motion.div>

          {/* column 3 — the text, scrolling past the sticky column */}
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
                className="group grid w-full grid-cols-[auto_1fr] items-start gap-5 border-b border-neutral-200 py-7 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand dark:border-neutral-800"
              >
                <span
                  className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
                    active === index ? "bg-signal" : "bg-neutral-300 dark:bg-neutral-700"
                  }`}
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl dark:text-white">
                    {study.title}
                  </h3>
                  <p className="mt-2 text-sm text-steel">
                    {study.tag} &middot; {study.metric}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-steel text-pretty">
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
