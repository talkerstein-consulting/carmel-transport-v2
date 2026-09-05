# CARMEL TRANSPORT — Brand Guide

Version 1.0 · Digital-first (web / Framer)

---

## 1. Brand Mark

The wordmark is two stacked lines, left-aligned, set in **Roboto Slab**, all caps.

```
CARMEL
TRANSPORT
```

| | Line 1 — CARMEL | Line 2 — TRANSPORT |
|---|---|---|
| Font | Roboto Slab | Roboto Slab |
| Weight | 700 (Bold) | 500 (Medium) |
| Case | Uppercase | Uppercase |
| Size | `1em` (base) | `0.44em` of line 1 |
| Tracking | `-0.01em` | justified — see below |
| Line height | `0.92` | `1` |
| Fill | `--grad-mark` | `--grad-mark` (identical) |

**Justification rule — the defining constraint:** the two lines are **exactly the same width**. TRANSPORT is not letter-spaced by eye; its nine letters are *distributed* across the measured width of CARMEL, so the lockup is flush on both edges at every size with no re-kerning. In CSS the outer element sizes to CARMEL and the second line justifies inside it:

```css
.wm    { display: inline-block; font-family: var(--font-mark); text-transform: uppercase; }
.wm .a { display: block; font-weight: 700; font-size: 1em;
         letter-spacing: -.01em; line-height: .92; }
.wm .b { display: flex; justify-content: space-between; width: 100%;
         font-weight: 500; font-size: .44em; line-height: 1; margin-top: .06em; }
/* each letter of TRANSPORT is its own inline element */
```
In vector artwork the same result is achieved with paragraph justification set to *justify all lines* on a text box locked to the CARMEL width. Never fake it with a tracking value — a tracking value drifts as the size changes.

### Lockup spacing
- Gap between lines: `0.18em` of the CARMEL cap-height.
- Clear space on all sides: **1× the CARMEL cap-height**. Nothing enters this zone.
- Minimum size: CARMEL cap-height `14px` on screen, `4mm` in print.

### Variants — one only
**Primary** — `--grad-mark` (ink gradient) on a light ground (`--paper-50` / `--paper-100` / `--grad-paper`).

**There is no reverse lockup.** The mark is never set light-on-dark, never on an accent colour, never on a photograph without a `--paper-50` plate behind it. Where gradient fills cannot be reproduced — embroidery, vinyl, one-colour print, favicons under 32px — it flattens to solid `--ink-900`, still on light.

### Misuse
Never: outline it, add a drop shadow, stretch or condense the letterforms, set it in another typeface, colour TRANSPORT differently from CARMEL, let the two lines end at different widths, place TRANSPORT above CARMEL, centre the lines against each other, reverse it out of a dark ground, or set it on a photo without a light plate.

---

## 2. Typography

**Roboto Slab is logo only.** All other type — headlines, UI, body, data — is **Schibsted Grotesk**.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@500;700&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
```

```css
--font-mark: "Roboto Slab", "Zilla Slab", Georgia, serif;
--font-sans: "Schibsted Grotesk", "Inter", -apple-system, "Segoe UI", sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

### Weights in use
| Role | Weight |
|---|---|
| Display / hero | 500 Medium — *large type does not need bold* |
| Section headings | 600 Semibold |
| Body | 400 Regular |
| Emphasis / labels | 600 Semibold |
| Eyebrows, meta, tabular | 500 Medium, uppercase, tracked |

---

## 3. Type Scale

Base 16px. Ratio ≈ **1.25 (major third)** through the body range, opening to a wider jump at display sizes so the big headings actually feel big. Display sizes are fluid — they interpolate between 390px and 1440px viewports.

