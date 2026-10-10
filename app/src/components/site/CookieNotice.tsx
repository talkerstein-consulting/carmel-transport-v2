import { useEffect, useState } from "react"
import { Cookie } from "lucide-react"
import { Cta } from "./Cta"
import "./cookie.css"

/* Cookie notice. Same skin as every other card on the site (.diff-card):
   white plate, paper hairline, ink type, a pale-blue icon tile, and the navy
   brand CTA for the primary action.

   The choice is kept in localStorage and announced as a "carmel:consent"
   event ({ detail: "all" | "essential" }), so an analytics loader added later
   can wait for "all" before it runs. Nothing optional is loaded today. Storage
   can throw (private windows, blocked site data); then the notice simply
   shows again next visit. */

const KEY = "carmel-consent"
type Choice = "all" | "essential"

const read = (): Choice | null => {
  try { const v = localStorage.getItem(KEY); return v === "all" || v === "essential" ? v : null } catch { return null }
}

export function CookieNotice() {
  const [open, setOpen] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (read()) return
    // After the homepage preloader has handed off to the nav, not over it.
    const t = window.setTimeout(() => setOpen(true), document.querySelector(".pre") ? 3200 : 900)
    return () => window.clearTimeout(t)
  }, [])

  const choose = (c: Choice) => {
    try { localStorage.setItem(KEY, c) } catch { /* shown again next visit */ }
    window.dispatchEvent(new CustomEvent("carmel:consent", { detail: c }))
    setLeaving(true)
    window.setTimeout(() => setOpen(false), 260)
  }

  if (!open) return null
  return (
    <aside className={"cookie" + (leaving ? " is-leaving" : "")} role="dialog" aria-live="polite" aria-labelledby="cookie-title">
      <div className="cookie-top">
        <span className="cookie-ic" aria-hidden="true"><Cookie size={20} strokeWidth={1.8} /></span>
        <p className="cookie-eyebrow" id="cookie-title">Cookies</p>
      </div>
      <p className="cookie-body">
        We keep cookies to a minimum. Essential ones keep this site working. With your OK,
        we would also use analytics cookies to see which pages help, so we can improve them.
      </p>
      <div className="cookie-actions">
        <Cta type="button" size="sm" onClick={() => choose("all")}>Accept all</Cta>
        {/* Same size and weight as Accept: refusing must be as easy as agreeing. */}
        <Cta type="button" size="sm" variant="outline" className="cookie-alt-cta" onClick={() => choose("essential")}>Essential only</Cta>
      </div>
    </aside>
  )
}
