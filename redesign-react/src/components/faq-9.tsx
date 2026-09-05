"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { faqs, company } from "@/content";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/** Deal the questions down the columns so each column stacks evenly. */
function toColumns<T>(list: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  list.forEach((entry, i) => cols[i % count].push(entry));
  return cols;
}

export default function FAQ9() {
  const [open, setOpen] = useState<number>(-1);
  const columns = toColumns(
    faqs.map((f, i) => ({ ...f, i })),
    2,
  );

  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="col-grid items-start"
        >
          {/* column 1 — the text */}
          <div className="lg:sticky lg:top-28">
            <p className="inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              FAQ
            </p>
            <h2 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl dark:text-white">
              Frequently Asked <span className="text-steel">Questions</span>
            </h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-steel">
              Here&rsquo;s what you need to know about working with us. Need to ask
              something else? Our team is reachable any hour.
            </p>
            <a
              href={`mailto:${company.email}`}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
            >
              Ask a Question
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* columns 2-3 — the questions */}
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-4">
              {column.map((faq) => {
                const isOpen = open === faq.i;
                return (
                  <motion.div
                    key={faq.q}
                    variants={item}
                    className={`rounded-2xl border bg-white transition-colors duration-200 dark:bg-neutral-900 ${
                      isOpen
                        ? "border-neutral-300 dark:border-neutral-700"
                        : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-800"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.i}`}
                      onClick={() => setOpen(isOpen ? -1 : faq.i)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="flex-1 text-[0.98rem] font-medium leading-snug text-ink dark:text-white">
                        {faq.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-0.5 shrink-0 text-steel transition-colors duration-200 group-hover:text-ink dark:group-hover:text-white"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq.i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                            opacity: { duration: 0.25 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-[0.92rem] leading-relaxed text-steel">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
