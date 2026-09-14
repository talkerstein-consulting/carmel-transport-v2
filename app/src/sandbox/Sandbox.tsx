import { Cta } from "@/components/site/Cta"
import "./sandbox.css"

/* Palette + component sandbox. Not linked from the site; reach it at /sandbox. */

const swatches = [
  { name: "Off-white", token: "--sb-paper", hex: "#F7F9FC" },
  { name: "Text", token: "--sb-ink", hex: "#081D35" },
  { name: "Highlight", token: "--sb-hi", hex: "#6AB0FF" },
  { name: "CTA accent", token: "--sb-cta", hex: "#FE9B23" },
]

/* Squircle card, after the reference: white shell, tinted inner stage with a
   framed image and a floating status pill, then heading + support line. */
function SquircleCard() {
  return (
    <article className="sb-card">
      <div className="sb-card-stage">
        <div className="sb-card-frame">
          <img src="/img/services/drayage.jpg" alt="" />
        </div>
        <div className="sb-card-pill">
          <span className="sb-card-pill-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
          <span className="sb-card-pill-main">Container 4471</span>
          <span className="sb-card-pill-tail">Delivered</span>
        </div>
      </div>
      <div className="sb-card-body">
        <h3>Port to door,<br />same day.</h3>
        <p>Drayage from Newark and Elizabeth to anywhere in the tri-state.</p>
      </div>
    </article>
  )
}

export default function Sandbox() {
  return (
    <div className="sb">
      <header className="sb-head">
        <p className="sb-eyebrow">Sandbox · palette v2</p>
        <h1>Carmel <em>Transport</em></h1>
        <p className="sb-lead">
          Off-white ground, navy text, one sky-blue highlight, one orange for the action.
          Font stays as built (Google Sans).
        </p>
      </header>

      <section className="sb-sec">
        <h2>Colour</h2>
        <div className="sb-swatches">
          {swatches.map(s => (
            <div className="sb-swatch" key={s.hex}>
              <div className="sb-swatch-chip" style={{ background: `var(${s.token})` }} />
              <strong>{s.name}</strong>
              <code>{s.hex}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="sb-sec">
        <h2>Hero CTA</h2>
        <p className="sb-note">After the Spartan AI hero button: 64px pill, icon tile, label. Chevrons travel the tile edge to edge; on hover the tile snaps across, the label slides in from the left and the chevrons park right.</p>
        <div className="sb-row">
          <Cta href="#quote">Get a quote</Cta>
          <Cta href="#quote" tone="accent" live>Get a quote</Cta>
        </div>
      </section>

      <section className="sb-sec">
        <h2>Type</h2>
        <p className="sb-display">Drayage that <em>shows up.</em></p>
        <p className="sb-body">Same-day port pulls from Newark, Elizabeth and Bayonne. 300 power units, 800+ chassis, 30 reefer slots on a secured yard in Kearny. Open 24/7/365.</p>
      </section>

      <section className="sb-sec">
        <h2>Card</h2>
        <div className="sb-cards">
          <SquircleCard />
        </div>
      </section>
    </div>
  )
}
