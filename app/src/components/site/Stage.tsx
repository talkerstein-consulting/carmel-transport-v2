import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import FrameScrub from "@/components/frame-scrub"
import { hasSmoothScroll } from "@/lib/smooth-scroll"

gsap.registerPlugin(ScrollTrigger)

/* Background stage.
   FrameScrub advances a pre-rendered WebP frame sequence with scroll. The
   frames are built at deploy time (see scripts/build-frames.sh) rather than
   decoded from an MP4 in the browser: that removes ~400MB of canvas memory
   per instance and the several-second black gap while it sampled.

   It renders its own runway with a sticky canvas inside, so this wrapper is
   ABSOLUTE, not fixed: a fixed element's rect never changes as you scroll,
   which would freeze the component's progress.

   HOW ACT ONE ENDS. The footage is WIPED away, not scrolled away: the canvas
   stays pinned and its bottom edge travels up, uncovering the ship that has
   been sitting underneath the whole time.

   That needs two things to happen at different moments, which is why
   scrollLength and frameSpan are not the same number:

     - the FRAMES must run out at 1.9vh, the instant the intro copy unpins and
       starts moving up (measured: the copy holds at innerTop 0 until 2388px
       on a 1257px viewport, then tracks scroll 1:1). That is frameSpan.
     - the CANVAS must stay pinned past that point, or it would scroll away
       instead of being wiped. A sticky canvas unpins at scrollLength * 100vh,
       so the runway has to outlast the wipe. That is scrollLength.

   The span is therefore MEASURED, not written down. The intro is 190svh wide
   and 170svh at the 900px breakpoint, so a hardcoded 1.9/2.9 was right on a
   desktop and wrong on a phone — the wipe was a fifth of the way through
   before the footage had finished. Deriving it from the section's real height
   keeps the two honest at every width. */
const STAGE_RUNWAY_VH = 2.9

export function Stage() {
  const stage = useRef<HTMLDivElement>(null)

  // Fraction of the runway the frames get. The copy unpins one viewport before
  // the intro section's bottom, and the scrub's own progress runs over
  // STAGE_RUNWAY_VH screens, so the release lands at that ratio. Remeasured on
  // resize because the intro's height is a breakpoint away from changing.
  const [span, setSpan] = useState(1.9 / STAGE_RUNWAY_VH)

  /* MATCH CUT into the ship, measured per viewport rather than written down.
     The truck's container sits at 51.76% of frame width on the last hero
     frame; the Carmel container on the ship's deck sits at 46.37% and holds
     there through the handoff. That gap is a fraction of the DRAWN frame,
     and the drawn frame is wider than the viewport by whatever the cover
     crop overshoots -- so the pan expressed as a fraction of the viewport
     changes with the aspect ratio, and a single number was only right on the
     screen it was measured on. Worse, on a 16:9 screen the crop has no slack
     at all and the pan clamped to nothing: the truck sat 5% right of the ship
     at 1440p. So: compute the pan in pixels from the real draw size, and ask
     for just enough overscan that the crop has room to carry it. The +0.8%
     is the deliberate nudge right that was asked for (2% of the drawn frame,
     about 29px at 1440p), not a measurement. */
  const [cut, setCut] = useState({ offsetX: -0.0459, overscan: 1 })
  useLayoutEffect(() => {
    const FRAME_W = 1920, FRAME_H = 1080
    const TRUCK_X = 0.5176, SHIP_X = 0.4637, NUDGE = 0.02
    const read = () => {
      const cw = window.innerWidth, ch = window.innerHeight
      if (cw < 1 || ch < 1) return
      const dw = FRAME_W * Math.max(cw / FRAME_W, ch / FRAME_H)
      const pan = (SHIP_X - TRUCK_X + NUDGE) * dw
      const overscan = Math.max(1, (cw + 2 * Math.abs(pan)) / dw)
      setCut({ offsetX: pan / cw, overscan })
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  useLayoutEffect(() => {
    const read = () => {
      const copy = document.querySelector<HTMLElement>(".reveal")
      const vh = window.innerHeight
      if (!copy || vh < 1) return
      const bottom = copy.getBoundingClientRect().bottom + window.scrollY
      const next = (bottom - vh) / (STAGE_RUNWAY_VH * vh)
      if (Number.isFinite(next) && next > 0.05 && next <= 1) {
        setSpan((prev) => (Math.abs(prev - next) > 0.002 ? next : prev))
      }
    }
    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  useEffect(() => {
    const el = stage.current
    // The intro copy. Its sticky release is what the wipe is timed to, so it
    // is the trigger rather than anything belonging to the stage itself.
    const copy = document.querySelector<HTMLElement>(".reveal")
    if (!el || !copy) return

    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The pinned box, not the wrapper: the wrapper spans the whole runway,
      // so a percentage inset on it would not read as a viewport-height wipe.
      const pinned = el.querySelector<HTMLElement>(".stage-scrub > div > div")
      if (!pinned) return

      // "bottom bottom" on the intro section fires exactly where its sticky
      // inner lets go — the frame the paragraph starts moving. The wipe then
      // runs over one viewport, which is the distance the copy travels to
      // clear the screen, so the two finish together.
      const wipe = gsap.fromTo(
        pinned,
        { clipPath: "inset(0% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 100% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: copy,
            start: () => "bottom bottom",
            end: () => "+=" + window.innerHeight,
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
        src="/seq/hero/f-{i}.webp?v=5"
        count={151}
        pad={3}
        start={1}
        variant="plain"
        fit="cover"
        /* see `cut` above */
        offsetX={cut.offsetX}
        overscan={cut.overscan}
        offsetXRamp={0.25}
        height={0.95}
        width={4000}
        borderRadius={0}
        /* See the note above — these two are a pair, not duplicates. */
        scrollLength={STAGE_RUNWAY_VH}
        frameSpan={span}
        // No easing of its own under Lenis — the scroll is already eased, and a
        // second ease here made the footage trail the copy. See smooth-scroll.ts.
        smooth={hasSmoothScroll() ? 0 : 0.12}
        grain={0}
        vignette={0}
        showCounter={false}
        background="#F7F7F6"
        className="fs-fill stage-scrub"
      />
    </div>
  )
}
