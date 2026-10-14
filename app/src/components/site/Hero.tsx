import { Cta } from "./Cta"
import { QUOTE_HREF, CALL } from "@/lib/contact"

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
        {/* The two things a buyer arrives to do, in the first screen. */}
        <div className="hero-actions">
          <Cta href={QUOTE_HREF} tone="accent">Get a quote</Cta>
          <Cta href={CALL.href}>Call {CALL.label}</Cta>
        </div>
      </div>
    </section>
  )
}
