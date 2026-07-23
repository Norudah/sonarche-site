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

## Page structure (agreed)

1. **Hero** — full viewport, wordmark + tagline, hand-crafted SVG/GSAP "Ark moment"
   animation on load (stream of particles gathered into the vessel). CTA → GitHub.
2. **Manifesto** — 3–4 punchy lines on ownership; large typography, text reveal.
3. **The flow** — the pipeline: paste a link → download → auto-import with verified
   metadata → lands in the library. Screenshots / short video loops per step.
4. **Your library, your rules** — album/artists/genres views + metadata edit drawer.
5. **Your player too** — Sonarche replaces the music player, not just a downloader.
6. **Open source & free** — GitHub CTA repeated, built-with (Tauri, Rust, beets),
   minimal footer.

## Stack decisions (already challenged and settled — don't relitigate)

- **Next.js, static export** (`output: 'export'`). Chosen for pragmatism (React/
  Tailwind knowledge reuse, Vercel-native, easy OG/meta). TanStack Start and Astro
  were considered and ruled out for this project.
- **No react-query** — no async state on a landing page.
- **Tailwind with design tokens copied from the Sonarche app** (its HeroUI v3 theme
  layer: colors, radius, typography). The landing must feel like the app's world
  extended. Do NOT import the full HeroUI library unless several components are
  genuinely used.
- **GSAP** as the single animation engine (100% free since the Webflow acquisition,
  all plugins included): ScrollTrigger for scroll narrative, SplitText for text
  reveals, DrawSVG/MorphSVG for the hand-made SVG animations. No Motion/framer-motion,
  no three.js/WebGL.
- **Hosting: Vercel Hobby** (fine for non-commercial open-source) + DNS pointed
  from Hostinger.

## Design workflow

Mockups are made in Claude Design (onboarded on the app's screenshots so it inherits
the real design system), then built here with iteration in the browser. The design
direction: dark-first, moody, restrained palette, strong typography, award-site
energy. App screenshots are the proof — treat them as heroes, large, in real window
chrome. Explicitly banned: purple/blue gradient mesh, 3D blobs, emoji feature grids,
generic AI-landing look.

## Quality bar

- Juicy but never laggy: animate transform/opacity, respect `prefers-reduced-motion`.
- Video loops as mp4/webm (`autoplay muted loop playsinline`), never GIF.
- Copy in English. The page is a scroll narrative echoing rescue → shelter →
  ownership in every section.
