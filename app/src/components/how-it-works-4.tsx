"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Cta } from "@/components/site/Cta";

gsap.registerPlugin(ScrollTrigger);

const stages = [
  {
    label: "Seaports",
    title: "Container pickup and transportation.",
    items: [
      "Asset-based drayage from the terminal",
      "Dry, overweight, open-top and flat-rack",
      "20', 40' and 45' containers",
    ],
  },
  {
    label: "Rail terminals",
    title: "Intermodal coordination.",
    items: [
      "Ocean and rail container terminals",
      "Pre-arranged rail reservations",
      "Documentation and border clearance",
    ],
  },
  {
    label: "Secure yards",
    title: "Short- and long-term storage.",
    items: [
      "Yards near major seaports and rail",
      "Dry-box and refrigerated containers",
      "Monitored around the clock",
    ],
  },
];

/* Section 06 — How we connect the journey.
   @reactbits-pro/how-it-works-4, restyled onto the site's tokens: the block
   ships its own neutral palette and dark-mode variants, which would read as a
   different site. */
export default function HowItWorks4() {
  const stageRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  /* The three stages arrive one at a time, and the rule between them fills as
     you scroll — the line is the progress readout, so the section reads as a
     journey being drawn rather than three cards fading in together.

     Scrubbed, not triggered: a whileInView fade plays once at whatever speed
     it likes, which cannot show progress. Tying scaleX and the per-stage
     thresholds to the same scroll range means the fill always arrives at a dot
     exactly when that stage appears. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    /* Desktop only. These entrances set opacity:0 up front and rely on a
       ScrollTrigger to bring it back. This page grows by thousands of pixels
       after mount as the frame sequences load, so triggers created at mount
       resolve against a much shorter document -- on a phone they frequently
       never fired at all and the section simply stayed invisible. Nothing on
       a phone needs a dealt entrance; the content is there and it scrolls. */
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const fill = fillRef.current;
      const rule = el.querySelector<HTMLElement>(".hiw-rule");
      const groups = gsap.utils.toArray<HTMLElement>("[data-stage]", el);

      /* Each stage is triggered on itself and the fill on the rule. An earlier
         version drove all of it from one trigger on the section with a manual
         onUpdate; that resolved its range against a document still growing as
         the frame sequences loaded, and then sat at progress 1 without
         updating again. Per-element fromTo tweens re-measure on refresh and
         are the pattern the rest of this page already uses. */
      const fillTween = fill && rule
        ? gsap.fromTo(fill, { scaleX: 0 }, {
            scaleX: 1, ease: "none",
            scrollTrigger: {
              trigger: rule, start: "top 86%", end: "top 46%",
              scrub: true, invalidateOnRefresh: true,
            },
          })
        : null;

      /* The three stages sit side by side, so they share a top edge — a range
         measured from each element's own position fires all three at once. The
         sequencing has to come from the index instead: each stage starts 11% of
         a viewport later than the one before it, which is what makes them
         arrive left to right as the fill reaches each dot. */
      const reveals = groups.map((g) => {
        const i = Number(g.dataset.stage);
        return gsap.fromTo(g, { opacity: 0, y: 14 }, {
          opacity: 1, y: 0, ease: "power2.out",
          scrollTrigger: {
            trigger: g,
            start: `top ${92 - i * 11}%`,
            end: `top ${70 - i * 11}%`,
            scrub: true, invalidateOnRefresh: true,
          },
        });
      });

      return () => {
        [fillTween, ...reveals].forEach((t) => {
          if (!t) return;
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hiw" ref={stageRef}>
      <div className="max-w-[1400px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <p className="hiw-eyebrow">How we connect the journey</p>
          <h2 className="hiw-head">From port to possibility.</h2>
          <p className="hiw-lead">
            Freight moves through more than one destination. Carmel connects the
            critical points along the way.
          </p>
          <div className="hiw-cta">
            <Cta href="#quote">Request a quote</Cta>
          </div>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          <div className="hiw-stages grid grid-cols-3 items-center">
            {stages.map((s, i) => (
              <div className="flex justify-center hiw-reveal" data-stage={i} key={i}>
                <span className="hiw-chip">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="hiw-track relative mt-5 h-3 flex items-center">
            <div className="hiw-rule">
              <span className="hiw-rule-fill" ref={fillRef} />
            </div>
            {stages.map((_, i) => (
              <span
                key={i}
                className="hiw-dot hiw-reveal"
                data-stage={i}
                style={{ left: `calc(${16.66 + 33.33 * i}% - 5px)` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((s, i) => (
            <div className="hiw-card hiw-reveal" data-stage={i} key={i}>
              <h3 className="hiw-card-head">
                {s.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {s.items.map((item, j) => (
                  <li
                    key={j}
                    className="hiw-item"
                  >
                    <Check
                      className="hiw-check"
                      strokeWidth={2.5}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
