"use client";

import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";

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
  return (
    <section className="hiw">
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
          <a href="#quote" className="hiw-cta">
            Request a quote <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        <div className="relative mt-12 sm:mt-16">
          <div className="grid grid-cols-3 items-center">
            {stages.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex justify-center"
              >
                <span className="hiw-chip">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-5 h-3 flex items-center">
            <div className="hiw-rule" />
            {stages.map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="hiw-dot"
                style={{ left: `calc(${16.66 + 33.33 * i}% - 5px)` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {stages.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="hiw-card"
            >
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
