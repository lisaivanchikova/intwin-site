# InTwin Partners — website

Static, multi-page marketing site for InTwin Partners (intwin.tech). No framework, no build
dependencies beyond Node for the page assembly step. Served as plain HTML by GitHub Pages.

**Live:** https://lisaivanchikova.github.io/intwin-site/

## Structure

```
build.js              page assembler (Node, no dependencies)
src/layout.html       shared shell: head, top bar, header/nav, footer
src/pages/*.html      page content + a meta block
assets/css/site.css   the whole design system
assets/js/site.js     navigation only (dropdowns, mobile menu)
assets/img/*.svg      illustrations, drawn for this site
*.html                build output — do not edit these directly
```

## Editing

Content lives in `src/pages/`. Each page starts with a meta block:

```html
<!--meta
title: Page title used in <title>
desc: Meta description
active: ai
-->
```

`active` highlights the matching top-level nav item (`ai`, `partners`, `about`).

Header, footer and navigation are in `src/layout.html` — change once, applies everywhere.

After any edit:

```bash
node build.js
```

This regenerates the seven `.html` files in the repo root. Commit both the `src/` change and
the rebuilt output, since GitHub Pages serves the output directly.

To preview locally:

```bash
python3 -m http.server 8765
# then open http://localhost:8765/
```

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — positioning, services overview, AI, process |
| `services.html` | Six services in detail, fully vs co-managed, pricing rationale |
| `ai.html` | What automation touches, what it never touches, guardrails |
| `solutions.html` | By company size and by industry, plus who we are *not* for |
| `partners.html` | Acquisition/merger funnel aimed at MSP owners |
| `about.html` | Company facts, commitments, stack, straight answers |
| `contact.html` | Assessment form, phone, Calendly, separate owner enquiry path |

## Brand

Palette is taken from the logo itself, not invented:

| Token | Value | Use |
|---|---|---|
| `--blue` | `#007AFF` | primary actions, accents |
| `--navy` | `#3B425F` | headings on light, illustration darks |
| `--navy-d` | `#2C3149` | dark bands, stats, CTA |
| `--navy-xd` | `#232739` | footer |
| `--mist` | `#F5F6FB` | alternating section background |

Typeface is Inter, loaded from Google Fonts, with a system fallback stack.

## Content rules applied

These were deliberate and should survive future edits:

- **No invented metrics.** No uptime percentage, no CSAT score, no client count, no logo wall.
  Every number on the site is one the company can defend: 15-minute target response,
  24/7/365 emergency cover, Delaware C Corp incorporated March 2023.
- **No claimed service area or office.** The site says plainly that the company works remotely
  and supports teams nationwide. Wilmington appears only as registered office, in the footer.
- **No team page until there are real people, photos and certifications.**
- **No published price list**, with the reasoning stated rather than the question dodged.
- **AI is described as mechanics, not personality** — including an explicit list of what is
  never automated. The word does not appear in the H1.

## Still to decide

- Acquisition criteria on `partners.html` ($1M–$5M revenue, 60%+ recurring) are the segment
  standard and need confirming against actual mandate.
- Form posts via `mailto:` so the site needs no backend. Swap for Formspree, Netlify Forms or
  similar when a real endpoint exists.
- SOC 2 wording on `about.html` says "aligned to" rather than "audited against" — tighten once
  the current audit status is confirmed.
