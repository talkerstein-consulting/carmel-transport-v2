/* Post-build: one HTML file per route, so each page ships its own title,
   description, canonical and Open Graph tags, plus its headline and lead in
   the markup for crawlers that don't run JavaScript. createRoot() replaces
   the #root contents on mount, so the static copy never shows twice.

   Also writes 404.html (Vercel serves it with a real 404 status now that the
   catch-all rewrite is gone), robots.txt and sitemap.xml. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const dist = join(here, "..", "dist")
const META = JSON.parse(readFileSync(join(here, "..", "src", "pages", "meta.json"), "utf8"))
const shell = readFileSync(join(dist, "index.html"), "utf8")

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const NAV = [
  ["/services/drayage", "Drayage"],
  ["/services/intermodal", "Intermodal trucking"],
  ["/services/refrigerated", "Refrigerated containers"],
  ["/services/storage", "Storage facility"],
  ["/company", "Company"],
  ["/careers", "Careers"],
  ["/contact", "Request a quote"],
]

function page(m, { url, noindex = false }) {
  const head = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Carmel Transport" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : "",
    `<meta property="og:image" content="${META.site}${META.image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].filter(Boolean).join("\n    ")

  const body =
    `<div id="root"><main class="prerender">` +
    `<h1>${esc(m.h1)}</h1>` +
    (m.lead ? `<p>${esc(m.lead)}</p>` : "") +
    `<nav aria-label="Pages"><ul>` +
    NAV.map(([h, l]) => `<li><a href="${h}">${esc(l)}</a></li>`).join("") +
    `</ul></nav>` +
    `<p>78 John Miller Way, Unit #408, Kearny, NJ 07032 · <a href="tel:+12012995416">(201) 299-5416</a></p>` +
    `</main></div>`

  return shell
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace('<div id="root"></div>', body)
}

function write(rel, html) {
  const file = join(dist, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

const routes = Object.keys(META.pages)
for (const route of routes) {
  const url = META.site + (route === "/" ? "/" : route)
  write(route === "/" ? "index.html" : join(route, "index.html"), page(META.pages[route], { url }))
}

write("404.html", page(META.notFound, { noindex: true }))
/* the scratch page still needs a file now there is no catch-all */
write("sandbox/index.html", page({ ...META.notFound, title: "Sandbox | Carmel Transport", h1: "Sandbox" }, { noindex: true }))

write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /sandbox\n\nSitemap: ${META.site}/sitemap.xml\n`)

const today = new Date().toISOString().slice(0, 10)
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes.map((r) => `  <url><loc>${META.site}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod></url>`).join("\n") +
    `\n</urlset>\n`,
)

console.log(`prerender: ${routes.length} pages, 404.html, robots.txt, sitemap.xml`)
