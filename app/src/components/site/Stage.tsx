import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FrameScrub from "@/components/frame-scrub"

gsap.registerPlugin(ScrollTrigger)

/* Background stage.
   FrameScrub advances a pre-rendered WebP frame sequence with scroll. The
   frames are built at deploy time (see scripts/build-frames.sh) rather than
   decoded from an MP4 in the browser: that removes ~400MB of canvas memory
   per instance and the several-second black gap while it sampled.

   It renders its own runway with a sticky canvas inside, so this wrapper is
   ABSOLUTE, not fixed: a fixed element's rect never changes as you scroll,
   which would freeze the component's progress. */
export function Stage() {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stage.current
    // Anchor on the end of act one, not on the ship section: that section now
    // carries a -100svh margin, so its own top sits a screen and a half early.
    const actOneEnd = document.querySelector<HTMLElement>(".reveal")
    if (!el || !actOneEnd) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The pinned box, not the wrapper: the wrapper spans the whole runway,
      // so a percentage inset on it would not read as a viewport-height wipe.
      const pinned = el.querySelector<HTMLElement>(".stage-scrub > div > div")
      if (!pinned) return

      // The bottom edge travels upward and takes act one with it. The ship has
      // been sitting underneath the whole time, so this uncovers it rather
      // than sliding anything over it.
      const wipe = gsap.fromTo(
        pinned,
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 100% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: actOneEnd,
            start: "bottom bottom",
            end: () => "+=" + window.innerHeight * 0.9,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      )

      return () => { wipe.scrollTrigger?.kill(); wipe.kill() }
    })

    return () => mm.revert()
  }, [])

  return (
    <div className="stage" aria-hidden="true" ref={stage}>
      <FrameScrub
        /* ?v= is a CACHE BUSTER and it MUST be bumped whenever the frames
           behind it are rebuilt. vercel.json serves /seq/* with
           `max-age=31536000, immutable`, which is a promise that the bytes at
           a URL never change — so replacing the files under the same names
           leaves every browser and the Vercel edge serving last year's copy
           for a year. That is what mixes old and new footage in one scrub:
           some frames come from cache, the rest come fresh. Immutable is the
           right header; changing the URL is how you ship new frames under it. */
        src="/seq/hero/f-{i}.webp?v=2"
        count={76}
        pad={3}
        start={1}
        variant="plain"
        fit="cover"
        height={0.95}
        width={4000}
        borderRadius={0}
        scrollLength={1.9}
        smooth={0.12}
        grain={0}
        vignette={0}
        showCounter={false}
        background="#F7F7F6"
        className="fs-fill stage-scrub"
      />
    </div>
  )
}
