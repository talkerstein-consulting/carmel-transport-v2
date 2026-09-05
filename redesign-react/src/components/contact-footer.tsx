"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUp, Clock, FileCheck2, Mail, MapPin, Phone } from "lucide-react";
import { company, contact, navLinks, serviceLinks, serviceOptions } from "@/content";

const fieldCx =
  "mt-2 w-full rounded-lg bg-neutral-100 px-4 py-3.5 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-brand dark:bg-white/5 dark:text-white";
const labelCx = "block text-[0.95rem] font-medium text-ink dark:text-white";

export default function ContactFooter() {
  return (
    /* The whole block sits on the footer's grey, so the form card can rise
       out of the top of the photo band and still have a ground to sit on. */
    <section id="contact" className="relative w-full">
      {/* grey strip the card overlaps into */}
      <div className="pt-10 lg:pt-24">
        {/* band — deliberately NOT overflow-hidden, or it would clip the card */}
        {/* tall enough that the lifted form card lands well inside the photo */}
        <div className="relative lg:min-h-[880px]">
          {/* only the photo is clipped */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/img/containers-3.jpg"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(100deg,rgba(14,27,46,0.92)_0%,rgba(14,27,46,0.66)_46%,rgba(14,27,46,0.3)_100%)]"
            />
          </div>

          <div className="relative mx-auto grid w-full max-w-[1400px] items-start gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_minmax(420px,520px)] lg:gap-16 lg:px-8 lg:py-0">
            {/* left: heading, marks, reach-out card */}
            <div className="lg:pb-24 lg:pt-40">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-[16ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {contact.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="mt-7 flex flex-wrap items-center gap-x-9 gap-y-3"
              >
                <span className="inline-flex items-center gap-2.5 text-[0.95rem] text-white/85">
                  <FileCheck2 size={18} strokeWidth={1.8} className="shrink-0 text-white/60" />
                  Precise quotes, no extra charges.
                </span>
                <span className="inline-flex items-center gap-2.5 text-[0.95rem] text-white/85">
                  <Clock size={18} strokeWidth={1.8} className="shrink-0 text-white/60" />
                  {company.hours}.
                </span>
              </motion.div>

              {/* the contact details, listed out */}
              <motion.dl
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-12 grid max-w-xl gap-px overflow-hidden rounded-2xl border border-white/12 bg-white/12 sm:grid-cols-2 lg:mt-16"
              >
                <div className="bg-ink/70 p-5 backdrop-blur-sm">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-signal">
                    <MapPin size={14} strokeWidth={2} /> Address
                  </dt>
                  <dd className="mt-2.5 text-[0.95rem] leading-relaxed text-white/85">
                    {company.address}
                  </dd>
                </div>

                <div className="bg-ink/70 p-5 backdrop-blur-sm">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-signal">
                    <Phone size={14} strokeWidth={2} /> Phones
                  </dt>
                  <dd className="mt-2.5 grid gap-1.5 text-[0.95rem] text-white/85">
                    <a href={company.phones.emergency.href} className="hover:text-signal">
                      Emergency: {company.phones.emergency.value} {company.phones.emergency.note}
                    </a>
                    <a href={company.phones.sales.href} className="hover:text-signal">
                      Sales: {company.phones.sales.value}
                    </a>
                    <a href={company.phones.other.href} className="hover:text-signal">
                      Other inquiries: {company.phones.other.value}
                    </a>
                  </dd>
                </div>

                <div className="bg-ink/70 p-5 backdrop-blur-sm">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-signal">
                    <Mail size={14} strokeWidth={2} /> Email
                  </dt>
                  <dd className="mt-2.5 text-[0.95rem] text-white/85">
                    <a href={`mailto:${company.email}`} className="hover:text-signal">
                      {company.email}
                    </a>
                  </dd>
                </div>

                <div className="bg-ink/70 p-5 backdrop-blur-sm">
                  <dt className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-signal">
                    <Clock size={14} strokeWidth={2} /> Opening Hours
                  </dt>
                  <dd className="mt-2.5 text-[0.95rem] text-white/85">{company.hours}</dd>
                </div>
              </motion.dl>

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                href={company.phones.emergency.href}
                className="group mt-6 inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-signal-dk"
              >
                Call Dispatch
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </motion.a>
            </div>

            {/* right: the form, lifted out of the top of the band */}
            <motion.form
              id="quote"
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full rounded-3xl bg-white p-7 shadow-[0_30px_70px_rgba(16,30,54,0.28)] sm:p-10 lg:-mt-16 dark:bg-neutral-900"
            >
              <h3 className="font-display text-2xl font-bold leading-[1.15] tracking-tight text-ink sm:text-[2rem] dark:text-white">
                Have freight to move?
                <br />
                <span className="text-steel">Let&rsquo;s get started</span>
              </h3>
              <p className="mt-5 text-[0.98rem] leading-relaxed text-steel">
                Send the pick up, delivery and dates. A dispatcher gets back to
                you with an all-in rate.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className={labelCx} htmlFor="cf-name">
                    Your Name
                  </label>
                  <input
                    id="cf-name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="Your name"
                    className={fieldCx}
                  />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cf-email">
                    Email
                  </label>
                  <input
                    id="cf-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    className={fieldCx}
                  />
                </div>
                <div>
                  <label className={labelCx} htmlFor="cf-service">
                    Service
                  </label>
                  <select id="cf-service" name="service" className={`${fieldCx} cursor-pointer`}>
                    {serviceOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCx} htmlFor="cf-details">
                    Shipment Details
                  </label>
                  <textarea
                    id="cf-details"
                    name="details"
                    rows={4}
                    placeholder="Pick up, delivery and dates"
                    className={`${fieldCx} resize-y`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-8 w-full cursor-pointer rounded-full bg-signal px-6 py-4 text-[0.95rem] font-semibold text-ink transition-colors hover:bg-signal-dk"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </div>

      {/* ============ FOOTER ============ */}
      <footer id="careers" className="w-full px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:gap-10">
            <div>
              <p className="font-display text-5xl font-bold uppercase leading-none tracking-[-0.04em] text-ink sm:text-6xl lg:text-[5.5rem] dark:text-white">
                Carmel
                <sup className="align-super text-[0.22em] tracking-normal text-neutral-400">
                  &trade;
                </sup>
              </p>
              <p className="mt-5 max-w-[34ch] text-[0.93rem] leading-relaxed text-steel">
                Drayage, refrigerated containers, intermodal trucking and secured
                storage. {company.addressShort}.
              </p>
            </div>

            <div>
              <h4 className="text-[1.02rem] text-steel">Navigation</h4>
              <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                {navLinks.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[1.02rem] text-ink transition-colors hover:text-brand dark:text-neutral-200"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[1.02rem] text-steel">Services</h4>
              <ul className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-3">
                {serviceLinks.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-2.5">
                    <a
                      href={s.href}
                      title={s.label}
                      className="text-[1.02rem] text-ink transition-colors hover:text-brand dark:text-neutral-200"
                    >
                      {s.label.split(" ")[0]}
                    </a>
                    {i < serviceLinks.length - 1 && (
                      <span aria-hidden="true" className="text-neutral-300">
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                // Lenis owns the scroll; fall back to native if it's off
                const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (reduced) {
                  window.scrollTo({ top: 0, behavior: "auto" });
                } else {
                  window.dispatchEvent(new Event("carmel:scroll-top"));
                }
              }}
              aria-label="Back to top"
              className="grid h-14 w-14 cursor-pointer place-items-center self-start justify-self-start rounded-2xl border border-neutral-200 bg-white text-ink transition-colors hover:bg-ink hover:text-white lg:justify-self-end dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            >
              <ArrowUp size={18} strokeWidth={2} />
            </button>
          </div>

          <div className="mt-16 flex flex-col gap-4 border-t border-neutral-200 py-7 text-[0.9rem] text-steel sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
            <span>{company.addressShort}</span>
            <span>{company.copyright}</span>
            <span className="flex gap-7">
              <a href={company.phones.sales.href} className="transition-colors hover:text-brand">
                {company.phones.sales.value}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="transition-colors hover:text-brand"
              >
                {company.email}
              </a>
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
