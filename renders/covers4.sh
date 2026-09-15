#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"

# The plate covers the left 81% of the band. A badge at 85% lands on its edge
# and gets frosted over, which is what happened last pass. It has to sit in the
# far right sliver, clear of everything.
BADGE="CRITICAL — THE COMPANY BADGE: painted flat on a container side in the FAR RIGHT of the frame, its centre roughly 90 percent of the way across the image from the left edge, at mid height. It must be COMPLETELY UNOBSTRUCTED: nothing overlaps it, no other container, no chassis, no crane leg, no post and no shadow falls across it, and it is not cut off by the right edge of the frame — the whole circle is inside the picture with clear space around it. Reproduce it exactly as supplied in the attached reference image: a round emblem with a blue globe and faint latitude-longitude grid, an orange city skyline across the upper half, and a stack of multicoloured shipping containers with a yellow reach stacker along the lower half. Across the middle in bold condensed serif capitals is CARMEL in black with a white outline, and directly beneath it TRANSPORT in smaller white capitals. It is flat paint that follows the surface and its perspective, lit by the same light as the rest of the scene, with no glow, no embossing, no reflection and no drop shadow. Exactly ONE badge in the frame."

SIDE="COMPOSITION: the left 60 percent of the frame is empty negative space — open sky, flat pale haze or bare road surface — with no vehicle, no container, no crane, no structure and no detail in it at all. All subjects sit in the right 40 percent. The horizon runs low."

NEW="All Carmel equipment is BRAND NEW: flawless glossy yellow-over-blue paint, mirror-polished chrome, spotless glass, brand new tyres, crisp factory-painted container sides. No rust, no corrosion, no faded or chalky paint, no scuffs, no dents, no grime on the Carmel equipment."
NEG="Photorealistic, natural colour, professional transport photography, bright clear daylight, deep blue sky, no people, no faces, no text overlays, no watermark, no duplicate badges, no second logo, no floating logo, no badge cropped by the frame edge, no object in front of the badge, no misspelled text, no garbled letters, no redesigned logo, no different font, no changed logo colours, no warped or blurry logo, no lens flare, no sun star, no HDR, no heavy vignette, no oversaturated grade, no orange-teal grade, no cartoon, no illustration, no painting, no 3D render, no artifacts."

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

gen drayage "Photorealistic photograph of a brand-new Carmel semi tractor in yellow-over-blue livery — yellow upper cab, blue lower body, chrome grille, polished aluminium tanks, matching the attached truck reference — hauling a 40-foot shipping container on a chassis along a port access road, seen side-on from the left so the full length of the container side faces the camera. The tractor sits around the middle-right and the container runs to the right edge, carrying the badge on its rear half. Port gantry cranes soft in the distance. 50mm lens."

gen refrigerated "Photorealistic photograph of brand-new white refrigerated shipping containers with spotless stainless Genset power packs in a working container yard, seen side-on so their long sides face the camera. They occupy the right 40 percent of the frame, the nearest one carrying the badge on its side at the far right. Clean power posts, neatly run cabling, faint cold vapour at the vents. 35mm lens, low angle."

gen intermodal "Photorealistic photograph of a brand-new Carmel tractor in yellow-over-blue livery with a container chassis at a rail yard, seen side-on. Intermodal rail cars stacked with mixed-livery ocean containers run behind it. The Carmel container sits at the far right of the frame with its side square to the camera, carrying the badge. 35mm lens, low angle."

gen storage "Photorealistic photograph of a secured container storage yard. Stacks of mixed-livery ocean containers four high occupy the right 40 percent and recede toward the right edge, with a yellow reach stacker among them. One container at the FAR RIGHT stands clear of the others with its side square to the camera, carrying the badge with open space around it. 35mm lens, ground level, long shadows."
echo "COVERS4 DONE"
