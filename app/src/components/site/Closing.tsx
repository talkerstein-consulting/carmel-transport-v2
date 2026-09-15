import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MapPin, Phone, PhoneCall, Receipt, Mail, Clock, ShieldCheck, Gauge, MessagesSquare, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Cta } from "./Cta"
import { QuoteSequence } from "./QuoteSequence"
import Globe from "@/components/globe"

gsap.registerPlugin(ScrollTrigger)

/* The three reasons, moved off the /services and /careers feature band and
   down here where the ask is. As picture cards they were a section of their
   own competing with the CTA; as a compact icon + text row they are the
   reassurance you read immediately before clicking, which is the job they
   were always doing. Body copy is trimmed to one line each — at this size the
   full paragraphs would outweigh the CTA they are supporting. */
const REASONS = [
  {
    icon: ShieldCheck,
    head: "Reliable & Protected",
    body: "A track record of effective solutions, whatever the complexity.",
  },
  {
    icon: Gauge,
    head: "Fast Delivery",
    body: "Minutes from the New York and New Jersey ports, with drivers who know them.",
  },
  {
    icon: MessagesSquare,
    head: "Outstanding Client Support",
    body: "Problem-solving aimed squarely at how your business actually runs.",
  },
]

/* The contact block is a grid of labelled facts, one icon each, rather than a
   definition list — every row carries the same weight, so they read as a set
   you scan instead of a list you work down. */
const CONTACT = [
  { icon: MapPin,    label: "Corporate HQ",      value: "78 John Miller Way, Unit #408, Kearny, NJ 07032" },
  { icon: PhoneCall, label: "Emergency · 24/7",  value: "(646) 808-7266", href: "tel:+16468087266" },
  { icon: Phone,     label: "Sales",             value: "(201) 299-5416", href: "tel:+12012995416" },
  { icon: Receipt,   label: "Billing & other",   value: "(201) 299-5417", href: "tel:+12012995417" },
  { icon: Mail,      label: "Email",             value: "quotes@carmel-usa.com", href: "mailto:quotes@carmel-usa.com" },
  { icon: Clock,     label: "Hours",             value: "Open 24 / 7 / 365" },
]

/* On a phone the six facts are six stacked rows — most of a screen of
   footer before the nav even starts, and the reveal that holds the footer at
   the base only works while it fits the viewport. Grouped into three tabs
   they fit, and the grouping is how someone actually arrives: they want to
   call, to write, or to find the yard. Desktop still shows all six at once —
   there the grid is scannable and a tab would be hiding facts for no reason. */
const GROUPS = [
  { name: "Call",  icon: Phone,  labels: ["Emergency · 24/7", "Sales", "Billing & other"] },
  { name: "Email", icon: Mail,   labels: ["Email"] },
  { name: "Visit", icon: MapPin, labels: ["Corporate HQ", "Hours"] },
]

function renderDetail(c: (typeof CONTACT)[number]) {
  const Icon = c.icon
  return (
    <li className="foot-detail" key={c.label}>
      <span className="foot-detail-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <span className="foot-detail-label">{c.label}</span>
      <span className="foot-detail-value">
        {c.href ? <a href={c.href}>{c.value}</a> : c.value}
      </span>
    </li>
  )
}

/* Sections 07–08 — Final CTA and contact footer.
   Same language as the rest of the page: paper ground, split-tone display
   heading, unboxed caps links that tumble per word. */
