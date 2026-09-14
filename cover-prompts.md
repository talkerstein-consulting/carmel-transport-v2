# Image prompts — Nano Banana Pro

Six images, and nothing else. Three **page covers** (`/company`, `/careers`,
`/contact`) and three **value card** pictures. `/services` is not here: its
cover (`hero.jpg`) is approved and staying.

The two sets are shot differently and the difference is the whole point:

| | Page covers | Value cards |
|---|---|---|
| Where | `.ph-bg`, behind the masthead plate | top of each `.pg-value` card |
| Treatment in CSS | grained, desaturated to 70%, cool wash | sharp, untouched |
| So what matters | composition and detail both — it renders sharp | one clear subject, legible small |
| Rendered size | full-bleed, ~1400px wide | ~380px wide, 16:9 |
| Company badge | **yes** — see below | **no** — see below |

## The logo, and where it goes

Nano Banana Pro takes reference images. For the three **covers**, attach
`carmel-logo.png` and keep this paragraph verbatim — it is the wording the hero
video prompt used, and it is built to stop the model redrawing the badge:

> Painted flat on the container side is the company badge from the attached
> reference image, reproduced exactly as supplied: a round emblem with a blue
> globe and faint latitude-longitude grid, an orange city skyline across the
> upper half, and a stack of multicoloured shipping containers with a yellow
> reach stacker along the lower half. Across the middle in bold condensed serif
> capitals is CARMEL in black with a white outline, and directly beneath it
> TRANSPORT in smaller white capitals. It is flat paint that follows the surface
> and its perspective, lit by the same light as the rest of the scene, with no
> glow, no embossing, no reflection and no drop shadow.

**The card images carry no badge.** At ~380px wide a trailer-door decal lands
about 30px across — too small to read, big enough to look like a smudge, and it
is exactly the case BRANDING §1 forbids (the mark on a photograph with no paper
plate behind it). The covers can carry it because they are full-bleed and the
badge sits on real livery at real size. Asking for it on the cards buys a
defect, so the card prompts name no logo at all and their negative prompts
exclude one.

Worth settling with the client either way: `carmel-logo.png` is a raster circle
with a photograph inside it, while §1 defines the mark as the two-line Roboto
Slab wordmark. Using it as vehicle livery inside a photograph is legitimate;
using it as the site's logo is not what the guide describes.

---

# Part 1 — Page covers

**These render sharp.** The blur is gone from `.ph-bg` — the only glass left is
the frosted plate the type sits on — so detail counts, and a weak frame now has
nowhere to hide. Each one still keeps an open, lighter upper-left third: that is
where the plate lands, and the headline needs contrast under it.

## 1 — `/company` · storage yard at first light

**Prompt**

Photorealistic wide photograph of a secured container storage yard at first
light, shot on a 35mm lens from ground level. Stacks of shipping containers run
in even rows across the right two-thirds of the frame, four high, in muted
weathered blues, greys and faded reds. A yellow reach stacker sits parked among
them, small in frame. The upper-left third of the picture is open pale sky and
low cold haze with nothing in it. Long soft shadows run toward the camera from a
low sun behind the stacks, backlighting the rows so the containers read as dark
masses against bright air. Cool early-morning colour, heavy atmospheric haze,
flat even contrast, no harsh highlights.

Painted flat on the nearest container side is the company badge from the
attached reference image *(insert the badge paragraph above)*.

Photorealistic, natural colour, professional architectural photography,
tripod-steady, no people, no text overlays, no watermark.

**Negative prompt**

people, workers, faces, vehicles in motion, lens flare, sun star, HDR, heavy
vignette, tilt-shift, miniature effect, oversaturated colour, orange teal grade,
duplicate badges, badge on the sky, badge on the ground, floating logo,
misspelled text, garbled letters, redesigned logo, different font, changed logo
colours, blurry logo, warped logo, cartoon, illustration, painting, 3D render,
low quality, artifacts

## 2 — `/careers` · the yard from the driver's side

**Prompt**

