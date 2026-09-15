import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Phone, ChevronDown, Truck, Snowflake, TrainFront, Warehouse } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Cta } from "./Cta"
import "./nav.css"

gsap.registerPlugin(ScrollTrigger)

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

export function Nav() {
  const bar = useRef<HTMLElement>(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  /* Over footage the pill is a dark translucent plate with white type; once
     the light sections arrive it flips to a white plate with ink type. The
     homepage marks that handoff with .act-three; interior pages mark it with
     [data-nav-light] on whatever follows their dark masthead. */
  useEffect(() => {
    const el = bar.current
    const light = document.querySelector<HTMLElement>(".act-three, [data-nav-light]")
    if (!el || !light) return
    const st = ScrollTrigger.create({
      trigger: light,
      start: "top top+=96",
      end: "bottom top",
      onToggle: (self) => el.classList.toggle("is-light", self.isActive),
      invalidateOnRefresh: true,
    })
    return () => st.kill()
  }, [])

  return (
    <header className={"nav" + (hovered || servicesOpen || mobileOpen ? " is-active" : "")} ref={bar}>
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
              <button
                type="button"
                className="nav-link nav-link-more"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onMouseEnter={openSoon}
                onClick={toggleByClick}
              >
                Services
                <ChevronDown size={15} strokeWidth={2.25} aria-hidden="true" />
              </button>
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
              <Cta href="#quote" size="sm">Request a quote</Cta>
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
                  <div className="nav-mobile-links">
                    {LINKS.map((l) => (
                      <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
                    ))}
                    <a href="tel:+12012995416">(201) 299-5416</a>
                  </div>
                  <p className="nav-mobile-head">Services</p>
                  <div className="nav-grid">
                    {SERVICES.map((s) => {
                      const Icon = s.icon
                      return (
                        <a key={s.title} href={s.href} className="nav-item" onClick={() => setMobileOpen(false)}>
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
                        </a>
                      )
                    })}
                  </div>

                  {/* Last, not wedged between the links and Services. It is the
                      one action in the drawer, and sitting mid-list it read as
                      another row. At the bottom, off on its own, it is the
                      thing your thumb lands on after reading the menu. */}
                  <Cta href="#quote" className="nav-mobile-cta">Request a quote</Cta>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </header>
  )
}
