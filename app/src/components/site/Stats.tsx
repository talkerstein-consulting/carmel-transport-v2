import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FrameScrub from "@/components/frame-scrub"
import { hasSmoothScroll } from "@/lib/smooth-scroll"
import { StatCard } from "@/components/site/StatCard"
import type { StatSpec } from "@/components/site/StatCard"
import { CalendarClock, Truck, Container, Headset } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const STATS: StatSpec[] = [
  { value: 50,  suffix: "+",  label: "Years of industry experience",       icon: CalendarClock },
  { value: 300,               label: "Power units across North America",   icon: Truck },
  { value: 800, suffix: "+",  label: "Chassis in operation",               icon: Container },
  { value: 0,   literal: "24/7/365", label: "Service and support",         icon: Headset },
]

/* Section 03 — Stats.
   Scrolls up OVER the sticky section above it (higher stacking context,
   opaque backdrop).

   FrameScrub supplies BOTH the ship footage and this section's scroll runway:
   it renders a tall runway with a sticky canvas inside. The figures ride on
   top in an absolute overlay with its own sticky box, so nothing has to nest
   inside FrameScrub's pin.

   The footage plays as shot — no scale on the canvas. It used to enter at
   2.8x and pull back, which was magnifying 960px frames on a full screen. */
const STATS_RUNWAY_VH = 7.7

export function Stats() {
  const section = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  /* Phones only. The ship canvas is pinned under the stage canvas from the
     moment this section's top passes, but the stage is still being wiped
     off it until the intro copy's bottom clears the screen -- so the ship
     had already run a fifth of its take by the time it was uncovered, and
     the wipe revealed mid-footage rather than the opening frame. Hold the
     first frame until the wipe completes; measured, since the intro's height
     is a breakpoint away from changing. Desktop keeps its tuned timing. */
  const [hold, setHold] = useState(0)
  useLayoutEffect(() => {
    const read = () => {
      const el = section.current
      const copy = document.querySelector<HTMLElement>(".reveal")
      const vh = window.innerHeight
      if (!el || !copy || vh < 1 || !window.matchMedia("(max-width: 1023px)").matches) {
        setHold(0)
        return
      }
      const top = el.getBoundingClientRect().top + window.scrollY
      const wipeEnd = copy.getBoundingClientRect().bottom + window.scrollY - vh
      const next = (wipeEnd - top) / (STATS_RUNWAY_VH * vh)
      setHold(Number.isFinite(next) && next > 0 && next < 0.9 ? next : 0)
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  useEffect(() => {
    const el = section.current
    const box = inner.current
    if (!el || !box) return

    // FrameScrub mounts its canvas after its own effect runs
    const canvas = el.querySelector<HTMLCanvasElement>(".stats-scrub canvas")
    if (!canvas) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The block is HELD while the four figures arrive, then released and
      // scrolls away. Pinned by ScrollTrigger rather than CSS sticky: sticky
      // did not engage inside the absolutely positioned overlay.
      // pinSpacing is off because the overlay is absolute — adding spacer
      // height there would push the section out of step with the footage.
      const hold = ScrollTrigger.create({
        trigger: el,
        start: () => "top top-=" + Math.round(window.innerHeight * 1.9),
        end: () => "+=" + Math.round(window.innerHeight * 1.1),
        pin: box,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })

      const figures = gsap.utils.toArray<HTMLElement>(".stat", box)

      // Set the start state outright rather than relying on fromTo's
      // immediateRender: under a scrubbed stagger it applies late, so figures
      // rendered visible first and snapped to hidden, and the last one never
      // received it at all.
      gsap.set(figures, { opacity: 0, y: 44 })

      // STATIC FIGURES. The count-up used to be driven off each card's opacity
      // (opacity IS progress, so the number tracked the fade). That coupling
      // kept stranding the figures on "0" whenever the scrub did not update
      // them — which is worse than not counting at all, because the number is
      // then simply wrong. The markup renders the true value and it stays
      // true; the cards still fade and rise in.
      const reveal = gsap.to(figures, {
        opacity: 1,
        y: 0,
        ease: "none",
        stagger: 1,
        scrollTrigger: {
          trigger: el,
          start: () => "top top-=" + Math.round(window.innerHeight * 2),
          end: () => "+=" + Math.round(window.innerHeight * 0.9),
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener("load", refresh)
      const settle = window.setTimeout(refresh, 2500)

      return () => {
        window.removeEventListener("load", refresh)
        window.clearTimeout(settle)
        hold.kill()
        reveal.scrollTrigger?.kill()
        reveal.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="stats" id="stats" ref={section}>
      <FrameScrub
        /* ?v= is a CACHE BUSTER and it MUST be bumped whenever the frames
           behind it are rebuilt. vercel.json serves /seq/* with
           `max-age=31536000, immutable`, which is a promise that the bytes at
           a URL never change — so replacing the files under the same names
           leaves every browser and the Vercel edge serving last year's copy
           for a year. That is what mixes old and new footage in one scrub:
           some frames come from cache, the rest come fresh. Immutable is the
           right header; changing the URL is how you ship new frames under it. */
        src="/seq/ship/f-{i}.webp?v=2"
        count={151}
        pad={3}
        start={1}
        variant="plain"
        fit="cover"
        height={0.95}
        width={4000}
        borderRadius={0}
        // This one scrub carries BOTH this section and the services section
        // above it. The film is a single continuous ocean-to-cloud take, so
        // there is no second sequence to dissolve into: services underlaps
        // this section and keeps scrubbing the same canvas.
        //
        // The canvas is pinned for scrollLength x 100vh and only travels over
        // the final 100vh, so BOTH sections have to finish inside that pinned
        // range. Services is 430vh and starts 3.4 screens in (see the -530svh
        // in .intro-services), so it ends at 3.4 + 4.3 = 7.7 screens — which is
        // exactly the pin length. Change one of these three numbers and the
        // footage drops out from under services; change all three together.
        // The figure block is pinned until 3.0, just inside the stats share:
        // services arrives as the figures release. (Was 10.4 — the take ran
        // long, with a screen and a half of empty scroll between the figures
        // and the services copy and nearly three more holding the open cards.)
        scrollLength={STATS_RUNWAY_VH}
        frameStart={hold}
        // No easing of its own under Lenis — the scroll is already eased, and a
        // second ease here made the footage trail the copy. See smooth-scroll.ts.
        smooth={hasSmoothScroll() ? 0 : 0.12}
        grain={0}
        vignette={0}
        showCounter={false}
        background="#0A0A09"
        className="fs-fill stats-scrub"
      />

      <div className="stats-overlay">
        <div className="stats-vig-range" aria-hidden="true">
          <div className="stats-vig" />
        </div>

        {/* All four stay together as one block — two left, two right. The
            block scrolls up past the footage, which stays put, and each figure
            fades in on its own as it arrives. */}
        <div className="stats-inner">
          <div className="stats-group" ref={inner}>
          <div className="stats-col">
            {STATS.slice(0, 2).map((s) => <StatCard {...s} key={s.label} />)}
          </div>

          <div className="stats-col stats-col-right">
            {STATS.slice(2).map((s) => <StatCard {...s} align="right" key={s.label} />)}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