| Token | Clamp (fluid) | Desktop | Mobile | Weight | Line height | Tracking |
|---|---|---|---|---|---|---|
| `--fs-display-1` | `clamp(3.5rem, 1.2rem + 9.4vw, 8.5rem)` | 136px | 56px | 500 | 0.92 | -0.035em |
| `--fs-display-2` | `clamp(2.75rem, 1.3rem + 6.1vw, 6rem)` | 96px | 44px | 500 | 0.95 | -0.03em |
| `--fs-h1` | `clamp(2.25rem, 1.4rem + 3.6vw, 4.25rem)` | 68px | 36px | 600 | 1.02 | -0.025em |
| `--fs-h2` | `clamp(1.75rem, 1.2rem + 2.3vw, 3rem)` | 48px | 28px | 600 | 1.08 | -0.02em |
| `--fs-h3` | `clamp(1.375rem, 1.1rem + 1.1vw, 2rem)` | 32px | 22px | 600 | 1.15 | -0.015em |
| `--fs-h4` | `1.375rem` | 22px | 20px | 600 | 1.25 | -0.01em |
| `--fs-lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` | 22px | 18px | 400 | 1.5 | -0.005em |
| `--fs-body` | `1rem` | 16px | 16px | 400 | 1.6 | 0 |
| `--fs-small` | `0.875rem` | 14px | 14px | 400 | 1.55 | 0 |
| `--fs-caption` | `0.8125rem` | 13px | 13px | 500 | 1.45 | 0.005em |
| `--fs-eyebrow` | `0.75rem` | 12px | 12px | 500 | 1.2 | **0.14em**, uppercase |

### Big-heading rules
- **Optical tracking is mandatory.** Anything ≥ 44px gets negative tracking; the table above is the minimum. Display type at default tracking reads loose and cheap.
- **Weight goes down as size goes up.** Hero type is 500, never 700.
- **Measure:** headings max `18ch`; lead paragraphs `48ch`; body `62–72ch`.
- **Hero headings are filled with `--grad-head`** on a light ground, and one clause of the headline takes `--grad-head-accent` (blue) or flat `--ink-400`. That split-tone headline is the signature move of this identity.
- Hyphenation off on display; `text-wrap: balance` on H1–H3, `pretty` on body.

```css
h1 { font-size: var(--fs-h1); font-weight: 600; letter-spacing: -.025em;
     line-height: 1.02; text-wrap: balance; }

.eyebrow { font-size: var(--fs-eyebrow); font-weight: 500;
     letter-spacing: .14em; text-transform: uppercase; color: var(--ink-500); }
```

---

## 4. Colour

A near-monochrome grey family — paper through ink — with a **single blue accent**. The discipline is the brand: ~95% of any screen is grey, and blue appears only where you want a click, a highlight, or an active state.

### Greys
| Token | Hex | Use |
|---|---|---|
| `--paper-50` | `#FFFFFF` | Cards on grey, reverse text |
| `--paper-100` | `#F7F7F6` | Default page ground |
| `--paper-200` | `#EFEFEE` | Alternating sections, table stripes |
| `--paper-300` | `#E3E3E1` | Hairlines, dividers, input borders |
| `--ink-400` | `#B4B4B1` | Disabled text, decorative rules, secondary headline clause |
| `--ink-500` | `#8A8A87` | Meta, captions, eyebrows, TRANSPORT line |
| `--ink-600` | `#63635F` | Secondary body text |
| `--ink-700` | `#454542` | Body text on light |
| `--ink-800` | `#2A2A28` | Dark section grounds |
| `--ink-900` | `#151513` | Headlines, wordmark, footer ground |

Greys are **warm-neutral** (a trace of yellow, not blue) so the accent reads as genuinely blue rather than as "slightly bluer grey."

### Blue accent
| Token | Hex | Use |
|---|---|---|
| `--blue-50` | `#EDF3FC` | Accent tint backgrounds, hover rows |
| `--blue-200` | `#A9C6F0` | Borders on tinted panels, accent on dark |
| `--blue-500` | `#1F5FD0` | **Primary accent** — links, buttons, active nav, key data |
| `--blue-600` | `#194FAE` | Hover / pressed |
| `--blue-700` | `#143E88` | Text on `--blue-50`, small type needing contrast |

