# carmel-usa.com — sitemap of the original

Reconstructed from the full crawl on 2026-09-05. The live site publishes no
`sitemap.xml` and no `robots.txt` — both return 404 — so this was built by
following every internal link from `/en`.

**5 unique pages. 6 URLs. No deeper levels — the tree is completely flat.**

---

## Structure

```
https://www.carmel-usa.com/
│
└── /en ......................................... Home  ("Home | Carmel")
    │                                             └── /en/home  (duplicate, identical)
    │
    ├── /en/services ............................ Services  ("Services | Carmel")
    │   │
    │   │   Four services live on this ONE page as anchors,
    │   │   not as separate pages:
    │   │
    │   ├── #drayage ............................ Drayage
    │   ├── #refridgerated-containers ........... Refrigerated Containers
    │   ├── #intermodal-trucking ................ Intermodal Trucking
    │   └── #storage ............................ Storage Facility
    │
    ├── /en/company ............................. Company  ("Company | Carmel")
    ├── /en/careers ............................. Careers  ("Careers | Carmel")
    └── /en/contact-us .......................... Contact  ("Contact | Carmel")
```

## Global navigation

Identical on all five pages — header nav, services dropdown, and footer link
list never vary:

| Nav item | Target |
|---|---|
| Home | `/en` |
| Services | `/en/services` |
| &nbsp;&nbsp;› Drayage | `/en/services#drayage` |
| &nbsp;&nbsp;› Refridgerated Containers | `/en/services#refridgerated-containers` |
| &nbsp;&nbsp;› Intermodal Trucking | `/en/services#intermodal-trucking` |
| &nbsp;&nbsp;› Storage Facility | `/en/services#storage` |
| Company | `/en/company` |
| Careers | `/en/careers` |
| Contact | `/en/contact-us` |

## Outbound links

- Google Maps pin — 78 John Miller Way, Kearny, NJ 07032 (on every page)
- An embedded Google Map on `/en/contact-us`
- Google Fonts (Poppins) on every page

---

## Findings worth fixing in the redesign

**1. `/en` and `/en/home` are byte-for-byte identical.**
Two URLs serving the same page, both linked from the nav, with no canonical tag
between them. Pick `/en` and 301 the other to it.

**2. One of the two reefer anchors is broken.**
The anchor on the Services page is spelled `id="refridgerated-containers"`.
Two different spellings link to it:

| Link location | Href | Works? |
|---|---|---|
| Header dropdown | `…#refridgerated-containers` | Yes — matches the ID |
| Home "Read More" | `…#refrigerated-containers` | **No — silently lands at the page top** |
| Footer services list | `…#refrigerated-containers` | **No — silently lands at the page top** |

So the header menu works and both in-page routes to the same service do not.
Worth noting the misspelling is only in the ID and the header link text; the
body headings on the page spell it correctly.

**3. The `/en` prefix implies localisation that does not exist.**
Every URL sits under `/en`, but there is no second language anywhere on the
site — no alternate nav, no `hreflang`, no other locale directory.

**4. No `sitemap.xml`, no `robots.txt`.** Both 404.

**5. Each service has only two or three sentences of copy.**
That is why they are anchors rather than pages. If the redesign gives each
service its own page, the copy has to grow to justify it — otherwise keep the
single-page anchor structure and just make all the links point at real IDs.

---

## Files

- `sitemap.xml` — valid XML sitemap of the original, canonical URLs only
- `manifest.json` — every crawled URL with its title and saved file paths
- `pages/` — raw HTML, `text/` — extracted copy, `assets/` — images
