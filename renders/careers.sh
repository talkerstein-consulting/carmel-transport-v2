#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"

# Card rule from cover-prompts.md: NO badge on card images. At card size a
# decal reads as a smudge, and BRANDING §1 forbids the mark on a photograph
# with no paper plate behind it. So no logo reference is attached here — only
# the company shots, for livery and for the look of the real yard.
STYLE="Shot in the style of the attached reference photographs: a real working container yard, bright clear daylight under a deep blue sky, strong direct sun, high contrast, natural saturated colour, documentary photography, deep depth of field."
NEW="All Carmel equipment is BRAND NEW: flawless glossy yellow-over-blue paint, mirror-polished chrome, spotless glass, brand new tyres. No rust, no corrosion, no faded or chalky paint, no scuffs, no dents, no grime on the Carmel equipment."
NEG="Photorealistic, natural colour, no people, no faces, no hands, no text overlays, no readable text, no logos, no badges, no branding, no watermark, no lens flare, no sun star, no HDR, no heavy vignette, no oversaturated grade, no orange-teal grade, no motion blur, no cartoon, no illustration, no painting, no 3D render, no artifacts."

gen () {
  local out="$1"; shift
  local scene="$1"; shift
  local url
  url=$(higgsfield generate create nano_banana_pro --aspect_ratio 16:9 --resolution 2k --wait \
        --image app/public/img/company/tractor.jpg \
        --image app/public/img/company/yard.jpg \
        --prompt "$scene $STYLE $NEW $NEG" 2>&1 | tail -1)
  case "$url" in
    https://*) curl -sL "$url" -o "renders/careers/$out.png" && echo "OK   $out" ;;
    *) echo "FAIL $out :: $url" ;;
  esac
}
mkdir -p renders/careers

gen driver "Photorealistic photograph taken from just outside the open driver door of a brand-new Carmel semi tractor in yellow-over-blue livery — yellow upper cab, blue lower body, chrome grille and polished aluminium tanks, matching the attached truck reference — parked in a container yard. The cab door stands open and the step and grab handle are sharp in the foreground; the yard with stacked mixed-livery containers opens out beyond it. The cab is empty. 35mm lens, low angle."

gen dispatcher "Photorealistic photograph of an empty dispatch desk in a trucking office, shot at a low three-quarter angle on a 35mm lens. Two monitors show soft out-of-focus schedule grids and a map, a headset rests on the desk beside a notepad, sharp and in focus. Through the window behind, a container yard sits in bright daylight. No one is at the desk."

gen mechanic "Photorealistic photograph of a clean maintenance bay with a brand-new Carmel tractor in yellow-over-blue livery raised on a lift, its hood tilted forward to expose the engine. Neatly racked tools and a rolling tool chest sit in the foreground, sharp and in focus. Daylight floods in through the open bay door onto the container yard beyond. Nobody in the bay. 35mm lens."

gen csr "Photorealistic photograph of a tidy customer service desk beside a large office window, shot on a 50mm lens. A headset and an open notebook sit on the desk in the foreground, sharp and in focus; a monitor glows softly out of focus behind them. Through the window, brand-new yellow-over-blue tractors and stacked containers are visible in bright daylight. The chair is empty."

gen owner-operator "Photorealistic photograph of a brand-new owner-operator semi tractor in yellow-over-blue livery backing under a container chassis in a working yard, shot from a low rear three-quarter angle on a 35mm lens so the fifth wheel and the chassis nose are the sharp subject. Stacked mixed-livery ocean containers fill the background under a deep blue sky."
echo "CAREERS DONE"
