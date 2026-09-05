"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { company, navLinks, serviceLinks } from "@/content";

export default function Navigation9() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // over the hero the nav is light-on-image; once stuck it inverts to ink-on-white
  const linkCx = scrolled
    ? "text-ink-2 hover:text-ink dark:text-neutral-200 dark:hover:text-white"
    : "text-white/85 hover:text-white";

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-0 h-px w-full" />
      <div className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1400px]">
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex items-center justify-between py-1.5 transition-[background-color,backdrop-filter,border-color,box-shadow,border-radius,padding] duration-300 ease-out ${
              scrolled
                ? "rounded-2xl border border-neutral-200 bg-white/80 pl-4! pr-1.5! shadow-[0_8px_30px_-10px_rgba(16,30,54,0.18)] backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/70"
                : "rounded-none border border-transparent bg-transparent"
            }`}
          >
            <a href="#top" className="flex items-center gap-2.5">
              <img
                src="/logo/carmel-logo-transparent.png"
                alt={company.name}
                className="h-10 w-10"
              />
              <span className="leading-none">
                <span
                  className={`block font-display text-[1.02rem] font-semibold tracking-tight transition-colors ${
                    scrolled ? "text-ink dark:text-white" : "text-white"
                  }`}
                >
                  {company.name}
                </span>
                <span
                  className={`mt-1 block text-[0.58rem] font-medium uppercase tracking-[0.2em] transition-colors ${
                    scrolled ? "text-steel" : "text-white/70"
                  }`}
                >
                  {company.tagline}
                </span>
              </span>
            </a>

            <div className="hidden items-center gap-7 px-4 md:flex">
              {navLinks.map((link) =>
                link.label === "Services" ? (
                  <div key={link.label} className="group relative">
                    <a
                      href={link.href}
                      className={`flex items-center gap-1 text-sm transition-colors ${linkCx}`}
                    >
                      Services
                      <ChevronDown
                        size={12}
                        strokeWidth={2.5}
                        className="transition-transform duration-200 group-hover:rotate-180"
                      />
                    </a>
                    <div className="invisible absolute left-1/2 top-full z-10 w-60 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <ul className="rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_18px_44px_rgba(16,30,54,0.13)] dark:border-neutral-800 dark:bg-neutral-900">
                        {serviceLinks.map((s) => (
                          <li key={s.label}>
                            <a
                              href={s.href}
                              className="block rounded-lg px-3 py-2.5 text-[0.87rem] text-ink-2 transition-colors hover:bg-neutral-50 hover:text-brand dark:text-neutral-200 dark:hover:bg-white/5"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-sm transition-colors ${linkCx}`}
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="#quote"
                className="hidden cursor-pointer items-center gap-1.5 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-signal-dk sm:inline-flex"
              >
                Request a Quote
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                className={`grid h-10 w-10 cursor-pointer place-items-center rounded-[10px] border transition-colors md:hidden ${
                  scrolled
                    ? "border-neutral-200 text-ink dark:border-neutral-700 dark:text-white"
                    : "border-white/25 bg-white/10 text-white backdrop-blur"
                }`}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </motion.nav>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-2 flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white/95 p-4 backdrop-blur-xl md:hidden dark:border-neutral-800 dark:bg-neutral-950/90"
              >
                {navLinks.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-sm text-ink-2 dark:text-neutral-200"
                  >
                    {l.label}
                  </a>
                ))}
                {serviceLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="py-2 pl-4 text-[0.85rem] text-steel"
                  >
                    {s.label}
                  </a>
                ))}
                <a
                  href="#quote"
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full cursor-pointer rounded-full bg-signal px-4 py-3 text-center text-sm font-semibold text-ink"
                >
                  Request a Quote
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
