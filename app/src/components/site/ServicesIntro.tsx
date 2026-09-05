import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FrameScrub from "@/components/frame-scrub"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    n: "01",
    name: "Drayage",
    head: "From terminal to destination",
    body: "A full range of asset-based drayage and transload services, connecting ports, terminals, warehouses, and final destinations.",
    img: "/img/services/drayage.jpg",
    cta: "Explore Drayage",
  },
  {
    n: "02",
    name: "Refrigerated",
    head: "Keeping cargo in control",
    body: "Comprehensive refrigerated container transport and storage, supported by experienced drivers and Genset chassis, up to 30 units at once.",
    img: "/img/services/refrigerated.jpg",
    cta: "Explore Refrigerated Logistics",
  },
  {
    n: "03",
    name: "Intermodal",
    head: "Connecting every leg",
    body: "Ocean and rail container terminals, pre-arranged rail reservations, documentation and border clearance support.",
    img: "/img/services/intermodal.jpg",
    cta: "Explore Intermodal Trucking",
  },
  {
    n: "04",
    name: "Storage",
    head: "Space to keep moving",
    body: "Secure short- and long-term storage for dry-box and refrigerated containers, in yards near major seaports and rail terminals.",
    img: "/img/services/storage.jpg",
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

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const canvas = el.querySelector<HTMLElement>(".svc-scrub")
      const copy = el.querySelector<HTMLElement>(".svc-copy")
      const out = el.querySelector<HTMLElement>(".svc-out")
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card", el)
      if (!canvas || !copy) return

      // dissolve the clouds in over the ship — the stitch
      const stitch = gsap.fromTo(
        canvas,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            // "top top", not "top bottom": the canvas is sticky, so before the
            // section's top reaches the viewport top it is still parked at the
            // section top and would slide up into place. Waiting until sticky
            // has engaged means the clouds are already pinned where they
            // belong and only the opacity moves.
            trigger: el,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * 0.9),
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

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

      // Once all four are up, continued scroll walks through them one at a
      // time: the active card opens to show its photo and copy, the others
      // stay closed. One quarter of the walkthrough range per service.
      const walk = ScrollTrigger.create({
        trigger: el,
        start: () => "top top-=" + Math.round(window.innerHeight * 1.9),
        end: () => "+=" + Math.round(window.innerHeight * 2),
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(SERVICES.length - 1, Math.floor(self.progress * SERVICES.length))
          setActive(self.progress <= 0 ? -1 : i)
        },
        onLeaveBack: () => setActive(-1),
      })

      // The tail of the clouds resolves into the flat #D5E7F2 the next section
      // opens on, so the footage hands off to colour rather than cutting.
      // It starts only after the last card has finished expanding: the
      // walkthrough runs from 1.9 to 3.4 screens, so this begins at 3.4.
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
                start: () => "top top-=" + Math.round(window.innerHeight * 3.4),
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
        walk.kill()
        ;[stitch, copyIn, fadeOut, ...tweens].forEach((t) => {
          if (!t) return
          t.scrollTrigger?.kill()
          t.kill()
        })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="intro-services" id="services" ref={section}>
      <FrameScrub
        src="/seq/clouds/f-{i}.webp"
        count={91}
        pad={3}
        start={1}
        variant="plain"
        fit="cover"
        height={0.95}
        width={4000}
        borderRadius={0}
        scrollLength={3.6}
        smooth={0.12}
        grain={0}
        vignette={0}
        showCounter={false}
        background="#0A0A09"
        className="fs-fill svc-scrub"
      />

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

                <div className="svc-card-detail">
                  <div className="svc-card-media">
                    <img src={s.img} alt="" loading="lazy" decoding="async" />
                  </div>
                  <p className="svc-card-body">{s.body}</p>
                  <a className="link-caps svc-card-cta" href="#quote">{s.cta}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
