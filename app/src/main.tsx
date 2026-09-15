import { StrictMode } from "react"
import type { ReactElement } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import Services from "./pages/Services.tsx"
import Company from "./pages/Company.tsx"
import Careers from "./pages/Careers.tsx"
import Contact from "./pages/Contact.tsx"
import Sandbox from "./sandbox/Sandbox.tsx"
import { SERVICE_PAGES } from "./pages/services-content"
import { makeServicePage } from "./pages/ServicePage"
import { initSmoothScroll } from "./lib/smooth-scroll"

/* A path table, not a router library. Five static pages and a scratch page do
   not need react-router, and adding it would pull a second history model in
   next to the GSAP scroll work. Anchors inside a page stay plain #hrefs. */
const ROUTES: Record<string, () => ReactElement> = {
  "": App,
  "/services": Services,
  "/company": Company,
  "/careers": Careers,
  "/contact": Contact,
  "/sandbox": Sandbox,
  /* One route per service. /services stays as the overview that links to them. */
  ...Object.fromEntries(
    SERVICE_PAGES.map((s) => ["/services/" + s.slug, makeServicePage(s)]),
  ),
}

/* The homepage grows by thousands of pixels as three frame sequences load, so
   the browser restores a saved scroll position against a document that does not
   exist yet — and lands somewhere arbitrary once it does, overriding anything
   already in flight. Own the entry point instead: every load starts at the top. */
if ("scrollRestoration" in history) history.scrollRestoration = "manual"

const path = window.location.pathname.replace(/\/+$/, "")
const Page = ROUTES[path] ?? App

/* The entry animation is opt-in from here so it can always be taken back off.
   A CSS animation does not run while the tab is in the background, and its
   `from` state would otherwise hold the page at opacity 0 until someone
   focused it. Both the animationend listener and the timer clear the class;
   whichever fires first wins. */
const rootEl = document.getElementById("root")!
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  rootEl.classList.add("is-entering")
  const done = () => rootEl.classList.remove("is-entering")
  rootEl.addEventListener("animationend", done, { once: true })
  window.setTimeout(done, 1600)
}

initSmoothScroll()

createRoot(rootEl).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
