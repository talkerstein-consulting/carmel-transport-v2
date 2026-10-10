/* The site's rounded corners are CSS `corner-shape: superellipse(2.6)` on top
   of a border-radius. A superellipse(K) corner is the curve |x|^n + |y|^n = 1
   with n = 2^K, so K = 1 is an ordinary round corner and 2.6 is the squircle
   the cards and the nav pill use. Where corner-shape is unsupported the
   browser draws round corners, so callers ask cornerK() rather than assuming
   2.6 -- anything that has to line up with those corners stays matched
   either way. */
export const SITE_CORNER_K = 2.6

export const cornerK = () =>
  typeof CSS !== "undefined" && CSS.supports?.("corner-shape", `superellipse(${SITE_CORNER_K})`)
    ? SITE_CORNER_K
    : 1

/* SVG path of a w x h box with radius r and superellipse(K) corners, inset by
   `o` so a stroke can sit on the box's own outline. Starts just right of the
   top-left corner and runs clockwise (screen coordinates, y down). */
export function squirclePath(w: number, h: number, r: number, k = cornerK(), o = 1, steps = 14) {
  const e = 2 / Math.pow(2, k)
  const f = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), e)
  const x0 = o, y0 = o, x1 = w - o, y1 = h - o
  const R = Math.max(0, Math.min(r - o, (x1 - x0) / 2, (y1 - y0) / 2))

  // One corner, swept from angle t0 to t1 (degrees) about its centre.
  const corner = (cx: number, cy: number, t0: number, t1: number) => {
    let d = ""
    for (let i = 0; i <= steps; i++) {
      const t = ((t0 + ((t1 - t0) * i) / steps) * Math.PI) / 180
      d += `L${(cx + R * f(Math.cos(t))).toFixed(2)} ${(cy - R * f(Math.sin(t))).toFixed(2)}`
    }
    return d
  }

  return (
    `M${(x0 + R).toFixed(2)} ${y0.toFixed(2)}` +
    corner(x1 - R, y0 + R, 90, 0) +     // top edge, then top-right
    corner(x1 - R, y1 - R, 0, -90) +    // right edge, then bottom-right
    corner(x0 + R, y1 - R, -90, -180) + // bottom edge, then bottom-left
    corner(x0 + R, y0 + R, 180, 90) +   // left edge, then top-left
    "Z"
  )
}
