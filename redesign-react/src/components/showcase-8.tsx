"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/content";

const projects = services;

const headerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const trackVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Showcase8() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const readScroll = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    const left = node.scrollLeft;
    setProgress(max > 0 ? Math.min(1, Math.max(0, left / max)) : 0);
    setCanPrev(left > 8);
    setCanNext(left < max - 8);
    const cards = Array.from(node.children) as HTMLElement[];
    if (!cards.length) return;
    const start = cards[0].offsetLeft;
    let nearest = 0;
    let smallest = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - start - left);
      if (distance < smallest) {
        smallest = distance;
        nearest = index;
      }
    });
    if (max - left < 8) nearest = cards.length - 1;
    setActive(nearest);
  }, []);

  const handleScroll = () => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(readScroll);
  };

  useEffect(() => {
    frameRef.current = requestAnimationFrame(readScroll);
    window.addEventListener("resize", readScroll);
    return () => {
      window.removeEventListener("resize", readScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, [readScroll]);

  const step = (direction: number) => {
    const node = trackRef.current;
    if (!node) return;
    const cards = Array.from(node.children) as HTMLElement[];
    if (!cards.length) return;
    const start = cards[0].offsetLeft;
    const left = node.scrollLeft;
    const offsets = cards.map((card) => card.offsetLeft - start);
    let target: number | undefined;
    if (direction < 0) {
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i] < left - 8) {
          target = offsets[i];
          break;
        }
      }
      if (target === undefined) target = 0;
    } else {
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] > left + 8) {
          target = offsets[i];
          break;
        }
      }
      if (target === undefined) target = node.scrollWidth - node.clientWidth;
    }
    node.scrollTo({
      left: target,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10 sm:mb-12"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              What we do
            </p>
            <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl dark:text-white">
              Services
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-steel text-pretty sm:text-lg">
              Four services, run on our own tractors, chassis and yards.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={!canPrev}
              aria-label="Previous service"
              className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white enabled:hover:bg-neutral-100 dark:enabled:hover:bg-neutral-900 enabled:cursor-pointer disabled:opacity-35 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={!canNext}
              aria-label="Next service"
              className="grid h-11 w-11 place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white enabled:hover:bg-neutral-100 dark:enabled:hover:bg-neutral-900 enabled:cursor-pointer disabled:opacity-35 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <motion.div
            ref={trackRef}
            onScroll={handleScroll}
            role="region"
            aria-label="Services"
            tabIndex={0}
            variants={trackVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex gap-5 sm:gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
          >
            {projects.map((project) => (
              <motion.a
                key={project.title}
                href={`#${project.id}`}
                id={project.id}
                variants={cardVariants}
                whileHover="hover"
                className="group w-[80%] max-w-[420px] sm:w-[400px] lg:w-[440px] shrink-0 snap-start scroll-ml-4 sm:scroll-ml-6 lg:scroll-ml-8 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl border border-b-0 border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 dark:bg-neutral-950/80 px-3 py-1 text-xs font-medium text-neutral-900 dark:text-white backdrop-blur-sm">
                    {project.tag}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 rounded-b-2xl border border-t-0 border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl dark:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel">
                      {project.blurb}
                    </p>
                  </div>
                  <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:border-white dark:group-hover:text-neutral-900 transition-colors duration-200">
                    <motion.span
                      variants={{ hover: { x: 2, y: -2 } }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="grid place-items-center"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.span>
                  </span>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="absolute inset-0 origin-left rounded-full bg-neutral-900 dark:bg-white"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <p className="font-mono text-xs tracking-[0.12em]">
            <span className="text-neutral-900 dark:text-white">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {" "}
              / {String(projects.length).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Showcase8;
