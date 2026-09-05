"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { whyCarmel } from "@/content";
import { usePinned } from "@/hooks/use-pinned";

/** White cards: image on top, text below, swept across the heading. */
const cards = [
  { ...whyCarmel.partner, image: "/img/truck7.jpg", tag: "Asset-based" },
  { ...whyCarmel.specialized, image: "/img/refrigerated.jpg", tag: "Reefer & intermodal" },
  { ...whyCarmel.dispatch, image: "/img/intermodal-trucking.jpg", tag: "24 / 7 / 365" },
  { ...whyCarmel.storage, image: "/img/storage-facility.jpg", tag: "Secured yard" },
  { ...whyCarmel.containers, image: "/img/containers-3.jpg", tag: "Every type" },
];

/** >1 lengthens the pinned section, slowing the sweep relative to page scroll. */
const SCROLL_STRETCH = 2.1;

const fade: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function Card({ c }: { c: (typeof cards)[number] }) {
  return (
    <article className="group w-[82%] shrink-0 snap-start rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_18px_44px_rgba(16,30,54,0.10)] sm:w-[48%] lg:w-[420px] dark:border-neutral-800 dark:bg-neutral-900">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
        <img
          src={c.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[0.72rem] font-semibold text-ink backdrop-blur-sm">
          {c.tag}
        </span>
      </div>
      <div className="px-2 pb-2 pt-5">
        <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink dark:text-white">
          {c.title}
        </h3>
        <p className="mt-2.5 text-[0.93rem] leading-relaxed text-steel">{c.body}</p>
      </div>
    </article>
  );
}

/** The heading that the cards pass over. Lowest layer. */
function SuperHeading() {
  return (
    <h2 className="text-center font-display text-[13vw] font-bold leading-[0.92] tracking-[-0.05em] text-ink lg:text-[9.5vw] dark:text-white">
      Built to Take
      <br />
      the <span className="text-steel">Whole Job</span>
    </h2>
  );
}

export default function WhyCarmelBento() {
  const pinned = usePinned();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [{ travel, startX, endX }, setGeo] = useState({ travel: 0, startX: 0, endX: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      const stageW = stage.clientWidth;
      const trackW = track.scrollWidth;
      // start fully off the right edge, finish with the last card flush left-of-right.
      // travel is stretched past the actual distance so the sweep reads slower —
      // more page scroll for the same horizontal movement.
      setGeo({
        travel: Math.round(trackW * SCROLL_STRETCH),
        startX: stageW,
        endX: -(trackW - stageW),
      });
    };
    measure();
    window.addEventListener("resize", measure);

    // images and webfonts land after mount and change the track width, so keep
    // measuring until it settles rather than trusting the first pass
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
  const x = useTransform(smooth, [0, 1], [startX, endX]);

  const label = (
    <div className="col-grid items-end">
      <p className="inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
        {whyCarmel.eyebrow}
      </p>
      <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-steel lg:col-span-2 lg:justify-self-end lg:text-right">
        {whyCarmel.note}
      </p>
    </div>
  );

  /* ---------- below lg, or reduced motion: heading then a plain swipe row ---------- */
  if (!pinned) {
    return (
      <section className="section-y w-full overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">{label}</div>

        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-10 w-full max-w-[1400px] px-4 sm:px-6 lg:px-8"
        >
          <SuperHeading />
        </motion.div>

        <div
          role="region"
          aria-label="Why Carmel"
          tabIndex={0}
          className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto overscroll-x-contain px-4 pb-6 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((c) => (
            <Card key={c.title} c={c} />
          ))}
        </div>
      </section>
    );
  }

  /* ---------- pinned: cards sweep in from the right, over the heading ---------- */
  return (
    <div ref={wrapperRef} style={{ height: `calc(100svh + ${travel}px)` }}>
      <section className="sticky top-0 flex h-svh w-full flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">{label}</div>

        <div ref={stageRef} className="relative mt-12 w-full">
          {/* lowest layer: the heading the cards travel across */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <SuperHeading />
          </div>

          {/* upper layer: the cards, entering from the right edge */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative z-10 flex gap-12 will-change-transform lg:gap-24"
          >
            {cards.map((c) => (
              <Card key={c.title} c={c} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
