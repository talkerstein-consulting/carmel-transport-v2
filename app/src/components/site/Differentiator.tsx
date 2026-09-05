import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const POINTS = [
  {
    head: "Transparent pricing",
    body: "Precise quotes designed to match your invoice—without unexpected charges or surprises.",
  },
  {
    head: "A fleet built for flexibility",
    body: "From 20', 40', and 45' containers to dry, overweight, refrigerated, open-top, and flat-rack cargo, our equipment is ready for a wide range of requirements.",
  },
  {
    head: "Support around the clock",
    body: "Our team monitors shipments 24/7 to help ensure a seamless transition throughout the transportation process.",
  },
]

/* Section 05 — Why Carmel.
   The footage stops here. A full-page gradient drawn from the same deep blue
   the sequences sit in, so the run of film resolves into colour rather than
   cutting to paper. */
export function Differentiator() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(".diff-item, .diff-copy > *", el)
      const tweens = items.map((item) =>
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
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
    <section className="diff" id="why" ref={section}>
      <div className="diff-inner">
        <div className="diff-copy">
          <p className="eyebrow diff-eyebrow">Why Carmel</p>
          <h2 className="diff-head">More than transportation</h2>
          <p className="diff-lead">
            Moving freight is about more than getting from one place to another.
            It requires coordination, visibility, and a team that understands
            what is at stake.
          </p>
          <p className="diff-lead">
            Carmel provides flexible and cost-effective solutions for large
            volumes of import and export containers, with round-the-clock
            shipment monitoring and services designed to simplify the logistics
            process.
          </p>
        </div>

        <div className="diff-list">
          {POINTS.map((p) => (
            <div className="diff-item" key={p.head}>
              <h3 className="diff-item-head">{p.head}</h3>
              <p className="diff-item-body">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
