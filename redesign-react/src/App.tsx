import Navigation9 from "@/components/navigation-9";
import Hero24 from "@/components/hero-24";
import Stats14 from "@/components/stats-14";
import Showcase8 from "@/components/showcase-8";
import Showcase7 from "@/components/showcase-7";
import CTA14 from "@/components/cta-14";
import WhyCarmelBento from "@/components/why-carmel-bento";
import Features13 from "@/components/features-13";
import FAQ9 from "@/components/faq-9";
import ContactFooter from "@/components/contact-footer";
import { useLenis } from "@/hooks/use-lenis";

/* Note: src/components/tresmares/* is left on disk but not rendered here.
   Swap it back into this file if that opening sequence is wanted again. */

export default function App() {
  useLenis();

  return (
    <main className="relative min-h-screen bg-neutral-100 dark:bg-neutral-950">
      <Navigation9 />

      {/* hero sits under the sticky nav */}
      <div className="-mt-[86px]">
        <Hero24 />
      </div>

      {/* lifted panel that overlaps the bottom of the hero */}
      <Stats14 />

      <section id="services">
        <Showcase8 />
      </section>

      <section id="company">
        <Showcase7 />
      </section>

      <CTA14 />

      <WhyCarmelBento />

      <Features13 />

      <section id="faq">
        <FAQ9 />
      </section>

      <ContactFooter />
    </main>
  );
}
