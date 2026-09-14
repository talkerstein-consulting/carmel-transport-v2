# Ship shot — Higgsfield prompt

Re-render of `ship.mp4` / `app/public/seq/ship/` (91 frames, 16:9, ~6 s), same framing as
the current sequence, with the Carmel badge painted on top of the cargo. Higgsfield's
parser weights the opening of the prompt heaviest and handles one dense paragraph better
than the multi-paragraph Kling version in `ship-prompt.md`, so the shot is compressed into
a single block with the camera move stated first and last.

## Prompt (image-to-video — preferred)

> Use with `ship-start-frame.png` as the start frame and `ship-end-frame.png` as the end
> frame. Pinning both frames is what keeps the badge from drifting.

Aerial drone shot, camera perfectly flat top-down with zero tilt and zero roll, rising
straight up in one continuous even ascent. Photorealistic 4K footage of a container ship
sailing across deep dark teal-blue open ocean in hard midday sun. The ship is locked dead
centre of frame, bow at the top edge, stern at the bottom, and holds that exact position
and orientation for the whole take while the drone climbs so the ship shrinks slowly and
evenly. Deck stacked with tidy blocks of rust-red, dark blue and steel-blue shipping
containers with narrow walkways between them; a wide flat block of pale sky-blue containers
in the middle of the deck; white bridge and superstructure with a small green helideck near
the stern; a thin white wake off the stern and small white ripples along the hull. Painted
flat on the roof of the pale sky-blue container block is a large circular company decal,
upright so it reads correctly from directly overhead with its top edge toward the bow,
fitted inside the width of that block and touching nothing around it: a round emblem with a
blue globe and faint latitude-longitude grid, an orange city skyline across the upper half,
a stack of multicoloured shipping containers with a yellow reach stacker along the lower
half, the word CARMEL across the middle in bold condensed serif capitals, black with a
white outline, and TRANSPORT directly beneath it in smaller white capitals. The decal is
flat paint that follows the corrugated ribs and container seams, lit by the same sunlight
as the deck, no glow, no emboss, no reflection, no drop shadow, welded to the cargo for the
entire shot, moving with the ship, never sliding, drifting, flickering, warping or
resizing. In the last third of the shot a thick bright white cumulus bank rolls in from the
bottom of frame and rises until it covers the bottom third of the screen edge to edge,
fully opaque with a billowing lumpy upper edge, hiding the stern while the bow and mid-deck
stay clear above it. Hard sun from the upper right, short crisp shadows off the container
stacks, fine sun-glitter on the water. Single continuous take, no cuts, natural colour,
professional drone camera, locked-off top-down ascent.

## Prompt (text-to-video fallback)

Same paragraph, minus the sentence beginning "Painted flat on the roof…". Generate the
plate clean, then composite the badge per-frame — at this scale the model will not spell
CARMEL / TRANSPORT reliably without a pinned start frame.

## Negative prompt

logo on the hull, logo on the bridge, logo on the water, floating logo, logo in the sky,
duplicate logos, multiple badges, logo larger than the blue container block, logo
overlapping other containers or the deck, thin haze, translucent mist, soft gradient fog,
misspelled text, garbled letters, extra text, different font, changed logo colours,
redesigned logo, simplified logo, blurry logo, distorted logo, warped logo, flickering,
sliding, jitter, morphing, glowing, emboss, 3D bulge, reflection, tilted camera, rotating
camera, camera shake, speed ramp, jerky motion, stuttering, cuts, scene change, ship
turning, ship drifting off centre, different ship, cranes, port, land, coastline, other
vessels, watermark, subtitles, people, cartoon, illustration, painting, low quality,
artifacts

## Settings

- Model: Kling 2.5 Pro or Seedance 1.0 Pro (both on Higgsfield; Kling holds a locked
  top-down better, Seedance holds painted text better)
- Motion / camera preset: **Crane Up** — or none at all if the end frame is pinned, since
  two pinned frames already describe the climb and a preset on top of them fights it
- Aspect ratio 16:9 · Duration 5 s · Sound off · Motion strength low (the only motion is
  the ascent and the cloud)
- Start frame `ship-start-frame.png`, end frame `ship-end-frame.png`
- If the badge still drifts, add `carmel-logo.png` as a reference image

Once rendered, rebuild with `app/scripts/build-frames.sh` into `app/public/seq/ship/` —
91 frames, so the scrub timing in `Stage.tsx` stays unchanged.

---

## Re-rendering the end frame on Higgsfield

`ship-end-frame.png` is currently a composite. To rebuild it as a generated still,
run it as an **edit** on Higgsfield rather than a fresh text-to-image — Nano Banana Pro
holds the ship, the badge and the ocean grade far better when it is editing an existing
frame than when it is inventing one, and the end frame has to match the start frame
exactly or the video interpolation will fight it.

    nano-banana-pro --aspect-ratio 16:9 --resolution 2k
    input image: ship-start-frame.png
    reference image: carmel-logo.png

### Prompt

Keep this exact photograph, the same ship, the same ocean, the same lighting and the same
colour grade. Change only two things. First, pull the camera further back so the ship is
smaller in frame — about 80% of its current length — while staying perfectly centred and
still pointing straight up, bow at the top, stern at the bottom, camera still perfectly
flat top-down with no tilt and no rotation; more open water fills the frame around it. The
circular Carmel decal on the pale sky-blue container block in the middle of the deck
shrinks by exactly the same amount as the ship, staying the same size relative to that
container block, in the same position, upright, unchanged in design, colour and
proportion. Second, roll a thick bank of bright white cumulus cloud in from the bottom of
the frame so it covers the bottom third of the image edge to edge, fully opaque with a
billowing lumpy upper edge, no water showing through it, hiding the stern of the ship
while the bow and the middle of the deck stay clearly visible above it. Photorealistic
aerial drone photograph, sharp, natural colour, hard sun from the upper right.

### Negative prompt

badge changed size relative to the containers, badge moved, badge redesigned, badge
recoloured, misspelled text, garbled letters, ship off centre, ship rotated, ship turning,
different ship, tilted camera, thin haze, translucent mist, soft gradient fog,
semi-transparent cloud, water visible through the cloud, land, coastline, port, cranes,
other vessels, people, watermark, text overlay, cartoon, illustration, painting, 3D
render, low quality, artifacts

Save the result over `ship-end-frame.png` at 1920×1080 so it pairs with the start frame.
