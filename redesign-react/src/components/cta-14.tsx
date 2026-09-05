"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Check, Clock } from "lucide-react";
import { company, containerTypes, serviceOptions } from "@/content";

const panel: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const fieldCx =
  "w-full rounded-lg border border-white/15 bg-white/8 px-4 py-3 text-[0.95rem] text-white outline-none transition-colors placeholder:text-white/35 focus:border-signal focus:bg-white/12";
const labelCx =
  "mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-white/55";

export default function CTA14() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={panel}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-3xl bg-ink shadow-2xl shadow-ink/25"
        >
          <motion.div
            aria-hidden="true"
            animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, -24, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 16, repeat: Infinity, ease: "easeInOut" }
            }
            className="pointer-events-none absolute -top-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-white/[0.05] blur-3xl"
          />

          <div className="relative col-grid items-start p-6 sm:p-10 lg:p-14">
            {/* column 1 — the copy */}
            <motion.div variants={list} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.span
                variants={item}
                className="text-xs font-medium uppercase tracking-[0.2em] text-signal"
              >
                Request a Quote
              </motion.span>
              <motion.h2
                variants={item}
                className="mt-5 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl"
              >
                Let&rsquo;s Move Your Freight.
              </motion.h2>
              <motion.p
                variants={item}
                className="mt-5 text-base leading-relaxed text-white/60"
              >
                Contact us today to request a quote. We look forward to being the
                full-service company you trust for all of your transport needs.
              </motion.p>

              <motion.ul variants={item} className="mt-8 grid gap-3.5">
                <li className="flex items-start gap-3 text-[0.95rem] text-white/80">
                  <Check size={17} className="mt-0.5 shrink-0 text-signal" />
                  Precise quotes, no &lsquo;surprises&rsquo; on the invoice.
                </li>
                <li className="flex items-start gap-3 text-[0.95rem] text-white/80">
                  <Clock size={17} className="mt-0.5 shrink-0 text-signal" />
                  {company.hours}.
                </li>
              </motion.ul>

              <motion.div variants={item} className="mt-8 flex flex-wrap gap-1.5">
                {containerTypes.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/12 px-3 py-1.5 text-[0.78rem] text-white/60"
                  >
                    {c}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* columns 2-3 — the form */}
            <motion.form
              variants={item}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              onSubmit={(e) => e.preventDefault()}
              className="lg:col-span-2"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCx} htmlFor="cta-name">
                    Name
                  </label>
                  <input id="cta-name" name="name" autoComplete="name" required placeholder="Your name" className={fieldCx} />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cta-company">
                    Company
                  </label>
                  <input id="cta-company" name="company" autoComplete="organization" placeholder="Company" className={fieldCx} />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cta-email">
                    Email
                  </label>
                  <input id="cta-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={fieldCx} />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cta-phone">
                    Phone
                  </label>
                  <input id="cta-phone" name="phone" type="tel" autoComplete="tel" placeholder="(000) 000-0000" className={fieldCx} />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cta-service">
                    Service
                  </label>
                  <select id="cta-service" name="service" className={`${fieldCx} cursor-pointer`}>
                    {serviceOptions.map((s) => (
                      <option key={s} className="bg-ink">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCx} htmlFor="cta-container">
                    Container
                  </label>
                  <select id="cta-container" name="container" className={`${fieldCx} cursor-pointer`}>
                    {containerTypes.map((c) => (
                      <option key={c} className="bg-ink">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCx} htmlFor="cta-details">
                    Pick up, delivery and dates
                  </label>
                  <textarea
                    id="cta-details"
                    name="details"
                    rows={4}
                    placeholder="Terminal, destination ZIP, and when it needs to move."
                    className={`${fieldCx} resize-y`}
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-signal px-8 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-signal-dk"
                >
                  Request a Quote
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
                <a
                  href={company.phones.emergency.href}
                  className="text-[0.95rem] text-white/60 transition-colors hover:text-white"
                >
                  Or call {company.phones.emergency.value}
                </a>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
