import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ScrollReveal from "@/components/ScrollReveal"
import { Cta } from "./Cta"

/* Section 02 — Intro / About.
   Body left, heading and CTA right — the hero's split, mirrored.
   The copy block is sticky, so it does not travel through the viewport itself.
   ScrollReveal is therefore pointed at the section as its trigger: that is what
   supplies the scroll distance the word-by-word stagger runs across. */
gsap.registerPlugin(ScrollTrigger)

export function Intro() {
  const section = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  /* Phone: the copy runs full width on its paper wash, so rising up from the
     bottom it slid over the truck. Instead the whole block -- wash and all --
     drops in from the top of the screen while the section scrolls up to meet
     it. Its on-screen top is -sectionTop, i.e. -100vh -> 0. */
  useLayoutEffect(() => {
    const sec = section.current, el = inner.current
    if (!sec || !el) return
    const mm = gsap.matchMedia()
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(el, { y: () => -2 * window.innerHeight }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="reveal" id="about" ref={section}>
      <div className="reveal-inner" ref={inner}>
        <ScrollReveal
          triggerRef={section}
          enableBlur={false}
          /* 0.3, not the registry's 0.1: the untriggered tail of the sentence
             sits over footage for most of the section, and at 10% it read as a
             rendering fault rather than as copy waiting its turn. */
          baseRotation={0}
          baseOpacity={0.45}
          wordAnimationEnd="bottom bottom"
          containerClassName="reveal-body-wrap"
          textClassName="reveal-body"
        >
          For over 50 years, Carmel's leadership has brought experience and expertise to the transportation industry. With a fleet of 300 power units and more than 800 chassis, we handle dry, overweight, refrigerated, open-top, and flat-rack cargo—with punctual service, tailored solutions, and transparent pricing without surprises.
        </ScrollReveal>

        <div className="reveal-aside">
          <h2 className="reveal-head">Built to keep moving</h2>
          <p className="reveal-cta">
            <Cta href="/company">More about Carmel</Cta>
          </p>
        </div>
      </div>
    </section>
  )
}
