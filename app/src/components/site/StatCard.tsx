import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

/* One figure on the ship footage. Same dark glass as the service cards
   (.svc-card in brand.css) so the two sequences read as one system: navy tint,
   hairline, backdrop blur. The number is split into a counted part and a
   fixed suffix — Stats.tsx drives the count from the reveal tween, so a card
   never runs its own timer and the count always tracks the fade. */
export type StatSpec = {
  /* numeric part, counted up from 0 */
  value: number
  /* appended after the number, never counted: "+", " Years" */
  suffix?: string
  /* replaces value+suffix outright for figures that are not a number */
  literal?: string
  label: string
  icon: LucideIcon
}

export function StatCard({ value, suffix = "", literal, label, icon: Icon, align = "left" }: StatSpec & { align?: "left" | "right" }): ReactNode {
  return (
    <div className={"stat stat-card" + (align === "right" ? " stat-card-right" : "")}>
      <span className="stat-card-ic" aria-hidden="true">
        <Icon size={20} strokeWidth={2} />
      </span>
      <p className="stat-figure">
        {literal ?? (
          <>
            <span className="stat-n" data-count={value}>{value}</span>
            {suffix && <span className="stat-unit">{suffix}</span>}
          </>
        )}
      </p>
      <p className="stat-label">{label}</p>
    </div>
  )
}
