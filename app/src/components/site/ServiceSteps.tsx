import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"

/* Adapted from @reactbits-pro/how-it-works-8: numbered nodes on a rule that
   draws itself in as the row enters. The block ships with three hardcoded
   steps and its own illustrated visuals; here the steps are props and the
   visuals are dropped, because on a service page the chain IS the picture —
   Port, Terminal, Rail, Destination — and an invented illustration beside each
   one would be decoration competing with the photograph already in the
   masthead. Neutral palette swapped for brand tokens. */

const EASE = [0.22, 1, 0.36, 1] as const

export type Step = { title: string; copy: string }

export function ServiceSteps({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  }

  return (
    <motion.ol
      className="svc-steps"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {steps.map((step, i) => {
        /* The rule runs between nodes, not past the ends: the first node opens
           it on the right only and the last closes it on the left only. */
        const seg =
          i === 0 ? "is-first" : i === steps.length - 1 ? "is-last" : "is-mid"
        return (
          <motion.li className={"svc-step " + seg} key={step.title} variants={item}>
            <div className="svc-step-node">
              <span className="svc-step-rule" aria-hidden="true" />
              <motion.span
                className="svc-step-rule svc-step-rule-fill"
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.35, ease: "linear" }}
              />
              <span className="svc-step-n">{i + 1}</span>
            </div>
            <h3 className="svc-step-head">{step.title}</h3>
            <p className="svc-step-body">{step.copy}</p>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
