import { WordRoll } from "./WordRoll"

export function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-head">
        <span className="l1">Move</span>
        <span className="l2">freight</span>
        <span className="l3">forward</span>
      </h1>

      <div className="hero-aside">
        <p className="hero-lead">
          From port to destination, Carmel delivers reliable drayage, intermodal
          transportation, refrigerated logistics, and storage solutions built
          around your business.
        </p>
        <div className="hero-actions">
          <WordRoll className="link-caps" href="#services">Explore Services</WordRoll>
          <WordRoll className="link-caps" href="#quote">Request a Quote</WordRoll>
        </div>
      </div>
    </section>
  )
}
