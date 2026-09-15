import { useRef, type MouseEvent } from "react"
import MetallicPaint from "@/components/MetallicPaint"
import "./tcg-badge.css"

/**
 * Static: ITC Cheltenham Bold Condensed caps, filled with the brand colour of the
 * surrounding context (`color` on any ancestor, or --tcg-brand).
 * Hover: a hairline frame draws itself around the text (top/bottom from the
 * centre, sides drop, corner dots blink), then react-bits MetallicPaint steel
 * pours in from the hairline to the centre and the letters sink to engraved.
 */
const HREF = "https://talkerstein.ca"
const SEQUENCE_MS = 750 // --t1 + --t2 + --t3 + a beat; keep in sync with footer.css

export function TcgBadge() {
  const ref = useRef<HTMLAnchorElement>(null)
  const armed = useRef(false)

  // Touch devices have no hover: first tap plays the sequence, then follows the link.
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: none)").matches || armed.current) return
    e.preventDefault()
    armed.current = true
    ref.current?.classList.add("is-active")
    window.setTimeout(() => { window.location.href = HREF }, SEQUENCE_MS)
  }

  return (
    <footer className="tcg-footer">
      <a ref={ref} className="tcg-plaque" href={HREF} onClick={onClick} aria-label="Handcrafted by Talkerstein Consulting Group">
        <span className="tcg-metal" aria-hidden="true">
          <span className="tcg-metal-canvas">
            <MetallicPaint
              imageSrc="/plate-mask.svg"
              seed={5} scale={2.4} refraction={0.008} blur={0.03}
              liquid={0.08} speed={0.06}                /* slow, steady drift */
              brightness={1.8} contrast={0.5} angle={90} fresnel={1.2}
              lightColor="#d7dbe0" darkColor="#343a42" tintColor="#9aa3ad"
              patternSharpness={0.5} waveAmplitude={0.15} noiseScale={0.3}
              chromaticSpread={0.3} distortion={0.05} contour={0.55}
              mouseAnimation={false}                     /* cursor no longer scrubs the pattern */
            />
          </span>
        </span>
        <i className="tcg-line tcg-line-top" /><i className="tcg-line tcg-line-bottom" />
        <i className="tcg-line tcg-line-left" /><i className="tcg-line tcg-line-right" />
        <i className="tcg-dot tcg-dot-tl" /><i className="tcg-dot tcg-dot-tr" /><i className="tcg-dot tcg-dot-bl" /><i className="tcg-dot tcg-dot-br" />
        <span className="tcg-text" aria-hidden="true" />
      </a>
    </footer>
  )
}
