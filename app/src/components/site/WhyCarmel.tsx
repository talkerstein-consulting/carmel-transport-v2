import { motion } from "motion/react"
import type { LucideIcon } from "lucide-react"

/* Adapted from @reactbits-pro/features-9. That block is a persona switcher —
   five tabs, each swapping a panel of sub-features — and "Why Carmel" is four
   flat statements with no second level to reveal, so the tab interaction is
   dropped and its visual language kept: the round icon tile, the tight title,
   the grid. Putting four static points behind a tab would hide three of them
   to no purpose. Neutral palette swapped for brand tokens, icons are lucide. */

const EASE = [0.22, 1, 0.36, 1] as const

export type Reason = { head: string; body: string; icon: LucideIcon }

export function WhyCarmel({ reasons }: { reasons: Reason[] }) {
  return (
    <ul className="why-grid">
      {reasons.map((r, i) => {
        const Icon = r.icon
        return (
          <motion.li
            className="why-item"
            key={r.head}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
          >
            <span className="why-ic" aria-hidden="true">
              <Icon size={20} strokeWidth={2} />
            </span>
            <h3 className="why-head">{r.head}</h3>
            <p className="why-body">{r.body}</p>
          </motion.li>
        )
      })}
    </ul>
  )
}