### Support
| Token | Hex | Use |
|---|---|---|
| `--success` | `#2E7D5B` | Delivered, on time |
| `--warning` | `#B57A18` | Delayed, attention |
| `--danger` | `#B3382F` | Failed, exception |

### Gradients — the default fill

Flat fills are the exception, not the rule. Every large surface, the wordmark, and the primary button take a gradient built from adjacent steps of the ramp above. The shift is deliberately narrow — two or three neighbouring values — so the surface reads as one colour with depth, never as a colour transition.

| Token | Definition | Use |
|---|---|---|
| `--grad-paper` | `linear-gradient(160deg,#FFFFFF 0%,#F7F7F6 45%,#EFEFEE 100%)` | Page and card grounds |
| `--grad-paper-deep` | `linear-gradient(160deg,#F7F7F6 0%,#EFEFEE 55%,#E7E7E5 100%)` | Alternating / contrast sections |
| `--grad-blue` | `linear-gradient(135deg,#2C74E8 0%,#1F5FD0 48%,#153F92 100%)` | Primary button only |
| `--grad-mark` | `linear-gradient(180deg,#3A3A37 0%,#151513 78%)` | Wordmark |
| `--grad-head` | `linear-gradient(180deg,#3A3A37 0%,#151513 82%)` | Display headings |
| `--grad-head-accent` | `linear-gradient(180deg,#2C74E8 0%,#153F92 100%)` | The accent clause of a headline |
| `--glow-blue` | `radial-gradient(900px 340px at 88% -12%, rgba(31,95,208,.10), transparent 70%)` | One per hero, top-right, behind content |

Rules: greys travel on the vertical / near-vertical axis (145–180°), blue on the diagonal (135°). Maximum three stops. Never cross families — no grey-to-blue. Never gradient body text, small type, hairlines, or icons. Text gradients use `background-clip: text` and must carry a solid `color` fallback of the darkest stop. **Every gradient in the system runs light — a dark ground is never used, so gradients darken only within the paper range or inside a button.**

### Ratios
- **90 / 8 / 2** — grey / ink-black / blue.
- One primary blue action per view. A second blue element must be a link, not a button.
- Never blue on blue. Never tint a grey toward blue to "match" the accent.

### Light-only rule
**The identity is light-ground, dark-text, everywhere.** There are no dark sections, no reverse blocks, no dark mode, no inverted footer. Contrast between sections comes from the four paper steps and from hairlines — `--paper-100` against `--paper-200`, `--grad-paper` against `--grad-paper-deep` — never from flipping to ink. `--ink-800` and `--ink-900` are **text colours only**; they are never used as a background.

The single exception is the primary button, which is a blue-gradient chip with white text. That is the only light-on-dark element in the system, and it is why it commands attention.

### Contrast (WCAG AA)
`--ink-900` on `--paper-100` ≈ 16.1:1 · `--ink-700` on `--paper-100` ≈ 9.2:1 · `--ink-600` on `--paper-100` ≈ 5.4:1 · `--ink-500` on `--paper-100` ≈ 3.6:1 (large / meta only) · `--blue-500` on `--paper-50` ≈ 5.9:1 · white on `--grad-blue` ≥ 5.9:1 at every stop.

---

## 5. Spacing

**4px base unit.** Every margin, padding, and gap comes from this table. No arbitrary values.

| Token | px | rem | Typical use |
|---|---|---|---|
| `--sp-1` | 4 | .25 | Icon-to-label |
| `--sp-2` | 8 | .5 | Inside chips, tight stacks |
| `--sp-3` | 12 | .75 | Input padding-y |
| `--sp-4` | 16 | 1 | Default gap, paragraph spacing |
| `--sp-5` | 24 | 1.5 | Card padding, gutter (mobile) |
| `--sp-6` | 32 | 2 | Card padding (desktop), grid gutter |
| `--sp-7` | 48 | 3 | Sub-block separation |
| `--sp-8` | 64 | 4 | Block separation |
| `--sp-9` | 96 | 6 | Section padding (mobile) |
| `--sp-10` | 128 | 8 | Section padding (desktop) |
| `--sp-11` | 160 | 10 | Hero padding, major chapter break |
| `--sp-12` | 240 | 15 | Full-bleed statement sections |

