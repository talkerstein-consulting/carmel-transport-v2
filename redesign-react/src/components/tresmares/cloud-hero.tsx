"use client";

import { motion } from "motion/react";
import SpectralClouds from "@/components/spectral-clouds";
import { SplitWords } from "./split-words";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Hero: photo underneath, volumetric cloud shader on top.
 *
 * SpectralClouds ships tuned as a purple nebula on near-black. Everything in
 * the CLOUD_TUNING block below is what turns it into weather:
 *   - backgroundColor "transparent" so the photo shows through at all
 *   - spectrum 0 kills the rainbow banding, which is the single biggest
 *     giveaway that you are looking at a shader and not a sky
 *   - white + cool grey highlight instead of lavender/fuchsia
 *   - higher passthrough and softness so the mass reads as vapour with the
 *     image visible through the thin parts
 */
const CLOUD_TUNING = {
  speed: 0.55,
  steps: 48,
  octaves: 5,
  thickness: 0.34,
  softness: 0.022,
  passthrough: 0.28,
  sky: 5,
  reach: 3.4,
  density: 1.55,
  spectrum: 0,
  colorWave: 0,
  colorTwist: 0,
  color: "#ffffff",
  highlightColor: "#e6eef8",
  bloom: 0.2,
  bloomPower: 2.4,
  grain: 0.02,
  vignette: 0.18,
  backgroundColor: "transparent",
  cursorInteraction: true,
  cursorSteer: 0.06,
  dpr: 1,
} as const;

export function CloudHero({
  /** The photo under the clouds. Swap for whichever image you meant. */
  image = "/img/slider.jpg",
  /** How strongly the clouds sit over the photo. */
  cloudOpacity = 0.85,
}: {
  image?: string;
  cloudOpacity?: number;
}) {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-center overflow-hidden"
    >
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      <SpectralClouds
        {...CLOUD_TUNING}
        opacity={cloudOpacity}
        className="absolute inset-0 -z-10 h-full w-full"
      />

      {/* Readability: the clouds alone don't guarantee contrast for the type,
          and the photo underneath changes. This does. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(14,27,46,0.62)_0%,rgba(14,27,46,0.26)_38%,rgba(14,27,46,0)_70%)]"
      />
      {/* and a bottom fade so the next section has something to blend into */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[32vh] bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.35)_45%,rgba(255,255,255,0.85)_80%,#fff_100%)]"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SplitWords
          as="h1"
          immediate
          text="MOVE FREIGHT FORWARD"
          accent={["FORWARD"]}
          stagger={0.08}
          className="max-w-[14ch] font-display text-[2.9rem] font-bold leading-[0.98] tracking-[-0.01em] text-white drop-shadow-[0_2px_24px_rgba(14,27,46,0.45)] sm:text-[4.5rem] lg:text-[6rem]"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          className="mt-9 max-w-xl text-[1.02rem] leading-relaxed text-white/85"
        >
          From port to destination, Carmel delivers reliable drayage, intermodal
          transportation, refrigerated logistics, and storage solutions built
          around your business.
        </motion.p>
      </div>
    </section>
  );
}

export default CloudHero;
