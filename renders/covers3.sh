#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"

BADGE="Painted flat on a container side on the RIGHT of the frame is the company badge from the attached reference image, reproduced exactly as supplied: a round emblem with a blue globe and faint latitude-longitude grid, an orange city skyline across the upper half, and a stack of multicoloured shipping containers with a yellow reach stacker along the lower half. Across the middle in bold condensed serif capitals is CARMEL in black with a white outline, and directly beneath it TRANSPORT in smaller white capitals. It is flat paint that follows the surface and its perspective, lit by the same light as the rest of the scene, with no glow, no embossing, no reflection and no drop shadow."

# The composition rule, stated hard. The frosted plate covers the left ~80% of
# the band and crops to the vertical middle, so anything centred is lost behind
# it. Everything that matters lives in the right half.
SIDE="COMPOSITION IS CRITICAL: every subject sits in the RIGHT HALF of the frame. The entire LEFT HALF is empty negative space — open sky, flat pale haze or bare road surface — with no vehicle, no container, no crane, no structure and no detail in it at all. The horizon runs low. Think of it as a wide establishing frame with all the action pushed hard to the right edge and clean empty air filling the left, so a white panel can be laid over the left half without covering anything."

NEW="All Carmel equipment is BRAND NEW: flawless glossy yellow-over-blue paint, mirror-polished chrome, spotless glass, brand new tyres, crisp factory-painted container sides. No rust, no corrosion, no faded or chalky paint, no scuffs, no dents, no grime on the Carmel equipment."
NEG="Photorealistic, natural colour, professional transport photography, bright clear daylight, deep blue sky, no people, no faces, no text overlays, no watermark, no duplicate badges, no floating logo, no misspelled text, no garbled letters, no redesigned logo, no different font, no changed logo colours, no warped or blurry logo, no lens flare, no sun star, no HDR, no heavy vignette, no oversaturated grade, no orange-teal grade, no cartoon, no illustration, no painting, no 3D render, no artifacts."

gen () {
  local out="$1"; shift
  local scene="$1"; shift
  local url
  url=$(higgsfield generate create nano_banana_pro --aspect_ratio 16:9 --resolution 2k --wait \
        --image carmel-logo.png \
        --image app/public/img/company/tractor.jpg \
        --prompt "$scene $SIDE $BADGE $NEW $NEG" 2>&1 | tail -1)
  case "$url" in
    https://*) curl -sL "$url" -o "renders/$out.png" && echo "OK   $out" ;;
    *) echo "FAIL $out :: $url" ;;
  esac
}

gen drayage "Photorealistic photograph of a brand-new Carmel semi tractor in yellow-over-blue livery — yellow upper cab, blue lower body, chrome grille, polished aluminium tanks, matching the attached truck reference — hauling a 40-foot shipping container on a chassis along a port access road. The truck is positioned in the right third of the frame, travelling away from camera toward the right edge, with port gantry cranes soft behind it on the right. The left half of the frame is empty road and open pale sky. 35mm lens."

gen refrigerated "Photorealistic photograph of two brand-new white refrigerated shipping containers with spotless stainless Genset power packs standing in a working container yard, positioned in the right third of the frame. Clean power posts and neatly run cabling, crisp vent grilles, faint cold vapour at the vents. The left half of the frame is empty yard apron and open sky with nothing in it. 35mm lens, low angle."

gen intermodal "Photorealistic photograph of a brand-new Carmel tractor in yellow-over-blue livery and container chassis at a rail yard, positioned in the right third of the frame beside intermodal rail cars stacked with mixed-livery ocean containers that recede toward the right edge. The left half of the frame is empty apron and open sky with nothing in it. 35mm lens, low angle."

gen storage "Photorealistic photograph of a secured container storage yard. Stacks of mixed-livery ocean shipping containers four high, and a yellow reach stacker among them, occupy the right third of the frame and recede toward the right edge. The left two-thirds is empty yard apron and open sky with nothing in it at all. 35mm lens, ground level, long shadows."
echo "COVERS3 DONE"
