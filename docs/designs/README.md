# Reference mockups

Claude Design exports, vendored here on 2026-07-30 so the build has one
unambiguous visual reference. The originals live in the app repo under
`docs/designs/landing/Sonarche landing page design final/`.

| File                                | Role                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `Sonarche Landing v7.dc.html`       | **The reference.** Validated v7 — 13 sections, no platform named.         |
| `Sonarche Landing FR (web).dc.html` | FR mirror. Careful: it **vouvoie**, an earlier pass. See `../copy/fr.md`. |
| `SonarcheArk.dc.html`               | The animated ark (hero + footer). Same geometry as the app's brand mark.  |
| `IsoScene.dc.html`                  | The four isometric scenes of the flow section.                            |
| `support.js`                        | Claude Design runtime, needed to render the `.dc.html` files.             |

## Do not read copy from the other exports

`Sonarche Landing v7 - export.dc.html` and the 8 MB `Sonarche Landing.html` in
the app repo are **stale v6 builds**. They name streaming platforms and
downloader products, and still show `License: [ TBD — MIT? ]`. They were
deliberately left behind. Copy comes from `../copy/en.md` only.

## Rendering one

`file://` won't do — the runtime resolves siblings over HTTP:

```bash
cd docs/designs && python3 -m http.server 8909
```

Then open `http://localhost:8909/Sonarche%20Landing%20v7.dc.html`. The scroll
reveals need a visible, focused window to trigger.

## Chosen variants

The mockup exposes a variant picker in the top right. The build follows the
defaults: **hero `storm`** (the rain and the sea) and **flow `cascade`** (the
four steps alternating left/right). The `voyage` and `deck` variants are not
built.
