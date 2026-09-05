/* The React Bits registry ships ScrollReveal as untyped .jsx.
   Types declared here so the component keeps its real prop contract. */
import type { ReactNode, RefObject } from "react"

declare const ScrollReveal: (props: {
  children: ReactNode
  scrollContainerRef?: RefObject<HTMLElement | null>
  triggerRef?: RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}) => JSX.Element

export default ScrollReveal