Photorealistic photograph taken from just outside the open driver door of a blue
semi truck tractor at a container yard, early morning, 35mm lens. The tractor's
blue bodywork and mirror arm fill the right edge of the frame as a large soft
dark mass. Beyond it the yard opens out: rows of containers, a chassis with a
40-foot box on it, and pale flat sky across the upper-left third with nothing in
it. Wet asphalt holds a soft sheen. Cool overcast daylight, no direct sun,
gentle contrast, muted blue-grey palette.

Painted flat on the trailer side, mid-frame, is the company badge from the
attached reference image *(insert the badge paragraph above)*.

Photorealistic, natural colour, documentary photography, no people in frame, no
text overlays, no watermark.

**Negative prompt**

people, drivers, hands on the wheel, faces, interior dashboard, steering wheel,
lens flare, HDR, oversaturated colour, orange teal grade, motion blur, duplicate
badges, floating logo, badge on the cab, misspelled text, garbled letters,
redesigned logo, different font, changed logo colours, warped logo, cartoon,
illustration, painting, 3D render, low quality, artifacts

## 3 — `/contact` · the gate

**Prompt**

Photorealistic photograph of the entrance gate to a trucking yard at dusk, wide
35mm lens, shot square to the gate from twenty metres back. A chain-link fence
line runs left to right across the lower half; a single blue semi truck with a
40-foot container waits at the gate, angled slightly toward the camera, its
running lights on. The upper-left third is open deep-blue evening sky, clean and
empty. Sodium yard lights throw pools of warm light onto wet asphalt, the only
warmth in an otherwise cold blue frame. Long exposure stillness, no motion blur.

Painted flat on the container side is the company badge from the attached
reference image *(insert the badge paragraph above)*.

Photorealistic, natural colour, blue hour, professional photography, no people,
no text overlays, no watermark.

**Negative prompt**

people, security guard, faces, headlight glare, lens flare, sun star, light
streaks, HDR, neon, cyberpunk, purple sky, oversaturated colour, motion blur,
duplicate badges, floating logo, misspelled text, garbled letters, redesigned
logo, different font, changed logo colours, warped logo, cartoon, illustration,
painting, 3D render, low quality, artifacts

---

# Part 2 — Value card images

These render **sharp at ~380px wide, 16:9** — small enough that the covers'
rule about composition does not carry over: one subject, centred, reading
instantly at thumbnail size, because nothing else will survive the size. No badge, no text, no people's
faces. All three share a palette so the row reads as a set — cool blue-grey,
one warm accent, overcast light, no hard sun.

## 4 — Reliable & Protected

> You benefit from our history of delivering effective solutions, regardless of
> complexity. Our proven track record speaks for our ability to handle any
> situation with proficiency and expertise.

**Prompt**

Photorealistic close photograph of the locking bars and cam handles on the rear
doors of a shipping container, shot straight on with a 50mm lens from two metres.
The container is a deep weathered blue, its vertical locking rods and galvanised
handles catching soft overcast light. A steel security seal hangs through the
handle, sharp and in focus at the centre of the frame. Shallow depth of field
falls off to a blurred container yard behind. Cool blue-grey palette, soft even
daylight, fine surface texture of paint, rust bloom and brushed metal.

Photorealistic, natural colour, product-quality detail photography, no people,
no text, no logos, no watermark.

**Negative prompt**

people, hands, faces, text, letters, numbers, serial codes, logos, badges,
branding, padlocks, chains, hard sunlight, lens flare, HDR, oversaturated
colour, orange teal grade, cartoon, illustration, painting, 3D render, low
quality, artifacts

## 5 — Fast Delivery

> Take advantage of our strategic location near the New York and New Jersey
> ports. Rely on our skilled drivers for timely and secure delivery of your
> cargo.

**Prompt**

Photorealistic photograph of a blue semi truck hauling a 40-foot container
crossing an elevated highway bridge, shot from the side with a 135mm telephoto
lens so the background compresses. Behind it, soft and out of focus, stand
port gantry cranes and the faint outline of a city skyline in haze. The truck is
sharp and reads as a clean silhouette against pale sky. Cool overcast light, no
hard shadows, muted blue-grey palette with a single warm note from the cranes.
Slight motion in the wheels only, everything else still.

