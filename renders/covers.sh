#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"
NEW="Everything BRAND NEW and factory fresh: flawless glossy paint, mirror-bright polished chrome, spotless glass, brand new tyres, crisp factory-painted containers with sharp corner castings, newly laid asphalt with bright new line markings. NOT weathered, NO rust, NO rust streaks, NO corrosion, NO faded or chalky paint, NO scuffs, NO dents, NO grime."
BADGE="In the right third and lower half of the frame a container carries a painted CARMEL badge: the vertical corrugated ribs run straight THROUGH the artwork, each rib catching light on its raised face and falling into shadow in its valley, paint crisp and new, no outline ring, no decal edge, no drop shadow."
GRADE="Cool overcast daylight, near-monochrome steel-blue and grey grade, deep blue the only saturated colour. No people, no text other than the badge."

gen () {
  local out="$1"; shift
  local prompt="$1"; shift
  local url
  url=$(higgsfield generate create seedream_v5_pro --aspect_ratio 3:2 --resolution 2k --wait --prompt "$prompt" 2>&1 | tail -1)
  case "$url" in
    https://*) curl -sL "$url" -o "renders/$out.png" && echo "OK   $out" ;;
    *) echo "FAIL $out :: $url" ;;
  esac
}

gen services "Wide editorial photograph of a brand new container yard at first light, low three-quarter angle, 35mm lens. Four immaculate shipping containers in a staggered row receding to the right: one standard dry, one white refrigerated unit with a clean stainless Genset pack, one open-top, one flat-rack. $NEW $BADGE $GRADE"
gen refrigerated "Editorial photograph of two BRAND NEW white refrigerated shipping containers side by side in a clean container yard, low three-quarter angle, 35mm lens. Immaculate factory-white paint, spotless stainless Genset packs and control panels, neatly run power cabling, crisp vent grilles, faint cold haze near the units. $NEW $BADGE $GRADE"
gen intermodal "Editorial photograph of a BRAND NEW container chassis and glossy new tractor crossing a rail yard apron, well-maintained intermodal rail cars and stacked immaculate containers running away to the right, low three-quarter angle, 35mm lens. The frame reads as a handoff point: rail on one side, road on the other. $NEW $BADGE $GRADE"
gen storage "Editorial photograph of a secure container storage yard at dusk, slightly elevated three-quarter angle, 35mm lens. Neat rows of brand new containers stacked two high, a mix of dry units and white refrigerated units, behind a clean palisade security fence, modern camera mast and discreet LED yard lighting just coming on. $NEW $BADGE Cool blue-hour grade, near-monochrome steel-blue and grey, yard lights the only warm points and kept small. No people, no signage text other than the badge."
echo "COVERS DONE"
