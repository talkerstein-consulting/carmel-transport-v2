#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"

# The badge paragraph from cover-prompts.md, verbatim. It exists to stop the
# model redrawing the emblem; do not paraphrase it.
BADGE="Painted flat on the container side is the company badge from the attached reference image, reproduced exactly as supplied: a round emblem with a blue globe and faint latitude-longitude grid, an orange city skyline across the upper half, and a stack of multicoloured shipping containers with a yellow reach stacker along the lower half. Across the middle in bold condensed serif capitals is CARMEL in black with a white outline, and directly beneath it TRANSPORT in smaller white capitals. It is flat paint that follows the surface and its perspective, lit by the same light as the rest of the scene, with no glow, no embossing, no reflection and no drop shadow. The badge sits in the right third of the frame, below the horizon line."

# Client override on cover-prompts.md, which still specifies weathered stock.
NEW="All Carmel equipment is BRAND NEW: flawless glossy paint, mirror-polished chrome, spotless glass, brand new tyres, crisp factory-painted container sides with sharp corner castings. No rust, no rust streaks, no corrosion, no faded or chalky paint, no scuffs, no dents, no grime on the Carmel equipment."

# Composition rule from the doc: the frosted plate lands upper-left.
PLATE="The upper-left third of the picture is open, lighter and empty — pale sky or flat haze with nothing in it — so a white plate and dark headline can sit over it with comfortable contrast."

NEG="Photorealistic, natural colour, professional transport photography, no people, no faces, no text overlays, no watermark, no duplicate badges, no floating logo, no misspelled text, no garbled letters, no redesigned logo, no different font, no changed logo colours, no warped or blurry logo, no lens flare, no sun star, no HDR, no heavy vignette, no tilt-shift, no oversaturated colour, no orange-teal grade, no cartoon, no illustration, no painting, no 3D render, no artifacts."

gen () {
  local out="$1"; shift
  local scene="$1"; shift
  local url
  url=$(higgsfield generate create nano_banana_pro --aspect_ratio 16:9 --resolution 2k --wait \
        --image carmel-logo.png \
        --image app/public/img/company/tractor.jpg \
        --prompt "$scene $PLATE $BADGE $NEW $NEG" 2>&1 | tail -1)
  case "$url" in
    https://*) curl -sL "$url" -o "renders/$out.png" && echo "OK   $out" ;;
    *) echo "FAIL $out :: $url" ;;
  esac
}

gen drayage "Photorealistic photograph of a brand-new Carmel semi tractor in yellow-over-blue livery — yellow upper cab, blue lower body, chrome grille and polished aluminium tanks, matching the attached truck reference — hauling a 40-foot shipping container on a chassis along a port access road, shot from a low front three-quarter angle on a 50mm lens, the truck moving toward camera-left. Behind it, soft and out of focus, stand port gantry cranes. Bright clear daylight, natural colour, strong direct sun."

gen refrigerated "Photorealistic photograph of two brand-new white refrigerated shipping containers standing side by side in a working container yard, shot from a low three-quarter angle on a 35mm lens. Spotless stainless Genset power packs and control panels, neatly run power cabling, crisp vent grilles, faint cold vapour at the vents. Bright clear daylight, deep blue sky, natural saturated colour."

gen intermodal "Photorealistic photograph of a brand-new Carmel tractor in yellow-over-blue livery and container chassis crossing a rail yard apron, shot from a low three-quarter angle on a 35mm lens. Intermodal rail cars stacked with mixed-livery ocean containers run away to the right, so rail and road appear in one frame as a handoff point. Bright clear daylight, deep blue sky, natural saturated colour."

gen storage "Photorealistic wide photograph of a secured container storage yard, shot on a 35mm lens from ground level. Stacks of mixed-livery ocean shipping containers run in even rows across the right two-thirds of the frame, four high. A yellow reach stacker sits parked among them, small in frame. Bright clear daylight, deep blue sky, long shadows, natural saturated colour."
echo "COVERS2 DONE"
