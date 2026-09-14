import { Cta } from "./Cta"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    n: "01",
    name: "Drayage",
    head: "From terminal to destination",
    body: "A full range of asset-based drayage and transload services, connecting ports, terminals, warehouses, and final destinations.",
    img: "/img/services/drayage.jpg",
    href: "/services#drayage",
    cta: "Explore Drayage",
  },
  {
    n: "02",
    name: "Refrigerated",
    head: "Keeping cargo in control",
    body: "Comprehensive refrigerated container transport and storage, supported by experienced drivers and Genset chassis, up to 30 units at once.",
    img: "/img/services/refrigerated.jpg",
    href: "/services#refrigerated",
    cta: "Explore Refrigerated Logistics",
  },
  {
    n: "03",
    name: "Intermodal",
    head: "Connecting every leg",
    body: "Ocean and rail container terminals, pre-arranged rail reservations, documentation and border clearance support.",
    img: "/img/services/intermodal.jpg",
    href: "/services#intermodal",
    cta: "Explore Intermodal Trucking",
  },
  {
    n: "04",
    name: "Storage",
    head: "Space to keep moving",
    body: "Secure short- and long-term storage for dry-box and refrigerated containers, in yards near major seaports and rail terminals.",
    img: "/img/services/storage.jpg",
    href: "/services#storage",
    cta: "Explore Storage Solutions",
  },
]

/* Section 04 — Services.
   The clouds sequence is STITCHED to the ship: this section is pulled up over
   the tail of the one above with a negative margin, and the clouds dissolve in
   only once their canvas is already pinned in position. Nothing travels up
   into place — the footage sits where it belongs and only scrubs.

   The headline splits to the two margins. The four service cards sit below the
   fold and rise into frame one at a time, but only once the clouds have filled
   the screen. */
