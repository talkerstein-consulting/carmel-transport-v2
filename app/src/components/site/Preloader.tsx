import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import "./preloader.css"

/* Homepage preloader. A navy screen with the Carmel mark ringed by a round
   progress bar while the hero footage comes in; once the frames are ready the navy plate does not
   fade out, it shrinks into the nav bar -- the pill's plate IS this plate,
   landed -- while the footage is already on screen beneath it.

   Timing: the hero scrub reports its progress on the window; the screen
   holds for at least MIN_MS so the mark reads as more than a flash, and
   leaves at MAX_MS regardless so a slow frame can never hold the page. */
const HERO_SRC = "/seq/hero/f-{i}.webp?v=6"

const MIN_MS = 900
const MAX_MS = 7000

/* Once per session: a return visit (or the next page view) does not wait on
   the navy screen again. Decided once, when this module first loads -- not in
   an effect, which React's dev mode runs twice (the first run would mark the
   session and the second would then skip the preloader on the very first
   visit). */
const SEEN = (() => {
  try {
    const seen = sessionStorage.getItem("carmel-seen") === "1"
    sessionStorage.setItem("carmel-seen", "1")
    return seen
  } catch { return false } // storage blocked: show it, as on a first visit
})()

export function Preloader() {
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const plate = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (SEEN) { setGone(true); return }
    const el = root.current
    const pl = plate.current
    const bd = body.current
    if (!el || !pl || !bd) return

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = "hidden"

    const t0 = performance.now()
    let ready = false
    let leaving = false

    const leave = () => {
      if (leaving) return
      leaving = true
      html.style.overflow = prevOverflow

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      /* whichever nav is showing at this width */
      const pill = [...document.querySelectorAll<HTMLElement>(".nav-pill")].find(
        (p) => p.getBoundingClientRect().width > 0,
      )
      const done = () => setGone(true)

      if (reduced || !pill) {
        gsap.to(el, { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: done })
        return
      }

      const r = pill.getBoundingClientRect()
      const radius = getComputedStyle(pill).borderRadius
      const tl = gsap.timeline({ onComplete: done })
      tl.to(bd, { opacity: 0, scale: 0.92, duration: 0.45, ease: "power2.in" }, 0)
        /* the plate travels to the pill's exact box, taking its radius */
        .to(pl, {
          top: r.top, left: r.left, width: r.width, height: r.height,
          borderRadius: radius,
          duration: 0.9, ease: "power4.inOut",
        }, 0.15)
        /* then hands off to the pill's own (translucent) plate beneath it */
        .to(pl, { opacity: 0, duration: 0.35, ease: "power2.out" }, ">-0.05")
    }

    const tryLeave = () => {
      if (!ready) return
      const wait = Math.max(0, MIN_MS - (performance.now() - t0))
      window.setTimeout(leave, wait)
    }

    const onProgress = (e: Event) => {
      const d = (e as CustomEvent<{ src: string; ready: number }>).detail
      if (d.src !== HERO_SRC) return
      setProgress(d.ready)
      if (d.ready >= 1 && !ready) { ready = true; tryLeave() }
    }
    window.addEventListener("framescrub:progress", onProgress)
    const cap = window.setTimeout(() => { ready = true; leave() }, MAX_MS)

    return () => {
      window.removeEventListener("framescrub:progress", onProgress)
      window.clearTimeout(cap)
      html.style.overflow = prevOverflow
    }
  }, [])

  if (gone) return null

  /* Portalled to body: #root is scaled for its entrance, and position:fixed
     inside a transformed ancestor is fixed to that ancestor, not the screen. */
  return createPortal(
    <div className="pre" ref={root} role="status" aria-label="Loading">
      <div className="pre-plate" ref={plate} />
      <div className="pre-body" ref={body}>
        <div className="pre-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <circle className="pre-track" cx="60" cy="60" r="56" pathLength={1} />
            <circle className="pre-fill" cx="60" cy="60" r="56" pathLength={1}
              style={{ strokeDashoffset: (1 - progress).toFixed(3) }} />
          </svg>
          <img src="/img/carmel-mark-512.webp" alt="" width="112" height="112" decoding="async" />
        </div>
      </div>
    </div>,
    document.body,
  )
}
