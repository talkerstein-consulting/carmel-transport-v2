import { useRef, useState } from "react"
import type { FormEvent, KeyboardEvent, Ref } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ChevronLeft, Check } from "lucide-react"
import { Cta } from "@/components/site/Cta"
import "./quote-sequence.css"

/* One question at a time. The whole enquiry is a single page that steps
   through six prompts — Enter or the button advances, Back returns — and
   the last screen sends everything as a pre-filled email to quotes@, since
   the site has no backend. The answers never leave the browser otherwise. */

type Key = "name" | "company" | "email" | "phone" | "service" | "details"

export type Step = {
  key: Key
  kind: "text" | "email" | "tel" | "choice" | "long"
  label: string
  hint?: string
  placeholder?: string
  autoComplete?: string
  options?: string[]
  required: boolean
}

/* The full enquiry: six prompts, ends as a quote request. */
export const QUOTE_STEPS: Step[] = [
  { key: "name",    kind: "text",  label: "First, who are we talking to?", placeholder: "Your name", autoComplete: "name", required: true },
  { key: "company", kind: "text",  label: "And the company?", hint: "Optional", placeholder: "Company name", autoComplete: "organization", required: false },
  { key: "email",   kind: "email", label: "Where should the quote go?", placeholder: "you@company.com", autoComplete: "email", required: true },
  { key: "phone",   kind: "tel",   label: "A number, if a call is easier.", hint: "Optional", placeholder: "(201) 555-0100", autoComplete: "tel", required: false },
  { key: "service", kind: "choice", label: "What do you need moved or held?",
    options: ["Drayage", "Refrigerated containers", "Intermodal trucking", "Storage", "Not sure yet"], required: true },
  { key: "details", kind: "long",  label: "Anything we should know?", hint: "Origin, destination, container size, dates — whatever you have.",
    placeholder: "e.g. 3 x 40ft from Port Newark to Allentown, weekly from October", required: false },
]

/* The short one for the masthead: who, where to reply, a number, a message. */
export const CONTACT_STEPS: Step[] = [
  { key: "name",    kind: "text",  label: "Who are we talking to?", placeholder: "Your name", autoComplete: "name", required: true },
  { key: "email",   kind: "email", label: "Where should we reply?", placeholder: "you@company.com", autoComplete: "email", required: true },
  { key: "phone",   kind: "tel",   label: "A number, if a call is easier.", hint: "Optional", placeholder: "(201) 555-0100", autoComplete: "tel", required: false },
  { key: "details", kind: "long",  label: "What can we do for you?", placeholder: "Tell us what you need moved, held, or answered", required: false },
]

type Answers = Record<Key, string>
const EMPTY: Answers = { name: "", company: "", email: "", phone: "", service: "", details: "" }
const LABELS: Record<Key, string> = { name: "Name", company: "Company", email: "Email", phone: "Phone", service: "Service", details: "Details" }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EASE = [0.22, 0.61, 0.36, 1] as const

type Props = {
  steps?: Step[]
  /* email subject; the chosen service is appended when there is one */
  subject?: string
  /* "dark" sits on the inverted band — light type, glass chips */
  tone?: "light" | "dark"
}