export function ServicesIntro() {
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const mm = gsap.matchMedia()

    /* Desktop only. This whole entrance is choreographed against the pinned
       600vh runway: the copy fades over the first 0.7 of a screen, the cards
       rise from under the fold at 0.9/1.12/1.34/1.56 screens in, and the
       clouds hand off at 4.7. A phone does not pin (see brand.css) -- the
       frame grows to its content and scrolls -- so none of those offsets mean
       anything there, and the cards simply sat at opacity 0 / y 120 for the
       whole section. On a phone they are laid out and visible, which is what
       the phone layout was already written to expect. */
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const copy = el.querySelector<HTMLElement>(".svc-copy")
      const out = el.querySelector<HTMLElement>(".svc-out")
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card", el)
      if (!copy) return

      const copyIn = gsap.fromTo(
        copy,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * 0.7),
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      // The cards wait below the fold and rise into frame only after the
      // clouds have filled the screen — the dissolve above runs for 0.9 of a
      // viewport, so nothing starts before that.
      //
      // NOT `once: true`: three frame sequences load after mount and grow the
      // document by thousands of pixels, so triggers created now resolve
      // against a much shorter page. toggleActions lets them re-evaluate.
      const tweens = cards.map((card, i) =>
        gsap.fromTo(
          card,
          { opacity: 0, y: 120 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: () => "top top-=" + Math.round(window.innerHeight * (0.9 + i * 0.22)),
              end: () => "+=" + Math.round(window.innerHeight * 0.45),
              scrub: true,
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            },
          }
        )
      )

      // The tail of the clouds resolves into the flat #D5E7F2 the next section
      // opens on, so the footage hands off to colour rather than cutting.
      //
      // The walkthrough now ends at 4.0 screens and this begins at 4.7, so the
      // fourth card sits open and untouched for most of a screen before the
      // clouds start taking the picture back. Previously this began at 2.8 —
      // while the walkthrough was still running — and the last service was
      // being dissolved out before it could be read.
      const fadeOut = out
        ? gsap.fromTo(
            out,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                // Explicit offsets from the section top, the same form the
                // cards and the walkthrough use. "bottom bottom+=X" resolves
                // in the opposite direction to what it reads like and kept
                // starting this early.
                start: () => "top top-=" + Math.round(window.innerHeight * 4.7),
                end: () => "+=" + Math.round(window.innerHeight * 1),
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        : null

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", refresh)
      const settle = window.setTimeout(refresh, 2500)

      return () => {
        window.removeEventListener("load", refresh)
        window.clearTimeout(settle)
        ;[copyIn, fadeOut, ...tweens].forEach((t) => {
          if (!t) return
          t.scrollTrigger?.kill()
          t.kill()
        })
      }
    })

    /* The four-across walkthrough is desktop only. */
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el2 = section.current
      if (!el2) return
      // Once all four are up, continued scroll walks through them one at a
      // time: the active card opens to show its photo and copy, the others
      // stay closed. One quarter of the walkthrough range per service.
      // 1.6 -> 4.0, so each service gets 0.6 of a screen rather than 0.5.
      const walk = ScrollTrigger.create({
        trigger: el2,
        start: () => "top top-=" + Math.round(window.innerHeight * 1.6),
        end: () => "+=" + Math.round(window.innerHeight * 2.4),
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(SERVICES.length - 1, Math.floor(self.progress * SERVICES.length))
          setActive(self.progress <= 0 ? -1 : i)
        },
        onLeaveBack: () => setActive(-1),
      })

      return () => walk.kill()
    })

    /* On a phone the four cards are a pinned deck, the same one the desktop
       turns: they arrive as compact tabs, the frame catches, and then each
       expands in turn while the other three drop back to their closed height.

       Driven off the overlay's live rect every frame rather than through
       ScrollTrigger. ScrollTrigger resolves its ranges against measurements
       taken when it is created, and on this page the document is still growing
       then — three frame sequences load after mount. Worse on a phone, ranges
       expressed in viewport heights shift under you as the URL bar shows and
       hides, which is what stuck this on the first card when it last pinned.
       A rect read on the frame is always current, so neither can bite.

       The runway is the overlay's padding (200svh, set in brand.css): the pin
       catches at the far edge of it and releases a frame-height short of the
       overlay's bottom. LEAD holds all four closed for the first stretch after
       it catches, so the tabs register as tabs before anything opens. */
    mm.add("(max-width: 1023px)", () => {
      const el2 = section.current
      if (!el2) return
      const wrap = el2.querySelector<HTMLElement>(".svc-overlay")
      const pin = el2.querySelector<HTMLElement>(".svc-pin")
      if (!wrap || !pin) return


      const LEAD = 0.12
      let queued = false

      const pick = () => {
        queued = false
        const r = wrap.getBoundingClientRect()
        const pad = parseFloat(getComputedStyle(wrap).paddingTop) || 0
        const start = r.top + pad                      // frame's top, once padding is spent
        const range = r.bottom - start - pin.offsetHeight
        if (range <= 0) { setActive(-1); return }

        const p = -start / range
        if (p <= LEAD) { setActive(-1); return }        // pinned, still all tabs
        if (p >= 1) { setActive(SERVICES.length - 1); return }

        const t = (p - LEAD) / (1 - LEAD)
        setActive(Math.min(SERVICES.length - 1, Math.floor(t * SERVICES.length)))
      }

      const onScroll = () => {
        if (queued) return
        queued = true
        requestAnimationFrame(pick)
      }

      /* The clouds-to-paper handoff, on a phone. .svc-out is the #D5E7F2 veil
         the desktop sequence fades up so the footage dissolves into the colour
         act three opens on rather than cutting at a section edge. Its desktop
         tween is measured in viewport heights off the pinned runway, which
         does not exist here, so on a phone the veil never ran and the dark
         ship footage cut straight to the light section. Anchored to act three
         itself: the screen lightens as "More than transportation" arrives. */
      const veil = el2.querySelector<HTMLElement>(".svc-out")
      const light = document.querySelector<HTMLElement>(".act-three")
      const outIn = veil && light
        ? gsap.fromTo(
            veil,
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: light,
                start: "top bottom",
                end: "top top+=25%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        : null

      pick()
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      return () => {
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
        outIn?.scrollTrigger?.kill()
        outIn?.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="intro-services" id="services" ref={section}>
      {/* No second sequence. The ship scrub in Stats is one continuous
          ocean-to-cloud take and stays pinned through this section, so all
          this needs to contribute is the scroll runway the copy rides on —
          the same 700vh FrameScrub used to render (100 + 6 x 100). */}
      <div className="svc-runway" aria-hidden="true" />

      <div className="svc-out" aria-hidden="true" />

      <div className="svc-overlay">
        <div className="svc-pin">
          <div className="svc-copy">
            <h2 className="svc-head">
              <span className="svc-left">One partner.</span>
              <span className="svc-right">Every move.</span>
            </h2>
          </div>

          <div className="svc-row">
            {SERVICES.map((s, i) => (
              <article
                className={"svc-card" + (i === active ? " is-open" : "")}
                key={s.n}
                aria-expanded={i === active}
              >
                <p className="svc-card-n">{s.n} / {s.name}</p>
                <h3 className="svc-card-head">{s.head}</h3>

                {/* One wrapper, deliberately. The 0fr -> 1fr row trick only
                    collapses the rows grid-template-rows actually declares —
                    with the media, body and CTA as three separate children the
                    other two landed in implicit auto rows and stayed at full
                    height, so a closed card measured 264px instead of 85 and
                    four of them could not fit a pinned frame. */}
                <div className="svc-card-detail">
                  <div className="svc-card-detail-inner">
                    <div className="svc-card-media">
                      <img src={s.img} alt="" loading="lazy" decoding="async" />
                    </div>
                    <p className="svc-card-body">{s.body}</p>
                    <Cta href={s.href} size="sm" className="svc-card-cta">{s.cta}</Cta>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
