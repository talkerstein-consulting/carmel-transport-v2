import { useRef } from "react"
import ScrollReveal from "@/components/ScrollReveal"
import { WordRoll } from "./WordRoll"

/* Section 02 — Intro / About.
   Body left, heading and CTA right — the hero's split, mirrored.
   The copy block is sticky, so it does not travel through the viewport itself.
   ScrollReveal is therefore pointed at the section as its trigger: that is what
   supplies the scroll distance the word-by-word stagger runs across. */
export function Intro() {
  const section = useRef<HTMLElement>(null)

  return (
    <section className="reveal" id="about" ref={section}>
      <div className="reveal-inner">
        <ScrollReveal
          triggerRef={section}
          enableBlur={false}
          baseRotation={0}
          baseOpacity={0.1}
          wordAnimationEnd="bottom bottom"
          containerClassName="reveal-body-wrap"
          textClassName="reveal-body"
        >
          For over 50 years, Carmel's leadership has brought experience and expertise to the transportation industry. With a fleet of 300 power units and more than 800 chassis, we handle dry, overweight, refrigerated, open-top, and flat-rack cargo—with punctual service, tailored solutions, and transparent pricing without surprises.
        </ScrollReveal>

        <div className="reveal-aside">
          <h2 className="reveal-head">Built to keep moving</h2>
          <p className="reveal-cta">
            <WordRoll className="link-caps" href="#company">More About Carmel</WordRoll>
          </p>
        </div>
      </div>
    </section>
  )
}
