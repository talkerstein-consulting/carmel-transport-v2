import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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
/* True once Lenis owns the scroll. The frame scrubs read this to drop their
   own easing: Lenis already eases the scroll position, and easing the frame
   index a second time on top of it left the footage trailing the pinned copy
   by most of a second and still moving after the page had stopped — which
   is what read as jitter. One easing, in one place. */
export function hasSmoothScroll(): boolean {
  return typeof window !== "undefined" && !!window.__lenis
}

/* Scroll the page to a target through whatever is driving it. With Lenis
   running, a GSAP ScrollTo tween on window would fight it for scrollTop
   every frame. */
export function scrollPageTo(target: Element, duration: number): void {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { duration, easing: (t) => 1 - Math.pow(1 - t, 3) })
    return
  }
  gsap.to(window, { scrollTo: { y: target, autoKill: false }, duration, ease: "power2.inOut" })
}

export function initSmoothScroll(): void {
  if (typeof window === "undefined") return
  if (window.__lenis) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  if (!window.matchMedia("(min-width: 1024px)").matches) return

  const lenis = new Lenis({
    /* 0.9, down from 1.1: the longer tail was what read as the page
       "resisting" a normal-paced scroll. */
    duration: 0.9,
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
