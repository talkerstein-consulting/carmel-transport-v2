"use client";

import { motion, type Variants } from "motion/react";
import { Clock, Container, ShieldCheck, Warehouse } from "lucide-react";
import { whyCarmel } from "@/content";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const cardCx =
  "flex flex-col rounded-2xl border border-neutral-200 bg-white p-7 transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(16,30,54,0.13)] dark:border-neutral-800 dark:bg-neutral-950";

const iconCx =
  "mb-5 grid h-10 w-10 place-items-center rounded-xl bg-brand-wash text-brand";

/** Photo cell with the heading laid over the image. */
function PhotoCell({
  image,
  title,
  body,
  className = "",
}: {
  image: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <motion.article
      variants={cell}
      className={`group relative flex min-h-[270px] flex-col justify-end overflow-hidden rounded-2xl p-7 ${className}`}
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,38,0.06)_30%,rgba(8,20,38,0.88)_100%)]"
      />
      <div className="relative">
        <h3 className="font-display text-lg font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-white/78">{body}</p>
      </div>
    </motion.article>
  );
}

export default function WhyCarmelBento() {
  return (
    <section className="section-y w-full px-4 sm:px-6 lg:px-8 ">
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 grid items-center gap-6 sm:mb-14 lg:grid-cols-[1fr_auto_1fr]"
        >
          <p className="inline-flex items-center gap-2.5 text-[0.87rem] text-steel">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {whyCarmel.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-center lg:text-5xl dark:text-white">
            {whyCarmel.title}
          </h2>
          <p className="max-w-[30ch] text-[0.9rem] text-steel lg:justify-self-end lg:text-right">
            {whyCarmel.note}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* wide: the long verbatim partner statement */}
          <motion.article
            variants={cell}
            className={`${cardCx} md:col-span-2`}
          >
            <span className={iconCx}>
              <ShieldCheck size={19} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight text-ink dark:text-white">
              {whyCarmel.partner.title}
            </h3>
            <p className="mt-2.5 text-[0.94rem] leading-relaxed text-steel">
              {whyCarmel.partner.body}
            </p>
          </motion.article>

          {/* dark: dispatch */}
          <motion.article
            variants={cell}
            className="flex flex-col rounded-2xl border border-ink bg-ink p-7 text-white transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(16,30,54,0.3)]"
          >
            <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-signal">
              <Clock size={19} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              {whyCarmel.dispatch.title}
            </h3>
            <p className="mt-2.5 text-[0.94rem] leading-relaxed text-white/70">
              {whyCarmel.dispatch.body}
            </p>
          </motion.article>

          {/* photo: specialized services */}
          <PhotoCell
            image={whyCarmel.specialized.image}
            title={whyCarmel.specialized.title}
            body={whyCarmel.specialized.body}
          />

          {/* storage */}
          <motion.article variants={cell} className={cardCx}>
            <span className={iconCx}>
              <Warehouse size={19} strokeWidth={1.8} />
            </span>
            <h3 className="font-display text-lg font-bold tracking-tight text-ink dark:text-white">
              {whyCarmel.storage.title}
            </h3>
            <p className="mt-2.5 text-[0.94rem] leading-relaxed text-steel">
              {whyCarmel.storage.body}
            </p>
          </motion.article>

          {/* photo: container types */}
          <PhotoCell
            image={whyCarmel.containers.image}
            title={whyCarmel.containers.title}
            body={whyCarmel.containers.body}
          />
        </motion.div>

        <motion.p
          variants={cell}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 flex items-center gap-2.5 text-[0.87rem] text-steel"
        >
          <Container size={16} strokeWidth={1.8} className="text-signal-dk" />
          20&rsquo;, 40&rsquo;, 45&rsquo; &middot; dry, overweight, refrigerated,
          open top, flat rack
        </motion.p>
      </div>
    </section>
  );
}
