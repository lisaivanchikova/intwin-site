# Intwin Tech — brand spec, as built from the brandbook

Source: `Intwin brandbook .pdf`, 12 pages, received 2026-08-27.
This file is the machine-readable version of it. Where the site departs from
the brandbook, the reason is written down here rather than left as a surprise.

## Colour

| Token | Hex | Role, per the brandbook |
|---|---|---|
| Graphite | `#14171F` | Primary dark surface. The room the brand lives in. |
| Ink Navy | `#131A54` | The core. Headlines on light, depth on dark. |
| Signal Blue | `#0057FF` | The twin. Actions, links, emphasis — **one per composition**. |
| Echo Blue | `#A9BDF0` | First trace. Secondary accents, labels on dark, data series. |
| Mist Blue | `#DCEBF8` | Faintest echo. Tints, dividers, pattern dots at rest. |
| Paper | `#F7F9FC` | Light background for documents and print. Never pure white. |

Proportion rule: surfaces dominate; Signal Blue stays under ~10% of any
layout. In print-heavy or light contexts, Paper leads and Graphite becomes type.

Echo and Mist never carry meaning — they are the trace the twin leaves behind.

### The one departure, and why

Signal Blue `#0057FF` on Graphite `#14171F` measures **3.34:1**. WCAG AA wants
4.5:1 for text under 18.66px bold. So Signal Blue cannot be link or label text
on a dark surface without failing the standard.

The brandbook resolves this itself: Echo Blue is designated for "labels on
dark", and `#A9BDF0` on Graphite measures **9.8:1**. So:

- **Signal Blue** — button and control fills, with white label text (5.47:1), plus
  non-text emphasis: rules, underlines, the single dot, focus rings.
- **Echo Blue** — link text, eyebrows, labels and small type on dark.

This keeps Signal Blue as the single point of action while the text that has
to be read stays readable.

## Typography

**Manrope** carries everything: display, headings, body, UI. One family.

| Use | Weight | Size |
|---|---|---|
| Display | 800 extrabold | 48–96px |
| Heading | 700 bold | 24–40px |
| Body | 400 regular | 14–17px |
| UI | 500 / 600 | — |

- Display tracking −0.02 to −0.03em.
- Body never below 13px on screen, 9pt in print.
- No italics. No third typeface. **No all-caps Manrope.**
- Sentence case everywhere except mono labels.

**JetBrains Mono** is the technical voice: labels, metadata, figures and
evidence — SLAs, timestamps, spec tables. It signals "this is measured, not
marketed."

- 10–13px, uppercase, tracking +0.14 to +0.18em.
- Never for headings or body copy.

Approved alternates: Space Grotesk (sharper), Sora (rounder) for display;
IBM Plex Mono (quieter, print-safe), Space Mono (display only) for mono.

### What this changes on the site

Every `.eyebrow` is currently uppercase in the sans face. Under these rules
uppercase sans is forbidden and small uppercase labels belong to JetBrains
Mono — so eyebrows convert to mono, which is what the brandbook's own website
mockup shows.

## Website direction (brandbook page 11)

> Dark, calm, evidence forward.

- Graphite surfaces; **near-black `#0E1118` for cards and hero**.
- **Exactly one Signal Blue CTA per viewport.**
- Numbers and SLAs set in JetBrains Mono — the proof layer.
- Dot-wave appears **once**, in the hero, behind whitespace.
- **Corners near-square, 2–4px. No glows, no gradients.**
- Long-form pages may switch to Paper with Ink type.

From the mockup itself: eyebrow in mono, Echo Blue. Headline in Manrope
extrabold with its second line in Signal Blue. One filled Signal Blue button
beside one outlined ghost. A stats strip under the hero with the figures set
in mono.

## Where the site as built breaks these rules

| Rule | Site today | Fix |
|---|---|---|
| Corners 2–4px | 14px on cards, 8px on buttons | Reduce the radius tokens |
| No gradients | The hero is a gradient | Flat fill |
| No glows | Shadow tokens on cards and dropdowns | Drop or flatten |
| Cards near-black `#0E1118` | Cards are **lighter** than the page | Invert: cards go darker |
| Signal Blue `#0057FF` | Accent is `#3D9BFF` | Fills to Signal, text to Echo |
| Manrope + JetBrains Mono | Archivo + Inter | Swap both faces |
| No all-caps sans | Eyebrows are uppercase sans | Eyebrows to mono |
| One Signal CTA per viewport | Several blue buttons share a screen | Audit section by section |
| Dot-wave once in the hero | Absent | Build the pattern |
| Logo: circles plus `intwin tech` | The brain/network mark | Replace the mark |

## The logo (brandbook page 4)

> One business. One twin. Its echo.

- **The core** — the solid dark dot is the real business: opaque, grounded, yours.
- **The twin** — the first bright ring is its AI twin: the same outline, alive.
- **The echo** — the fading rings behind the twin are not more twins. They are
  the trace of one twin working: resonance, reach, scale.

Rules:

- Clear space on all sides ≥ one ring diameter.
- All four circles are the same diameter — the core included. The core stands
  apart with a small gap; each echo slides behind the ring before it, showing
  its right crescent, with a thin surface-coloured gap at the crossing.
