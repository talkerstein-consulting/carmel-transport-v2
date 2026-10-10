import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"

/* The truck shot, drawn. Loaded on demand by TruckScene so three.js never
   sits in the page's first bundle.

   LOOK. Two-tone print, after illoca.unseen.co: everything in light is warm
   paper, everything in shadow is ultramarine, edges are fine navy lines and
   the whole frame carries paper grain. It is done in two passes:

     1. the scene renders in plain greyscale -- white Lambert, one sun with a
        soft shadow, black hairline edges -- into an offscreen target;
     2. a full-screen pass reads that luminance and THRESHOLDS it into the
        palette, so light and shadow meet on a crisp line. The clear colour is
        pure magenta, which no grey surface can produce, so the pass knows sky
        from ground and paints its own gradient there.

   There is no clock. pose(s) is a pure function of shot progress s in 0..1,
   and a frame is only drawn when s or the size changes. */

// Brand tokens (brand.css). Written straight to the screen as sRGB bytes --
// the renderer's output colour space is left linear, so no conversion runs.
export const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
export const PAL = {
  ink: hex("#081D35"),      // --ink-900: outlines
  blue: hex("#1A4F9C"),     // shadow: one step under --blue-700, toward --ink-800
  blueLift: hex("#3E92F5"), // --blue-600: shadow catching bounce
  castShade: hex("#B9D6FF"), // --blue-200: shadows thrown on the ground, faded
  paperDim: hex("#DFE5ED"), // --paper-300: paper turning from the light
  paper: hex("#F7F9FC"),    // --paper-100: lit paper
  skyTop: hex("#6AB0FF"),   // --blue-500
  skyLow: hex("#EAF3FF"),   // --blue-50
}
export const v3 = (c: number[]) => new THREE.Vector3(c[0], c[1], c[2])

/* Shared with ship-world.ts, which has to pick the shot up exactly where
   this one leaves it: the same 40ft box, seen from the same height, with the
   same lens, so the Carmel container is the same size on screen across the
   cut. */
export const BOX = { CL: 12.2, CH: 2.59, CW: 2.44, CY: 1.38, CZ: 2.6 } // CY: deck height on the chassis
// Where the truck shot ends: straight down, from DIST above its target,
// with the target 0.4m ahead of the rig's origin -- so the container centre
// sits CZ - 0.4 behind the screen centre.
export const overheadFrame = (aspect: number) => {
  const portrait = aspect < 1
  // On a tall screen the copy takes the top of the frame, so the camera aims
  // 16m ahead of the rig and the box settles in the lower third instead.
  return { fov: portrait ? 44 : 30, dist: portrait ? 70 : 60, elev: 89.5, ahead: BOX.CZ - 0.4 + (portrait ? 16 : 0) }
}

/* The two-tone pass, shared with ship-world.ts. Uniforms: tScene, res,
   horizon, haze, and the palette (see PAL). */
