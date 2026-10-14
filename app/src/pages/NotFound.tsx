import { PageShell, PageBlock } from "./PageShell"

/* Any path not in the route table. It used to fall through to the homepage,
   so a mistyped or retired link looked like it had worked; Vercel serves this
   from 404.html with a real 404 status. */
const PAGES = [
  { href: "/services/drayage",      name: "Drayage",                 body: "Container moves between the NY/NJ ports, rail and your dock" },
  { href: "/services/intermodal",   name: "Intermodal trucking",     body: "The trucking legs into and out of the rail terminals" },
  { href: "/services/refrigerated", name: "Refrigerated containers", body: "Reefers on Genset chassis, with powered yard storage" },
  { href: "/services/storage",      name: "Storage facility",        body: "Dry and refrigerated container storage near the ports" },
  { href: "/contact",               name: "Contact",                 body: "Request a quote or give us a call" },
]

export default function NotFound() {
  return (
    <PageShell
      cover="/img/covers/services.jpg"
      crumb="Not found"
      head="Page not found."
      accent="Let's get you moving."
      lead="That address doesn't match a page on this site. It may have moved, or the link was mistyped."
      actions
    >
      <PageBlock n="01" kicker="Try" head="Where to next">
        <div className="pg-list">
          {PAGES.map((p) => (
            <a className="pg-list-row" href={p.href} key={p.href}>
              <span className="pg-list-name">{p.name}</span>
              <span className="pg-list-body">{p.body}</span>
            </a>
          ))}
        </div>
      </PageBlock>
    </PageShell>
  )
}
