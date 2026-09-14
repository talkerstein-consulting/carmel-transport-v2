import { ShieldCheck, Gauge, MessagesSquare } from "lucide-react"

/* The three-up close shared by /services and /careers — the old site ran the
   same block on both. Branded cards, same construction as the nav panel's
   service cards: a picture, then an icon tile, then the text, on a paper
   surface with superellipse corners and a hairline.

   STAND-IN IMAGES: img below points at the service photographs, the same
   placeholder approach the page covers use. The real card pictures are
   prompted in cover-prompts.md (Part 2) and belong at /img/values/*.jpg —
   swap the three paths once they are generated. */

const VALUES = [
  {
    icon: ShieldCheck,
    img: "/img/services/storage.jpg",
    head: "Reliable & Protected",
    body: "You benefit from our history of delivering effective solutions, regardless of complexity. Our proven track record speaks for our ability to handle any situation with proficiency and expertise.",
  },
  {
    icon: Gauge,
    img: "/img/services/drayage.jpg",
    head: "Fast Delivery",
    body: "Take advantage of our strategic location near the New York and New Jersey ports. Rely on our skilled drivers for timely and secure delivery of your cargo.",
  },
  {
    icon: MessagesSquare,
    img: "/img/services/intermodal.jpg",
    head: "Outstanding Client Support",
    body: "We are prepared to channel our enthusiasm for problem-solving towards enhancing your business operations.",
  },
]

/* hidePhone: the same three reasons run again inside the CTA block
   (Closing's `cta-reasons`). On a phone the two land within a screen of each
   other and read as a stutter, so the page that sits closest to the CTA drops
   the card band and lets the compact row carry them. Desktop keeps both —
   there the cards are a section you pass, not a repeat you notice. */
export function Values({ deep = false, hidePhone = false }: { deep?: boolean; hidePhone?: boolean }) {
  return (
    <section
      className={"band pg-values" + (deep ? " band-deep" : "") + (hidePhone ? " pg-values-nophone" : "")}
      aria-label="Why Carmel"
    >
      <div className="band-inner pg-values-grid">
        {VALUES.map((v) => {
          const Icon = v.icon
          return (
            <article className="pg-value" key={v.head} data-rise>
              <span className="pg-value-media" aria-hidden="true">
                <img src={v.img} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="pg-value-ic" aria-hidden="true">
                <Icon size={22} strokeWidth={1.9} />
              </span>
              <h2 className="pg-value-head">{v.head}</h2>
              <p className="pg-value-body">{v.body}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
