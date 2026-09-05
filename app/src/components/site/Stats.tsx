import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FrameScrub from "@/components/frame-scrub"

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { figure: "50+", unit: "Years", label: "Of industry experience" },
  { figure: "300", unit: "", label: "Power units across North America" },
  { figure: "800+", unit: "", label: "Chassis in operation" },
  { figure: "24/7/365", unit: "", label: "Service and support" },
]

/* Section 03 — Stats.
   Scrolls up OVER the sticky section above it (higher stacking context,
   opaque backdrop).

   FrameScrub supplies BOTH the ship footage and this section's scroll runway:
   it renders a tall runway with a sticky canvas inside. The figures ride on
   top in an absolute overlay with its own sticky box, so nothing has to nest
   inside FrameScrub's pin.

   The footage enters heavily zoomed — tight on the containers — and pulls
   back to full frame as the section continues. */
export function Stats() {
  const section = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = section.current
    const box = inner.current
    if (!el || !box) return

    // FrameScrub mounts its canvas after its own effect runs
    const canvas = el.querySelector<HTMLCanvasElement>(".stats-scrub canvas")
    if (!canvas) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // enters tight on the cargo, then pulls back to full frame
      const zoom = gsap.fromTo(
        canvas,
        { scale: 2.8, transformOrigin: "50% 50%" },
        {
          scale: 1,
          ease: "power2.out",
          immediateRender: true,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: () => "+=" + el.offsetHeight * 0.6,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

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
        zoom.scrollTrigger?.kill()
        zoom.kill()
        reveal.scrollTrigger?.kill()
        reveal.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="stats" id="stats" ref={section}>
      <FrameScrub
        src="/seq/ship/f-{i}.webp"
        count={91}
        pad={3}
        start={1}
        variant="plain"
        fit="cover"
        height={0.95}
        width={4000}
        borderRadius={0}
        // The clouds section underlaps this one by 200svh, so it begins at
        // (scrollLength - 2) screens. The figure block is pinned until 3.0, so
        // anything under 5.0 lets the clouds copy fade in over the figures.
        scrollLength={4.4}
        smooth={0.12}
        grain={0}
        vignette={0}
        showCounter={false}
        background="#0A0A09"
        className="fs-fill stats-scrub"
      />

      <div className="stats-overlay">
        <div className="stats-scrim" />

        {/* All four stay together as one block — two left, two right. The
            block scrolls up past the footage, which stays put, and each figure
            fades in on its own as it arrives. */}
        <div className="stats-inner">
          <div className="stats-group" ref={inner}>
          <div className="stats-col">
            {STATS.slice(0, 2).map((s) => (
              <div className="stat" key={s.figure}>
                <p className="stat-figure">
                  {s.figure}
                  {s.unit && <span className="stat-unit"> {s.unit}</span>}
                </p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="stats-col stats-col-right">
            {STATS.slice(2).map((s) => (
              <div className="stat" key={s.figure}>
                <p className="stat-figure">
                  {s.figure}
                  {s.unit && <span className="stat-unit"> {s.unit}</span>}
                </p>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
