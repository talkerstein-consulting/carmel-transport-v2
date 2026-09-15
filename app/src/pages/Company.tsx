import { Cta } from "@/components/site/Cta"
import { PageShell, PageBlock } from "./PageShell"

/* /company — copy ported verbatim from carmel-usa-scrape/text/en_company.txt.
   The source page's four service teasers stay, but as links into /services
   rather than a second set of "Read More" cards.

   Photos are the old site's own — the actual Carmel fleet, cab decal and team
   (carmel-usa-scrape/.../images/img, exported to /img/company). This is the
   one page where real pictures beat the generated service frames. */

const SECTIONS = [
  {
    id: "about",
    n: "01",
    head: "About Us",
    img: "/img/company/tractor.jpg",
    body: [
      "Carmel Transport Inc. is a new player in the Drayage market in New Jersey. It is owned by a team with over 50 combined years of experience in Drayage trucking. The Office and parking is located in Kearny, NJ.",
      "We know the ins and outs of this industry and you can count on us to do the best job with the lowest cost.",
    ],
  },
  {
    id: "mission",
    n: "02",
    head: "Mission Statement",
    img: "/img/company/yard.jpg",
    body: [
      "Our goal is to be safe. Safety above all! The secondary goal is to deliver your container in a timely fashion, keeping the load safe and secure, while charging the lowest amount of money. We understand the need to save every penny these days.",
    ],
  },
  {
    id: "safety",
    n: "03",
    head: "Safety and Compliance",
    img: "/img/company/cab.jpg",
    body: [
      "Carmel USA has a Safety Manager – Ellen Andrews - with 35 years of experience, specifically in the drayage industry.",
      "We prioritize safety and compliance through rigorous driver selection and ongoing training initiatives. We also ensure our equipment, including tractors and chassis, is subject to our Preventative Maintenance program to prevent breakdowns and enhance customer satisfaction. Additionally, our drivers are trained in key areas like air brake adjustment, defensive driving, and hazardous goods transportation.",
    ],
  },
]

const SERVICES = [
  { name: "Drayage",                 img: "/img/covers/drayage.jpg",      href: "/services/drayage",      body: "We provide a full range asset-based drayage and full transload services" },
  { name: "Refrigerated Containers", img: "/img/covers/refrigerated.jpg", href: "/services/refrigerated", body: "We offer all-encompassing storage and transit of refrigerated containers" },
  { name: "Intermodal Trucking",     img: "/img/covers/intermodal.jpg",   href: "/services/intermodal",   body: "We operate to ocean and rail container terminals, ensuring your goods reach their destination" },
  { name: "Storage Facility",        img: "/img/covers/storage.jpg",      href: "/services/storage",      body: "We provide an all-inclusive storage solution for all sizes of dry-box and refrigerated containers" },
]

export default function Company() {
  return (
    <PageShell
      cover="/img/covers/company.jpg"
      crumb="Company"
      head="Company"
      accent="Fifty years in."
      lead="A new name in New Jersey drayage, run by people who have been doing this a long time."
      aside={
        <nav className="ph-toc" aria-label="On this page">
          <p className="eyebrow ph-toc-label">On this page</p>
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={"#" + s.id}>{s.head}</a></li>
            ))}
          </ol>
        </nav>
      }
    >
      {SECTIONS.map((s, i) => (
        <PageBlock key={s.id} id={s.id} n={s.n} kicker="Company" head={s.head} deep={!!(i % 2)}>
          {s.body.map((p) => (
            <p className="pg-body" key={p.slice(0, 24)} data-rise>{p}</p>
          ))}
          <div className="pg-media" data-rise>
            <img src={s.img} alt="" loading="lazy" decoding="async" />
          </div>
        </PageBlock>
      ))}

      {/* The four service teasers as cards — picture, name, one line, link
          into /services — rather than a text list. */}
      <section className="band pg-block band-deep" id="services" aria-label="Services">
        <div className="band-inner">
          <div className="svc-grid-lead">
            <p className="pg-rail-n" data-rise>04 / Company</p>
            <h2 className="pg-rail-head" data-rise>What we run</h2>
          </div>
          <div className="svc-grid svc-grid-4">
            {SERVICES.map((s) => (
              <a className="svc-tile" href={s.href} key={s.name} data-rise>
                <span className="svc-tile-media" aria-hidden="true">
                  <img src={s.img} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="svc-tile-body">
                  <span className="svc-tile-head">{s.name}</span>
                  <span className="svc-tile-copy">{s.body}</span>
                  <span className="svc-tile-go" aria-hidden="true">Read more →</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band pg-block" aria-label="Our reputation">
        <div className="band-inner pg-grid">
          <div className="pg-rail">
            <p className="pg-rail-n" data-rise>05 / Company</p>
            <h2 className="pg-rail-head" data-rise>Our reputation</h2>
          </div>
          <div className="pg-main">
            <p className="pg-body" data-rise>
              Committed to superior service, Carmel USA partners only with the best
              carriers to ensure timely deliveries. Our enduring relationships have
              fostered a nationwide network with diverse fleet sizes, allowing us to
              meet your specific transportation needs. With excellent customer service
              and a proactive problem-solving approach, we offer tailored solutions.
              Contact us today!
            </p>
            <p className="pg-stat" data-rise>
              <span className="pg-stat-n">1000+</span>
              <span className="pg-stat-label">Satisfied clients</span>
            </p>
            <p className="pg-cta" data-rise>
              <Cta href="/contact" size="sm">Contact us</Cta>
            </p>
            <div className="pg-media" data-rise>
              <img src="/img/company/team.jpg" alt="The Carmel Transport team" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
