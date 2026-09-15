#!/usr/bin/env bash
set -u
cd "F:/ARCHIVE WORK/04 SEAN/213 Carmel Transport v2"
NEW="Everything BRAND NEW and factory fresh: flawless glossy paint, mirror-bright polished chrome, spotless glass, brand new tyres, crisp factory-painted containers with sharp corner castings and perfectly straight corrugations, newly laid asphalt with bright new line markings. NOT weathered, NO rust, NO rust streaks, NO corrosion, NO faded or chalky paint, NO scuffs, NO dents, NO grime."
GRADE="Cool overcast daylight, near-monochrome steel-blue and grey grade, deep blue the only saturated colour. Documentary equipment photography, deep depth of field, no people, no text, no logos, no watermark."

gen () {
  local out="$1"; shift
  local prompt="$1"; shift
  local url
  url=$(higgsfield generate create seedream_v5_pro --aspect_ratio 3:2 --resolution 1.5k --wait --prompt "$prompt $NEW $GRADE" 2>&1 | tail -1)
  case "$url" in
    https://*) curl -sL "$url" -o "renders/cards/$out.png" && echo "OK   $out" ;;
    *) echo "FAIL $out :: $url" ;;
  esac
}

# --- drayage
gen drayage-1 "Two brand new shipping containers being exchanged on a port apron, one lifting onto a gleaming new chassis by a reach stacker, the other already seated. Import and export in one frame."
gen drayage-2 "A brand new day-cab tractor and container chassis pulling away from a terminal gate down a freshly paved access road, shot from behind and to the side, open road ahead."
gen drayage-3 "Four brand new specialised containers lined up square to camera: a standard dry, an open-top with its tarpaulin neatly furled, a flat-rack, and a white refrigerated unit. An equipment line-up."
gen drayage-4 "Close three-quarter detail of a brand new tractor cab and the head of its container chassis, king pin and air lines crisp and clean, the container nose behind it."

# --- refrigerated
gen refrigerated-1 "Close detail of a spotless stainless steel Genset power pack mounted on a brand new refrigerated container chassis, control panel and gauges crisp, cabling neatly run."
gen refrigerated-2 "A brand new white refrigerated container seated on a Genset chassis at a clean yard bay, reefer plug connected, faint cold vapour at the vents, the tractor waiting in front."
gen refrigerated-3 "A row of brand new white refrigerated containers in a storage yard, each plugged into clean power posts, receding in perspective to the right."
gen refrigerated-4 "Elevated wide of a refrigerated storage yard: roughly thirty brand new white reefer containers in neat ranks with power posts between them, seen from a slight height."

# --- intermodal
gen intermodal-1 "A brand new container chassis leaving an ocean terminal under ship-to-shore gantry cranes, the container just landed, the crane legs framing the exit lane."
gen intermodal-2 "A brand new tractor and chassis alongside well-maintained intermodal rail cars stacked with immaculate containers, the rail line running away to the right."
gen intermodal-3 "A brand new container chassis backing onto a clean distribution centre dock, dock doors and levellers crisp and new, container doors square to the bay."
gen intermodal-4 "Wide elevated view of an intermodal yard at dusk, ordered rows of brand new containers and chassis lanes, discreet LED mast lighting, everything legible and orderly."

# --- storage
gen storage-1 "Neat ranks of brand new dry shipping containers stacked two high in a clean storage yard, square to camera, bright new line markings on fresh asphalt."
gen storage-2 "Brand new white refrigerated containers in a dedicated bay of a storage yard, plugged into clean power posts, dry containers visible behind them."
gen storage-3 "Wide of a container storage yard behind a clean palisade security fence with a modern camera mast, brand new containers in ordered rows, late afternoon."
gen storage-4 "A brand new reach stacker lifting an immaculate container in a storage yard, a waiting tractor and chassis in the foreground, the yard gate and access road beyond."
echo "CARDS DONE"