### Vertical rhythm
```css
--section-y: clamp(96px, 6vw + 2rem, 160px);  /* between sections */
--block-y:   clamp(48px, 3vw + 1rem, 64px);   /* between blocks   */
```
- Space **between** sections always exceeds space **inside** them by ≥ 2 steps.
- Eyebrow → heading `--sp-3`. Heading → lead `--sp-5`. Lead → CTA `--sp-7`.
- Never stack two `--sp-10` paddings against each other; collapse to one.

### Grid
| | Mobile | Tablet | Desktop |
|---|---|---|---|
| Breakpoint | < 768 | 768–1199 | ≥ 1200 |
| Columns | 4 | 8 | 12 |
| Gutter | 24 | 32 | 32 |
| Margin | 24 | 48 | 64 |
| Max content width | — | — | 1360px |
| Text column | 4 | 6 | 7 of 12 |

### Radii, lines, shadow
```css
--r-sm: 4px;    /* inputs, chips */
--r-md: 8px;    /* cards, buttons */
--r-lg: 16px;   /* media, panels */
--r-full: 999px;
--line: 1px solid var(--paper-300);
--shadow-1: 0 1px 2px rgba(21,21,19,.06), 0 8px 24px rgba(21,21,19,.05);
```
Shadows are near-absent by default — separation comes from hairlines and space.

---

## 6. Tokens

```css
:root {
  /* type */
  --font-mark: "Roboto Slab", Georgia, serif;
  --font-sans: "Schibsted Grotesk", Inter, -apple-system, "Segoe UI", sans-serif;
  --fs-display-1: clamp(3.5rem, 1.2rem + 9.4vw, 8.5rem);
  --fs-display-2: clamp(2.75rem, 1.3rem + 6.1vw, 6rem);
  --fs-h1: clamp(2.25rem, 1.4rem + 3.6vw, 4.25rem);
  --fs-h2: clamp(1.75rem, 1.2rem + 2.3vw, 3rem);
  --fs-h3: clamp(1.375rem, 1.1rem + 1.1vw, 2rem);
  --fs-h4: 1.375rem;
  --fs-lead: clamp(1.125rem, 1rem + .5vw, 1.375rem);
  --fs-body: 1rem;
  --fs-small: .875rem;
  --fs-caption: .8125rem;
  --fs-eyebrow: .75rem;

  /* colour */
  --paper-50:#FFFFFF; --paper-100:#F7F7F6; --paper-200:#EFEFEE; --paper-300:#E3E3E1;
  --ink-400:#B4B4B1; --ink-500:#8A8A87; --ink-600:#63635F;
  --ink-700:#454542; --ink-800:#2A2A28; --ink-900:#151513;
  --blue-50:#EDF3FC; --blue-200:#A9C6F0; --blue-500:#1F5FD0;
  --blue-600:#194FAE; --blue-700:#143E88;
  --success:#2E7D5B; --warning:#B57A18; --danger:#B3382F;

  /* gradients — all light-ground */
  --grad-paper:      linear-gradient(160deg,#FFFFFF 0%,#F7F7F6 45%,#EFEFEE 100%);
  --grad-paper-deep: linear-gradient(160deg,#F7F7F6 0%,#EFEFEE 55%,#E7E7E5 100%);
  --grad-blue:       linear-gradient(135deg,#2C74E8 0%,#1F5FD0 48%,#153F92 100%);
  --grad-mark:       linear-gradient(180deg,#3A3A37 0%,#151513 78%);
  --grad-head:       linear-gradient(180deg,#3A3A37 0%,#151513 82%);
  --grad-head-accent:linear-gradient(180deg,#2C74E8 0%,#153F92 100%);
  --glow-blue:       radial-gradient(900px 340px at 88% -12%,rgba(31,95,208,.10),transparent 70%);
  /* --shine: parked, see §7 — not in use */
  --shine: linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);

  /* space */
  --sp-1:4px;  --sp-2:8px;  --sp-3:12px;  --sp-4:16px;   --sp-5:24px;   --sp-6:32px;
  --sp-7:48px; --sp-8:64px; --sp-9:96px;  --sp-10:128px; --sp-11:160px; --sp-12:240px;
  --section-y: clamp(96px, 6vw + 2rem, 160px);
  --block-y:   clamp(48px, 3vw + 1rem, 64px);

  /* form */
  --r-sm:4px; --r-md:8px; --r-lg:16px; --r-full:999px;
  --line: 1px solid var(--paper-300);
  --shadow-1: 0 1px 2px rgba(21,21,19,.06), 0 8px 24px rgba(21,21,19,.05);
  --ease: cubic-bezier(.22,.61,.36,1);
  --dur: 240ms;
}
```

