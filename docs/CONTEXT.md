# Sonarche landing page — project context

## Intent

A dedicated landing page for Sonarche at **sonarche.org** (domain bought on Hostinger).
Single-purpose: present the app, make people want it, link to the GitHub repository
(which will go public). Nothing to sell — the app is free and open-source. No signup,
no pricing, no blog (for now).

## What Sonarche is

A free, open-source desktop app (Tauri + Rust core, React webview) for building and
owning an offline music library. It downloads music from the web (yt-dlp, native AAC
quality kept), imports it into a beets-managed library with fingerprint-verified
metadata (AcoustID), lets you browse by albums/artists/genres, edit all metadata,
and play everything with its integrated audio player.

## Brand narrative (drives all copy and visuals)

Tagline: **"From the stream into the Ark."**
Metaphor: Noah's Ark. The internet is an unstable sea of pixels — streams, dead
links, rented music. Sonarche is the Ark: you rescue the music you love out of the
stream, shelter it aboard, and carry it with you — owned, controlled, forever.
Keep it abstract and elegant: sea/stream/vessel/harbor imagery, geometric ark,
converging particles or waveforms. Never literal (no boat with animals, no biblical
kitsch).

## Page structure (final — v7, 2026-07-30)

The v7 Claude Design mockup ("Sonarche Landing v7", in the app repo under
`docs/designs/landing/`) superseded the earlier 6-section plan. Final order:

1. **Hero** — badge, wordmark, tagline, subline, GitHub CTA. The "Ark moment"
   SVG/GSAP animation on load (stream of particles gathered into the vessel).
2. **Why it exists** — manifesto: "Your music should outlive every app."
3. **The flow** — 4 numbered steps (paste / come aboard / fingerprint / named).
4. **The old way** — 5-tools pain table, then "Sonarche does all five."
5. **True names** — scraped-vs-identified compare, the fingerprint story.
6. **No expertise needed** — automation + the genre-edit widget.
7. **The hold is yours** — plain files, no lock-in.
8. **Under the deck** — architecture diagram (yt-dlp, ffmpeg+Chromaprint,
   beets, MusicBrainz, AcoustID, embedded Python).
9. **The deck** — library views, editable fields.
10. **The ship's sound** — the native Rust player.
11. **The real thing** — real screenshots carousel.
12. **First launch** — Gatekeeper (macOS) + SmartScreen (Windows) walkthrough.
13. **Final CTA + footer** — "Free. Open source. Yours.", MIT, personal-use line.

## Copy & languages

- The full validated copy lives in **`docs/copy/en.md`** (source of truth) and
  **`docs/copy/fr.md`** (validated French mirror). Components must render that
  text verbatim — copy fixes go to those files first.
- Two static routes: `/` (FR) and `/en/` (EN), cross-linked with `hreflang`
  alternates (+ `x-default` → FR). French is the default because the page is
  aimed at a French audience first; English is the translation. No auto-redirect
  on Accept-Language: a static export can't, and a visible language switch is
  better anyway. The switch is top-right (revealed on scroll) and in the footer.
- The FR page uses **tu**, never « vous » — it matches the app's own voice.
- The tagline **"From the stream into the Ark."** is the brand: it is never
  translated and never reworded, in any language, hero and footer included.

## Legal positioning (hard rules — never relax without Romain's say-so)

Backed by the precedent research of 2026-07-30 (see the app project's memory:
every stream-ripping lawsuit targeted monetized web converters marketed as
"free music"; free client-side OSS tools have never been touched).

- The page sells a **music library manager**; downloading is one feature among
  others, never the headline.
- **No streaming-platform names, logos, or brand colors anywhere** in copy or
  visuals ("the open web", "a link"). Naming yt-dlp/ffmpeg/beets in the
  technical "Under the deck" section is fine and deliberate.
- No "free music" framing, no anti-streaming-subscription framing, and never
  any claim about legality ("it's legal", "risk-free") — the page stays silent
  on the topic; the only trace is the footer line: "For personal use. Respect
  the terms of the services you use, and your local law."