- **Always two echoes**; one only at very small sizes (favicon, 16px).
- Never rotate the mark or stack it vertically over the wordmark.
- Wordmark is always lowercase: **intwin** ExtraBold + **tech** Medium.
- Minimum mark height: 24px on screen, 10mm in print.
- On dark surfaces the core inverts to light; **the signal ring never changes**.

The mark is entirely geometric — circles, one stroked ring, two crescents — so
it rebuilds as SVG at any size rather than being carried as a raster. The
construction below was measured off the supplied artwork, so the SVG can be
reproduced exactly rather than traced by eye.


## Logo files

Delivered 2026-08-27, five PNGs, now in `assets/img/brand/`. All RGBA with a
baked background — there is no transparent cut-out among them, so a mark
dropped onto a non-brand surface has to be rebuilt as SVG, not keyed out.

| File | Size | What it is |
|---|---|---|
| `intwin-mark-light-1024.png` | 1024×1024 | Mark alone on Paper |
| `intwin-mark-dark-1024.png` | 1024×1024 | Mark alone on Graphite |
| `intwin-lockup-light-1800.png` | 1800×600 | Mark + wordmark on Paper |
| `intwin-lockup-dark-1800.png` | 1800×600 | Mark + wordmark on Graphite |
| `intwin-header-2400x800.png` | 2400×800 | Dark lockup + tagline + dot-wave |

The brandbook PDF itself is **not** in this repo. It is internal, and this
repo is public and served by GitHub Pages — anything committed here is
downloadable by anyone. This file is the distillation; the PDF stays with
Lisa.

### Mark colours, measured

The echoes are not one palette reused on both grounds. Each variant fades its
echoes **toward its own background**, which is why the dark echoes are slate
rather than blue.

| Part | On Paper | On Graphite |
|---|---|---|
| Core (solid disc) | `#131A54` Ink Navy | `#EAF2FB` near-white |
| Ring (the twin) | `#0057FF` Signal Blue | `#0057FF` Signal Blue |
| Echo 1 | `#A9BDF0` Echo Blue | `#667292` |
| Echo 2 | `#DCEBF8` Mist Blue | `#40464F` |
| Ground | `#F7F9FC` Paper | `#14171F` Graphite |

The ring holds `#0057FF` on both grounds — that is the brandbook rule made
literal. The dark core is `#EAF2FB`, marginally cooler than Paper `#F7F9FC`;
close enough that Paper is a safe substitute at small sizes.

### Construction, measured off `intwin-mark-light-1024.png`

Every value below is exact, in the 1024 canvas. Let **d** be the circle
diameter.

- **d = 300.** All four circles share it. Ink box: x 60–965, y 362–661,
  so the mark is **3.02 : 1**, wider than it is tall.
- **Ring stroke = 50 = d/6.** Inner hole 200. Both echoes use the same stroke.
- Centres, on one horizontal axis at cy = 511.5:

  | Circle | cx | Step from previous |
  |---|---|---|
  | Core | 209.5 | — |
  | Ring | 543.5 | 334 = 1.113 d |
  | Echo 1 | 679.5 | 136 = 0.453 d |
  | Echo 2 | 815.5 | 136 = 0.453 d |

- So the core sits **apart** — a 34px gap between core edge and ring edge —
  while the three rings **overlap**, each echo offset by a hair under half a
  diameter. That is the whole idea in geometry: the business is separate and
  solid, the twin and its resonance interlock.
- Stacking order is front to back: ring over echo 1 over echo 2. Each is drawn
  whole; the one in front hides the rest, leaving only the right crescent.
- There is no gap stroke in the artwork — the crescents meet the ring
  directly. On a busy ground, add a ground-coloured outer stroke rather than
  redrawing the geometry.

### Lockup metrics, measured off the 1800×600 files

Both light and dark lockups are pixel-identical in layout.

- Mark height **192** (d = 192 at this scale), ink x 280–857.
- Gap mark → wordmark: **77 = 0.40 × mark height**.
- Wordmark ascender height **88 = 0.458 × mark height**, baseline at y 345.
- Word space between `intwin` and `tech`: **23**.
- The wordmark's optical centre sits on the mark's centre line, not its
  baseline.

Wordmark colour: on Paper, `intwin` is Graphite `#14171F` and `tech` is Signal
Blue `#0057FF`. On Graphite, `intwin` is Paper and `tech` is Echo Blue
`#A9BDF0` — again the contrast rule, applied by the brand's own designer.

### Tagline

The header file carries a tagline the brandbook pages did not:

> **YOUR BUSINESS, TWINNED.**

Set in JetBrains Mono, uppercase, wide tracking, Echo Blue `#A9BDF0`, sitting
under `tech` and left-aligned to the `i` of `intwin`. It is a brand asset, not
yet site copy — putting it on the site is a decision to take, not a detail to
absorb.

### The dot-wave

Visible in the header, right third, behind whitespace — exactly the "once, in
the hero" placement the brandbook calls for. It is a field of small dots whose
vertical displacement traces a wave, densest at the crest.

Measured: the brightest dot on Graphite is `#17344E`, which is Signal Blue at
roughly **20% opacity** over the ground; most dots sit far below that. The
pattern is meant to be felt, not read — it never approaches text contrast.
