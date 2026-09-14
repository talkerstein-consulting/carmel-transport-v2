import type { MouseEvent, ReactNode } from "react"
import "./cta.css"

function Chevron() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  )
}

/* Primary CTA. Navy pill, icon tile on the left with the chevrons rolling
   through it, label to the right. On hover the tile snaps across the pill and
   the label re-enters in navy from the left.
   tone="paper" (default) keeps the tile light; tone="accent" paints it orange.
   variant="outline" drops the fill for a hairline outline, for use over
   footage where a solid navy slab would punch a hole in the picture.
   live=true runs the chevron; everything but the hero stays static.
   dir="down" turns the chevron into a scroll cue and drops it through the tile.
   size="sm" for cards and the nav.
   type="submit" renders a real <button> for forms; otherwise it is a link. */
export function Cta({
  children, href, tone = "paper", size = "md", variant = "solid",
  dir = "right", live = false, className = "", onClick, type,
}: {
  children: ReactNode; href?: string
  tone?: "accent" | "paper"; size?: "md" | "sm"
  variant?: "solid" | "outline"; dir?: "right" | "down"
  live?: boolean; className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  type?: "submit" | "button"
}) {
  const cls = [
    "cta-btn", `cta-btn-${tone}`, `cta-btn-${size}`,
    variant === "outline" ? "cta-btn-outline" : "",
    dir === "down" ? "cta-btn-down" : "",
    live ? "cta-btn-live" : "", className,
  ].filter(Boolean).join(" ")

  const inner = (
    <>
      <span className="cta-btn-spacer" aria-hidden="true" />
      <span className="cta-btn-tile" aria-hidden="true">
        <span className="cta-btn-tile-label">{children}</span>
        <span className="cta-btn-ic"><Chevron /></span>
      </span>
      <span className="cta-btn-label">{children}</span>
    </>
  )

  if (type) {
    return <button type={type} className={cls} onClick={onClick as unknown as (e: MouseEvent<HTMLButtonElement>) => void}>{inner}</button>
  }
  return <a href={href} className={cls} onClick={onClick}>{inner}</a>
}
