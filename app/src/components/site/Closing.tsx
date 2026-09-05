import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { WordRoll } from "./WordRoll"

gsap.registerPlugin(ScrollTrigger)

/* Sections 07–08 — Final CTA and contact footer.
   Same language as the rest of the page: paper ground, split-tone display
   heading, unboxed caps links that tumble per word. */
export function Closing() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
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
    <div ref={root}>
      {/* final CTA */}
      <section className="cta" id="quote">
        <div className="cta-inner">
          <p className="eyebrow cta-eyebrow" data-rise>Let's keep moving.</p>
          <h2 className="cta-head" data-rise>Ready to move freight forward?</h2>
          <p className="cta-lead" data-rise>
            Tell us where your cargo needs to go. We'll help you get it there.
          </p>
          <p className="cta-actions" data-rise>
            <WordRoll className="link-caps cta-link" href="mailto:quotes@carmel-usa.com">
              Request a Quote
            </WordRoll>
          </p>
        </div>
      </section>

      {/* contact footer */}
      <footer className="foot" id="contact">
        <div className="foot-top">
          <div>
            <h2 className="foot-head" data-rise>We're here to help</h2>
            <p className="foot-lead" data-rise>
              Have questions about transportation, sales, billing, or logistics
              services? Our knowledgeable team is ready to help.
            </p>
            <p className="foot-actions" data-rise>
              <WordRoll className="link-caps foot-link" href="mailto:quotes@carmel-usa.com">
                Get in Touch
              </WordRoll>
            </p>
          </div>

          <dl className="foot-details" data-rise>
            <dt>Corporate HQ</dt>
            <dd>78 John Miller Way, Unit&nbsp;#408<br />Kearny, NJ 07032</dd>

            <dt>Emergency · 24/7</dt>
            <dd><a href="tel:+16468087266">(646) 808-7266</a></dd>

            <dt>Sales</dt>
            <dd><a href="tel:+12012995416">(201) 299-5416</a></dd>

            <dt>Billing &amp; other</dt>
            <dd><a href="tel:+12012995417">(201) 299-5417</a></dd>

            <dt>Email</dt>
            <dd><a href="mailto:quotes@carmel-usa.com">quotes@carmel-usa.com</a></dd>

            <dt>Hours</dt>
            <dd>Open 24 / 7 / 365</dd>
          </dl>
        </div>

        <div className="foot-bottom">
          <span className="wm foot-wm">Carmel</span>
          <nav className="foot-nav" aria-label="Footer">
            <a href="#services">Drayage</a>
            <a href="#services">Refrigerated Containers</a>
            <a href="#services">Intermodal Trucking</a>
            <a href="#services">Storage Facility</a>
            <a href="#careers">Careers</a>
          </nav>
          <p className="foot-legal">© 2026 Carmel Transport Inc.</p>
        </div>
      </footer>
    </div>
  )
}
