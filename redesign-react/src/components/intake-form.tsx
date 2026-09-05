"use client";

import { useId, useState } from "react";
import { ArrowUpRight, ArrowUpDown, CalendarDays, Container, MapPin, Truck } from "lucide-react";
import { serviceOptions, containerTypes } from "@/content";

type Tab = "quote" | "contact";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-transparent bg-neutral-50 px-3.5 py-2.5 transition-colors focus-within:border-brand focus-within:bg-white focus-within:ring-3 focus-within:ring-brand-wash dark:bg-white/5 dark:focus-within:bg-white/10">
      {icon ? <span className="shrink-0 text-steel">{icon}</span> : null}
      <span className="min-w-0 flex-1">
        <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.09em] text-steel">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}

const inputCx =
  "w-full border-0 bg-transparent p-0 text-[0.93rem] font-medium text-ink outline-none placeholder:font-normal placeholder:text-neutral-400 dark:text-white";

export function IntakeForm({ wide = false }: { wide?: boolean }) {
  const [tab, setTab] = useState<Tab>("quote");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const uid = useId();

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className={`w-full rounded-2xl bg-white shadow-[0_30px_70px_rgba(16,30,54,0.19),0_8px_20px_rgba(16,30,54,0.08)] dark:bg-neutral-900 ${wide ? "p-3 sm:p-4" : "p-2"}`}>
      {/* tabs */}
      <div
        role="tablist"
        aria-label="Get in touch"
        className={`mb-2.5 grid grid-cols-2 gap-1 rounded-lg bg-neutral-50 p-1 dark:bg-white/5 ${wide ? "sm:max-w-md" : ""}`}
      >
        {(
          [
            ["quote", "Request a Quote"],
            ["contact", "Contact Us"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`${uid}-tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`${uid}-panel-${key}`}
            onClick={() => setTab(key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                setTab((t) => (t === "quote" ? "contact" : "quote"));
              }
            }}
            className={`cursor-pointer rounded-md px-2 py-2.5 text-[0.84rem] font-semibold transition-colors ${
              tab === key
                ? "bg-signal text-ink shadow-sm"
                : "text-steel hover:text-ink dark:hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-1.5 pb-1.5">
        {tab === "quote" ? (
          <form
            id={`${uid}-panel-quote`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-quote`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={`relative grid gap-1.5 ${wide ? "lg:grid-cols-2" : ""}`}>
              <Field label="Pick up" icon={<MapPin size={17} strokeWidth={1.8} />}>
                <input
                  className={inputCx}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Port, terminal or city"
                />
              </Field>

              <button
                type="button"
                onClick={swap}
                aria-label="Swap pick up and delivery"
                className={`absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-[3px] border-white bg-signal text-ink shadow-sm transition-transform duration-300 hover:rotate-180 dark:border-neutral-900 ${wide ? "lg:hidden" : ""}`}
              >
                <ArrowUpDown size={15} strokeWidth={2.2} />
              </button>

              <Field label="Deliver to" icon={<Truck size={17} strokeWidth={1.8} />}>
                <input
                  className={inputCx}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Destination or ZIP"
                />
              </Field>
            </div>

            <div className={`mt-1.5 grid gap-1.5 sm:grid-cols-2 ${wide ? "lg:grid-cols-2" : ""}`}>
              <Field label="Service" icon={<Container size={17} strokeWidth={1.8} />}>
                <select className={`${inputCx} cursor-pointer appearance-none`}>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Date" icon={<CalendarDays size={17} strokeWidth={1.8} />}>
                <input type="date" className={`${inputCx} cursor-pointer`} />
              </Field>
            </div>

            <button
              type="submit"
              className={`mt-2.5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-signal-dk ${wide ? "lg:w-auto lg:px-10" : ""}`}
            >
              Request a Quote
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
            <p className="mt-2.5 text-center text-[0.76rem] text-steel">
              Precise quotes, no &lsquo;surprises&rsquo; on the invoice.
            </p>
          </form>
        ) : (
          <form
            id={`${uid}-panel-contact`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-contact`}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-1.5 sm:grid-cols-2">
              <Field label="Name">
                <input className={inputCx} autoComplete="name" placeholder="Your name" />
              </Field>
              <Field label="Phone">
                <input className={inputCx} type="tel" autoComplete="tel" placeholder="(000) 000-0000" />
              </Field>
            </div>
            <div className="mt-1.5">
              <Field label="Email">
                <input className={inputCx} type="email" autoComplete="email" placeholder="you@company.com" />
              </Field>
            </div>
            <div className="mt-1.5">
              <Field label="Container">
                <select className={`${inputCx} cursor-pointer appearance-none`}>
                  {containerTypes.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-1.5">
              <Field label="Message">
                <textarea
                  rows={3}
                  className={`${inputCx} resize-y font-normal`}
                  placeholder="How can we help?"
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-2.5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
            >
              Send Message
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </button>
            <p className="mt-2.5 text-center text-[0.76rem] text-steel">
              Or call dispatch on (646) 808-7266, any hour.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default IntakeForm;
