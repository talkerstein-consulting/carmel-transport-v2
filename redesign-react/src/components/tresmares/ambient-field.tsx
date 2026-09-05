"use client";

import { Warp } from "@paper-design/shaders-react";
import { useReducedMotion } from "motion/react";

/**
 * Tresmares' `#cloudsea-webgl`: one fixed shader plane behind the whole
 * opening sequence, so the sections read as depth changes rather than hard
 * cuts, and a page that is mostly type is never actually still.
 *
 * They spend Three.js on it; the Warp shader already in this project gets us
 * the same drifting-field effect for none of the extra bundle.
 *
 * Very low opacity on purpose — if you can point at it, it is too strong.
 */
export function AmbientField() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 select-none"
    >
      <Warp
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
        colors={["#FFFFFF", "#EAF1FA", "#F4F6F9", "#FFF6DE"]}
        proportion={0.42}
        softness={1}
        distortion={0.22}
        swirl={0.62}
        swirlIterations={8}
        shape="edge"
        shapeScale={0.08}
        rotation={0.4}
        scale={1.5}
        speed={reduceMotion ? 0 : 0.18}
      />
      {/* keeps the middle of the page calm enough to read over */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.45)_55%,rgba(255,255,255,0.8)_100%)]" />
    </div>
  );
}

export default AmbientField;
