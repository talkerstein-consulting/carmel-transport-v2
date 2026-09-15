import { useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { Cta } from "@/components/site/Cta"
import "./apply-modal.css"

/* The application form, in a dialog. A role card's Apply opens it with that
   role already chosen; the page-level Apply opens it with the role left for
   the applicant to pick. Like the quote form, it ends as a pre-filled email
   to the careers inbox — the site has no backend yet, and this keeps every
   field the applicant typed in the message rather than losing it to a
   mailto: link with nothing in it. */

export const APPLY_TO = "quotes@carmel-usa.com"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EASE = [0.22, 0.61, 0.36, 1] as const

type Fields = { name: string; email: string; phone: string; role: string; experience: string; message: string }
const EMPTY: Fields = { name: "", email: "", phone: "", role: "", experience: "", message: "" }

type Props = {
  open: boolean
  onClose: () => void
  /* every role on the page, for the picker */
  roles: string[]
  /* the role whose card was clicked, if any */
  role?: string
}

export function ApplyModal({ open, onClose, roles, role }: Props) {
  const [f, setF] = useState<Fields>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const first = useRef<HTMLInputElement>(null)
  const dialog = useRef<HTMLDivElement>(null)

  /* Each opening starts clean, with the card's role filled in. Reset during
     render (React's "adjust state on prop change" pattern) rather than in an
     effect, so the first paint of a fresh dialog never shows stale answers. */
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) { setF({ ...EMPTY, role: role ?? "" }); setErrors({}) }
  }

  /* Escape closes; the page behind stays put while it is up. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      root.style.overflow = prev
    }
  }, [open, onClose])

  const set = (k: keyof Fields) => (v: string) => {
    setF((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: undefined }))
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!f.name.trim()) e.name = "We need your name."
    if (!EMAIL.test(f.email.trim())) e.email = "That email does not look right."
    if (!f.role) e.role = "Pick the role you are applying for."
    return e
  }

  const mailto = () => {
    const lines = [
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.phone ? `Phone: ${f.phone}` : null,
      `Role: ${f.role}`,
      f.experience ? `Experience: ${f.experience}` : null,
      f.message ? "" : null,
      f.message || null,
    ].filter((l): l is string => l !== null)
    return `mailto:${APPLY_TO}?subject=${encodeURIComponent("Application — " + f.role)}&body=${encodeURIComponent(lines.join("\n"))}`
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      const k = Object.keys(errs)[0]
      dialog.current?.querySelector<HTMLElement>(`[name="${k}"]`)?.focus()
      return
    }
    window.location.href = mailto()
    onClose()
  }

  /* A plain function, not a component: a component declared inside render
     would remount on every keystroke and drop focus. */
  const field = ({ k, label, hint, type = "text", autoComplete, placeholder, inputMode }: {
    k: keyof Fields; label: string; hint?: string; type?: string; autoComplete?: string; placeholder?: string
    inputMode?: "tel" | "email" | "text"
  }) => (
    <div className={"am-field" + (errors[k] ? " has-error" : "")}>
      <label className="am-label" htmlFor={"am-" + k}>{label}{hint && <span className="am-hint">{hint}</span>}</label>
      <input
        id={"am-" + k} name={k} ref={k === "name" ? first : undefined}
        className="am-input" type={type} inputMode={inputMode} autoComplete={autoComplete}
        placeholder={placeholder} value={f[k]} onChange={(e) => set(k)(e.target.value)}
        aria-invalid={!!errors[k]} aria-describedby={errors[k] ? "am-e-" + k : undefined}
      />
      {errors[k] && <span className="am-error" id={"am-e-" + k} role="alert">{errors[k]}</span>}
    </div>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="am-scrim"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            ref={dialog}
            className="am-dialog"
            role="dialog" aria-modal="true" aria-labelledby="am-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: EASE }}
            onAnimationComplete={() => first.current?.focus({ preventScroll: true })}
          >
            <button type="button" className="am-close" onClick={onClose} aria-label="Close">
              <X size={20} strokeWidth={2.25} />
            </button>

            <p className="eyebrow am-eyebrow">Application</p>
            <h2 className="am-title" id="am-title">{role ? role : "Apply to Carmel"}</h2>
            <p className="am-lead">
              A few details and we'll be in touch. Kearny, NJ — home daily on every local role.
            </p>

            <form className="am-form" onSubmit={onSubmit} noValidate>
              <div className="am-row">
                {field({ k: "name", label: "Full name", autoComplete: "name", placeholder: "Your name" })}
                {field({ k: "phone", label: "Phone", hint: "Optional", type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "(201) 555-0100" })}
              </div>
              {field({ k: "email", label: "Email", type: "email", inputMode: "email", autoComplete: "email", placeholder: "you@example.com" })}

              <div className={"am-field" + (errors.role ? " has-error" : "")}>
                <label className="am-label" htmlFor="am-role">Role</label>
                <select
                  id="am-role" name="role" className="am-input am-select"
                  value={f.role} onChange={(e) => set("role")(e.target.value)}
                  aria-invalid={!!errors.role} aria-describedby={errors.role ? "am-e-role" : undefined}
                >
                  <option value="" disabled>Choose a position</option>
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  <option value="General application">Something else — general application</option>
                </select>
                {errors.role && <span className="am-error" id="am-e-role" role="alert">{errors.role}</span>}
              </div>

              {field({ k: "experience", label: "Experience", hint: "Optional", placeholder: "e.g. 4 years drayage, Class A CDL, TWIC" })}

              <div className="am-field">
                <label className="am-label" htmlFor="am-message">Anything else<span className="am-hint">Optional</span></label>
                <textarea
                  id="am-message" name="message" className="am-input am-textarea" rows={3}
                  placeholder="Availability, endorsements, a link to your résumé — whatever helps."
                  value={f.message} onChange={(e) => set("message")(e.target.value)}
                />
              </div>

              <div className="am-actions">
                <Cta type="submit">Send application</Cta>
                <span className="am-note">Opens in your email app, addressed to {APPLY_TO}.</span>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
