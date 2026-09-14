import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Tag, Truck, Clock } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const POINTS = [
  {
    icon: Tag,
    head: "Transparent pricing",
    body: "Precise quotes designed to match your invoice—without unexpected charges or surprises.",
    img: "/img/services/drayage.jpg",
  },
  {
    icon: Truck,
    head: "A fleet built for flexibility",
    body: "From 20', 40', and 45' containers to dry, overweight, refrigerated, open-top, and flat-rack cargo, our equipment is ready for a wide range of requirements.",
    img: "/img/services/storage.jpg",
  },
  {
    icon: Clock,
    head: "Support around the clock",
    body: "Our team monitors shipments 24/7 to help ensure a seamless transition throughout the transportation process.",
    img: "/img/services/intermodal.jpg",
  },
]

/* Section 05 — Why Carmel.
   The footage stops here. A full-page gradient drawn from the same deep blue
   the sequences sit in, so the run of film resolves into colour rather than
   cutting to paper.

   The three points arrive one at a time as you scroll. The progress rail that
   used to sit with the copy has been removed — that readout belongs to the
   stage line in "From port to possibility." and reading as a second one here
   made two sections compete to be the page's progress indicator. */
export function Differentiator() {
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const mm = gsap.matchMedia()

    /* Desktop only. These entrances set opacity:0 up front and rely on a
       ScrollTrigger to bring it back. This page grows by thousands of pixels
       after mount as the frame sequences load, so triggers created at mount
       resolve against a much shorter document -- on a phone they frequently
       never fired at all and the section simply stayed invisible. Nothing on
       a phone needs a dealt entrance; the content is there and it scrolls. */
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const copy = gsap.utils.toArray<HTMLElement>(".diff-copy > *", el)
      const cards = gsap.utils.toArray<HTMLElement>(".diff-card", el)
      const phone = window.matchMedia("(max-width: 900px)").matches
      if (phone) gsap.set(cards, { clearProps: "opacity,transform" })

      const intro = copy.map((item) =>
        gsap.fromTo(item, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 86%", toggleActions: "play none none reverse", invalidateOnRefresh: true },
        })
      )

      /* Each card is triggered on ITSELF, not on the section. The section is
         100svh and centres its content, so a range measured from the section's
         top runs out before the cards are even on screen — they were finishing
         their deal-in while still below the fold. Anchored to the card, they
         arrive one at a time simply because they are stacked.

         Desktop only. On a phone the cards are the section — they are not
         being dealt beside a sticky rail, they ARE the scroll — and scrubbing
         each one's opacity against its own position just means the card you
         are reading is half faded. They scroll normally there. */
      const deal = phone ? [] : cards.map((card) =>
        gsap.fromTo(card, { opacity: 0, y: 56 }, {
          opacity: 1, y: 0, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            end: "top 58%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      )

      return () => {
        ;[...intro, ...deal].forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
      }
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
          {POINTS.map((p) => {
            const Icon = p.icon
            return (
              <article className="diff-card" key={p.head}>
                <span className="diff-card-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <h3 className="diff-card-head">{p.head}</h3>
                <p className="diff-card-body">{p.body}</p>
                <div className="diff-card-media">
                  <img src={p.img} alt="" loading="lazy" decoding="async" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
