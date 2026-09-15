# Service page cover prompts

Five prompts: one shared cover for `/services`, and one for each of the four
service pages. Written 2026-09-15.

## Where they go

| Prompt | File |
|---|---|
| Services overview | `app/public/img/covers/services.jpg` |
| Drayage | `app/public/img/covers/drayage.jpg` |
| Refrigerated containers | `app/public/img/covers/refrigerated.jpg` |
| Intermodal trucking | `app/public/img/covers/intermodal.jpg` |
| Storage facility | `app/public/img/covers/storage.jpg` |

Those four paths currently hold placeholders copied from `img/services/`.
Dropping the final renders at the same filenames is the whole install — no code
change.

## Rules that apply to every prompt below

These are not optional and they are not in the source `cover-prompts.md`, so
they have to be carried into each generation by hand.

**1. Everything is brand new.** Fresh factory paint on containers, showroom
tractors with glossy paint and polished chrome, newly laid and line-marked
asphalt. This is the single most-repeated note from the first cover round.

**2. The Carmel badge is painted, never applied.** The container's vertical
corrugated ribs run straight *through* the artwork, each rib catching light on
its raised face and falling into shadow in its valley. No circular outline ring,
no keyline, no drop shadow, no gloss blob, no smooth flat patch where the ribs
stop.

**3. The badge sits in the right third, lower half of the frame.** `.ph-plate`
is a white plate covering the left ~80% of the band and `.ph-bg img` is
`object-fit: cover` against a ~2.6:1 strip, so anything composed centre-frame is
cropped out or covered. Generate 2–3 variants per cover and pick on badge
placement, not just on the photograph.

**4. Aspect and crop.** Render 3:2 or wider. The page crops to a horizontal band
through the vertical middle, so keep the subject and the badge out of the top
and bottom eighths.

**5. Palette.** Near-monochrome cool — steel blues, greys, white — with Carmel
blue as the only saturated colour. No warm orange grade, no teal-and-orange.

**Shared negative prompt** (append to every one):

> rust, rust streaks, corrosion, weathering, patina, faded paint, chalky paint,
> oxidation, scuffs, dents, scratches, grime, dirt streaks, peeling, graffiti,
> cracked asphalt, potholes, puddles, litter, warm orange grade, teal-and-orange
> grade, HDR, lens flare, heavy vignette, text, watermark, logos other than
> Carmel, sticker or decal appearance, circular outline around the badge, drop
> shadow on the badge, flat smooth patch interrupting the corrugation, people
> looking at camera, fisheye distortion

---

## 0 — Services overview → `covers/services.jpg`

> Wide editorial photograph of a brand-new container yard at first light, shot
> from a low three-quarter angle on a 35mm lens. Four immaculate shipping
> containers in a staggered row recede to the right — one standard dry, one
> white refrigerated unit with a clean Genset pack, one open-top, one
> flat-rack — so the range of equipment reads in a single frame without any of
> them being labelled. Fresh factory paint throughout, crisp edges, sharp
> corner castings, freshly laid asphalt with bright new line markings. Cool
> overcast daylight, near-monochrome steel-blue and grey grade, Carmel blue the
> only saturated colour in the frame. On the container nearest the right edge,
> in the lower half of the frame, the Carmel badge is painted directly onto the
> corrugated steel: the vertical ribs run through the artwork, each rib
> catching light on its raised face and dropping into shadow in its valley,
> paint crisp and new. Deep depth of field, no people, no text anywhere else.

Why this one: the overview page has to say "four services" before you read a
word, so the frame carries all four equipment types at once.

---

## 1 — Drayage → `covers/drayage.jpg`

> Editorial photograph of a brand-new day-cab tractor pulling a single
> immaculate 40ft container chassis on a freshly surfaced port access road,
> shot from a low front three-quarter angle on a 50mm lens, the truck moving
> toward camera-left. Showroom-fresh tractor: glossy paint, polished chrome
> stacks and mirrors, spotless glass. The container is brand new with crisp
> factory paint and sharp corner castings. Behind and well out of focus, the
> silhouettes of ship-to-shore gantry cranes place it at a port without
> competing. Cool overcast daylight, near-monochrome steel-blue and grey grade.
> In the right third, lower half of the frame, the container's side carries the
> Carmel badge painted straight into the corrugated steel — vertical ribs
> running through the artwork, raised faces catching the light, valleys in
> shadow. Shallow background, sharp subject, no people, no other branding.

Why this one: drayage is the road leg, so the frame is a truck in motion with
the port implied behind it rather than a static yard.

---

## 2 — Refrigerated containers → `covers/refrigerated.jpg`

> Editorial photograph of two brand-new white refrigerated shipping containers
> side by side in a clean container yard, shot from a low three-quarter angle
> on a 35mm lens. Immaculate factory-white paint, spotless stainless Genset
> packs and control panels, clean power cabling neatly run, crisp vent grilles.
> Freshly laid asphalt with bright new line markings, faint cold haze in the
> air near the units. Cool overcast daylight, near-monochrome white, steel-blue
> and grey grade, Carmel blue the only saturated colour. On the right-hand
> unit, in the right third and lower half of the frame, the Carmel badge is
> painted directly onto the corrugated steel side — the vertical ribs run
> through the artwork, each rib lit on its raised face and shadowed in its
> valley, paint crisp and new. No frost damage, no ice buildup, no people, no
> text other than the badge.

Why this one: the Genset is what makes a reefer a reefer, so it has to be
visible and obviously new — that is the whole equipment claim on that page.

---

## 3 — Intermodal trucking → `covers/intermodal.jpg`

> Editorial photograph of a brand-new container chassis crossing a rail yard
> apron, with well-maintained intermodal rail cars and stacked immaculate
> containers running away to the right, shot from a low three-quarter angle on
> a 35mm lens. The frame reads as a handoff point: rail on one side, road on
> the other, the container between them. Everything new — fresh factory paint,
> clean rails, freshly laid asphalt with bright line markings. Cool overcast
> daylight, near-monochrome steel-blue and grey grade. In the right third,
> lower half of the frame, the nearest container carries the Carmel badge
> painted into the corrugated steel, vertical ribs running through the artwork
> with light on the raised faces and shadow in the valleys. Long lines of
> perspective leading right, no people, no other branding.

Why this one: the page is about connections between modes, so the photograph
has to contain two modes at once rather than a truck on its own.

---

## 4 — Storage facility → `covers/storage.jpg`

> Editorial photograph of a secure container storage yard at dusk, shot from a
> slightly elevated three-quarter angle on a 35mm lens. Neat rows of brand-new
> containers stacked two high — a mix of dry units and white refrigerated units
> — behind a clean palisade security fence, with a modern camera mast and
> discreet LED yard lighting just coming on. Freshly laid asphalt with bright
> new line markings, everything orderly and immaculate. Cool blue-hour grade,
> near-monochrome steel-blue and grey, the yard lights the only warm points and
> kept small. In the right third, lower half of the frame, a container at the
> end of the nearest row carries the Carmel badge painted into the corrugated
> steel, vertical ribs running through the artwork, raised faces catching the
> light, valleys in shadow. No people, no signage text other than the badge.

Why this one: security and order are the claim on that page, so the frame is
the fence, the camera mast and the straightness of the rows — not a truck.

---

## Known issue to fix alongside these

The badge crops out entirely at phone width on all three existing covers,
because `.ph-bg img` is `object-fit: cover` with default centre positioning. The
fix is `object-position` on `.ph-bg img` at narrow widths, not another render —
worth doing once these five land so the whole set is judged on the same crop.