- **Screenshots/videos**: never show a platform URL, a platform logo, or a
  famous copyrighted track mid-download. Famous covers in _library_ views are
  fine (every player does it); the download-in-progress shots use obscure or
  royalty-free content. The app strips platform branding since app commit
  2ace015 — take fresh screenshots, don't reuse old ones.
- Free forever, no ads, no paid tier: if that ever changes, the legal analysis
  must be redone first.

## SEO checklist (per language)

- One `h1` (the hero), semantic sections with `h2`s, real text in the DOM
  (GSAP reveals must animate real nodes, not inject text at runtime).
- `<title>` + meta description, canonical, `hreflang` alternates, OG + Twitter
  card with a designed OG image (1200×630, the ark + tagline).
- JSON-LD `SoftwareApplication` (name, OS, free, license MIT, repo URL).
- `sitemap.xml` + `robots.txt` in the static export.
- Self-host the fonts (@fontsource or local woff2, `font-display: swap`) —
  no Google Fonts CDN (perf + EU privacy).
- Budget: Lighthouse ≥ 95 on every axis, mobile included; LCP is the hero —
  keep its animation payload lean and never lazy-load its text.

## Stack decisions (already challenged and settled — don't relitigate)

- **Next.js, static export** (`output: 'export'`). Chosen for pragmatism (React/
  Tailwind knowledge reuse, Vercel-native, easy OG/meta). TanStack Start and Astro
  were considered and ruled out for this project.
- **No react-query** — no async state on a landing page.
- **Tailwind with design tokens copied from the Sonarche app** (its HeroUI v3 theme
  layer: colors, radius, typography). The landing must feel like the app's world
  extended. Do NOT import the full HeroUI library unless several components are
  genuinely used. Only the _useful subset_ of the app's `src/app/theme.css` is
  copied — the landing has no genre families, no drawer, no dark block. Values
  come from the app, not from the mockup: the app's palette was reworked for
  contrast after v7 was drawn (accent `oklch(0.505 0.185 277)`, structural greys
  on hue 279), so the built page reads very slightly quieter than the mockup.
- **Typography: Space Grotesk (sans) + Instrument Serif (the italic accent)**, the
  mockup's two faces, self-hosted via `@fontsource` — never the Google CDN. The
  italic serif carries the tagline, the step notes and the emphasis spans; it is
  the brand's second voice, not decoration.
- **GSAP** as the single animation engine (100% free since the Webflow acquisition,
  all plugins included): ScrollTrigger for scroll narrative, SplitText for text
  reveals, DrawSVG/MorphSVG for the hand-made SVG animations. No Motion/framer-motion,
  no three.js/WebGL.
- **Hosting: Vercel Hobby** (fine for non-commercial open-source) + DNS pointed
  from Hostinger.

## Design workflow

Mockups are made in Claude Design (onboarded on the app's screenshots so it inherits
the real design system), then built here with iteration in the browser. The reference
is `docs/designs/Sonarche Landing v7.dc.html` and nothing else — see that folder's
README for why the other exports are traps.

The design direction: **light only**, paper rather than white, indigo accent,
restrained palette, strong typography, award-site energy. App screenshots are the
proof — treat them as heroes, large, in real window chrome. Explicitly banned:
purple/blue gradient mesh, 3D blobs, emoji feature grids, generic AI-landing look.

No dark theme on the landing (decided 2026-07-30). The _app_ is the thing that
needs both themes; a landing page does not, and the validated mockup is light.
`color-scheme: light` accordingly — the page must not be half-inverted by a
browser that assumes dark.

Chosen variants from the mockup's picker: hero **storm**, flow **cascade** (the
four steps alternating left/right).

## Quality bar

- Juicy but never laggy: animate transform/opacity, respect `prefers-reduced-motion`.
- Video loops as mp4/webm (`autoplay muted loop playsinline`), never GIF.
- Copy in English. The page is a scroll narrative echoing rescue → shelter →
  ownership in every section.
