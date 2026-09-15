import { useEffect, useRef } from "react"
import type { ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Nav } from "@/components/site/Nav"
import { PlateBg } from "@/components/site/PlateBg"
import { Closing } from "@/components/site/Closing"

gsap.registerPlugin(ScrollTrigger)

/* The interior-page chassis, lifted out of /services once a second page needed
   it: nav, blurred-photo masthead under a frosted plate, [data-rise] entrances,
   then the shared closing. Everything here already exists in page.css — this
   only stops the three remaining pages from restating it. */

type Props = {
  crumb: string
  head: string
  accent: string
  lead: string
  /* Each page gets its own frame. The masthead photo is opaque now, so it is
     carrying real weight rather than tinting a band — the same picture on
     four pages would read as a template. */
  cover: string
  aside?: ReactNode
  /* rendered inside the plate, full width, under the headline row — the
     contact form on /contact */
  /* service pages run the headline across the whole plate; the TOC drops
     beneath it rather than sitting in the right-hand columns */
  wideHead?: boolean
  plate?: ReactNode
  children: ReactNode
}

export function PageShell({ crumb, head, accent, lead, cover, aside, plate, wideHead, children }: Props) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const mm = gsap.matchMedia()
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-rise]", el)
      const tweens = items.map((item) =>
        gsap.fromTo(
          item,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", toggleActions: "play none none reverse", invalidateOnRefresh: true },
          }
        )
      )
      /* ScrollTrigger measures start positions once, at creation. Every image
         on these pages is lazy and most are 16/9 boxes that only reserve their
         height once the file arrives, so the document grows underneath those
         measurements and every trigger below the fold ends up pointing at the
         wrong scroll position — the cards stay at opacity 0 with the page
         sitting right on top of them. Re-measure whenever an image lands. */
      const refresh = () => ScrollTrigger.refresh()
      const imgs = Array.from(el.querySelectorAll("img"))
      const pending = imgs.filter((img) => !img.complete)
      pending.forEach((img) => {
        img.addEventListener("load", refresh)
        img.addEventListener("error", refresh)
      })
      window.addEventListener("load", refresh)
      refresh()

      return () => {
        pending.forEach((img) => {
          img.removeEventListener("load", refresh)
          img.removeEventListener("error", refresh)
        })
        window.removeEventListener("load", refresh)
        tweens.forEach((t) => { t.scrollTrigger?.kill(); t.kill() })
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={root}>
      <Nav />

      <a className="skip-link" href="#main">Skip to content</a>
      <main id="main" tabIndex={-1}>
        {/* Light from the first pixel, so the nav pill starts in its light
            state rather than flipping partway down. */}
        <header className="band ph" data-nav-light>
          <PlateBg src={cover} />

          <div className="band-inner">
            <div className="ph-plate">
              <div className={"ph-grid" + (wideHead ? " ph-grid-wide" : "")}>
                <div>
                  <p className="ph-crumbs">
                    <a href="/">Home</a><span aria-hidden="true">/</span>{crumb}
                  </p>
                  <h1 className="ph-head">
                    <span>{head}</span>
                    <span className="accent">{accent}</span>
                  </h1>
                  <p className="ph-lead">{lead}</p>
                </div>

                {aside}
              </div>
              {plate && <div className="ph-plate-body">{plate}</div>}
            </div>
          </div>
        </header>

        {children}

        <div className="band band-deep">
          <Closing />
        </div>
      </main>

      <div className="grain grain-paper" aria-hidden="true" />
    </div>
  )
}

/* One entry: a sticky numbered rail beside a scrolling column — the same pair
   every /services block uses. */
export function PageBlock({
  id, n, kicker = "Section", head, deep, children,
}: {
  id?: string
  n: string
  kicker?: string
  head: string
  deep?: boolean
  children: ReactNode
}) {
  return (
    <section className={"band pg-block" + (deep ? " band-deep" : "")} id={id}>
      <div className="band-inner pg-grid">
        <div className="pg-rail">
          <p className="pg-rail-n" data-rise>{n} / {kicker}</p>
          <h2 className="pg-rail-head" data-rise>{head}</h2>
        </div>
        <div className="pg-main">{children}</div>
      </div>
    </section>
  )
}
