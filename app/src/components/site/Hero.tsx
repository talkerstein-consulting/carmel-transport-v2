import type { MouseEvent } from "react"
import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Cta } from "./Cta"

gsap.registerPlugin(ScrollToPlugin)

export function Hero() {
  /* The hero's only action is "keep reading", so the button drives the scroll
     itself rather than jumping. GSAP owns the scroll position everywhere else
     on this page; handing the glide to it keeps the pinned sections from being
     yanked past by a native smooth-scroll they do not know about. */
  const toIntro = (e: MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector("#about")
    if (!target) return
    e.preventDefault()
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    gsap.to(window, {
      // autoKill:false deliberately. Three frame sequences load after mount and
      // keep changing the document height, and ScrollTrigger's own scrubbing
      // moves the scroll position while the tween runs — autoKill reads both as
      // the user grabbing the page and cancels a few hundred pixels in.
      scrollTo: { y: target, autoKill: false },
      duration: reduced ? 0 : 1.1,
      ease: "power2.inOut",
    })
  }

  return (
    <section className="hero">
      <h1 className="hero-head">
        <span className="l1">Move</span>
        <span className="l2">freight</span>
        <span className="l3">forward</span>
      </h1>

      <div className="hero-aside">
        <p className="hero-lead">
          From port to destination, Carmel delivers reliable drayage, intermodal
          transportation, refrigerated logistics, and storage solutions built
          around your business.
        </p>
        <div className="hero-actions">
          <Cta href="#about" variant="outline" dir="down" live onClick={toIntro}>
            Scroll to learn more
          </Cta>
        </div>
      </div>
    </section>
  )
}
