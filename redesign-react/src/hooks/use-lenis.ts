import { useEffect, useSyncExternalStore } from "react";
import Lenis from "lenis";

/* ------------------------------------------------------------------ *
 * Scroll position store.
 *
 * Lenis emits no native `scroll` events, so window scroll listeners and
 * IntersectionObserver sentinels never fire. Lenis's own event is the one
 * reliable signal, so we publish from there and let components subscribe.
 * ------------------------------------------------------------------ */

let scrollPos = 0;
const listeners = new Set<() => void>();

function publish(y: number) {
  if (y === scrollPos) return;
  scrollPos = y;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Current scroll offset, kept in step with Lenis. */
export function useScrollY() {
  return useSyncExternalStore(
    subscribe,
    () => scrollPos,
    () => 0,
  );
}

/** True once scrolled past `threshold`. */
export function useScrolledPast(threshold = 24) {
  return useScrollY() > threshold;
}

/**
 * Momentum scrolling.
 * Skipped entirely under prefers-reduced-motion — hijacking the scroll is
 * exactly the kind of motion that setting exists to switch off.
 */
export function useLenis() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Without Lenis nothing publishes, so fall back to native scroll events.
    if (reduced.matches) {
      const onScroll = () => publish(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    });

    lenis.on("scroll", ({ scroll }: { scroll: number }) => publish(scroll));
    publish(window.scrollY);

    if (import.meta.env.DEV) {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

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
