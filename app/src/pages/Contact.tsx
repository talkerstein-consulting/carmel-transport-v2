import { PageShell, PageBlock } from "./PageShell"
import { QuoteSequence, CONTACT_STEPS } from "@/components/site/QuoteSequence"
import { MapPin, Clock, Phone, Mail } from "lucide-react"

/* /contact — copy ported verbatim from carmel-usa-scrape/text/en_contact-us.txt.
   The source page's Google map iframe is dropped: it was a third-party embed
   doing the job one address line already does, and the footer repeats the
   address anyway. The named roster stays, since it is the only place on the
   site that tells you who you are actually calling. */

const PEOPLE = [
  { name: "Liran Bartal",    role: "President",        email: "liran@carmel-usa.com" },
  { name: "Dispatch",        role: "Dispatch",         email: "dispatch@carmel-usa.com" },
  { name: "Harry Singh",     role: "Dispatch",         email: "dispatch@carmel-usa.com" },
  { name: "Jessy Sierra",    role: "Accounting",       email: "accounting@carmel-usa.com" },
  { name: "Tanassia Edwards", role: "Customer service", email: "csr@carmel-usa.com" },
  { name: "Philisha Daisy",  role: "Customer service",  email: "csr2@carmel-usa.com" },
]

export default function Contact() {
  return (
    <PageShell
      cover="/img/covers/contact.jpg"
      crumb="Contact"
      head="Get in touch"
      accent="Answered 24/7."
      lead="Feel free to contact us. A question, a suggestion, or a new opportunity — your voice matters to us."
      aside={
        <div className="ph-toc" aria-label="Direct lines">
          <p className="eyebrow ph-toc-label">Straight through</p>
          <ol>
            <li><a href="tel:+12012995416">Call (201) 299-5416</a></li>
            <li><a href="mailto:quotes@carmel-usa.com">quotes@carmel-usa.com</a></li>
          </ol>
        </div>
      }
      /* the masthead IS the form: four prompts, one at a time */
      plate={<QuoteSequence steps={CONTACT_STEPS} subject="Message from the website" tone="dark" />}
    >
      <PageBlock n="01" kicker="Contact" head="Who to ask for">
        <p className="pg-body" data-rise>
          We value communication and are eager to connect with you. Whether you
          have a question, a suggestion, or you're seeking new opportunities,
          don't hesitate to reach out. Your voice matters to us, and we'd
          genuinely love to hear from you. So, please, feel free to contact us at
          any time.
        </p>

        <div className="pg-list">
          {PEOPLE.map((p) => (
            <a className="pg-list-row" href={"mailto:" + p.email} key={p.name} data-rise>
              <span className="pg-list-name">{p.name}</span>
              <span className="pg-list-body">{p.role}</span>
              <span className="pg-list-go">{p.email}</span>
            </a>
          ))}
        </div>
      </PageBlock>

      {/* The full quote request on its own inverted band — the footer's
          ground, so the inversion reads as identity rather than a dark slab. */}
      <section className="band band-ink pg-block" id="quote" aria-label="Request a quote">
        <div className="band-inner pg-grid">
          <div className="pg-rail">
            <p className="pg-rail-n" data-rise>02 / Contact</p>
            <h2 className="pg-rail-head" data-rise>Request a quote</h2>
            <p className="pg-rail-note" data-rise>
              Six quick questions, one at a time. It ends as an email to us with
              everything filled in.
            </p>
          </div>
          <div className="pg-main">
            <QuoteSequence tone="dark" />
          </div>
        </div>
      </section>

      <section className="band pg-block" aria-label="Corporate HQ">
        <div className="band-inner pg-grid">
          <div className="pg-rail">
            <p className="pg-rail-n" data-rise>03 / Contact</p>
            <h2 className="pg-rail-head" data-rise>Corporate HQ</h2>
          </div>
          <div className="pg-main">
            <ul className="pg-facts" data-rise>
              <li className="pg-fact">
                <span className="pg-fact-icon" aria-hidden="true"><MapPin size={18} strokeWidth={2} /></span>
                <span className="pg-fact-label">Address</span>
                <span className="pg-fact-value">78 John Miller Way, Unit #408<br />Kearny, NJ 07032</span>
              </li>
              <li className="pg-fact">
                <span className="pg-fact-icon" aria-hidden="true"><Clock size={18} strokeWidth={2} /></span>
                <span className="pg-fact-label">Hours</span>
                <span className="pg-fact-value">Open 24 / 7 / 365</span>
              </li>
              <li className="pg-fact">
                <span className="pg-fact-icon" aria-hidden="true"><Phone size={18} strokeWidth={2} /></span>
                <span className="pg-fact-label">Phone</span>
                <span className="pg-fact-value"><a href="tel:+12012995416">(201) 299-5416</a></span>
              </li>
              <li className="pg-fact">
                <span className="pg-fact-icon" aria-hidden="true"><Mail size={18} strokeWidth={2} /></span>
                <span className="pg-fact-label">Email</span>
                <span className="pg-fact-value"><a href="mailto:quotes@carmel-usa.com">quotes@carmel-usa.com</a></span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
