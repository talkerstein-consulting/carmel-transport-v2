import { useEffect, useRef, useState } from "react"

/* Act two, drawn (the scene lives in ship-world.ts). A drop-in for the ship
   FrameScrub in Stats: a runway section with a sticky canvas, so the stats
   pin, the services underlap and the cloud veil all keep working.

   frameStart holds the opening frame for that fraction of the runway (the
   phone wipe timing, measured in Stats). The scene module is shared with the
   truck's chunk, so it is usually already downloaded by the time this runs. */

const world = import("./ship-world")

interface Props {
  scrollLength: number
  frameStart?: number
  className?: string
}

export function ShipScene({ scrollLength, frameStart = 0, className }: Props) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const holdRef = useRef(frameStart)
  holdRef.current = frameStart
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = root.current, cv = canvas.current
    if (!el || !cv) return
    let dispose: (() => void) | undefined
    let dead = false

    const getS = () => {
      const b = el.getBoundingClientRect()
      const span = b.height - window.innerHeight
      const p = span > 0 ? Math.min(1, Math.max(0, -b.top / span)) : 0
      const hold = Math.min(0.9, Math.max(0, holdRef.current))
      return Math.max(0, (p - hold) / (1 - hold))
    }

    world.then(async ({ mountShipWorld }) => {
      if (dead) return
      // Haze by where the next section actually is: fully flat by the time
      // .act-three's top reaches the bottom of the screen, ramping in over the
      // 0.6 screens before. Independent of how tall services is on a device.
      const getHaze = () => {
        const next = document.querySelector<HTMLElement>(".act-three")
        if (!next) return null
        const vh = window.innerHeight, top = next.getBoundingClientRect().top
        const t = Math.min(1, Math.max(0, (1.6 * vh - top) / (0.6 * vh)))
        return t * t * (3 - 2 * t)
      }
      const unmount = mountShipWorld(cv, getS, getHaze)
      dispose = unmount
      await unmount.ready
      if (!dead) setReady(true)
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
        <div className="relative w-full overflow-hidden" style={{ height: "100lvh", backgroundColor: "#F7F9FC" }}>
          <canvas
            ref={canvas}
            className="block h-full w-full"
            style={{ opacity: ready ? 1 : 0, transition: "opacity .4s ease" }}
          />
        </div>
      </div>
    </section>
  )
}