export function Closing() {
  const root = useRef<HTMLDivElement>(null)
  const foot = useRef<HTMLElement>(null)
  const [reveal, setReveal] = useState(false)

  /* The accordion is a real structural change, not a CSS one, so the component
     has to know the breakpoint: rendering collapsed rows on desktop would hide
     four of the six facts from assistive tech for no reason. */
  const [phone, setPhone] = useState(false)
  const [open, setOpen] = useState(0)
  /* The CTA opens the quote sequence in place rather than handing off to
     /contact. The ask and the answer share one container. */
  const [asking, setAsking] = useState(false)
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)")
    const sync = () => setPhone(q.matches)
    sync()
    q.addEventListener("change", sync)
    return () => q.removeEventListener("change", sync)
  }, [])

  /* The footer is laid on the base and the CTA is pulled down over it by
     exactly the footer's height, so scrolling the CTA away uncovers something
     that was already in place rather than sliding a new panel in.

     It needs the real measured height — a guessed value leaves either a seam
     or a dead gap — and it only works while the footer is shorter than the
     screen: a footer taller than the viewport, stuck to its bottom, would show
     its last rows and never its first. The phone footer is compacted in CSS to
     fit, so the reveal runs there too; the width check is gone and only the
     fit check remains. */
  useEffect(() => {
    const el = foot.current
    const wrap = root.current
    if (!el || !wrap) return

    const measure = () => {
      const h = el.offsetHeight
      wrap.style.setProperty("--foot-h", h + "px")
      setReveal(h <= window.innerHeight * 0.92)
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)
    return () => { ro.disconnect(); window.removeEventListener("resize", measure) }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()
    /* Desktop only. These entrances set opacity:0 up front and rely on a
       ScrollTrigger to bring it back. This page grows by thousands of pixels
       after mount as the frame sequences load, so triggers created at mount
       resolve against a much shorter document -- on a phone they frequently
       never fired at all and the section simply stayed invisible. Nothing on
       a phone needs a dealt entrance; the content is there and it scrolls. */
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-rise]", el)
      const tweens = items.map((item) =>
        gsap.fromTo(
          item,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        )
      )
      return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={root} className={"closing" + (reveal ? " is-revealing" : "")}>
      {/* final CTA */}
      <section className="cta" id="quote">
        <div className="cta-bg" aria-hidden="true">
          <img src="/img/hero.jpg" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="cta-inner">
          {/* The pitch and the form are the same container: the button does not
              navigate, it swaps what the plate is showing. AnimatePresence with
              mode="wait" keeps the two from overlapping mid-swap. */}
          <AnimatePresence mode="wait" initial={false}>
            {!asking ? (
              <motion.div
                key="pitch"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow cta-eyebrow" data-rise>Let's keep moving.</p>
                <h2 className="cta-head" data-rise>Ready to move freight forward?</h2>
                <p className="cta-lead" data-rise>
                  Tell us where your cargo needs to go. We'll help you get it there.
                </p>
                <p className="cta-actions" data-rise>
                  <Cta href="/contact" onClick={(e) => { e.preventDefault(); setAsking(true) }}>Request a quote</Cta>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="cta-form"
              >
                <div className="cta-form-top">
                  <p className="eyebrow cta-eyebrow">Request a quote</p>
                  <button type="button" className="cta-form-back" onClick={() => setAsking(false)}>
                    Back
                  </button>
                </div>
                <QuoteSequence />
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="cta-reasons" data-rise>
            {REASONS.map((r) => {
              const Icon = r.icon
              return (
                <li className="cta-reason" key={r.head}>
                  <span className="cta-reason-ic" aria-hidden="true">
                    <Icon size={18} strokeWidth={2} />
                  </span>
                  <p className="cta-reason-head">{r.head}</p>
                  <p className="cta-reason-body">{r.body}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* contact footer */}
      <footer className="foot" id="contact" ref={foot}>
        {/* Bleeds off the right edge on purpose: a globe fully inside the
            column reads as a picture of a globe, and half out of frame it
            reads as the world the network sits on. On a phone it sits on
            the bottom edge instead, enlarged and bled off the bottom (see
            .foot-globe in sections.css). Decorative and inert —
            aria-hidden, no pointer events. */}
        <div className="foot-globe" aria-hidden="true">
          <Globe
            width="auto"
            height="auto"
            /* arcs (and labels) take the brand orange; the sphere, land dots
               and atmosphere stay in the footer's blues */
            primaryColor="#FE9B23"
            neutralColor="#3E92F5"
            globeColor="#081D35"
            atmosphereColor="#6AB0FF"
            showAtmosphere
            autoRotateSpeed={0.35}
            enableZoom={false}
            interactive={false}
            arcCount={5}
          />
        </div>

        <div className="foot-top">
          <div>
            <h2 className="foot-head" data-rise>We're here to help</h2>
            <p className="foot-lead" data-rise>
              Have questions about transportation, sales, billing, or logistics
              services? Our knowledgeable team is ready to help.
            </p>
            <p className="foot-actions" data-rise>
              <Cta href="/contact">Get in touch</Cta>
            </p>
          </div>

          {phone ? (
            <div className="foot-faq" data-rise>
              {GROUPS.map((g, i) => {
                const Icon = g.icon
                const isOpen = i === open
                return (
                  <div className="foot-faq-row" key={g.name}>
                    <h3 className="foot-faq-q">
                      <button
                        type="button"
                        className="foot-faq-btn"
                        id={"foot-q-" + i}
                        aria-expanded={isOpen}
                        aria-controls={"foot-a-" + i}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                      >
                        <span className="foot-faq-ic" aria-hidden="true">
                          <Icon size={16} strokeWidth={2} />
                        </span>
                        <span className="foot-faq-name">{g.name}</span>
                        <ChevronDown className="foot-faq-chev" size={18} strokeWidth={2} aria-hidden="true" />
                      </button>
                    </h3>
                    <div
                      className="foot-faq-a"
                      id={"foot-a-" + i}
                      role="region"
                      aria-labelledby={"foot-q-" + i}
                      hidden={!isOpen}
                    >
                      <ul className="foot-details">
                        {CONTACT.filter((c) => g.labels.includes(c.label)).map(renderDetail)}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <ul className="foot-details" data-rise>
              {CONTACT.map(renderDetail)}
            </ul>
          )}
        </div>

        <div className="foot-bottom">
          <a className="foot-brand" href="/" aria-label="Carmel — home">
            <img className="foot-mark" src="/img/carmel-mark.png" alt="" width="30" height="30" decoding="async" />
            <span className="wm foot-wm">Carmel</span>
          </a>
          <nav className="foot-nav" aria-label="Footer">
            <a href="/services/drayage">Drayage</a>
            <a href="/services/refrigerated">Refrigerated Containers</a>
            <a href="/services/intermodal">Intermodal Trucking</a>
            <a href="/services/storage">Storage Facility</a>
            <a href="/company">Company</a>
            <a href="/careers">Careers</a>
          </nav>
          <p className="foot-legal">© 2026 Carmel Transport Inc.</p>
        </div>
      </footer>
    </div>
  )
}
