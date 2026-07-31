import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

/*
 * Draws app/opengraph-image.png — the card Discord, LinkedIn and Slack unfurl
 * when the link is pasted.
 *
 * Run by hand, not by the build: this changes when the brand changes, which is
 * roughly never, and a 1200x630 raster does not belong in a hot loop. `sharp`
 * is a devDependency for the same reason — nothing in the shipped site imports
 * it.
 *
 *   node scripts/build-og-image.mjs
 *
 * The card is the hero, cropped to a card: the same paper, the same sea drawn
 * by the same swell formula, the same ark, the same two faces. A share preview
 * that does not look like the page it links to is a share preview that makes
 * people think they clicked the wrong thing.
 *
 * Type is real, not traced: both woff2 go in as data URIs inside an @font-face,
 * which resvg resolves. Colours are hex rather than the oklch the site uses —
 * this renderer is not a browser and has no colour-4 support.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
/* The mark is the app's, and it is read from the app's repo rather than copied:
   one drawing, one place it is maintained. See app/icon.svg for the same rule. */
const BRAND = join(ROOT, "..", "sonarche", "docs", "brand");

const W = 1200;
const H = 630;

const INK = {
  paperTop: "#fdfdff",
  paperBottom: "#eef0fb",
  strong: "#12131d",
  accent: "#4f51cb",
  accentMuted: "#484e8c",
  body: "#535461",
  seaBody: "#d7dcf9",
  seaFoot: "#565be1",
  seaCrest: "#a8b3f1",
};

const font = (file) => readFileSync(join(ROOT, "public", "fonts", file)).toString("base64");

/*
 * The waterline, at u across the width — three sines, the long one carrying more
 * than half the amplitude so the surface reads as one body rising rather than as
 * even chop. Same shape as components/brand/sea/sea.ts, at a card's scale.
 */
const TURN = Math.PI * 2;
const swell = (u) =>
  0.5 +
  0.5 * (0.52 * Math.sin(u * TURN * 1.15 + 0.9) + 0.3 * Math.sin(u * TURN * 2.7 + 1.7) + 0.2 * Math.sin(u * TURN * 8));

/** The berth: water lies flat where the hull sits, or the ark tilts on it. */
const BERTH = 13;
const shelter = (pct) => {
  const c = Math.min(1, Math.max(0, Math.abs(pct - 50) / (BERTH * 1.6)));
  return 0.12 + 0.88 * (c * c * (3 - 2 * c));
};

const WATERLINE = 538;

/*
 * Two hexes, blended. The site quantises its tints into seven steps so brotli
 * has something to chew on; a png has no such worry, so the crests here run the
 * continuum uncut — three bands read as three stripes of paint at this size.
 */
function mix(a, b, t) {
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [ar, ag, ab] = rgb(a);
  const [br, bg, bb] = rgb(b);
  const c = (x, y) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
}

/** How far the surface itself heaves above its nominal line, at u. */
const heave = (u) => 16 * Math.sin(u * TURN * 0.85 + 0.47) * shelter(u * 100);

/*
 * The body of water, cut along the surface it actually has.
 *
 * A rectangle with a straight top would put a ruled line across the card and
 * turn the sea into a swatch — the same mistake the site's own first sea made.
 * The crests stand on this line, so the two agree by construction.
 */
function water() {
  const steps = 120;
  const top = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    top.push(`${(u * W).toFixed(1)},${(WATERLINE - heave(u)).toFixed(1)}`);
  }
  return `<path d="M0,${H} L${top.join(" L")} L${W},${H} Z" fill="url(#water)"/>`;
}

function crests() {
  const bars = [];
  const count = 300;
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    const lee = shelter(u * 100);
    const s = swell(u);
    const height = Math.round(8 + 46 * s * lee);
    const y = WATERLINE - heave(u) - height;
    const fill = mix(INK.seaFoot, INK.seaCrest, Math.min(1, s * lee * 1.15));
    bars.push(
      `<rect x="${(u * W).toFixed(1)}" y="${y.toFixed(1)}" width="4" height="${height}" rx="2" fill="${fill}" opacity="${(0.55 + 0.35 * lee).toFixed(2)}"/>`,
    );
  }
  return bars.join("");
}

/** The mark, lifted whole out of the app's brand folder and placed on the water. */
function ark(x, y, size) {
  const svg = readFileSync(join(BRAND, "sonarche-mark.svg"), "utf8");
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return `<g transform="translate(${x} ${y}) scale(${size / 24})">${inner}</g>`;
}

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face { font-family: "Grotesk"; src: url(data:font/woff2;base64,${font("space-grotesk-latin-wght-normal.woff2")}) format("woff2"); }
      @font-face { font-family: "Serif"; src: url(data:font/woff2;base64,${font("instrument-serif-latin-400-italic.woff2")}) format("woff2"); }
    </style>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${INK.paperTop}"/>
      <stop offset="1" stop-color="${INK.paperBottom}"/>
    </linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${INK.seaBody}"/>
      <stop offset="0.55" stop-color="#bcc4f8"/>
      <stop offset="1" stop-color="#9aa5f0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#paper)"/>

  <text x="${W / 2}" y="82" text-anchor="middle" font-family="Grotesk" font-size="20" font-weight="600"
        letter-spacing="5.5" fill="${INK.accent}">GRATUIT · OPEN SOURCE · HORS LIGNE</text>

  <text x="${W / 2}" y="198" text-anchor="middle" font-family="Grotesk" font-size="118" font-weight="700"
        letter-spacing="-3" fill="${INK.strong}">SONARCHE</text>

  <!-- The tagline and nothing else. Every unfurler prints og:description under
       the image, so a second line of prose here is the same sentence twice. -->
  <text x="${W / 2}" y="264" text-anchor="middle" font-family="Serif" font-size="43"
        fill="${INK.accentMuted}">From the stream into the Ark.</text>

  <!-- Water, then hull: the ark floats in the sea rather than standing on a
       drawing of one, which is the whole point of the berth above. -->
  ${water()}
  ${crests()}
  ${ark(W / 2 - 150, WATERLINE - 253, 300)}
</svg>`;

/*
 * public/, not the app/opengraph-image.png file convention.
 *
 * That convention resolves per route segment, and this site's two locales live
 * in two route groups with a root layout each — one file at app/ reaches
 * neither, and one file per group is the same 50KB twice. A single asset the
 * two layouts point at is one image, one place, and each locale still gets its
 * own alt text.
 */
const out = join(ROOT, "public", "og.png");
await sharp(Buffer.from(card)).png({ compressionLevel: 9 }).toFile(out);
console.log(`wrote ${out}`);
