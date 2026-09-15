import { useEffect, useRef } from "react"

/* The cover behind an interior masthead, with the frosting for the plate
   baked in. The plate used to carry backdrop-filter, and Chrome renders a
   backdrop only for the part of the viewport it can see: once the plate's
   top scrolled off, the blur at the viewport edge sampled clamped pixels and
   drew a band across the plate — with the nav bar printed into it, since the
   bar was what sat at that edge. So the blur is done on the picture instead:
   a second copy of the cover, blurred, clipped to exactly the plate's box.
   The clip is measured, not styled, because the plate is laid out by the
   band's grid and the picture is not. */
export function PlateBg({ src }: { src: string }) {
  const bg = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bg.current
    const band = el?.parentElement
    const plate = band?.querySelector<HTMLElement>(".ph-plate")
    if (!el || !band || !plate) return

    /* Layout geometry, not getBoundingClientRect: the page enters under a
       transform (and the plate rises under another), and a rect read
       mid-animation is a few pixels off from where the plate settles. */
    const offset = (node: HTMLElement) => {
      let x = 0, y = 0
      for (let n: HTMLElement | null = node; n && n !== band; n = n.offsetParent as HTMLElement | null) {
        x += n.offsetLeft; y += n.offsetTop
      }
      return { x, y }
    }
    const measure = () => {
      const { x, y } = offset(plate)
      const s = el.style
      s.setProperty("--frost-t", `${y}px`)
      s.setProperty("--frost-r", `${band.clientWidth - x - plate.offsetWidth}px`)
      s.setProperty("--frost-b", `${band.clientHeight - y - plate.offsetHeight}px`)
      s.setProperty("--frost-l", `${x}px`)
      s.setProperty("--frost-radius", getComputedStyle(plate).borderRadius)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(band)
    ro.observe(plate)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="ph-bg" aria-hidden="true" ref={bg}>
      <img src={src} alt="" decoding="async" />
      <img className="ph-bg-frost" src={src} alt="" decoding="async" />
    </div>
  )
}
