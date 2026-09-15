import { Stage } from "@/components/site/Stage"
import { Nav } from "@/components/site/Nav"
import { Hero } from "@/components/site/Hero"
import { Intro } from "@/components/site/Intro"
import { Stats } from "@/components/site/Stats"
import { ServicesIntro } from "@/components/site/ServicesIntro"
import { Differentiator } from "@/components/site/Differentiator"
import HowItWorks4 from "@/components/how-it-works-4"
import { Closing } from "@/components/site/Closing"
import { Preloader } from "@/components/site/Preloader"

export default function App() {
  return (
    <>
      {/* Keyboard users otherwise tab the whole nav -- brand, Services panel,
          four links, phone, quote -- on every single page before reaching the
          content. Visually hidden until it takes focus. */}
      <a className="skip-link" href="#main">Skip to content</a>

      <Stage />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Intro />
        <Stats />
        <ServicesIntro />
        {/* everything past the footage shares one continuous ground */}
        <div className="act-three">
          <Differentiator />
          <HowItWorks4 />
          <Closing />
        </div>
      </main>

      {/* film grain — sits over everything, masks compression in the footage */}
      <div className="grain" aria-hidden="true" />

      {/* homepage only: the navy screen that becomes the nav bar */}
      <Preloader />
    </>
  )
}
