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

# Part 2 — Value card images (revised 15 Sept 2026)

The first pass — object studies, no people, cool grade — was rejected: "I
don't like the recipe for the features." The cards now use the CleverPays
photographic direction (the global block from
`F:\ARCHIVE WORK\04 SEAN\209 Cleverpays post-rishon branch\hardware-image-prompts.txt`),
adapted for a yard rather than a shop: **people, bright natural daylight,
editorial-portrait, unretouched — and each person wears the Carmel badge as an
embroidered patch on their uniform.** Attach `carmel-logo.png` as the
reference for the cards too now.

## The global block — prepend to every card scene

> Photographed like a real editorial portrait for a business magazine, not a
> logistics brand campaign. Bright natural daylight is the dominant and primary
> light source — open sky or large windows flooding the space, soft and even
> but not flat, with gentle real shadow falloff. Any practical lamps or fixtures
> stay secondary and subtle, never competing with the daylight or tinting the
> scene orange. Overall the image reads bright, fresh and airy, not dim or
> moody. Full-frame camera at eye level, 50mm lens around f/2.8 — subject
> sharp, background softened but still clearly readable as a specific real
> place, never dissolved into abstract bokeh. Shot from a normal standing
> distance, the way a photographer actually stands in a working yard. The
> environment fills the frame with layered depth: something in the near
> foreground (a mirror arm, a container corner, a shoulder), the subject in the
> middle, real background detail behind them — equipment, stacked containers,
> other staff out of focus and partially cropped by the frame. No empty
> negative space, no styled minimalist set. Include mundane working detail no
> art director would choose: a coiled air line, a coffee cup on the step, a
> clipboard, a radio on a belt, a chock beside a wheel, a cloth over a
> shoulder. Clean means cared-for and in-use, not empty or styled — but every
> truck, container and chassis is brand new and immaculate: fresh factory
> paint, polished chrome, no rust, no weathering, no dents. Absolutely no
> readable text, signage, labels, plates, numbers or lettering anywhere in the
> shot, including out of focus — if a surface would normally carry text, show
> it blank, blurred beyond legibility, or turned away from camera. The ONE
> exception: the CARMEL TRANSPORT company badge from the attached reference
> image, reproduced exactly as supplied *(badge description as above)* — worn
> as an embroidered patch on the chest of the person's work uniform, about the
> size of a palm, stitched into the fabric and following its folds, lit by the
> same light as the rest of the scene. One badge only, on the uniform only,
> nowhere else in the frame. People may look directly into the lens and smile
> openly — a real, warm, unforced smile with the eyes involved. Posing for the
> camera is fine and usually reads more honest than forced candidness. Show
> real ages and real skin: pores, laugh lines, uneven tone, flyaway hair, a
> watch or ring worn for years. No smoothing, no retouching, no idealised faces
> or bodies. Colour is bright and naturally warm-toned skin against a clean,
> airy daylight environment — not graded toward blue or teal, not
> high-contrast, not glossy, not dim. No CGI or 3D render look, no stock-photo
> gloss, no floating UI, no other logos, no watermarks. Shot on a full-frame
> camera, 50mm lens at f/2.8, natural eye-level perspective, bright
> daylight-dominant lighting, fine 400-speed film grain, unretouched.

## 4 — Reliable & Protected

**Scene:** A Carmel Transport driver in her fifties, in a navy work shirt with
the company badge patch on the chest, stands at the rear doors of a brand-new
blue shipping container on a chassis in a bright container yard, one hand
resting on the locking bar where a steel security seal hangs, clipboard in the
other hand. She has just finished the walkaround and looks straight into the
lens with an easy, confident smile. Near foreground: the corner of the
container door and its cam handle, slightly cropped. Behind her, softened: rows
of new containers stacked in fresh factory colours, a yellow reach stacker, a
light mast, open blue sky. Late-morning sun, bright and clean.

## 5 — Fast Delivery

**Scene:** A Carmel Transport driver in his thirties, in a hi-vis vest over a
navy company polo with the badge patch on the chest, stands at the open door of
a showroom-new blue-and-yellow semi truck tractor at a container port gate, one
boot on the step, one hand on the mirror arm, coffee in the other, looking into
the lens with a wide, genuine grin as if about to roll out. Near foreground: the
chrome mirror and the edge of the door, cropped. Behind him, softened but
readable: a red container on his chassis, tall port gantry cranes, a container
ship, another truck waiting in the lane, bright open sky. Full daylight, bright
and airy.

## 6 — Outstanding Client Support

**Scene:** A Carmel Transport dispatcher in her forties, in a navy company polo
with the badge patch on the chest, at a dispatch desk beside a
floor-to-ceiling window, headset on, one hand on a mouse, turned toward the
camera with a warm, open smile mid-call. Near foreground: the corner of a
second monitor and a mug, cropped. The monitors show soft out-of-focus schedule
grids and a map with no readable text. Through the big window behind her,
softened: a bright container yard with new containers and a truck passing. The
room is flooded with daylight from the window wall; bright, airy, clean modern
office, warm skin tones.

**Watch for:** container numbers and shipping-line names on background boxes —
the model still draws them despite the no-text rule. Pick the variant where
they are smallest, or run a "make only this change: remove the lettering on
the container" edit pass.

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
    covers and cards — reference image: carmel-logo.png (the cards wear it
    as a uniform patch since the 15 Sept revision)

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
