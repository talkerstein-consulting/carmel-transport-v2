import { useEffect, useRef, useState } from "react"
import { squirclePath } from "@/lib/squircle"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Phone, ChevronDown, ChevronRight, Truck, Snowflake, TrainFront, Warehouse } from "lucide-react"
import { Cta } from "./Cta"
import "./nav.css"


/* Adapted from @reactbits-pro/navigation-2: a floating translucent pill with a
   hover panel for Services and a collapsing mobile menu. The block's Tailwind
   neutral palette is replaced with brand tokens in nav.css, and its violet
   backdrop is dropped — the footage is the backdrop here. */

const SERVICES = [
  { icon: Truck,      title: "Drayage",       description: "Port to door, same day",            href: "/services/drayage",    img: "/img/covers/drayage.jpg" },
  { icon: Snowflake,  title: "Refrigerated",  description: "Reefer transport and 30-slot yard", href: "/services/refrigerated", img: "/img/covers/refrigerated.jpg" },
  { icon: TrainFront, title: "Intermodal",    description: "Ocean and rail terminals",          href: "/services/intermodal",   img: "/img/covers/intermodal.jpg" },
  { icon: Warehouse,  title: "Storage",       description: "Secured container yard in Kearny",  href: "/services/storage",      img: "/img/covers/storage.jpg" },
]

