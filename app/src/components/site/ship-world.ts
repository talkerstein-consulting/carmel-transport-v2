import * as THREE from "three"
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js"
import { Water } from "three/examples/jsm/objects/Water.js"
import { BOX, PAL, TWO_TONE_FRAG, overheadFrame, v3 } from "./truck-world"

/* Act two, drawn: the container ship. Same two-tone print as the truck
   (the pass is shared), and the shot opens on EXACTLY the frame the truck
   shot closes on -- the Carmel 40ft box, straight down, same lens, same
   distance above its roof, same offset from screen centre -- so the wipe
   between the two canvases is a match cut. From there the camera climbs
   off the ship, through a cloud layer, and hazes out into the pale section
   that follows.

   The Carmel box sits logically: on the top tier of a stack of four, in a
   mid-ship bay, with its neighbours no taller, so its roof is the one you
   see. Detail is deliberately low -- hull, deck, a forecastle, the stern
   tower and funnel, and bays of plain boxes. */

const ease = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = THREE.MathUtils.lerp

export function mountShipWorld(cv: HTMLCanvasElement, getS: () => number, getHaze?: () => number | null) {
  const mobile = Math.min(window.innerWidth, window.innerHeight) < 700
  let dirty = true
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: false, powerPreference: "high-performance" })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 6000)

  // Lighting matched to the truck shot, so the two frames print alike.
  scene.add(new THREE.AmbientLight("#ffffff", 0.32 * Math.PI))
  const sun = new THREE.DirectionalLight("#ffffff", 0.95 * Math.PI)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.radius = 3
  sun.shadow.intensity = 0.6
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.03
  const sc = sun.shadow.camera
  sc.left = -130; sc.right = 130; sc.top = 130; sc.bottom = -130; sc.near = 1; sc.far = 500
  scene.add(sun, sun.target)
  const SUN_DIR = new THREE.Vector3(-0.55, 0.62, -0.56).normalize()

  const disposables: { dispose(): void }[] = []
  const lambert = (l: number) => {
    const m = new THREE.MeshLambertMaterial({ color: new THREE.Color(l, l, l) })
    disposables.push(m)
    return m
  }
  // Mid-dark grey, not black: the pass prints it in the deep shadow blue
  // rather than full ink, so outlines read lighter (a touch lighter still
  // on phones, where lines sit closer together).
  const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color().setScalar(mobile ? 0.34 : 0.3) })
  disposables.push(lineMat)

  type Part = THREE.BufferGeometry
  const placed = (g: Part, x: number, y: number, z: number, ry = 0, sx = 1, sy = 1, sz = 1) =>
    g.clone().applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3(x, y, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, ry, 0)),
      new THREE.Vector3(sx, sy, sz),
    ))
  const emit = (parts: Part[], mat: THREE.Material, parent: THREE.Object3D, outline = true, shadows = true) => {
    if (!parts.length) return
    const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)), false)!
    parts.forEach((p) => p.dispose())
    disposables.push(g)
    const mesh = new THREE.Mesh(g, mat)
    mesh.castShadow = shadows
    mesh.receiveShadow = shadows
    parent.add(mesh)
    if (outline) {
      const eg = new THREE.EdgesGeometry(g, 30)
      disposables.push(eg)
      parent.add(new THREE.LineSegments(eg, lineMat))
    }
    return mesh
  }
  const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d)

  let seed = 23
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)

  /* ---- sea --------------------------------------------------------------
     three.js's Water shader (after liquid.fish's ocean): moving normal-mapped
     ripples, sun glitter, fresnel reflection of the ship and the cloud layer.
     It renders in brand blue, and because its pixels are saturated the
     two-tone pass leaves them alone -- real water under a drawn ship. The
     ripple normal map is generated here (tileable fbm, 256px) rather than
     downloaded. */
  const NM = 256
  const nc = document.createElement("canvas")
  nc.width = nc.height = NM
  {
    const hs = (x: number, y: number) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v) }
    const vn = (x: number, y: number, p: number) => {
      const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
      const w = (a: number) => ((a % p) + p) % p
      const a = hs(w(xi), w(yi)), b = hs(w(xi + 1), w(yi)), c = hs(w(xi), w(yi + 1)), d = hs(w(xi + 1), w(yi + 1))
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
    }
    const hgt = new Float32Array(NM * NM)
    for (let y = 0; y < NM; y++) for (let x = 0; x < NM; x++) {
      let v = 0, amp = 1, f = 6
      for (let o = 0; o < 5; o++) { v += vn((x / NM) * f, (y / NM) * f, f) * amp; amp *= 0.5; f *= 2 }
      hgt[y * NM + x] = v
    }
    const g = nc.getContext("2d")!, img = g.createImageData(NM, NM)
    for (let y = 0; y < NM; y++) for (let x = 0; x < NM; x++) {
      const at = (i: number, j: number) => hgt[((j + NM) % NM) * NM + ((i + NM) % NM)]
      const dx = (at(x + 1, y) - at(x - 1, y)) * 3, dy = (at(x, y + 1) - at(x, y - 1)) * 3
      const len = Math.hypot(dx, dy, 1), k = (y * NM + x) * 4
      img.data[k] = ((-dx / len) * 0.5 + 0.5) * 255
      img.data[k + 1] = ((-dy / len) * 0.5 + 0.5) * 255
      img.data[k + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[k + 3] = 255
    }
    g.putImageData(img, 0, 0)
  }
  const waterNormals = new THREE.CanvasTexture(nc)
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  waterNormals.colorSpace = THREE.NoColorSpace
  disposables.push(waterNormals)
  // Colours are given as the sRGB bytes they should print as (the renderer
  // writes linear values straight out; see truck-world).
  const raw = (h: number[]) => new THREE.Color().setRGB(h[0], h[1], h[2], THREE.LinearSRGBColorSpace)
  const waterGeo = new THREE.PlaneGeometry(20000, 20000)
  const water = new Water(waterGeo, {
    textureWidth: mobile ? 256 : 512,
    textureHeight: mobile ? 256 : 512,
    waterNormals,
    // Its own sun, nearer overhead than the shadow light: looking straight
    // down, glitter only shows if the light can bounce back up at the lens.
    sunDirection: new THREE.Vector3(-0.18, 0.95, -0.25).normalize(),
    sunColor: 0xb4b4b4, // dimmed: full white glitter crowded the headline
    waterColor: raw(PAL.blue),
    distortionScale: 4,
    fog: false,
  })
  water.rotation.x = -Math.PI / 2
  water.receiveShadow = true
  // Alpha marker: tells the pass these pixels are water (see TWO_TONE_FRAG).
  water.material.uniforms.alpha.value = 0.2
  water.material.uniforms.size.value = 0.7 // larger ripples: readable from 60m up
  disposables.push(waterGeo, water.material)
  // The mirror pass clears with the renderer's colour, which here is the
  // magenta sky key -- reflected, that would print pink. Reflect the brand
  // sky instead, then put the key back for the main render.
  const skyRaw = raw(PAL.skyLow)
  const mirror = water.onBeforeRender.bind(water)
  water.onBeforeRender = (...a: Parameters<typeof mirror>) => {
    renderer.setClearColor(skyRaw, 1)
    mirror(...a)
    renderer.setClearColor(0xff00ff, 1)
  }
  scene.add(water)

  /* ---- ship -------------------------------------------------------------
     Bow toward -z, origin at the waterline under midships. */
  const ship = new THREE.Group()
  scene.add(ship)
  const LEN = 190, BEAM = 32, DECK = 10, STERN = LEN / 2, BOW = -LEN / 2

  // Hull: a plan outline (flat stern, pointed bow) extruded up from below
  // the waterline. Mid grey, so both flanks print in full blue.
  const plan = new THREE.Shape()
  plan.moveTo(-BEAM / 2, -STERN); plan.lineTo(BEAM / 2, -STERN); plan.lineTo(BEAM / 2, 50)
  plan.quadraticCurveTo(BEAM / 2, 80, 0, -BOW + 2); plan.quadraticCurveTo(-BEAM / 2, 80, -BEAM / 2, 50)
  plan.lineTo(-BEAM / 2, -STERN)
  const hullGeo = new THREE.ExtrudeGeometry(plan, { depth: DECK + 4, bevelEnabled: false, curveSegments: 6 })
  hullGeo.rotateX(-Math.PI / 2) // shape "forward" -> -z, extrusion -> up
  hullGeo.translate(0, -4, 0)
  emit([hullGeo], lambert(0.42), ship)

  // Deck plate, a raised forecastle and a bulwark at the bow.
  const deck: Part[] = []
  const deckGeo = new THREE.ShapeGeometry(plan, 6)
  deckGeo.rotateX(-Math.PI / 2)
  deck.push(placed(deckGeo, 0, DECK + 0.02, 0, 0, 0.97, 1, 0.98))
  deckGeo.dispose()
  emit(deck, lambert(0.86), ship, false)
  const fore: Part[] = [placed(B(BEAM - 6, 2.4, 14), 0, DECK + 1.2, BOW + 22)]
  emit(fore, lambert(1), ship)

  // Stern tower: accommodation block, bridge deck with wings, a window
  // band, and the funnel behind it.
  const tower: Part[] = [
    placed(B(24, 20, 14), 0, DECK + 10, STERN - 24),
    placed(B(BEAM + 2, 2.2, 8), 0, DECK + 21, STERN - 26),
    placed(B(8, 11, 9), 0, DECK + 5.5, STERN - 9), // funnel casing
  ]
  emit(tower, lambert(1), ship)
  emit([placed(B(24.2, 1.2, 14.2), 0, DECK + 17, STERN - 24), placed(B(BEAM + 2.2, 0.8, 8.2), 0, DECK + 21.4, STERN - 26)], lambert(0.12), ship, false)
  emit([placed(B(6, 2, 7), 0, DECK + 12, STERN - 9)], lambert(0.12), ship, false) // funnel top

  // Detail, kept to what reads from above: a dark boot-top band at the
  // waterline, deck rails, hatch coamings and lashing bridges between the
  // bays, mooring winches and bitts on the forecastle, lifeboats and a
  // radar mast on the tower, and a mast at the bow.
  const dark: Part[] = [], trim: Part[] = []
  {
    const band = new THREE.ExtrudeGeometry(plan, { depth: 1.2, bevelEnabled: false, curveSegments: 6 })
    band.rotateX(-Math.PI / 2); band.scale(1.005, 1, 1.003); band.translate(0, -0.2, 0)
    dark.push(band)
  }
  for (const s of [-1, 1]) trim.push(placed(B(0.12, 1.1, LEN - 40), s * (BEAM / 2 - 0.3), DECK + 0.55, 0))
  for (let b = 0; b <= 9; b++) {
    const z = BOW + 32 + b * (12.2 + 1.6) - 0.8
    trim.push(placed(B(BEAM - 3, 0.5, 0.5), 0, DECK + 0.25, z))         // coaming
    trim.push(placed(B(BEAM - 4, 0.25, 0.25), 0, DECK + 5.2, z))        // lashing bridge rail
    for (const s of [-1, 0, 1]) trim.push(placed(B(0.3, 5.2, 0.3), s * (BEAM / 2 - 3), DECK + 2.6, z))
  }
  const drum = new THREE.CylinderGeometry(0.9, 0.9, 1.6, 10); drum.rotateZ(Math.PI / 2)
  for (const s of [-1, 1]) {
    trim.push(placed(drum, s * 5, DECK + 3.3, BOW + 22))
    for (const k of [0, 1]) trim.push(placed(B(0.6, 1, 0.6), s * (BEAM / 2 - 4), DECK + 2.9, BOW + 16 + k * 2))
    // Lifeboats in davits either side of the tower.
    const boat = new THREE.CapsuleGeometry(1.4, 5, 3, 8); boat.rotateX(Math.PI / 2)
    trim.push(placed(boat, s * (BEAM / 2 + 0.6), DECK + 9, STERN - 24))
    boat.dispose()
  }
  drum.dispose()
  trim.push(placed(B(1, 7, 1), 0, DECK + 24.5, STERN - 24))              // radar mast
  trim.push(placed(B(6, 0.3, 0.5), 0, DECK + 27, STERN - 24))            // radar
  trim.push(placed(B(0.8, 9, 0.8), 0, DECK + 7, BOW + 14))               // fore mast
  emit(trim, lambert(1), ship)
  emit(dark, lambert(0.12), ship, false)


  /* ---- cargo ------------------------------------------------------------
     Bays of 40ft boxes, twelve across, stacked two to five high (lower
     toward the bow, where the deck narrows). Four tones -- paper, dim paper,
     pale blue, blue -- so the stacks read as varied cargo in two colours. */
  const { CL, CH, CW } = BOX
  const ROWS = 12, PITCH = CW + 0.06
  const tones = [lambert(1), lambert(0.86), lambert(0.74), lambert(0.4)]
  const byTone: Part[][] = tones.map(() => [])
  const boxGeo = B(CW - 0.04, CH - 0.04, CL - 0.08)
  disposables.push(boxGeo)

  const BAYS = 9, BAY0 = BOW + 32, BAY_PITCH = CL + 1.6
  const CARMEL_BAY = 4, CARMEL_ROW = 6, CARMEL_UNDER = 4 // sits on a stack of four
  const rowX = (r: number) => (r - (ROWS - 1) / 2) * PITCH
  const bayZ = (b: number) => BAY0 + CL / 2 + b * BAY_PITCH
  for (let b = 0; b < BAYS; b++) {
    const bowTaper = b < 2 ? 2 - b : 0
    for (let r = bowTaper; r < ROWS - bowTaper; r++) {
      let tiers = 2 + Math.floor(rnd() * 4) - (b < 2 ? 1 : 0)
      // Around the Carmel box nothing stands taller than its stack, so its
      // roof is the top surface in view; its own stack is exactly four.
      if (b === CARMEL_BAY && r === CARMEL_ROW) tiers = CARMEL_UNDER
      else if (Math.abs(b - CARMEL_BAY) <= 1 && Math.abs(r - CARMEL_ROW) <= 2) tiers = Math.min(tiers, CARMEL_UNDER)
      for (let t = 0; t < tiers; t++) {
        const tone = Math.floor(rnd() * tones.length)
        byTone[tone].push(placed(boxGeo, rowX(r), DECK + CH / 2 + t * CH, bayZ(b)))
      }
    }
  }
  byTone.forEach((parts, i) => emit(parts, tones[i], ship))

  // The Carmel box: same build as the truck's -- brand-blue-tone body, side
  // and roof corrugation, the logo on top of the roof ribs.
  const carmel = new THREE.Group()
  const cx = rowX(CARMEL_ROW), cz = bayZ(CARMEL_BAY), cBase = DECK + CARMEL_UNDER * CH
  carmel.position.set(cx, cBase, cz)
  ship.add(carmel)
  const cParts: Part[] = [placed(B(CW - 0.08, CH - 0.12, CL - 0.16), 0, CH / 2, 0)]
  for (let i = 0; i < 40; i++) {
    const z = -CL / 2 + 0.3 + i * ((CL - 0.6) / 39)
    for (const s of [-1, 1]) cParts.push(placed(B(0.06, CH - 0.34, 0.14), s * (CW / 2 - 0.02), CH / 2, z))
  }
  for (let i = 0; i < 30; i++) cParts.push(placed(B(CW - 0.3, 0.04, 0.16), 0, CH, -CL / 2 + 0.3 + i * ((CL - 0.6) / 29)))
  emit(cParts, lambert(1), carmel)

  const badgeTex = new THREE.TextureLoader().load("/img/carmel-mark-512.webp", () => { dirty = true })
  badgeTex.anisotropy = 16
  const badgeMat = new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })
  const badgeGeo = new THREE.CircleGeometry(1.12, 48)
  disposables.push(badgeTex, badgeMat, badgeGeo)
  const badge = new THREE.Mesh(badgeGeo, badgeMat)
  badge.rotation.x = -Math.PI / 2
  badge.position.set(0, CH + 0.035, 0)
  carmel.add(badge)

  /* Wake: one foam sheet from the stem to ~900m astern, riding with the
     ship. Its noise is sampled in WATER coordinates (local position plus
     distance sailed), so the foam stays put on the sea while the ship pulls
     away -- that is what sells the motion. Geometry follows the hull:
       - bow foam hugs the hull's own curve from the stem, fading by 60m;
       - the Kelvin arms start AT THE STEM and diverge at 19.5 deg, so they
         run outside the hull and on past the stern, as real ones do;
       - the propeller wash starts as wide as the stern, pinches in, then
         widens and breaks up with distance.
     It blends colour only and leaves the scene target's alpha alone, so the
     pass still reads the sea underneath as water. */
  const foamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
    uniforms: { travel: { value: 0 }, beam: { value: BEAM }, len: { value: LEN } },
    vertexShader: /* glsl */ `
      varying vec2 vP;
      void main(){ vP = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float travel, beam, len;
      varying vec2 vP;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
        return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
      float fbm(vec2 p){ return n(p) * 0.55 + n(p * 2.1 + 3.0) * 0.3 + n(p * 4.3 + 7.0) * 0.15; }
      void main(){
        float x = abs(vP.x);
        float d = vP.y;                 // metres astern of the transom (negative alongside the hull)
        float D = d + len;              // metres aft of the stem
        vec2 w = vec2(vP.x, d - travel); // water coordinates
        float a = 0.0;
        // Bow foam along the hull's curve (half-beam reached ~45m aft of the stem).
        float hull = beam * 0.5 * sqrt(clamp(D / 45.0, 0.0, 1.0));
        a += (1.0 - smoothstep(0.4, 2.4 + D * 0.03, abs(x - hull - 0.6)))
             * smoothstep(0.3, 0.6, fbm(w * 0.25)) * (1.0 - smoothstep(10.0, 70.0, D)) * step(0.0, D);
        // Kelvin arms from the stem.
        float arm = abs(x - D * 0.354);
        // Thin, and broken by fine noise into short ripples rather than a line.
        a += (1.0 - smoothstep(0.3, 1.0 + D * 0.006, arm)) * step(hull + 1.0, x)
             * smoothstep(0.5, 0.72, fbm(w * vec2(0.35, 0.22) + 5.0)) * exp(-max(d, 0.0) / 380.0) * 0.5;
        // Propeller wash behind the transom.
        if (d > 0.0) {
          float half_ = mix(beam * 0.48, beam * 0.3, smoothstep(0.0, 50.0, d)) + max(d - 50.0, 0.0) * 0.05;
          float wash = 1.0 - smoothstep(half_ * 0.6, half_, x);
          float churn = smoothstep(0.42, 0.7, fbm(w * vec2(0.18, 0.07)));
          a += wash * mix(0.95, churn, smoothstep(0.0, 70.0, d)) * exp(-d / 280.0);
        }
        gl_FragColor = vec4(vec3(1.0), clamp(a, 0.0, 0.95));
      }`,
  })
  const wakeGeo = new THREE.PlaneGeometry(500, LEN + 900, 1, 1)
  wakeGeo.rotateX(-Math.PI / 2)
  wakeGeo.translate(0, 0, (900 - LEN) / 2) // local z = metres astern of the transom, -LEN..900
  const wakeMesh = new THREE.Mesh(wakeGeo, foamMat)
  wakeMesh.position.set(0, 0.15, STERN)
  ship.add(wakeMesh)
  disposables.push(foamMat, wakeGeo)

  /* ---- clouds -----------------------------------------------------------
     Wispy: flat sheets carrying a generated fbm alpha (one 256px canvas,
     made here, not downloaded), stretched long along the wind and stacked at
     a few heights, so from above they read as thin drifting cirrus over the
     sea rather than as solid puffs. Unlit white; where they thin out the
     pass prints them through its pale bands, which keeps the edges soft. */
  const cc = document.createElement("canvas")
  cc.width = cc.height = 256
  {
    const g = cc.getContext("2d")!, img = g.createImageData(256, 256)
    const hs = (x: number, y: number) => { const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return v - Math.floor(v) }
    const vn = (x: number, y: number, p: number) => { // tileable value noise, period p
      const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
      const a = hs(xi % p, yi % p), b = hs((xi + 1) % p, yi % p), c = hs(xi % p, (yi + 1) % p), d = hs((xi + 1) % p, (yi + 1) % p)
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
    }
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      let v = 0, amp = 0.55, f = 4
      for (let o = 0; o < 5; o++) { v += vn((x / 256) * f, (y / 256) * f, f) * amp; amp *= 0.5; f *= 2 }
      // Fade to nothing at the sheet's edge so no square shows.
      const ex = Math.min(x, 255 - x) / 60, ey = Math.min(y, 255 - y) / 60
      const edge = Math.min(1, ex) * Math.min(1, ey)
      const a = Math.max(0, Math.min(1, (v - 0.52) * 3.2)) * edge
      const i = (y * 256 + x) * 4
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255; img.data[i + 3] = Math.round(a * 255)
    }
    g.putImageData(img, 0, 0)
  }
  const cloudTex = new THREE.CanvasTexture(cc)
  const cloudMat = new THREE.MeshBasicMaterial({
    map: cloudTex, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    // Colour only: leave the target's alpha marker as it is, or cloud over the
    // sea stops reading as water and prints grey in the pass.
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
  })
  const sheet = new THREE.PlaneGeometry(1, 1)
  sheet.rotateX(-Math.PI / 2)
  disposables.push(cloudTex, cloudMat, sheet)
  const cloudLayer = new THREE.Group()
  scene.add(cloudLayer)
  for (let i = 0; i < 46; i++) {
    const m = new THREE.Mesh(sheet, cloudMat)
    const w = 260 + rnd() * 420
    m.scale.set(w, 1, w * (0.35 + rnd() * 0.3))
    m.rotation.y = (rnd() - 0.5) * 0.5
    m.position.set((rnd() - 0.5) * 1100, 560 + rnd() * 260, 200 - rnd() * 1700) // above the stats stretch; met late in the climb
    m.renderOrder = 2
    cloudLayer.add(m)
  }

  /* ---- two-tone pass (shared) ------------------------------------------ */
  const rt = new THREE.WebGLRenderTarget(1, 1, { samples: mobile ? 2 : 4, type: THREE.UnsignedByteType })
  const pass = new THREE.ShaderMaterial({
    uniforms: {
      tScene: { value: rt.texture },
      res: { value: new THREE.Vector2(1, 1) },
      ink: { value: v3(PAL.ink) }, blue: { value: v3(PAL.blue) }, blueLift: { value: v3(PAL.blueLift) }, castShade: { value: v3(PAL.castShade) },
      paperDim: { value: v3(PAL.paperDim) }, paper: { value: v3(PAL.paper) },
      skyTop: { value: v3(PAL.skyTop) }, skyLow: { value: v3(PAL.skyLow) },
      horizon: { value: 0 }, haze: { value: 0 },
    },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
    fragmentShader: TWO_TONE_FRAG,
    depthTest: false, depthWrite: false,
  })
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pass)
  disposables.push(rt, pass, quad.geometry)
  const postScene = new THREE.Scene(); postScene.add(quad)
  const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  /* ---- camera ------------------------------------------------------------
     s 0 -> HOLD : the truck's closing frame, exactly. Its camera sat
                   dist above a target on the ground, the container roof at
                   CY + CH above that ground and its centre `ahead` behind
                   the target. Rebuild that against a virtual ground the same
                   height below this roof, and the box matches in size and
                   place across the cut.
     HOLD -> 1   : climb straight up off the ship and through the cloud
                   layer; the last stretch hazes out to the pale section. */
  const HOLD = 0.16
  const roofY = cBase + CH
  const target = new THREE.Vector3()
  const pose = (s: number) => {
    // The ship steams on -- with the scroll, and steadily with the clock
    // while the section is on screen. The camera rides with it, so it is the
    // sea and the foam left behind on it that show the speed.
    const travel = s * 260 + clock * 7
    const sail = -travel
    foamMat.uniforms.travel.value = travel
    ship.position.z = sail
    const f = overheadFrame(camera.aspect)
    const climb = ease(clamp01((s - HOLD) / (1 - HOLD)))
    const dist = lerp(f.dist, 1150, Math.pow(climb, 1.6))
    const elev = f.elev * (Math.PI / 180)
    // Drift from the box toward midships as we rise, so the whole ship
    // settles into the middle of the frame instead of sliding off one side.
    const toMid = ease(clamp01((s - HOLD) / 0.4))
    target.set(
      lerp(cx, 0, toMid),
      roofY - (BOX.CY + BOX.CH),
      lerp(cz - f.ahead, 0, toMid) + sail,
    )
    camera.position.set(target.x, target.y + Math.sin(elev) * dist, target.z + Math.cos(elev) * dist)
    camera.lookAt(target)

    sun.position.copy(target).addScaledVector(SUN_DIR, 250)
    sun.target.position.copy(target)
    sun.target.updateMatrixWorld()
    // The shot must be a flat #D5E7F2 field by the time .act-three rises over
    // this canvas. ShipScene measures that section directly; the scroll-based
    // ramp is only the fallback.
    const placed_ = getHaze?.()
    pass.uniforms.haze.value = placed_ ?? ease(clamp01((s - 0.72) / 0.14))
    // The swell moves with the scroll (and with the clock, where we animate).
    water.material.uniforms.time.value = s * 30 + clock
  }

  /* ---- loop ------------------------------------------------------------- */
  let W = 1, H = 1, last = -1
  const resize = () => {
    const r = cv.getBoundingClientRect()
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
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

  /* Water wants to move even when the page is still. On desktop, while the
     canvas is on screen, the clock runs and every frame redraws; on phones
     (and with reduced motion) it only moves with the scroll, which keeps the
     GPU idle when nothing is happening. */
  let clock = 0, prevT = 0, onScreen = false
  const animate = !mobile && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting })
  io.observe(cv)

  let raf = 0
  const frame = (t = 0) => {
    raf = requestAnimationFrame(frame)
    const s = getS()
    if (animate && onScreen) { clock += Math.min(0.05, (t - prevT) / 1000) * 0.6; dirty = true }
    prevT = t
    if (!dirty && Math.abs(s - last) < 1e-5) return
    dirty = false; last = s
    pose(s)
    renderer.setRenderTarget(rt)
    renderer.setClearColor(0xff00ff, 1)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    renderer.render(postScene, postCam)
  }
  let alive = true
  const ready = renderer.compileAsync(scene, camera).catch(() => {}).then(() => { if (alive) frame() })

  return Object.assign(() => {
    alive = false
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    disposables.forEach((d) => d.dispose())
    renderer.dispose()
  }, { ready })
}
