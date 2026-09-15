import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Nav } from "@/components/site/Nav"
import { PlateBg } from "@/components/site/PlateBg"
import { Cta } from "@/components/site/Cta"
import { Closing } from "@/components/site/Closing"
import { Values } from "@/components/site/Values"

gsap.registerPlugin(ScrollTrigger)

/* /services — the four services the old site kept as anchors on one page.
   Copy is ported verbatim from carmel-usa-scrape/text/en_services.txt; only
   the nav's "Refridgerated" misspelling is left behind, since the body copy
   on the source page already spelled it correctly. */

const SERVICES = [
  {
    id: "drayage",
    n: "01",
    name: "Drayage",
    img: "/img/covers/drayage.jpg",
    body: [
      "We pride ourselves on our superior drayage services. Our goal is to ensure seamless and prompt transportation of your goods, by making sure they arrive at destination in the same condition they left the port, thus reducing the level of concern to a minimum.",
      "Trust in our expertise to keep your goods safe and deliver them with a minimum cost to you.",
    ],
  },
  {
    id: "refrigerated",
    n: "02",
    name: "Refrigerated Containers",
    img: "/img/covers/refrigerated.jpg",
    body: [
      "Carmel USA delivers a comprehensive solution for both storage and transport of refrigerated containers. Our drivers are proficiently trained in transporting refrigerated items, we hold a substantial number of Genset chassis, and through our associates at Carmel USA Intermodal Logistics Inc, we also extend storage solutions for refrigerated containers. The storage facility is outfitted to accommodate up to 30 refrigerated containers simultaneously.",
    ],
  },
  {
    id: "intermodal",
    n: "03",
    name: "Intermodal Trucking",
    img: "/img/covers/intermodal.jpg",
    body: [
      "At Carmel USA, we specialize in seamless logistics for ocean and rail container terminals, ensuring your goods reach their destination timely and securely. Our logistics experts manage each shipment with precision, guaranteeing safe handling and prompt deliveries. With our expansive network and custom solutions, we connect you to vital commercial hubs effortlessly. With us, your cargo isn't just delivered - it's handled with care and reliability.",
    ],
  },
  {
    id: "storage",
    n: "04",
    name: "Storage Facility",
    img: "/img/covers/storage.jpg",
    body: [
      "Carmel USA offers integrated storage for all types of containers, promising notable savings on storage fees. Situated conveniently near NJ ports, our fully-secured site with 24/7 surveillance offers customers peace of mind against cargo theft. Leveraging a broad fleet featuring company-owned tractors, advanced lifting equipment, and a variety of chassis, we assure prompt, secure services.",
    ],
  },
]

export default function Services() {
  const root = useRef<HTMLDivElement>(null)

  /* The same rise the closing sections use, so interior pages move like the
     homepage does once the footage is behind you. */
  useEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-rise]", el)
      const tweens = items.map((item) =>
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", toggleActions: "play none none reverse", invalidateOnRefresh: true },
          }
        )
      )
      return () => tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={root}>
      <Nav />

      <main>
        {/* Light from the first pixel, so the nav pill starts in its light
            state rather than flipping partway down. */}
        <header className="band ph" data-nav-light>
          <PlateBg src="/img/covers/services.jpg" />

          <div className="band-inner">
            <div className="ph-plate ph-grid">
              <div>
                <p className="ph-crumbs">
                  <a href="/">Home</a><span aria-hidden="true">/</span>Services
                </p>
                <h1 className="ph-head">
                  <span>Services</span>
                  <span className="accent">Port to door.</span>
                </h1>
                <p className="ph-lead">
                  Four services off one asset-based fleet, minutes from the New
                  York and New Jersey ports.
                </p>
              </div>

              <nav className="ph-toc" aria-label="On this page">
                <p className="eyebrow ph-toc-label">On this page</p>
                <ol>
                  {SERVICES.map((s) => (
                    <li key={s.id}><a href={"#" + s.id}>{s.name}</a></li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        </header>

        {SERVICES.map((s, i) => (
          <section
            className={"band pg-block" + (i % 2 ? " band-deep" : "")}
            id={s.id}
            key={s.id}
          >
            <div className="band-inner pg-grid">
              <div className="pg-rail">
                <p className="pg-rail-n" data-rise>{s.n} / Service</p>
                <h2 className="pg-rail-head" data-rise>{s.name}</h2>
              </div>

              <div className="pg-main">
                {s.body.map((p) => (
                  <p className="pg-body" key={p.slice(0, 24)} data-rise>{p}</p>
                ))}
                <p className="pg-cta" data-rise>
                  <Cta href="/contact" size="sm">Request a quote</Cta>
                </p>
                <div className="pg-media" data-rise>
                  <img src={s.img} alt="" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </section>
        ))}

        <Values hidePhone />

        <div className="band band-deep">
          <Closing />
        </div>
      </main>

      <div className="grain grain-paper" aria-hidden="true" />
    </div>
  )
}
