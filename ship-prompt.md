# Ship shot — text-to-video prompt

Re-render of `ship.mp4` / `app/public/seq/ship/` (91 frames, 16:9, ~6 s). Same
framing as the current sequence, with the company badge added on top of the
cargo. Written to match `hero-prompt.md` so the two shots cut together.

## Prompt

Photorealistic aerial drone footage, single continuous take, looking straight down at a
container ship sailing across deep, dark teal-blue open ocean under clear midday sun. The
ship sits exactly in the centre of frame, pointing straight up so its bow is at the top of
the frame and its stern at the bottom, and it stays locked in that position and
orientation for the entire shot. The camera is perfectly flat top-down, with no tilt and
no rotation.

The deck is stacked with rows of shipping containers in rust-red, dark blue and steel-blue,
arranged in tidy blocks with narrow gaps and walkways between them. A larger flat block of
pale sky-blue containers occupies the middle of the deck, and the white bridge and
superstructure with a small green helicopter deck sit near the stern. A thin white wake
trails from the stern and small white ripples break along the hull.

Painted flat on the roof of the pale sky-blue container block in the middle of the deck,
fitting within the width of that block and touching nothing around it, is a circular
company decal, oriented upright so it reads correctly from the
overhead camera, with its top edge toward the bow. The badge is a round emblem with a blue
globe and faint latitude-longitude grid, an orange city skyline across the upper half, and
a stack of multicoloured shipping containers with a yellow reach stacker along the lower
half. Across the middle in bold condensed serif capitals is the word CARMEL in black with
a white outline, and directly beneath it the word TRANSPORT in smaller white capitals. The
decal is flat paint that follows the container roofs' corrugated ribs and the seams
between containers, lit by the same sunlight as the rest of the deck, with no glow, no
embossing, no reflection and no drop shadow. It stays locked to the cargo for the entire
shot, moving with the ship, never sliding, drifting, flickering, warping or changing size.

Over the course of the shot the drone climbs slowly and steadily straight up, so the ship
shrinks very gradually in frame while staying perfectly centred, in one continuous,
perfectly even motion with no pauses, no speed changes and no re-framing. In the final
third of the shot a bank of bright white cloud rolls in from the bottom of the frame and
rises until, on the last frame, it completely covers the bottom third of the screen edge
to edge: a solid, thick, bright white cumulus layer with a billowing, lumpy upper edge,
fully opaque with no water showing through it, hiding the stern of the ship while the bow
and the middle of the deck stay clearly visible above it.

Hard sunlight from the upper right, short crisp shadows from the container stacks, fine
sun-glitter on the water. Photorealistic, sharp, natural colour, shot on a professional
drone camera. No cuts, no transitions, no text overlays, no watermark, no other vessels,
no people.

## Negative prompt

logo on the hull, logo on the bridge, logo on the water, floating logo, logo in the sky,
duplicate logos, multiple badges, logo larger than the blue container, logo overlapping other containers or the deck, thin haze, translucent mist, soft gradient fog, misspelled text,
garbled letters, extra text, different font, changed logo colours, redesigned logo,
simplified logo, blurry logo, distorted logo, warped logo, flickering, sliding, jitter,
morphing, glowing, emboss, 3D bulge, reflection, tilted camera, rotating camera, camera
shake, speed ramp, jerky motion, stuttering, cuts, scene change, ship turning, ship
drifting off centre, different ship, cranes, port, land, coastline, other vessels,
watermark, subtitles, people, cartoon, illustration, painting, low quality, artifacts

## Settings

kling3_0 --mode pro --duration 5 --sound off --aspect-ratio 16:9   (7.5 credits)
start_image: `ship-start-frame.png` — the first frame of the current sequence with the
badge composited on the cargo (1920×1080).
end_image: `ship-end-frame.png` — the last frame of the current sequence, ship smaller
and still centred, badge on the cargo, white cloud covering the bottom of the screen.
With both frames pinned the model keeps the framing, the badge placement and the cloud
ending, and only has to generate the climb between them. If the badge still drifts, also
attach `carmel-logo.png` as a reference element.

Once rendered, rebuild the frames with `app/scripts/build-frames.sh` into
`app/public/seq/ship/` (91 frames to keep the scrub timing in `Stage.tsx` unchanged).