export function QuoteSequence({ steps: STEPS = QUOTE_STEPS, subject = "Quote request", tone = "light" }: Props) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [a, setA] = useState<Answers>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const field = useRef<HTMLElement>(null)
  // true from a step change until the next step has finished arriving. The
  // leaving step is still in the DOM (and still focused) while it fades, so
  // without this a fast Enter would submit again against the stale field.
  const busy = useRef(false)

  const done = i === STEPS.length
  const step = STEPS[Math.min(i, STEPS.length - 1)]

  // Focus follows the step. AnimatePresence (mode="wait") mounts the next
  // step only after the previous one has finished leaving, so a timer from
  // the index change fires before the field exists — focus on the entering
  // step's animation start instead, which is the first frame it is in the DOM.
  const focusField = () => { if (!done) field.current?.focus({ preventScroll: true }) }
  const settle = () => { busy.current = false }
  // The lock also times out on its own: motion runs on rAF, and a throttled
  // or backgrounded tab can stretch a 320ms transition to seconds, which
  // would otherwise leave the form ignoring input once the tab comes back.
  const lock = () => { busy.current = true; window.setTimeout(settle, 700) }

  const valid = (): string | null => {
    const v = a[step.key].trim()
    if (step.required && !v) return step.kind === "choice" ? "Pick one to continue." : "We need this one."
    if (step.kind === "email" && !EMAIL.test(v)) return "That email does not look right."
    return null
  }

  const go = (d: 1 | -1) => {
    if (busy.current) return
    if (d === 1) {
      const e = valid()
      if (e) { setError(e); return }
    }
    lock()
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    setError(null); setDir(d); setI((n) => Math.max(0, Math.min(STEPS.length, n + d)))
  }

  const onSubmit = (e: FormEvent) => { e.preventDefault(); go(1) }

  // Enter advances in single-line fields; in the textarea it is Cmd/Ctrl+Enter
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return
    if (step.kind === "long" && !(e.metaKey || e.ctrlKey)) return
    e.preventDefault(); go(1)
  }

  const set = (v: string) => { setError(null); setA((prev) => ({ ...prev, [step.key]: v })) }

  const mailto = () => {
    const lines = [
      `Name: ${a.name}`,
      a.company ? `Company: ${a.company}` : null,
      `Email: ${a.email}`,
      a.phone ? `Phone: ${a.phone}` : null,
      a.service ? `Service: ${a.service}` : null,
      a.details ? "" : null,
      a.details || null,
    ].filter((l): l is string => l !== null)
    const subj = a.service ? `${subject} — ${a.service}` : subject
    return "mailto:quotes@carmel-usa.com?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(lines.join("\n"))
  }

  const slide = {
    initial: (d: number) => ({ opacity: 0, y: d * 28 }),
    animate: { opacity: 1, y: 0 },
    exit: (d: number) => ({ opacity: 0, y: d * -28 }),
  }

  return (
    <div className={"qs" + (tone === "dark" ? " qs-dark" : "")} data-rise>
      <div className="qs-bar" aria-hidden="true">
        <span className="qs-bar-fill" style={{ transform: `scaleX(${Math.min(i, STEPS.length) / STEPS.length})` }} />
      </div>
      <p className="qs-count">{done ? "Ready to send" : `${i + 1} / ${STEPS.length}`}</p>

      <form onSubmit={onSubmit} noValidate className="qs-form">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {!done ? (
            <motion.div key={step.key} custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.32, ease: EASE }} className="qs-step"
              onAnimationStart={focusField} onAnimationComplete={settle}>
              <label className="qs-label" htmlFor={"qs-" + step.key} id={"qs-l-" + step.key}>{step.label}</label>
              {step.hint && <p className="qs-hint">{step.hint}</p>}

              {step.kind === "choice" ? (
                <div className="qs-choices" role="radiogroup" aria-labelledby={"qs-l-" + step.key}>
                  {step.options!.map((o, n) => (
                    <button type="button" key={o} className={"qs-choice" + (a.service === o ? " is-on" : "")}
                      role="radio" aria-checked={a.service === o}
                      ref={n === 0 ? (field as Ref<HTMLButtonElement>) : undefined}
                      onClick={() => set(o)}
                      onDoubleClick={() => { set(o); go(1) }}>
                      <span className="qs-choice-key">{String.fromCharCode(65 + n)}</span>
                      {o}
                      {a.service === o && <Check size={16} strokeWidth={2.5} className="qs-choice-check" />}
                    </button>
                  ))}
                </div>
              ) : step.kind === "long" ? (
                <textarea id={"qs-" + step.key} ref={field as Ref<HTMLTextAreaElement>} className="qs-input qs-textarea"
                  rows={3} value={a[step.key]} placeholder={step.placeholder}
                  onChange={(e) => set(e.target.value)} onKeyDown={onKey} />
              ) : (
                <input id={"qs-" + step.key} ref={field as Ref<HTMLInputElement>} className="qs-input"
                  type={step.kind} inputMode={step.kind === "tel" ? "tel" : step.kind === "email" ? "email" : "text"}
                  autoComplete={step.autoComplete} value={a[step.key]} placeholder={step.placeholder}
                  onChange={(e) => set(e.target.value)} onKeyDown={onKey} />
              )}

              <div className="qs-actions">
                {i > 0 && (
                  <button type="button" className="qs-back" onClick={() => go(-1)} aria-label="Back">
                    <ChevronLeft size={20} strokeWidth={2.4} />
                  </button>
                )}
                <Cta type="submit" size="sm" variant={tone === "dark" ? "outline" : "solid"}>
                  {i === STEPS.length - 1 ? "Review" : "Continue"}
                </Cta>
                <span className="qs-enter" aria-hidden="true">
                  {step.kind === "long" ? "Ctrl + Enter" : "press Enter"}
                </span>
                {error && <span className="qs-error" role="alert">{error}</span>}
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" custom={dir} variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.32, ease: EASE }} className="qs-step" onAnimationComplete={settle}>
              <p className="qs-label">Here is what we will send.</p>
              <dl className="qs-review">
                {STEPS.map((s) => a[s.key].trim() ? (
                  <div key={s.key} className="qs-review-row">
                    <dt>{LABELS[s.key]}</dt>
                    <dd>{a[s.key]}</dd>
                    <button type="button" className="qs-review-edit" onClick={() => { if (busy.current) return; lock(); setDir(-1); setI(STEPS.indexOf(s)) }}>Edit</button>
                  </div>
                ) : null)}
              </dl>
              <div className="qs-actions">
                <button type="button" className="qs-back" onClick={() => go(-1)} aria-label="Back">
                  <ChevronLeft size={20} strokeWidth={2.4} />
                </button>
                <Cta href={mailto()} size="sm" variant={tone === "dark" ? "outline" : "solid"}>{STEPS === QUOTE_STEPS ? "Send the request" : "Send the message"}</Cta>
                <span className="qs-enter">Opens in your email app, addressed to quotes@carmel-usa.com.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
