import { Cta } from "./Cta"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    n: "01",
    name: "Drayage",
    head: "From terminal to destination",
    body: "A full range of asset-based drayage and transload services, connecting ports, terminals, warehouses, and final destinations.",
    img: "/img/covers/drayage.jpg",
    href: "/services/drayage",
    cta: "Explore Drayage",
  },
  {
    n: "02",
    name: "Refrigerated",
    head: "Keeping cargo in control",
    body: "Comprehensive refrigerated container transport and storage, supported by experienced drivers and Genset chassis, up to 30 units at once.",
    img: "/img/covers/refrigerated.jpg",
    href: "/services/refrigerated",
    cta: "Explore Refrigerated Logistics",
  },
  {
    n: "03",
    name: "Intermodal",
    head: "Connecting every leg",
    body: "Ocean and rail container terminals, pre-arranged rail reservations, documentation and border clearance support.",
    img: "/img/covers/intermodal.jpg",
    href: "/services/intermodal",
    cta: "Explore Intermodal Trucking",
  },
  {
    n: "04",
    name: "Storage",
    head: "Space to keep moving",
    body: "Secure short- and long-term storage for dry-box and refrigerated containers, in yards near major seaports and rail terminals.",
    img: "/img/covers/storage.jpg",
    href: "/services/storage",
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
  /* No walkthrough. All four services render as full cards from the moment the
     section arrives — the deck-you-turn reading was costing three of the four
     their copy at any given scroll position, and the card you could read
     changed under you as you scrolled. They are four cards now, open. */

  useEffect(() => {
    const el = section.current
    if (!el) return

    const mm = gsap.matchMedia()

    /* Desktop only. This whole entrance is choreographed against the pinned
       430vh runway: the copy fades over the first 0.7 of a screen, the cards
       rise from under the fold at 0.9/1.12/1.34/1.56 screens in, and the
       clouds hand off at 2.2. A phone does not pin (see brand.css) -- the
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
      // The last card is open at 2.0 screens and this begins at 2.2, running
      // to 3.2. It MUST be finished before act three's top edge enters the
      // viewport, which on a 430vh runway is 3.3 screens in: act three slides
      // up over the pinned footage, and while the veil was still coming up
      // its top edge met a picture with the dark edge gradient still on it —
      // a dark band sitting right over "More than transportation". With the
      // veil complete first, act three's own gradient starts on the flat
      // #D5E7F2 the veil already put up, and the edge is invisible.
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
                start: () => "top top-=" + Math.round(window.innerHeight * 2.2),
                end: () => "+=" + Math.round(window.innerHeight * 1),
                scrub: true,
                invalidateOnRefresh: true,
              },
            }
          )
        : null

      /* The gradient leaves on exactly the range the veil arrives on. Fading
         the veil in over a gradient still at full strength kept the margins
         visibly darker than the middle all the way through the handoff; the
         swap to flat #D5E7F2 only reads as seamless if both move together. */
      const vigOut = gsap.to(document.documentElement, {
        "--vig-o": 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: () => "top top-=" + Math.round(window.innerHeight * 2.2),
          end: () => "+=" + Math.round(window.innerHeight * 1),
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", refresh)
      const settle = window.setTimeout(refresh, 2500)

      return () => {
        window.removeEventListener("load", refresh)
        window.clearTimeout(settle)
        document.documentElement.style.removeProperty("--vig-o")
        ;[copyIn, fadeOut, vigOut, ...tweens].forEach((t) => {
          if (!t) return
          t.scrollTrigger?.kill()
          t.kill()
        })
      }
    })


    /* The clouds-to-paper handoff, on a phone. .svc-out is the #D5E7F2 veil
       the desktop sequence fades up so the footage dissolves into the colour
       act three opens on rather than cutting at a section edge. The desktop
       tween is measured in viewport heights off the pinned runway, which does
       not exist here, so it is anchored to act three itself: the screen
       lightens as "More than transportation" arrives. */
    mm.add("(max-width: 1023px)", () => {
      const el2 = section.current
      if (!el2) return
      const veil = el2.querySelector<HTMLElement>(".svc-out")
      const light = document.querySelector<HTMLElement>(".act-three")
      if (!veil || !light) return

      const range = {
        trigger: light,
        start: "top bottom",
        end: "top top+=25%",
        scrub: true,
        invalidateOnRefresh: true,
      } as const

      const outIn = gsap.fromTo(veil, { opacity: 0 }, {
        opacity: 1, ease: "none", scrollTrigger: { ...range },
      })
      /* the gradient leaves on exactly the same range the veil arrives on */
      const vigOut = gsap.to(document.documentElement, {
        "--vig-o": 0, ease: "none", scrollTrigger: { ...range },
      })

      return () => {
        document.documentElement.style.removeProperty("--vig-o")
        ;[outIn, vigOut].forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="intro-services" id="services" ref={section}>
      {/* No second sequence. The ship scrub in Stats is one continuous
          ocean-to-cloud take and stays pinned through this section, so all
          this needs to contribute is the scroll runway the copy rides on
          (430vh — see .svc-runway). */}
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
            {SERVICES.map((s) => (
              <article
                className="svc-card is-open"
                key={s.n}
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
                    {/* Not lazy. The cards are tweened into a clipped, pinned
                        frame, and Chrome's lazy loader judges visibility from
                        layout, not transforms -- so a card arriving by tween
                        was never seen to "enter" and its picture sometimes
                        never loaded. Four covers is cheap enough to fetch up
                        front. */}
                    <div className="svc-card-media">
                      <img src={s.img} alt="" decoding="async" fetchPriority="low" />
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
