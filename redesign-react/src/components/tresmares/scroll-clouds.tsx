"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-driven cloud parallax — the Tresmares `#cloudsea-webgl` idea without
 * the WebGL.
 *
 * Tresmares builds 74 individual cloud sprites in Three.js and ramps every
 * property (z, y, scale, drift speed, tint) off a single `depth` value. This
 * does the same ramp with four repeating background layers, which costs one
 * composited paint instead of a render loop over 74 meshes.
 *
 * The backdrop is fixed, so it never scrolls — only the bands slide sideways,
 * further for the near layers than the far ones. Page content scrolls over it
 * normally.
 *
 * Tiles are seamless in x (generated on a cylinder — see tools/make_clouds.py),
 * which is what makes `repeat-x` safe. Swap in photographic clouds and the seam
 * comes back unless they are tiled the same way.
 */

/**
 * depth 0 = far. Every value is a lerp off that one number: far clouds are
 * smaller, higher, slower and darker; near clouds are bigger, lower, faster
 * and pure white. Sizes are in vw/vh so the field stays full bleed on any
 * monitor instead of shrinking to a strip.
 */
const LAYERS = [
  { src: "cloud-back",  top: "8%",  h: "26vh", tile: "62vw",  speed: 0.06, opacity: 0.55, bright: 0.86 },
  { src: "cloud-mid",   top: "24%", h: "36vh", tile: "96vw",  speed: 0.16, opacity: 0.7,  bright: 0.93 },
  { src: "cloud-front", top: "42%", h: "50vh", tile: "140vw", speed: 0.34, opacity: 0.88, bright: 1 },
  { src: "cloud-front", top: "60%", h: "66vh", tile: "190vw", speed: 0.62, opacity: 1,    bright: 1 },
];

/** Clouds thin out toward the bottom of the screen, so whatever scrolls up
 *  into that zone meets haze rather than a hard edge. */
const BOTTOM_FADE =
  "linear-gradient(to bottom,#000 0%,#000 52%,transparent 96%)";

export function ScrollClouds({
  /** Viewports over which the whole field fades out. >1 leaves the field
   *  faintly present behind the next section — that overlap is the blend. */
  fadeViewports = 2,
}: {
  fadeViewports?: number;
}) {
  const skyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sky = skyRef.current;
    if (!sky) return;

    const apply = (v: number) => {
      sky.style.setProperty("--s", v.toFixed(2));
      const fade = window.innerHeight * fadeViewports;
      sky.style.opacity = Math.max(0, 1 - v / fade).toFixed(3);
    };

    // Reduced motion: track scroll exactly, no easing, no rAF loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const onScroll = () => apply(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    // Ease toward the real scroll position so the drift keeps gliding for a
    // beat after the wheel stops instead of dying with it. Lenis already
    // smooths the page; this is a second, slower follow on top of that.
    let target = window.scrollY;
    let current = target;
    let frame = 0;
    let running = false;

    const tick = () => {
      current += (target - current) * 0.08;
      apply(current);
      if (Math.abs(target - current) > 0.1) {
        frame = requestAnimationFrame(tick);
      } else {
        apply(target);
        running = false;
      }
    };

    const onScroll = () => {
      target = window.scrollY;
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    apply(current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [fadeViewports]);

  return (
    <div
      ref={skyRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden bg-[linear-gradient(#b9cfe6_0%,#d5e3f1_40%,#eef4fa_72%,#fff_100%)]"
      style={{ maskImage: BOTTOM_FADE, WebkitMaskImage: BOTTOM_FADE }}
    >
      {LAYERS.map((l, i) => (
        <div
          key={i}
          /* wider than the viewport so no edge is ever visible */
          className="absolute -left-[2vw] w-[104vw] bg-repeat-x will-change-[background-position]"
          style={{
            top: l.top,
            height: l.h,
            backgroundImage: `url(/img/clouds/${l.src}.png)`,
            backgroundSize: `${l.tile} auto`,
            // the parallax: near layers travel further per pixel scrolled
            backgroundPositionX: `calc(var(--s, 0) * ${-l.speed}px)`,
            opacity: l.opacity,
            filter: l.bright === 1 ? undefined : `brightness(${l.bright})`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Wrap the first section BELOW the hero in this. Its top is fully transparent
 * and only reaches solid white well down its own height, so the cloud field
 * shows through the top edge and the two never meet at a visible line.
 */
export function CloudBlendSection({
  children,
  className = "",
  ...rest
}: React.ComponentProps<"section"> & { children: ReactNode }) {
  return (
    <section
      {...rest}
      className={`relative bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0,rgba(255,255,255,0.65)_22vh,#fff_55vh)] pt-[26vh] ${className}`}
    >
      {children}
    </section>
  );
}

export default ScrollClouds;
