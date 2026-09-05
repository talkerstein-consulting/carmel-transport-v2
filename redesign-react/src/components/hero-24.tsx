"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { NeuroNoise } from "@paper-design/shaders-react";
import { FileBadge2, Forklift, Globe, ThermometerSnowflake } from "lucide-react";
import { IntakeForm } from "@/components/intake-form";
import { company } from "@/content";

/** The four services, as line icons over the hero. */
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
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
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
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-ink px-4 pb-16 pt-28 sm:px-6 lg:px-8"
    >
      {/* photo bed */}
      <img
        src="/img/slider.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />

      {/* Carmel-tinted shader over the photo */}
      {/* Ambient light only. Yellow is the CTA colour — letting the shader
          smear it across the photo cheapened it and read as an artifact. */}
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

      {/* scrims: keep the copy legible over both */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(14,27,46,0.95)_0%,rgba(14,27,46,0.72)_42%,rgba(14,27,46,0.25)_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,27,46,0.55)_0%,rgba(14,27,46,0.1)_35%,rgba(14,27,46,0.6)_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(360px,420px)] lg:gap-14">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex max-w-2xl flex-col items-start text-left"
          >
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
              className="mt-7 font-display text-4xl font-bold leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl"
            >
              {company.headline}
              <br />
              <span className="text-signal">{company.headlineAccent}</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg"
            >
              {company.intro}
            </motion.p>

          </motion.div>

          {/* the intake card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full justify-self-end"
          >
            <IntakeForm />
          </motion.div>
        </div>

        {/* service strip — white container, dark line icons, blue labels */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid list-none grid-cols-2 gap-px overflow-hidden rounded-2xl bg-neutral-200 shadow-[0_18px_44px_rgba(8,20,38,0.28)] lg:mt-14 lg:grid-cols-4"
        >
          {heroServices.map(({ label, href, Icon }) => (
            <li key={label} className="bg-white">
              <a
                href={href}
                className="group flex h-full flex-col items-center justify-start gap-4 px-4 py-8 text-center transition-colors hover:bg-neutral-50"
              >
                <Icon
                  size={44}
                  strokeWidth={1.25}
                  aria-hidden="true"
                  className="text-ink transition-transform duration-300 group-hover:-translate-y-0.5"
                />
                <span className="text-[0.78rem] font-bold uppercase leading-tight tracking-[0.06em] text-brand">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default Hero24;
