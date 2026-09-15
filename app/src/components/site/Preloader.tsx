import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import Globe from "@/components/globe"
import "./preloader.css"

/* Homepage preloader. A navy screen with the globe and its arcs while the
   hero footage comes in; once the frames are ready the navy plate does not
   fade out, it shrinks into the nav bar -- the pill's plate IS this plate,
   landed -- while the footage is already on screen beneath it.

   Timing: the hero scrub reports its progress on the window; the screen
   holds for at least MIN_MS so the globe reads as more than a flash, and
   leaves at MAX_MS regardless so a slow frame can never hold the page. */
const HERO_SRC = "/seq/hero/f-{i}.webp?v=5"

/* --- the stand-in globe ----------------------------------------------------
   globe.gl is three.js and a WebGL context: even preloaded from index.html it
   is the better part of a second to first paint, which is most of the time a
   preloader is on screen. This is a 2D canvas sphere -- dotted graticule,
   atmosphere, and the same orange arcs -- that paints on the first frame and
   crossfades out underneath the real globe once that has faded in. */
function StandIn({ hidden }: { hidden: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    type P = [number, number, number]
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const toV = (lat: number, lon: number): P => {
      const la = (lat * Math.PI) / 180, lo = (lon * Math.PI) / 180
      return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
    }
    const rotY = ([x, y, z]: P, a: number): P => [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)]
    const slerp = (a: P, b: P, t: number): P => {
      const d = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
      const w = Math.acos(d), s = Math.sin(w) || 1e-6
      const ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s
      return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb]
    }

    /* graticule dots, denser toward the equator like a land-dot globe */
    const dots: P[] = []
    for (let lat = -80; lat <= 80; lat += 8) {
      const n = Math.max(6, Math.round(44 * Math.cos((lat * Math.PI) / 180)))
      for (let i = 0; i < n; i += 1) dots.push(toV(lat, (i / n) * 360))
    }
    /* arcs: a few at a time, each with its own life */
    type Arc = { a: P; b: P; t0: number; dur: number }
    const arcs: Arc[] = []
    const spawn = (now: number) => {
      const a = toV(rnd(-55, 65), rnd(0, 360))
      const b = toV(rnd(-55, 65), rnd(0, 360))
      arcs.push({ a, b, t0: now, dur: rnd(1600, 2400) })
      if (arcs.length > 6) arcs.shift()
    }

    let raf = 0
    let last = 0
    let spin = 0
    let nextSpawn = performance.now()
    const draw = (now: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const box = cv.getBoundingClientRect()
      const w = Math.max(1, Math.round(box.width)), h = Math.max(1, Math.round(box.height))
      if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const dt = last ? Math.min(50, now - last) : 0
      last = now
      if (!reduced) spin += dt * 0.00012
      if (now >= nextSpawn) { spawn(now); nextSpawn = now + rnd(350, 700) }

      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.40
      const proj = (p: P) => ({ x: cx + p[0] * R, y: cy - p[1] * R, z: p[2] })

      /* atmosphere + sphere */
      const glow = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.28)
      glow.addColorStop(0, "rgba(106,176,255,.30)")
      glow.addColorStop(1, "rgba(106,176,255,0)")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R)
      body.addColorStop(0, "#1a3a63")
      body.addColorStop(1, "#081D35")
      ctx.fillStyle = body
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()

      /* dots */
      for (const d of dots) {
        const q = proj(rotY(d, spin))
        if (q.z <= 0.02) continue
        ctx.globalAlpha = 0.18 + q.z * 0.6
        ctx.fillStyle = "#6AB0FF"
        ctx.beginPath(); ctx.arc(q.x, q.y, 1.1 + q.z * 0.9, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1

      /* arcs: a head travelling a to b with a fading tail, lifted off the surface */
      ctx.lineCap = "round"
      for (const arc of arcs) {
        const life = (now - arc.t0) / arc.dur
        if (life > 1.6) continue
        const head = Math.min(1, life / 0.75)
        const tail = Math.max(0, (life - 0.55) / 0.75)
        if (tail >= head) continue
        ctx.beginPath()
        let pen = false
        const steps = 40
        for (let i = 0; i <= steps; i += 1) {
          const t = tail + (head - tail) * (i / steps)
          const v = slerp(arc.a, arc.b, t)
          const lift = 1 + 0.32 * Math.sin(Math.PI * t)
          const q = proj(rotY([v[0] * lift, v[1] * lift, v[2] * lift], spin))
          if (q.z < -0.15) { pen = false; continue }
          if (!pen) { ctx.moveTo(q.x, q.y); pen = true } else ctx.lineTo(q.x, q.y)
        }
        ctx.strokeStyle = "#FE9B23"
        ctx.lineWidth = 1.6
        ctx.globalAlpha = life > 1 ? Math.max(0, 1.6 - life) / 0.6 : 1
        ctx.stroke()
        /* landing ring */
        if (head >= 1) {
          const q = proj(rotY(arc.b, spin))
          if (q.z > 0) {
            const k = Math.min(1, (life - 0.75) / 0.6)
            ctx.beginPath(); ctx.arc(q.x, q.y, 2 + k * 10, 0, Math.PI * 2)
            ctx.strokeStyle = "#FE9B23"; ctx.lineWidth = 1; ctx.globalAlpha = 1 - k; ctx.stroke()
          }
        }
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas className={"pre-standin" + (hidden ? " is-hidden" : "")} ref={ref} aria-hidden="true" />
}
const MIN_MS = 2400
const MAX_MS = 7000

export function Preloader() {
  const [gone, setGone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const plate = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  /* true once the WebGL globe has faded in and the stand-in can go */
  const [realUp, setRealUp] = useState(false)
  const globeBox = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = globeBox.current
    if (!box) return
    const check = () => {
      const g = box.querySelector<HTMLElement>(":scope > div")
      if (g && g.style.opacity === "1") { setRealUp(true); return true }
      return false
    }
    if (check()) return
    const mo = new MutationObserver(() => { if (check()) mo.disconnect() })
    mo.observe(box, { subtree: true, attributes: true, attributeFilter: ["style"], childList: true })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    const el = root.current
    const pl = plate.current
    const bd = body.current
    if (!el || !pl || !bd) return

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = "hidden"

    const t0 = performance.now()
    let ready = false
    let leaving = false

    const leave = () => {
      if (leaving) return
      leaving = true
      html.style.overflow = prevOverflow

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      /* whichever nav is showing at this width */
      const pill = [...document.querySelectorAll<HTMLElement>(".nav-pill")].find(
        (p) => p.getBoundingClientRect().width > 0,
      )
      const done = () => setGone(true)

      if (reduced || !pill) {
        gsap.to(el, { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: done })
        return
      }

      const r = pill.getBoundingClientRect()
      const radius = getComputedStyle(pill).borderRadius
      const tl = gsap.timeline({ onComplete: done })
      tl.to(bd, { opacity: 0, scale: 0.92, duration: 0.45, ease: "power2.in" }, 0)
        /* the plate travels to the pill's exact box, taking its radius */
        .to(pl, {
          top: r.top, left: r.left, width: r.width, height: r.height,
          borderRadius: radius,
          duration: 0.9, ease: "power4.inOut",
        }, 0.15)
        /* then hands off to the pill's own (translucent) plate beneath it */
        .to(pl, { opacity: 0, duration: 0.35, ease: "power2.out" }, ">-0.05")
    }

    const tryLeave = () => {
      if (!ready) return
      const wait = Math.max(0, MIN_MS - (performance.now() - t0))
      window.setTimeout(leave, wait)
    }

    const onProgress = (e: Event) => {
      const d = (e as CustomEvent<{ src: string; ready: number }>).detail
      if (d.src !== HERO_SRC) return
      setProgress(d.ready)
      if (d.ready >= 1 && !ready) { ready = true; tryLeave() }
    }
    window.addEventListener("framescrub:progress", onProgress)
    const cap = window.setTimeout(() => { ready = true; leave() }, MAX_MS)

    return () => {
      window.removeEventListener("framescrub:progress", onProgress)
      window.clearTimeout(cap)
      html.style.overflow = prevOverflow
    }
  }, [])

  if (gone) return null

  /* Portalled to body: #root is scaled for its entrance, and position:fixed
     inside a transformed ancestor is fixed to that ancestor, not the screen. */
  return createPortal(
    <div className="pre" ref={root} role="status" aria-label="Loading">
      <div className="pre-plate" ref={plate} />
      <div className="pre-body" ref={body}>
        <div className="pre-globe" aria-hidden="true" ref={globeBox}>
          <StandIn hidden={realUp} />
          <Globe
            width="auto"
            height="auto"
            primaryColor="#FE9B23"
            neutralColor="#3E92F5"
            globeColor="#081D35"
            atmosphereColor="#6AB0FF"
            showAtmosphere
            autoRotateSpeed={0.6}
            enableZoom={false}
            interactive={false}
            arcCount={6}
            arcInterval={2200}
            arcAnimationDuration={1400}
          />
        </div>
        <div className="pre-wm">
          <img src="/img/carmel-mark.png" alt="" width="28" height="28" decoding="async" />
          <span className="wm">Carmel</span>
        </div>
        <div className="pre-bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress.toFixed(3)})` }} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
