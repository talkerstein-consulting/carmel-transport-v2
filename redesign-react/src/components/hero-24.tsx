"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { NeuroNoise } from "@paper-design/shaders-react";
import { FileBadge2, Forklift, Globe, ThermometerSnowflake } from "lucide-react";
import { IntakeForm } from "@/components/intake-form";
import { company } from "@/content";

/** The four services, as line icons under the hero copy. */
const heroServices = [
  { label: "Drayage", href: "#services", Icon: Globe },
  { label: "Refrigerated Containers", href: "#services", Icon: ThermometerSnowflake },
  { label: "Intermodal Trucking", href: "#services", Icon: FileBadge2 },
  { label: "Storage Facility", href: "#services", Icon: Forklift },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const headline: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero24() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-ink px-4 pb-44 pt-32 sm:px-6 lg:px-8 lg:pb-52 lg:pt-40"
    >
      <img
        src="/img/slider.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      <NeuroNoise
        className="absolute inset-0 h-full w-full opacity-25 mix-blend-soft-light"
        style={{ width: "100%", height: "100%" }}
        colorBack="#0E1B2E"
        colorMid="#1763B8"
        colorFront="#5C9BE0"
        brightness={0.16}
        contrast={0.3}
        scale={1.3}
        offsetX={0.42}
        speed={reduceMotion ? 0 : 0.25}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(14,27,46,0.95)_0%,rgba(14,27,46,0.72)_42%,rgba(14,27,46,0.28)_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,27,46,0.55)_0%,rgba(14,27,46,0.12)_35%,rgba(14,27,46,0.75)_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <div className="col-grid items-start">
          {/* column 1 — copy, then the services as a 2x2 */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 shadow-sm backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              {company.eyebrow}
            </motion.div>

            <motion.h1
              variants={headline}
              className="mt-7 font-display text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl"
            >
              {company.headline}
              <br />
              <span className="text-signal">{company.headlineAccent}</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/80"
            >
              {company.intro}
            </motion.p>

            {/* 2 x 2 services — line icons only, no fill or frame */}
            <motion.ul
              variants={item}
              className="mt-12 grid max-w-md list-none grid-cols-2 gap-x-8 gap-y-10"
            >
              {heroServices.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex flex-col items-start gap-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                  >
                    <Icon
                      size={40}
                      strokeWidth={1}
                      aria-hidden="true"
                      className="text-white/85 transition-colors duration-300 group-hover:text-signal"
                    />
                    <span className="text-[0.74rem] font-bold uppercase leading-tight tracking-[0.08em] text-white/70 transition-colors duration-300 group-hover:text-white">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* columns 2-3 — the quote box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl justify-self-center lg:col-span-2"
          >
            <IntakeForm wide />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero24;
