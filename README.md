<div align="center">

<img src="docs/brand/sonarche-tile-168.png" alt="Sonarche" width="168" height="168">

# sonarche.org

**From the stream into the Ark.**

The landing page for Sonarche. The app itself lives in another repository — this
one only holds the site that points at it.

### → [github.com/Norudah/sonarche](https://github.com/Norudah/sonarche)

[![License](https://img.shields.io/badge/license-MIT-6163f2)](LICENSE)

</div>

---

## What this is

A single scrolling page, French at `/` and English at `/en/`, built with Next.js
in static export mode — no server, no database, no analytics, no tracking. It
deploys as plain files.

If you are looking for the application — what it does, how to install it, how it
works — everything is in the
[main repository](https://github.com/Norudah/sonarche).

## Running it

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`.

The share card in `public/og.png` is generated rather than drawn by hand. Rerun
`node scripts/build-og-image.mjs` after any change to the mark, the palette or
the tagline.

## Licensing

The code in this repository is MIT — see [LICENSE](LICENSE).

Two things in it are not covered by that and carry their own terms:

- **The typefaces.** [Space Grotesk](https://github.com/floriankarsten/space-grotesk)
  and [Instrument Serif](https://github.com/Instrument/instrument-serif) are used
  under the SIL Open Font License. Both licences ship beside the font files in
  [`public/fonts/`](public/fonts).
- **The Sonarche mark.** The ark, the wordmark and the tile are the project's own
  identity, maintained in the main repository and copied here. Use them to refer
  to Sonarche, not to brand something else.

The screenshots in `public/shots/` are captures of the application. Any album
artwork visible in them belongs to its respective rights holders and appears
incidentally, as it would in a screenshot of any music player.
