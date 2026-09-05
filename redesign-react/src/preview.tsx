import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import CloudHero from "./components/tresmares/cloud-hero";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CloudHero />
    <section className="mx-auto max-w-[1400px] px-8 py-32">
      <h2 className="font-display text-3xl font-bold">Next section</h2>
      <p className="mt-4 text-steel">Blends up into the hero's bottom fade.</p>
    </section>
  </StrictMode>,
);
