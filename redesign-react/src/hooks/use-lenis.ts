import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling.
 * Skipped entirely under prefers-reduced-motion — hijacking the scroll is
 * exactly the kind of motion that setting exists to switch off.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // leave touch alone: native momentum is better than anything we'd fake
      touchMultiplier: 1,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // in-page anchors have to go through Lenis or they fight it
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };
    document.addEventListener("click", onClick);

    // the footer's back-to-top button dispatches this
    const toTop = () => lenis.scrollTo(0);
    window.addEventListener("carmel:scroll-top", toTop);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("carmel:scroll-top", toTop);
      lenis.destroy();
    };
  }, []);
}

export default useLenis;