// Saturation of the scene's blues relative to the brand tokens (1 = as is).
const SCENE_SAT = 0.7
const glsl3 = (h: string) => `vec3(${hex(h).map((v) => v.toFixed(4)).join(", ")})`
export const TWO_TONE_FRAG = /* glsl */ `
      precision highp float;
      uniform sampler2D tScene; uniform vec2 res; uniform float horizon; uniform float haze;
      uniform vec3 ink, blue, blueLift, castShade, paperDim, paper, skyTop, skyLow;
      varying vec2 vUv;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
      void main(){
        vec4 c4 = texture2D(tScene, vUv);
        vec3 c = c4.rgb;
        // Sky key is pure magenta. An edge pixel is grey L blended with it
        // by a: r = b = L + a(1 - L), g = L(1 - a) -- so a = min(r, b) - g,
        // and the grey underneath is g / (1 - a). Reading it that way keeps
        // antialiased edges against the sky from tinting pink.
        float magenta = 1.0 - smoothstep(0.06, 0.14, abs(c.r - c.b));
        float sky = clamp((min(c.r, c.b) - c.g) * 1.02, 0.0, 1.0) * magenta;
        float l = sky > 0.98 ? 1.0 : clamp(c.g / max(0.02, 1.0 - sky), 0.0, 1.0);
        // Anything else that is saturated can only be the logo.
        float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
        float logo = (1.0 - magenta) * smoothstep(0.08, 0.16, mx - mn);
        if (logo < 0.5) l = mix(l, dot(c, vec3(0.333)), 1.0 - magenta);
        vec3 col;
        if (l < 0.16) col = ink;
        else {
          float lit = smoothstep(0.47, 0.5, l);             // the hard light edge
          vec3 shade = mix(blue, blueLift, smoothstep(0.38, 0.46, l)); // bounce only at the edge
          vec3 light = mix(paperDim, paper, smoothstep(0.55, 0.85, l));
          // Middle band (~0.5-0.66): a lit surface under a cast shadow.
          vec3 thrown = mix(castShade, paperDim, 0.25); // ("cast" is reserved in GLSL ES)
          vec3 lightOrCast = mix(thrown, light, smoothstep(0.62, 0.7, l));
          col = mix(shade, lightOrCast, lit);
          col = mix(ink, col, smoothstep(0.16, 0.22, l));    // soften line edge
        }
        float t = clamp((vUv.y - horizon) / max(0.001, 1.0 - horizon), 0.0, 1.0);
        vec3 skyCol = mix(skyLow, skyTop, pow(t, 0.8));
        col = mix(col, c, logo);
        // Alpha markers written into the scene target:
        //   ~0.6  livery -- two tones of the paint's own colour;
        //   ~0.2  water  -- held to three brand blues and paper, no in-betweens.
        float liv = smoothstep(0.4, 0.5, c4.a) * (1.0 - smoothstep(0.72, 0.86, c4.a));
        float wat = 1.0 - smoothstep(0.3, 0.42, c4.a);
        float pm = max(c.r, max(c.g, c.b));
        vec3 hue = c / max(pm, 0.001);
        vec3 paintCol = hue * mix(0.74, 0.97, smoothstep(0.42, 0.48, pm));
        col = mix(col, paintCol, liv);
        float wl = dot(c, vec3(0.3, 0.5, 0.2));
        vec3 waterCol = wl < 0.4  ? ${glsl3("#1F6FD1")}   // troughs: --blue-700
                      : wl < 0.62 ? ${glsl3("#6AB0FF")}   // body:    --blue-500
                      : wl < 0.82 ? ${glsl3("#B9D6FF")}   // lit:     --blue-200
                      :             ${glsl3("#F7F9FC")};  // glint/foam: paper
        col = mix(col, waterCol, wat);
        col = mix(col, skyCol, sky);
        // Muted blues: the scene's blues (shadow, cast shade, sky, sea) at
        // SCENE_SAT of their token saturation, pulled toward their own
        // luminance so light/dark stays the same. Logo and livery are exempt.
        float keep = max(logo * (1.0 - wat), liv);
        float Y = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(col, mix(vec3(Y), col, ${SCENE_SAT.toFixed(2)}), 1.0 - keep);
        // Paper grain, fixed to the screen like the reference's print texture.
        float n = hash(floor(vUv * res));
        col += (n - 0.5) * 0.06;
        // Haze, last of all so nothing (grain, saturation) shifts it: the ship
        // shot climbs into cloud and lands on EXACTLY #D5E7F2, the colour
        // .act-three starts on, so the section after it rises out of the same
        // flat field with no seam. The truck shot leaves this at 0.
        col = mix(col, ${glsl3("#D5E7F2")}, haze);
        gl_FragColor = vec4(col, 1.0);
      }`

const ease = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = THREE.MathUtils.lerp

