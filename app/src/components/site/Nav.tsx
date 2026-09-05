import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { WordRoll } from "./WordRoll"

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Company", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Contact", href: "#contact" },
]

export function Nav() {
  const bar = useRef<HTMLElement>(null)

  /* The bar sits on footage for the first half of the page and on a pale
     ground for the second. It carries a blurred plate throughout and flips to
     ink type the moment the light sections arrive, so it never loses contrast. */
  useEffect(() => {
    const el = bar.current
    const light = document.querySelector<HTMLElement>(".act-three")
    if (!el || !light) return

    const st = ScrollTrigger.create({
      trigger: light,
      start: "top top+=80",          // 80px = the bar's own height
      end: "bottom top",
      onToggle: (self) => el.classList.toggle("is-light", self.isActive),
      invalidateOnRefresh: true,
    })

    return () => st.kill()
  }, [])

  return (
    <header className="nav" ref={bar}>
      <a className="nav-brand" href="/" aria-label="Carmel — home">
        <span className="wm">Carmel</span>
      </a>

      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </nav>

      <a className="nav-phone" href="tel:+12012995416">(201) 299-5416</a>
      <WordRoll className="nav-portal" href="#quote">Request a Quote</WordRoll>
    </header>
  )
}