Photorealistic, natural colour, professional transport photography, no other
vehicles close to the truck, no people, no text, no logos, no watermark.

**Negative prompt**

traffic, other trucks, cars, people, faces, text, letters, numbers, logos,
badges, branding, light trails, long exposure streaks, heavy motion blur, lens
flare, sun star, HDR, oversaturated colour, orange teal grade, cartoon,
illustration, painting, 3D render, low quality, artifacts

## 6 — Outstanding Client Support

> We are prepared to channel our enthusiasm for problem-solving towards
> enhancing your business operations.

**Prompt**

Photorealistic photograph of a dispatch desk at a trucking office, shot at a
low three-quarter angle with a 35mm lens. Two monitors show soft out-of-focus
schedule grids and a map, their glow cool against the room. In the foreground, a
headset rests on the desk beside a notepad, sharp and in focus. Through a window
behind, a container yard sits blurred in flat daylight. Cool blue-grey palette,
soft overcast light from the window, warm desk lamp as the single warm accent.
No one is at the desk.

Photorealistic, natural colour, documentary interior photography, no people, no
readable text, no logos, no watermark.

**Negative prompt**

people, person at desk, hands, faces, readable text, letters, numbers, user
interface detail, spreadsheets, logos, badges, branding, phone screens, clutter,
messy cables, hard sunlight, lens flare, HDR, oversaturated colour, orange teal
grade, cartoon, illustration, painting, 3D render, low quality, artifacts

---

## Cost — Higgsfield

Nano Banana Pro runs **2 credits per image** on Higgsfield's metered plans.

| | Credits |
|---|---|
| Six images, one clean pass | **12** |
| Realistic, budgeting ~3 attempts each | **~36** |

For scale, the hero video in `hero-prompt.md` was 7.5 credits, so the entire
image set at a clean pass costs less than two of those. Two caveats: credit cost
varies with resolution and settings, so 4K will not be 2 credits — another
reason to stay at 2K — and some Higgsfield paid tiers include Nano Banana Pro
without metering it per image, in which case this costs nothing but time. Check
which tier the account is on before budgeting.

## Settings

    nano-banana-pro --aspect-ratio 16:9 --resolution 2k
    covers only — reference image: carmel-logo.png
    cards  — no reference image

2K for both. The covers now render sharp and full-bleed at roughly 1400px, so 2K
is the working minimum rather than a luxury — 1K would show. 4K is still not
worth it: it costs more per image on Higgsfield and the cards display at ~380px.

Export JPEG quality 82 and save to:

    app/public/img/covers/company.jpg
    app/public/img/covers/careers.jpg
    app/public/img/covers/contact.jpg
    app/public/img/values/reliable.jpg
    app/public/img/values/fast.jpg
    app/public/img/values/support.jpg

## Wiring them up

**Covers** — change the `cover` prop in `Company.tsx`, `Careers.tsx` and
`Contact.tsx`. They currently borrow service photographs as stand-ins, so this
is a one-line edit each.

**Cards** — `Values.tsx` has no image slot yet; the cards lead with an icon
tile. Adding a picture on top is the nav panel's service-card construction
(`.nav-item`: media, then title, then detail), so it is already in the system —
say the word once the files exist and it is a small change to `Values.tsx` plus
a `.pg-value-media` rule. I have not wired it now because pointing at six files
that do not exist ships six broken images.

## Checking a cover before you keep it

Two tests, both quick. Drop a white rectangle at 76% opacity over the upper-left
third — that is the plate. If the ink-navy headline would not clear it
comfortably, the frame is too busy or too dark there, whatever the rest looks
like. Then view it at full width: it renders sharp now, so anything soft,
noisy or obviously synthetic in the foreground will be visible on the page.

## Checking a card before you keep it

Shrink it to 380px wide. If you cannot name the subject in under a second, it is
too busy — go back and ask for a closer crop, not a better one.