export function mountTruckWorld(cv: HTMLCanvasElement, getS: () => number) {
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700
  let dirty = true // set by anything that needs a redraw (resize, texture repaint)
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: "high-performance" })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace // the pass owns colour

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 5000)

  // Greyscale lighting (x PI: three.js divides Lambert by PI). Ambient + sun are balanced so a face in shadow lands
  // well under the pass's threshold (0.5) and a lit face well over it.
  scene.add(new THREE.AmbientLight("#ffffff", 0.32 * Math.PI))
  const sun = new THREE.DirectionalLight("#ffffff", 0.95 * Math.PI)
  sun.castShadow = true
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048)
  sun.shadow.radius = 3
  // Cast shadows only take part of the sun away. A shadowed lit surface
  // then lands in a middle band the pass prints pale blue, so shadows on
  // the ground read faded while the unlit sides of things stay full blue.
  sun.shadow.intensity = 0.6
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.02
  const sc = sun.shadow.camera
  sc.left = -45; sc.right = 45; sc.top = 45; sc.bottom = -45; sc.near = 1; sc.far = 260
  scene.add(sun, sun.target)
  // Low, raking, from the front-left: long shadows across the road, and the
  // truck's flank facing the camera falls into blue, as in the reference.
  const SUN_DIR = new THREE.Vector3(-0.55, 0.62, -0.56).normalize()

  const disposables: { dispose(): void }[] = []
  const grey = (l: number) => {
    const m = new THREE.MeshLambertMaterial({ color: new THREE.Color(l, l, l) })
    disposables.push(m)
    return m
  }
  const WHITE = grey(1), SOFT = grey(0.86), DARK = grey(0.12), ROAD = grey(0.8) // lit, stays above the faded-shadow band
  // Outlines are always one pixel of the render target. On a phone that
  // pixel is small (see the DPR in resize) and a touch lighter, so the
  // pass prints it between ink and blue: a finer line, not a heavy one.
  // Mid-dark grey, not black: the pass prints it in the deep shadow blue
  // rather than full ink, so outlines read lighter (a touch lighter still
  // on phones, where lines sit closer together).
  const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color().setScalar(mobile ? 0.34 : 0.3) })
  disposables.push(lineMat)

  /* ---- building blocks -------------------------------------------------
     Static scenery is MERGED: every rail post, dash and bush of one material
     goes into one geometry with one outline, so the whole world is a few
     dozen draw calls rather than a couple of thousand. */
  type Part = THREE.BufferGeometry
  const placed = (g: Part, x: number, y: number, z: number, ry = 0, sx = 1, sy = 1, sz = 1) => {
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
      new THREE.Vector3(sx, sy, sz),
    )
    return g.clone().applyMatrix4(m)
  }
  const emit = (parts: Part[], mat: THREE.Material, parent: THREE.Object3D, outline = true, angle = 30) => {
    if (!parts.length) return
    const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false)!
    parts.forEach((p) => p.dispose())
    disposables.push(g)
    const mesh = new THREE.Mesh(g, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    if (outline) {
      const eg = new THREE.EdgesGeometry(g, angle)
      disposables.push(eg)
      parent.add(new THREE.LineSegments(eg, lineMat))
    }
    return mesh
  }
  const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)

  /* ---- world ------------------------------------------------------------ */
  const TRAVEL = 200
  const ROAD_W = 10, LEN = 1800, ZTOP = 260
  const world = new THREE.Group()
  scene.add(world)

  /* Dry open country: a straight highway with guard rails, sparse scrub,
     a line of power poles carrying thin wires, and a few low sheds set well
     back. No crossroad -- the overhead shot ends on the open road. All of it
     generated and merged per material, so nothing is downloaded. */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(8000, 8000), WHITE)
  ground.rotation.x = -Math.PI / 2
  ground.position.z = -2400
  ground.receiveShadow = true
  disposables.push(ground.geometry)
  world.add(ground)

  let seed = 11
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

  // Road slab a few cm proud of the ground, so it takes an outline.
  const slabs: Part[] = [placed(B(ROAD_W, 0.12, LEN), 0, 0.06, ZTOP - LEN / 2)]
  emit(slabs, ROAD, world, true)
  const shoulders: Part[] = []
  for (const s of [-1, 1]) shoulders.push(placed(B(2.2, 0.08, LEN), s * (ROAD_W / 2 + 1.1), 0.04, ZTOP - LEN / 2))
  emit(shoulders, WHITE, world, true)

  // Markings: centre dashes, solid edge lines.
  const marks: Part[] = []
  for (let z = ZTOP; z > ZTOP - LEN; z -= 10) marks.push(placed(B(0.18, 0.02, 4), 0, 0.13, z))
  for (const s of [-1, 1]) marks.push(placed(B(0.16, 0.02, LEN), s * (ROAD_W / 2 - 0.5), 0.13, ZTOP - LEN / 2))
  emit(marks, WHITE, world, false)

  // Guard rails: W-beam plus posts.
  const rails: Part[] = [], posts: Part[] = []
  const RX = ROAD_W / 2 + 2.8
  for (const s of [-1, 1]) {
    rails.push(placed(B(0.1, 0.32, LEN), s * RX, 0.62, ZTOP - LEN / 2))
    for (let z = ZTOP; z > ZTOP - LEN; z -= 3.8) posts.push(placed(B(0.14, 0.75, 0.14), s * RX, 0.37, z))
  }
  emit(rails, WHITE, world, true)
  emit(posts, SOFT, world, false)

  // Sparse scrub.
  const bushes: Part[] = []
  const bushGeo = new THREE.IcosahedronGeometry(1, 0)
  for (let i = 0; i < (mobile ? 140 : 260); i++) {
    const x = (rnd() < 0.5 ? -1 : 1) * (RX + 3 + rnd() * 140)
    const z = ZTOP - rnd() * 1300
    const s = 0.5 + rnd() * 1.3
    // Keep the ground under the intro copy clear: from overhead at the end of
    // the shot (truck stops at z = -TRAVEL), a bush there sits in the text.
    if (Math.abs(z + TRAVEL) < 70 && Math.abs(x) < 80) continue
    bushes.push(placed(bushGeo, x, s * 0.35, z, rnd() * 6, s, s * 0.7, s))
  }
  bushGeo.dispose()
  emit(bushes, WHITE, world, true, 20)

  // Power poles -- plain uprights, no crossarm (it read as a row of crosses)
  // -- with two wires sagging between them, drawn as hairlines.
  const poles: Part[] = []
  const PX = -RX - 6, SPAN = 42, TOP = 8.6
  const wire: number[] = []
  for (let z = ZTOP; z > ZTOP - LEN; z -= SPAN) {
    poles.push(placed(B(0.16, 9, 0.16), PX, 4.5, z))
    for (const dx of [-0.35, 0.35]) for (let i = 0; i < 8; i++) {
      const t0 = i / 8, t1 = (i + 1) / 8
      const sag = (t: number) => TOP - 0.9 * 4 * t * (1 - t)
      wire.push(PX + dx, sag(t0), z - SPAN * t0, PX + dx, sag(t1), z - SPAN * t1)
    }
  }
  emit(poles, WHITE, world, true)
  const wireGeo = new THREE.BufferGeometry()
  wireGeo.setAttribute("position", new THREE.Float32BufferAttribute(wire, 3))
  disposables.push(wireGeo)
  // Mid grey, not black: the pass prints it as a light blue hairline rather
  // than an ink line, so the wires sit back.
  const wireMat = new THREE.LineBasicMaterial({ color: new THREE.Color(0.4, 0.4, 0.4) })
  disposables.push(wireMat)
  world.add(new THREE.LineSegments(wireGeo, wireMat))

  // A few low sheds, well back from the road.
  const sheds: Part[] = []
  for (const [x, z, w, d, h] of [[34, -170, 14, 9, 4], [-40, -240, 18, 10, 5], [46, -300, 8, 8, 3.2], [-34, 60, 10, 7, 3.5], [52, -60, 12, 8, 3.6]]) {
    sheds.push(placed(B(w, h, d), x, h / 2, z))
    sheds.push(placed(B(w + 0.6, 0.3, d + 0.6), x, h + 0.15, z))
  }
  emit(sheds, WHITE, world, true)

  // An uneven horizon: low, broad swells of the plain itself, far out, in
  // the ground's own material and with no outlines, so the line where land
  // meets sky rolls gently instead of running dead flat.
  const swells: Part[] = []
  const swell = new THREE.SphereGeometry(1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2)
  for (let i = 0; i < 70; i++) {
    const x = -3400 + i * 100 + (rnd() - 0.5) * 90
    const z = -2600 - rnd() * 700
    const rx = 260 + rnd() * 340, h = 16 + rnd() * 40
    swells.push(placed(swell, x, -1, z, rnd() * 6, rx, h, 120 + rnd() * 160))
  }
  swell.dispose()
  const swellMesh = emit(swells, WHITE, world, false)
  if (swellMesh) swellMesh.castShadow = false



  /* ---- truck ------------------------------------------------------------
     Day-cab tractor and a 40ft box on a skeletal chassis. Nose toward -z,
     origin on the ground under the middle of the rig. */
  const truck = new THREE.Group()
  scene.add(truck)
  const body: Part[] = [], trim: Part[] = [], dark: Part[] = [], livery: Part[] = []

  // Container 12.2 x 2.59 x 2.44, on the chassis deck at 1.35m.
  const { CL, CH, CW, CY, CZ } = BOX
  body.push(placed(B(CW - 0.08, CH - 0.12, CL - 0.16), 0, CY + CH / 2, CZ))
  // Top and bottom side rails, corner posts, corner castings.
  for (const s of [-1, 1]) {
    trim.push(placed(B(0.1, 0.14, CL), s * (CW / 2 - 0.03), CY + CH - 0.07, CZ))
    trim.push(placed(B(0.1, 0.16, CL), s * (CW / 2 - 0.03), CY + 0.08, CZ))
    for (const e of [-1, 1]) {
      trim.push(placed(B(0.14, CH, 0.14), s * (CW / 2 - 0.05), CY + CH / 2, CZ + e * (CL / 2 - 0.05)))
      for (const y of [CY + 0.09, CY + CH - 0.09]) trim.push(placed(B(0.2, 0.18, 0.2), s * (CW / 2 - 0.07), y, CZ + e * (CL / 2 - 0.07)))
    }
    // Corrugation: 40 shallow ribs per side.
    for (let i = 0; i < 40; i++) {
      const z = CZ - CL / 2 + 0.3 + i * ((CL - 0.6) / 39)
      body.push(placed(B(0.06, CH - 0.34, 0.14), s * (CW / 2 - 0.02), CY + CH / 2, z))
    }
  }
  // Roof ribs run across; the badge sits on top of them.
  for (let i = 0; i < 30; i++) {
    const z = CZ - CL / 2 + 0.3 + i * ((CL - 0.6) / 29)
    body.push(placed(B(CW - 0.3, 0.04, 0.16), 0, CY + CH + 0.0, z))
  }
  // Rear doors: frame, split, four locking bars with handles, hinges.
  const RZ = CZ + CL / 2
  trim.push(placed(B(CW, 0.2, 0.08), 0, CY + CH - 0.1, RZ + 0.02))
  trim.push(placed(B(CW, 0.2, 0.08), 0, CY + 0.1, RZ + 0.02))
  trim.push(placed(B(0.04, CH - 0.3, 0.06), 0, CY + CH / 2, RZ + 0.03))
  for (const x of [-0.95, -0.62, 0.62, 0.95]) { // centre left clear for the roundel
    dark.push(placed(B(0.05, CH - 0.25, 0.05), x, CY + CH / 2, RZ + 0.08))
    dark.push(placed(B(0.22, 0.05, 0.05), x + 0.08, CY + 1.1, RZ + 0.1))
    for (const y of [CY + 0.35, CY + CH - 0.35]) dark.push(placed(B(0.1, 0.12, 0.06), x, y, RZ + 0.09))
  }
  for (const s of [-1, 1]) for (const y of [0.45, 1.3, 2.15]) dark.push(placed(B(0.12, 0.2, 0.06), s * (CW / 2 - 0.12), CY + y, RZ + 0.06))

  // Chassis: two main beams, crossmembers, landing legs, bogie, mud flaps,
  // ICC bumper, tail lights.
  for (const s of [-1, 1]) dark.push(placed(B(0.18, 0.3, CL + 0.4), s * 0.5, 1.15, CZ))
  for (let i = 0; i < 9; i++) dark.push(placed(B(1.2, 0.12, 0.12), 0, 1.15, CZ - CL / 2 + 0.6 + i * 1.4))
  for (const s of [-1, 1]) {
    dark.push(placed(B(0.12, 0.9, 0.12), s * 0.9, 0.6, CZ - 2.6))
    dark.push(placed(B(0.32, 0.06, 0.32), s * 0.9, 0.13, CZ - 2.6))
    dark.push(placed(B(0.02, 0.62, 0.5), s * 1.05, 0.5, CZ + CL / 2 - 0.75))
  }
  dark.push(placed(B(1.9, 0.1, 0.1), 0, 0.6, CZ - 2.6))
  dark.push(placed(B(CW - 0.1, 0.16, 0.12), 0, 0.62, RZ + 0.25))
  for (const s of [-1, 1]) {
    dark.push(placed(B(0.08, 0.5, 0.08), s * 0.5, 0.85, RZ + 0.2))
    trim.push(placed(B(0.28, 0.14, 0.05), s * 0.95, 1.05, RZ + 0.25))
  }

  // Tractor: frame, sleeper-less day cab with a sloped screen, long hood,
  // grille, bumper, fenders, steps, fuel tanks, exhaust stacks, mirrors,
  // air cleaners, fifth wheel.
  const TZ = -5.9 // cab back wall
  for (const s of [-1, 1]) dark.push(placed(B(0.16, 0.28, 7.2), s * 0.45, 0.95, -7.0))
  dark.push(placed(B(1.6, 0.18, 1.5), 0, 1.15, CZ - CL / 2 + 1.0))

  const cab = new THREE.Shape()
  cab.moveTo(0, 0); cab.lineTo(2.1, 0); cab.lineTo(2.1, 2.55); cab.lineTo(1.95, 2.7)
  cab.lineTo(0.75, 2.7); cab.lineTo(0.05, 1.55); cab.lineTo(0, 0)
  const cabGeo = new THREE.ExtrudeGeometry(cab, { depth: 2.42, bevelEnabled: false })
  cabGeo.translate(-2.1, 0, -1.21)
  cabGeo.rotateY(-Math.PI / 2) // profile x -> -z, nose forward
  livery.push(placed(cabGeo, 0, 1.2, TZ))
  cabGeo.dispose()
  // Side glass and door seams.
  for (const s of [-1, 1]) {
    dark.push(placed(B(0.03, 0.8, 1.0), s * 1.22, 3.05, TZ - 1.35))
    dark.push(placed(B(0.02, 1.55, 0.03), s * 1.215, 2.0, TZ - 0.55))
    dark.push(placed(B(0.02, 0.03, 1.4), s * 1.215, 1.42, TZ - 1.3))
  }
  // Windscreen: two panes on the slope.
  for (const s of [-1, 1]) {
    const g = B(1.0, 1.15, 0.03)
    g.rotateX(-Math.atan2(0.7, 1.15))
    dark.push(placed(g, s * 0.56, 3.3, TZ - 2.42))
    g.dispose()
  }
  // Hood with a crown, grille, bumper, headlights.
  livery.push(placed(B(2.0, 1.15, 2.4), 0, 1.78, TZ - 3.35))
  livery.push(placed(B(1.7, 0.18, 2.3), 0, 2.42, TZ - 3.35))
  trim.push(placed(B(1.3, 1.0, 0.08), 0, 1.8, TZ - 4.58))
  for (let i = 0; i < 7; i++) dark.push(placed(B(1.15, 0.04, 0.04), 0, 1.38 + i * 0.13, TZ - 4.63))
  trim.push(placed(B(2.5, 0.38, 0.32), 0, 1.0, TZ - 4.72))
  for (const s of [-1, 1]) {
    trim.push(placed(B(0.36, 0.18, 0.06), s * 0.82, 1.62, TZ - 4.58))
    // Fenders over the steer axle.
    livery.push(placed(B(0.42, 0.22, 1.6), s * 1.0, 1.45, TZ - 3.6))
    // Steps and fuel tank below the door.
    trim.push(placed(B(0.45, 0.06, 0.5), s * 1.15, 0.85, TZ - 1.0))
    trim.push(placed(B(0.45, 0.06, 0.5), s * 1.15, 0.5, TZ - 1.0))
    const tank = new THREE.CylinderGeometry(0.32, 0.32, 1.3, 10)
    tank.rotateX(Math.PI / 2)
    trim.push(placed(tank, s * 1.0, 0.85, TZ + 0.5))
    tank.dispose()
    // Exhaust stack behind the cab, and heat shield.
    const stack = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8)
    trim.push(placed(stack, s * 1.05, 3.0, TZ + 0.35))
    stack.dispose()
    dark.push(placed(B(0.06, 1.0, 0.24), s * 1.16, 2.6, TZ + 0.35))
    // West-coast mirrors on arms.
    dark.push(placed(B(0.5, 0.04, 0.04), s * 1.45, 3.1, TZ - 2.2))
    dark.push(placed(B(0.08, 0.6, 0.22), s * 1.72, 3.1, TZ - 2.2))
  }
  // Roof air shield, low.
  livery.push(placed(B(2.2, 0.35, 1.0), 0, 4.06, TZ - 0.7))

  emit(body, WHITE, truck, true, 25)

  /* Carmel livery on the tractor, sampled from the fleet photos: sunflower
     yellow above the belt line, sky blue below (truck6/truck7 in the old
     site's images, sunlit paint: #F8C439 and #387DD0). The cab is drawn
     twice from one geometry, each copy clipped at the belt line, so the
     split is a clean painted edge. The materials write alpha 0.6 into the
     scene target -- a marker that tells the pass to print these pixels in
     two tones of their OWN colour (full in light, deeper in shade) instead
     of paper and blue. */
  renderer.localClippingEnabled = true
  const BELT = 2.35
  const paint = (hexc: string, keepAbove: boolean) => {
    const [r, g, b] = hex(hexc)
    const m = new THREE.MeshLambertMaterial({
      color: new THREE.Color().setRGB(r, g, b, THREE.LinearSRGBColorSpace),
      transparent: true, opacity: 0.6, blending: THREE.NoBlending, depthWrite: true,
      clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, keepAbove ? 1 : -1, 0), keepAbove ? -BELT : BELT)],
    })
    disposables.push(m)
    return m
  }
  const liveryGeo = livery.map((p) => (p.index ? p.toNonIndexed() : p))
  const cabYellow = emit(liveryGeo.map((g) => g.clone()), paint("#F8C439", true), truck, true, 25)
  const cabBlue = emit(liveryGeo, paint("#387DD0", false), truck, false)
  for (const m of [cabYellow, cabBlue]) if (m) { m.castShadow = true; m.receiveShadow = true }
  emit(trim, SOFT, truck, true, 25)
  emit(dark, DARK, truck, false)

  // Wheels: tyre drums with a pale hub, steer singles and drive/trailer duals.
  const wheels = new THREE.Group()
  truck.add(wheels)
  const tyre = new THREE.CylinderGeometry(0.52, 0.52, 0.32, 14); tyre.rotateZ(Math.PI / 2)
  const hub = new THREE.CylinderGeometry(0.28, 0.28, 0.34, 10); hub.rotateZ(Math.PI / 2)
  disposables.push(tyre, hub)
  const axles: [number, boolean][] = [[TZ - 3.6, false], [TZ + 1.55, true], [TZ + 2.9, true], [CZ + CL / 2 - 2.2, true], [CZ + CL / 2 - 1.0, true]]
  const spin: THREE.Object3D[] = []
  for (const [z, dual] of axles) for (const s of [-1, 1]) for (const k of dual ? [0, 1] : [0]) {
    const x = s * (1.05 - k * 0.34)
    const w = new THREE.Mesh(tyre, DARK); w.position.set(x, 0.52, z); w.castShadow = true
    const h = new THREE.Mesh(hub, SOFT); h.position.copy(w.position); h.position.x += s * 0.005
    wheels.add(w, h); spin.push(w)
  }

  // The badge, twice: painted on the roof under the ribs, and on the rear
  // doors behind the locking bars. It is the one bitmap in the scene, and the
  // two-tone pass lets it through in its own colours (see "logo" below).
  // The real logo, at 512px (the 128px mark smeared on a 2.4m roof). The
  // two-tone pass lets its colours through untouched (see "logo" below).
  const badgeTex = new THREE.TextureLoader().load("/img/carmel-mark-512.webp", () => { dirty = true })
  badgeTex.anisotropy = 16
  disposables.push(badgeTex)
  const badgeMat = new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })
  disposables.push(badgeMat)
  const roofBadgeGeo = new THREE.CircleGeometry(1.12, 48), rearBadgeGeo = new THREE.CircleGeometry(0.56, 48)
  disposables.push(roofBadgeGeo, rearBadgeGeo)
  const roofBadge = new THREE.Mesh(roofBadgeGeo, badgeMat)
  roofBadge.rotation.x = -Math.PI / 2
  roofBadge.position.set(0, CY + CH + 0.035, CZ) // sits on top of the roof ribs, not under them
  const rearBadge = new THREE.Mesh(rearBadgeGeo, badgeMat)
  rearBadge.position.set(0, CY + CH / 2 + 0.15, RZ + 0.05)
  truck.add(roofBadge, rearBadge)
  // Door roundels, as on the fleet.
  for (const sd of [-1, 1]) {
    const door = new THREE.Mesh(rearBadgeGeo, badgeMat)
    door.scale.setScalar(0.62)
    door.rotation.y = sd * Math.PI / 2
    door.position.set(sd * 1.235, 2.05, TZ - 0.75)
    truck.add(door)
  }

  // Everything on the truck casts and receives.
  truck.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && m.material !== badgeMat) { m.castShadow = true; m.receiveShadow = true } })

  /* ---- two-tone pass ---------------------------------------------------- */
  const rt = new THREE.WebGLRenderTarget(1, 1, { samples: mobile ? 2 : 4, type: THREE.UnsignedByteType })
  disposables.push(rt)
  const pass = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: rt.texture },
      res: { value: new THREE.Vector2(1, 1) },
      ink: { value: v3(PAL.ink) }, blue: { value: v3(PAL.blue) }, blueLift: { value: v3(PAL.blueLift) }, castShade: { value: v3(PAL.castShade) },
      paperDim: { value: v3(PAL.paperDim) }, paper: { value: v3(PAL.paper) },
      skyTop: { value: v3(PAL.skyTop) }, skyLow: { value: v3(PAL.skyLow) },
      horizon: { value: 0.5 }, haze: { value: 0 },
    },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: TWO_TONE_FRAG,
    depthTest: false, depthWrite: false,
  })
  disposables.push(pass)
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pass)
  disposables.push(quad.geometry)
  const postScene = new THREE.Scene(); postScene.add(quad)
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  /* ---- camera ------------------------------------------------------------
     Road and truck stay centred in every view: the camera always sits on
     the road's centreline and aims at the middle of the rig. It starts low
     behind it and rises and tilts until it is straight overhead as the
     truck slows into the junction. */
  const target = new THREE.Vector3()
  const pose = (s: number) => {
    const z = -TRAVEL * (1 - Math.pow(1 - s, 1.7)) // rolls in, eases to a stop
    truck.position.z = z
    for (const w of spin) w.rotation.x = z / 0.52

    const lift = ease(clamp01((s - 0.08) / 0.84))
    const end = overheadFrame(camera.aspect)
    const elev = lerp(3.5, end.elev, lift) * (Math.PI / 180)
    const portrait = camera.aspect < 1
    const dist = lerp(portrait ? 34 : 28, end.dist, ease(clamp01((s - 0.15) / 0.85)))
    target.set(0, lerp(portrait ? 7.5 : 4.2, 0, lift), z + 0.4 - lift * (end.ahead - (BOX.CZ - 0.4))) // above the rig at first: low horizon, big sky
    camera.position.set(0, target.y + Math.sin(elev) * dist, target.z + Math.cos(elev) * dist)
    camera.lookAt(target)

    sun.position.copy(target).addScaledVector(SUN_DIR, 120)
    sun.target.position.copy(target)
    sun.target.updateMatrixWorld()

    // Where the horizon sits on screen, for the sky gradient.
    const h = new THREE.Vector3(0, 0, target.z - 2000).project(camera)
    pass.uniforms.horizon.value = clamp01(h.y * 0.5 + 0.5)
  }

  /* ---- loop ------------------------------------------------------------- */
  let W = 1, H = 1, last = -1
  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
    // Phones render near their native density: the scene is light and only
    // redraws on scroll, and at 1.5x each 1px outline doubled on a 3x screen.
    const dpr = Math.min(mobile ? 2.5 : 2, window.devicePixelRatio || 1)
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)
    rt.setSize(Math.round(W * dpr), Math.round(H * dpr))
    pass.uniforms.res.value.set(W * dpr, H * dpr)
    camera.aspect = W / H
    camera.fov = overheadFrame(camera.aspect).fov
    camera.updateProjectionMatrix()
    dirty = true
  }
  const ro = new ResizeObserver(resize)
  ro.observe(cv)
  resize()

  let raf = 0
  const frame = () => {
    raf = requestAnimationFrame(frame)
    const s = getS()
    if (!dirty && Math.abs(s - last) < 1e-5) return
    dirty = false; last = s
    pose(s)
    renderer.setRenderTarget(rt)
    renderer.setClearColor(0xff00ff, 1)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    renderer.render(postScene, postCam)
  }
  // Compile every program before the first frame so the fade-in is not a
  // stall; where KHR_parallel_shader_compile exists this happens off-thread.
  let alive = true
  const ready = renderer.compileAsync(scene, camera).catch(() => {}).then(() => { if (alive) frame() })

  return Object.assign(() => {
    alive = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    disposables.forEach((d) => d.dispose())
    renderer.dispose()
  }, { ready })
}
