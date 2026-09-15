import { Cta } from "@/components/site/Cta"
import { Values } from "@/components/site/Values"
import { PageShell, PageBlock } from "./PageShell"

/* /careers — copy ported verbatim from carmel-usa-scrape/text/en_careers.txt.
   The old page's application form posted to a host we no longer have, so the
   apply step is an email with the same intent.

   PLACEHOLDER: the roles below are invented. The old site never listed any, so
   there is nothing to port — these are here to show the shape of the section
   and must be replaced with real openings before launch. Each one mails
   quotes@carmel-usa.com with the title in the subject; if Carmel wants these
   going somewhere other than the quotes inbox, that address is the one line to
   change. */

const OPENINGS = [
  {
    title: "CDL-A Container Driver",
    img: "/img/careers/driver.jpg",
    type: "Full time",
    place: "Kearny, NJ",
    body: "Local port runs to NY/NJ terminals, home daily. Class A CDL, TWIC card, and two years of drayage or intermodal experience.",
  },
  {
    title: "Dispatcher",
    img: "/img/careers/dispatcher.jpg",
    type: "Full time",
    place: "Kearny, NJ",
    body: "Build the day's moves, work the terminal appointment systems, and keep drivers and customers ahead of the delays. Drayage experience strongly preferred.",
  },
  {
    title: "Diesel Mechanic",
    img: "/img/careers/mechanic.jpg",
    type: "Full time",
    place: "Kearny, NJ",
    body: "Preventative maintenance and repair across our tractors, chassis and Genset units. Own tools, brake certification an advantage.",
  },
  {
    title: "Customer Service Representative",
    img: "/img/careers/csr.jpg",
    type: "Full time",
    place: "Kearny, NJ",
    body: "First point of contact for accounts: quotes, status calls and problem-solving. Freight or logistics background welcome, not required.",
  },
  {
    title: "Owner-Operator",
    img: "/img/careers/owner-operator.jpg",
    type: "Contract",
    place: "NY / NJ ports",
    body: "Bring your own tractor and run consistent port work off our chassis pool. Settlement weekly, fuel card and plates available.",
  },
]

export default function Careers() {
  return (
    <PageShell
      cover="/img/covers/careers.jpg"
      crumb="Careers"
      head="Careers"
      accent="Drive with us."
      lead="Experienced people in the transportation industry, joining a company that is still growing fast."
    >
      <PageBlock n="01" kicker="Careers" head="Join the team">
        <p className="pg-body" data-rise>
          Carmel USA is continuously on the lookout for dedicated and driven
          individuals to join our team! If you possess experience in the
          transportation industry and are eager to embrace new, stimulating
          opportunities within a rapidly expanding company, then we'd be delighted
          to hear from you.
        </p>
        <p className="pg-body" data-rise>
          Kick-start your career with Carmel USA today! Simply fill out our brief
          application. We're eager to review your candidacy and welcome you to our
          team.
        </p>
        <p className="pg-cta" data-rise>
          <Cta href="mailto:quotes@carmel-usa.com?subject=Application" size="sm">Apply by email</Cta>
        </p>
      </PageBlock>

      <section className="band pg-block band-deep" id="openings" aria-label="Open positions">
        <div className="band-inner pg-grid">
          <div className="pg-rail">
            <p className="pg-rail-n" data-rise>02 / Careers</p>
            <h2 className="pg-rail-head" data-rise>Open positions</h2>
          </div>
          <div className="pg-main">
            <p className="pg-body" data-rise>
              Five roles open out of the Kearny yard. Don't see yours? Write to us
              anyway — we hire ahead of the posting more often than not.
            </p>

            {/* Full cards, not list rows. A role is a thing someone decides
                about, and a row of text gave the photograph nowhere to go and
                the two facts that actually filter the list — where it is and
                whether it is a job or a contract — no prominence at all.
                Those two are badges now, above the title where they are read
                before the prose rather than after it. */}
            <div className="job-grid">
              {OPENINGS.map((o) => (
                <a
                  className="job-card"
                  href={"mailto:quotes@carmel-usa.com?subject=" + encodeURIComponent("Application — " + o.title)}
                  key={o.title}
                  data-rise
                >
                  <span className="job-media">
                    <img src={o.img} alt="" loading="lazy" decoding="async" />
                  </span>
                  <span className="job-body">
                    <span className="job-badges">
                      <span className={"job-badge" + (o.type === "Contract" ? " is-contract" : "")}>{o.type}</span>
                      <span className="job-badge is-place">{o.place}</span>
                    </span>
                    <span className="job-title">{o.title}</span>
                    <span className="job-copy">{o.body}</span>
                    <span className="job-go">Apply</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Values />

    </PageShell>
  )
}
