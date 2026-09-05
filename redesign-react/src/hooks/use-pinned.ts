import { useReducedMotion } from "motion/react";

/**
 * Whether a section may pin and convert page scroll into horizontal motion.
 *
 * Only reduced-motion opts out. Width is deliberately NOT a gate — the
 * horizontal sweep is wanted on phones too.
 */
export function usePinned() {
  const reduceMotion = useReducedMotion();
  return !reduceMotion;
}

export default usePinned;
