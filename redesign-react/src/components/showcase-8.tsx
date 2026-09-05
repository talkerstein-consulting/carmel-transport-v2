"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/content";
import { usePinned } from "@/hooks/use-pinned";

/** >1 lengthens the pinned section, slowing the sweep relative to page scroll. */
const SCROLL_STRETCH = 1.9;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const trackVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function Card({ project }: { project: (typeof services)[number] }) {
  return (
    <motion.a
      variants={cardVariants}
      href={`#${project.id}`}
      id={project.id}
      className="group w-[78vw] shrink-0 snap-start sm:w-[58%] lg:w-[440px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl border border-b-0 border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-medium text-ink backdrop-blur-sm">
          {project.tag}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4 rounded-b-2xl border border-t-0 border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink dark:text-white">
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-steel">{project.blurb}</p>
        </div>
        <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-300 text-ink transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white dark:border-neutral-700 dark:text-white">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </motion.a>
  );
}

export function Showcase8() {
  const pinned = usePinned();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [{ travel, endX }, setGeo] = useState({ travel: 0, endX: 0 });
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      // track = the moving element, stage = the window it moves behind
      const distance = Math.max(0, track.scrollWidth - stage.clientWidth);
      setGeo({ travel: Math.round(distance * SCROLL_STRETCH), endX: -distance });
    };
    measure();
    window.addEventListener("resize", measure);

    // images and webfonts land after mount and change the track width
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (stageRef.current) ro.observe(stageRef.current);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });
  const x = useTransform(smooth, [0, 1], [0, endX]);
  const progressScale = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(smooth, "change", (v) => {
    setActive(Math.round(v * (services.length - 1)));
  });

  /** Arrows move the page, because page scroll is what drives the track. */
  const step = (direction: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !pinned || travel === 0) return;
    const perCard = travel / Math.max(1, services.length - 1);
    window.dispatchEvent(
      new CustomEvent("carmel:scroll-by", { detail: { top: direction * perCard } }),
    );
  };

  const heading = (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="mb-4 inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
        What we do
      </p>
      <h2 className="font-display text-3xl font-bold leading-[1.05] tracking-tight text-ink text-balance sm:text-4xl lg:text-5xl dark:text-white">
        Services
      </h2>
      <p className="mt-5 max-w-sm text-base leading-relaxed text-steel text-pretty">
        Four services, run on our own tractors, chassis and yards.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous service"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-neutral-300 text-ink transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-neutral-700 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next service"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-neutral-300 text-ink transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:border-neutral-700 dark:text-white"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="ml-3 font-mono text-xs tracking-[0.12em] text-steel">
          <span className="text-ink dark:text-white">
            {String(Math.min(active + 1, services.length)).padStart(2, "0")}
          </span>{" "}
          / {String(services.length).padStart(2, "0")}
        </p>
      </div>

      <div className="relative mt-6 h-0.5 w-full max-w-[220px] overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <motion.div
          style={pinned ? { scaleX: progressScale } : undefined}
          className="absolute inset-0 origin-left rounded-full bg-ink dark:bg-white"
        />
      </div>
    </motion.div>
  );

  /* ---------- reduced motion: plain swipe, same layout ---------- */
  if (!pinned) {
    return (
      <section className="section-y w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="col-grid items-center">
            {heading}
            <div
              role="region"
              aria-label="Services"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-4 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:col-span-2 [&::-webkit-scrollbar]:hidden"
            >
              {services.map((p) => (
                <Card key={p.title} project={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- pinned: heading on column 1, cards sweep across 2-3 ---------- */
  return (
    <div ref={wrapperRef} style={{ height: `calc(100svh + ${travel}px)` }}>
      <section className="sticky top-0 flex h-svh w-full items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="col-grid items-center">
            {heading}

            {/* columns 2-3: the window the track moves behind */}
            <div ref={stageRef} className="overflow-hidden lg:col-span-2">
              <motion.div
                ref={trackRef}
                variants={trackVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                style={{ x }}
                className="flex gap-6 will-change-transform"
              >
                {services.map((p) => (
                  <Card key={p.title} project={p} />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Showcase8;