const LINKS = [
  { label: "Company", href: "/company" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
]

const EASE = [0.4, 0, 0.2, 1] as const

/* Every "Request a quote" on the site goes to /contact, which leads with the
   quote form in its masthead. The hero's scroll cue is the one CTA that stays
   an in-page anchor -- it is a scroll cue, not an offer. */
const QUOTE_HREF = "/contact"

export function Nav() {
  const bar = useRef<HTMLElement>(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  /* Hover intent. Opening on the first pixel of mouseenter and closing on the
     first pixel of mouseleave made the panel flicker whenever the pointer
     crossed the bar on its way somewhere else, and a click on "Services" that
     followed the hover-open toggled it shut again. Now: a short delay before
     opening, a short grace before closing, and a click never closes a panel
     the hover just opened — it only closes one that a click opened. */
  const openTimer = useRef<number | undefined>(undefined)
  const closeTimer = useRef<number | undefined>(undefined)
  const openedByHover = useRef(false)
  const clearTimers = () => {
    window.clearTimeout(openTimer.current)
    window.clearTimeout(closeTimer.current)
  }
  const openSoon = () => {
    clearTimers()
    openTimer.current = window.setTimeout(() => {
      openedByHover.current = true
      setServicesOpen(true)
    }, 60)
  }
  const closeSoon = () => {
    clearTimers()
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), 140)
  }
  const closeNow = () => {
    clearTimers()
    setServicesOpen(false)
  }
  const toggleByClick = () => {
    clearTimers()
    if (servicesOpen && openedByHover.current) {
      openedByHover.current = false   // pin it: the next click closes
      return
    }
    openedByHover.current = false
    setServicesOpen((o) => !o)
  }
  useEffect(() => clearTimers, [])

  /* Escape and scrolling both dismiss; so does a click anywhere outside. */
  useEffect(() => {
    if (!servicesOpen && !mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeNow(); setMobileOpen(false) }
    }
    const onScroll = () => closeNow()
    const onDown = (e: PointerEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) { closeNow(); setMobileOpen(false) }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [servicesOpen, mobileOpen])

  /* The drawer covers most of the phone screen, but the page underneath kept
     scrolling behind it -- and because this page is scroll-driven, that meant
     footage advancing and sections pinning behind an open menu. Lock the
     document while it is open. overflow:hidden, not position:fixed: it leaves
     scrollY untouched, so none of the ScrollTriggers need refreshing when the
     drawer closes. Scrollbar-gutter holds the width so the page does not jump. */
  useEffect(() => {
    if (!mobileOpen) return
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    const prevGutter = root.style.scrollbarGutter
    root.style.overflow = "hidden"
    root.style.scrollbarGutter = "stable"
    return () => {
      root.style.overflow = prevOverflow
      root.style.scrollbarGutter = prevGutter
    }
  }, [mobileOpen])

  /* The progress stroke's outline is the pill's own: its measured size and
     radius with the same superellipse corners (lib/squircle.ts), rebuilt
     whenever a pill changes size. */
  useEffect(() => {
    const el = bar.current
    if (!el) return
    const fit = (pill: HTMLElement) => {
      const path = pill.querySelector<SVGPathElement>(".nav-progress path")
      const svg = path?.ownerSVGElement
      if (!path || !svg) return
      const { width: w, height: h } = pill.getBoundingClientRect()
      if (w < 1 || h < 1) return
      const r = parseFloat(getComputedStyle(pill).borderTopLeftRadius) || 0
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`)
      path.setAttribute("d", squirclePath(w, h, r))
    }
    const pills = [...el.querySelectorAll<HTMLElement>(".nav-pill")]
    const ro = new ResizeObserver((es) => es.forEach((e) => fit(e.target as HTMLElement)))
    pills.forEach((p) => { fit(p); ro.observe(p) })
    return () => ro.disconnect()
  }, [])

  /* Scroll progress for the stroke under the pill (nav.css .nav-pill::after).
     One rAF per scroll burst; set on the header so both pills inherit it. */
  useEffect(() => {
    const el = bar.current
    if (!el) return
    let raf = 0
    const set = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.setProperty("--read", max > 0 ? (window.scrollY / max).toFixed(4) : "0")
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(set) }
    set()
    window.addEventListener("scroll", on, { passive: true })
    window.addEventListener("resize", on)
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf) }
  }, [])

  /* The pill is always the light plate -- white with ink type -- on every
     page, over the drawn scenes and the dark mastheads alike. (It used to
     flip from navy glass to white at .act-three / [data-nav-light].) */

  return (
    <header className={"nav is-light" + (hovered || servicesOpen || mobileOpen ? " is-active" : "")} ref={bar}>
      {/* desktop */}
      <motion.div
        className="nav-desk"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseEnter={() => { clearTimers(); setHovered(true) }}
        onMouseLeave={() => { setHovered(false); closeSoon() }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) closeNow() }}
      >
        <div className="nav-pill">
          {/* Scroll progress, traced around the pill's outline (nav.css). */}
          <svg className="nav-progress" aria-hidden="true"><path pathLength={1} /></svg>
          <div className="nav-bar">
            <a className="nav-brand" href="/" aria-label="Carmel — home">
              {/* The mark sits before the wordmark and is decorative here: the
                  link already has its own label, so alt="" keeps a screen
                  reader from reading the company name twice. */}
              <img className="nav-mark" src="/img/carmel-mark.png" alt="" width="28" height="28" decoding="async" />
              <span className="wm">Carmel</span>
            </a>

            <nav className="nav-links" aria-label="Primary">
              {/* The chevron says the item opens something — without it Services
                  looks like the four links beside it and the panel appearing
                  reads as an accident. It rotates to point up while open. */}
              {/* A link to the overview page: hover opens the panel, a click
                  goes to /services. The chevron is its own button so a
                  keyboard user can still open the panel without leaving. */}
              <span className="nav-more" onMouseEnter={openSoon}>
                <a className="nav-link nav-link-more" href="/services">
                  Services
                </a>
                <button
                  type="button"
                  className="nav-link nav-link-chev"
                  aria-label="Show services"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={toggleByClick}
                >
                  <ChevronDown size={15} strokeWidth={2.25} aria-hidden="true" />
                </button>
              </span>
              {LINKS.map((l) => (
                <a key={l.href} className="nav-link" href={l.href} onMouseEnter={closeSoon}>
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="nav-end">
              <a
                className="nav-phone"
                href="tel:+12012995416"
                aria-label="Call sales: (201) 299-5416"
                title="(201) 299-5416"
                onMouseEnter={closeSoon}
              >
                <Phone size={18} strokeWidth={2} aria-hidden="true" />
              </a>
              <Cta href={QUOTE_HREF} size="sm" tone="accent">Request a quote</Cta>
            </div>
          </div>

          <AnimatePresence>
            {servicesOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="nav-panel"
                onMouseEnter={clearTimers}
              >
                <div className="nav-grid">
                  {SERVICES.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <motion.a
                        key={s.title}
                        href={s.href}
                        className="nav-item"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
                        onClick={closeNow}
                      >
                        <span className="nav-item-media">
                          <img src={s.img} alt="" loading="lazy" decoding="async" />
                        </span>
                        <span className="nav-item-text">
                          <span className="nav-item-title">
                            <Icon className="nav-item-icon" size={16} strokeWidth={2} aria-hidden="true" />
                            {s.title}
                          </span>
                          <span className="nav-item-desc">{s.description}</span>
                        </span>
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* mobile */}
      <motion.div
        className="nav-mobile"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="nav-pill">
          {/* Scroll progress, traced around the pill's outline (nav.css). */}
          <svg className="nav-progress" aria-hidden="true"><path pathLength={1} /></svg>
          <div className="nav-bar">
            <a className="nav-brand" href="/" aria-label="Carmel — home">
              {/* The mark sits before the wordmark and is decorative here: the
                  link already has its own label, so alt="" keeps a screen
                  reader from reading the company name twice. */}
              <img className="nav-mark" src="/img/carmel-mark.png" alt="" width="28" height="28" decoding="async" />
              <span className="wm">Carmel</span>
            </a>
            <button
              type="button"
              className="nav-burger"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="nav-panel"
              >
                <div className="nav-mobile-body">
                  {/* Four tangible rows, not a list of words: three links
                      and a Services button that opens the four services
                      beneath it, plus a link to the overview page. */}
                  <div className="nav-mobile-links">
                    {/* The label goes to the overview page; the chevron is
                        the part that opens the four services beneath. */}
                    <div className="nav-mobile-btn nav-mobile-btn-more" data-open={mobileServicesOpen || undefined}>
                      <a href="/services" onClick={() => setMobileOpen(false)}>Services</a>
                      <button
                        type="button"
                        aria-label="Show services"
                        aria-expanded={mobileServicesOpen}
                        onClick={() => setMobileServicesOpen((o) => !o)}
                      >
                        <ChevronDown size={20} strokeWidth={2.25} aria-hidden="true" />
                      </button>
                    </div>
                    <AnimatePresence initial={false}>
                      {mobileServicesOpen && (
                        <motion.div
                          className="nav-mobile-sub"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE }}
                        >
                          <div className="nav-grid">
                            {SERVICES.map((s) => {
                              const Icon = s.icon
                              return (
                                <a key={s.title} href={s.href} className="nav-item" onClick={() => setMobileOpen(false)}>
                                  <span className="nav-item-ic" aria-hidden="true">
                                    <Icon size={22} strokeWidth={2} />
                                  </span>
                                  <span className="nav-item-text">
                                    <span className="nav-item-title">{s.title}</span>
                                    <span className="nav-item-desc">{s.description}</span>
                                  </span>
                                </a>
                              )
                            })}
                            <a href="/services" className="nav-item nav-item-all" onClick={() => setMobileOpen(false)}>
                              <span className="nav-item-text">
                                <span className="nav-item-title">All services</span>
                              </span>
                              <ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {LINKS.map((l) => (
                      <a key={l.href} className="nav-mobile-btn" href={l.href} onClick={() => setMobileOpen(false)}>
                        {l.label}
                        <ChevronRight size={20} strokeWidth={2.25} aria-hidden="true" />
                      </a>
                    ))}
                  </div>

                  {/* Pinned to the foot of the drawer, which runs to the bottom
                      of the screen: the one action here, where the thumb
                      lands. The number is a square call button beside it —
                      the same pair as the desktop bar — rather than a line of
                      digits in the link list. */}
                  <div className="nav-mobile-actions">
                    <a
                      className="nav-phone"
                      href="tel:+12012995416"
                      aria-label="Call sales: (201) 299-5416"
                      title="(201) 299-5416"
                    >
                      <Phone size={22} strokeWidth={2} aria-hidden="true" />
                    </a>
                    <Cta href={QUOTE_HREF} tone="accent" className="nav-mobile-cta">Request a quote</Cta>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  )
}
