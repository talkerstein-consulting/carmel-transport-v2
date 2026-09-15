import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window { __lenis?: Lenis }
}

/* Desktop only.

   Touch keeps native momentum — syncTouch smoothing on a phone reads as lag,
   and this page already asks a lot of a mobile compositor with two frame
   sequences and a stack of pinned sections. Below 1024px Lenis never starts,
   so the phone scrolls exactly as it does now.

   Lenis drives the real document scrollTop rather than transforming the body,
   so position:sticky, the pinned ScrollTriggers and every scroll listener on
   this page keep working untouched. The two integration lines below are what
   keep GSAP in step: ScrollTrigger updates off Lenis's scroll event, and
   Lenis's rAF is driven by the GSAP ticker so there is one clock, not two. */
export function initSmoothScroll(): void {
  if (typeof window === "undefined") return
  if (window.__lenis) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (!window.matchMedia("(min-width: 1024px)").matches) return

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    anchors: true,
  })
  window.__lenis = lenis

  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((time: number) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}
