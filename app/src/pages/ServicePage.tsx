import { PageShell, PageBlock } from "./PageShell"
import { Cta } from "@/components/site/Cta"
import { ServiceSteps } from "@/components/site/ServiceSteps"
import { WhyCarmel } from "@/components/site/WhyCarmel"
import type { ServiceContent } from "./services-content"

/* One service, one page. The four services used to be anchors inside /services;
   each is now its own route so it can be linked, shared and indexed on its own
   terms. The template is the interior-page format already in page.css — split
   tone masthead, sticky rail, hairline band seams — so nothing here invents
   furniture. Only the words differ between the four. */

export function ServicePage({ s }: { s: ServiceContent }) {
  return (
    <PageShell
      cover={s.cover}
      crumb={s.crumb}
      head={s.head}
      accent={s.accent}
      lead={s.lead}
      wideHead
      aside={
        <div className="ph-toc" aria-label="On this page">
          <p className="eyebrow ph-toc-label">On this page</p>
          <ol>
            <li><a href="#what">What we do</a></li>
            <li><a href="#why">Why Carmel</a></li>
            <li><a href="#quote">Request a quote</a></li>
          </ol>
        </div>
      }
    >
      <PageBlock n="01" kicker={s.crumb} head={s.openHead}>
        {s.openBody.map((p) => (
          <p className="pg-body" data-rise key={p.slice(0, 24)}>{p}</p>
        ))}
      </PageBlock>

      <PageBlock id="what" n="02" kicker={s.crumb} head={s.offerHead} deep>
        <div className="pg-list">
          {s.offer.map((o) => (
            <div className="pg-list-row" data-rise key={o.head}>
              <span className="pg-list-name">{o.head}</span>
              <span className="pg-list-body">{o.body}</span>
            </div>
          ))}
        </div>
      </PageBlock>

      <PageBlock n="03" kicker={s.crumb} head={s.middle.head}>
        {s.middle.body.map((p) => (
          <p className="pg-body" data-rise key={p.slice(0, 24)}>{p}</p>
        ))}
        <ServiceSteps steps={s.middle.steps} />
      </PageBlock>

      <PageBlock id="why" n="04" kicker={s.crumb} head="Why Carmel" deep>
        <WhyCarmel reasons={s.why} />
      </PageBlock>

      <PageBlock n="05" kicker={s.crumb} head={s.closeHead}>
        {s.closeBody.map((p) => (
          <p className="pg-body" data-rise key={p.slice(0, 24)}>{p}</p>
        ))}
        <p className="pg-cta" data-rise>
          <Cta href="#quote">{s.closeCta}</Cta>
        </p>
      </PageBlock>
    </PageShell>
  )
}

/* One component per route so main.tsx's path table stays a plain map of path to
   component, with no parameter parsing in it. */
export const makeServicePage = (s: ServiceContent) => () => <ServicePage s={s} />
