import { useEffect, useRef, useState } from "react"

/* Act one, drawn instead of filmed (the scene lives in truck-world.ts).

   Same contract as the FrameScrub it replaces -- a runway section with a
   sticky box inside -- so Stage's wipe (".stage-scrub > div > div") and the
   .fs-fill overrides apply unchanged.

   LOADING. The footage was 151 WebP frames, ~11MB, and nothing showed until
   enough of them arrived. Here the page paints a paper-coloured box at once
   and three.js plus the scene (~136KB gzipped, no models, one 12KB badge)
   are a separate chunk, requested as soon as this module loads.
   The canvas fades in on its first rendered frame. */

const PAPER = "#F7F9FC"

// Start fetching the scene chunk the moment this module evaluates, not when
// the component mounts and its effect finally runs -- the download overlaps
// React's first render and the preloader instead of following them.
const world = import("./truck-world")

interface Props {
  scrollLength: number
  frameSpan: number
  className?: string
}

export function TruckScene({ scrollLength, frameSpan, className }: Props) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const spanRef = useRef(frameSpan)
  spanRef.current = frameSpan
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = root.current, cv = canvas.current
    if (!el || !cv) return
    let dispose: (() => void) | undefined
    let dead = false

    // Shot progress: the runway's scroll fraction, finished at frameSpan.
    const getS = () => {
      const b = el.getBoundingClientRect()
      const span = b.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -b.top / span)) : 0
      return Math.min(1, p / Math.max(0.05, spanRef.current))
    }

    world.then(async ({ mountTruckWorld }) => {
      if (dead) return
      const unmount = mountTruckWorld(cv, getS)
      dispose = unmount
      await unmount.ready
      if (dead) return
      setReady(true)
      // The preloader holds the navy screen until the hero reports ready, and
      // it listens for FrameScrub's event by source. Without this it sat out
      // its full 7s cap on every load, waiting for footage that is not used.
      window.dispatchEvent(new CustomEvent("framescrub:progress", {
        detail: { src: "/seq/hero/f-{i}.webp?v=6", ready: 1 },
      }))
    })
    return () => { dead = true; dispose?.() }
  }, [])

  return (
    <section
      ref={root}
      aria-hidden="true"
      className={"relative w-full " + (className ?? "")}
      style={{ height: `${100 + scrollLength * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full overflow-hidden" style={{ height: "100svh", backgroundColor: PAPER }}>
          <canvas
            ref={canvas}
            className="block h-full w-full"
            style={{ opacity: ready ? 1 : 0, transition: "opacity .6s ease" }}
          />
        </div>
      </div>
    </section>
  )
}