There is deliberately **no dark-theme token block.** If a platform forces a dark UI chrome, the Carmel surface stays light inside it — set `color-scheme: light` and paint the ground explicitly.

---

## 7. Components

**Buttons** — height 48 desktop / 44 mobile, padding `0 var(--sp-6)`, `--r-md`, `--fs-body` at 600, tracking 0.
- **Primary:** `--grad-blue` ground, `#FFF` text. The one light-on-dark element in the system.
- **Secondary:** `--paper-50` ground, `1px solid var(--paper-300)`, `--ink-900` text → hover border `--ink-900`.
- **Tertiary:** text only, `--blue-500`, underline offset `.2em`.

**Button hover — current spec:** no sweep. Primary deepens its shadow (`0 4px 18px rgba(31,95,208,.28)`); secondary darkens its border to `--ink-900`. Both at `var(--dur) var(--ease)`.

<details>
<summary><b>Parked — shine sweep (not in use)</b></summary>

Held for a later pass. Do not ship without a decision. The primary and secondary buttons sweep a single specular band left to right, once, on hover — never looping, never on load, never on links, cards, or nav.

```css
.btn { position: relative; overflow: hidden;
       transition: box-shadow var(--dur) var(--ease); }
.btn::before {
  content: ""; position: absolute; top: 0; bottom: 0; left: -90%; width: 60%;
  background: var(--shine); transform: skewX(-18deg);
}
.btn:hover::before { animation: shine 720ms var(--ease) forwards; }
.btn-primary:hover  { box-shadow: 0 4px 18px rgba(31,95,208,.28); }
@keyframes shine { to { left: 130%; } }
@media (prefers-reduced-motion: reduce) { .btn:hover::before { animation: none; } }
```
On the secondary (light) button, drop the shine opacity to `.35` and tint the band `--blue-50` — a white sweep on white is invisible.

</details>

**Focus** — `outline: 2px solid var(--blue-500); outline-offset: 2px;` Never removed, never replaced by the shine.

**Cards** — `--paper-50` or `--grad-paper` on `--paper-100`, `--line`, `--r-lg`, padding `--sp-6`, no shadow at rest.

**Sections** — alternate `--grad-paper` and `--grad-paper-deep`. Separation between them is a `--line` hairline, never a colour flip.

**Nav** — 72px tall, `--paper-50`, `--fs-small` at 500, `--ink-700`; active item `--ink-900` with a 2px `--blue-500` underline. Wordmark cap-height 20px, always left.

**Footer** — `--grad-paper-deep`, `--ink-600` text, hairline top. Not inverted.

**Data / numbers** — `font-variant-numeric: tabular-nums`. Key figures may take `--blue-500`; their labels stay `--ink-500`.

**Motion** — `var(--dur) var(--ease)`. Fades and 12–24px rises only. No bounce, no scale-on-hover. Respect `prefers-reduced-motion`.

---

## 8. Voice

Plain, specific, unhurried. Logistics buyers read for facts.

Say **"Cross-border freight, Toronto to Chicago, 14 hours."** Not "Delivering excellence in transportation solutions." No exclamation marks. Numerals for numbers. Sentence case everywhere except the eyebrow and the wordmark.
