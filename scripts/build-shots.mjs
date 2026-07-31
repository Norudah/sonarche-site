import { mkdir } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

/*
 * Converts a folder of raw app captures (retina PNGs, window shadow and
 * transparent margin already baked in) into the carousel's webp files.
 *
 *   node scripts/build-shots.mjs <capture-dir> <locale>
 *
 * <capture-dir> holds light/ and dark/ subfolders whose file names are the
 * capture names below; output lands in public/shots/<locale>/{light,dark}/.
 */

// Capture file name -> shot id (components/sections/real-thing/copy.ts)
const MAP = {
  "album-details": "album",
  "genres-page-and-track-list": "genres",
  "album-inspect-panel": "metadata",
  "track-inspect-panel": "inspector",
  "metadata-dashboard": "upkeep",
};

// The intrinsic size RealThing declares; keep the two in sync.
const WIDTH = 1600;
const HEIGHT = 1040;

const [src, locale] = process.argv.slice(2);
if (!src || !locale) {
  console.error("usage: node scripts/build-shots.mjs <capture-dir> <locale>");
  process.exit(1);
}

const out = path.join(import.meta.dirname, "..", "public", "shots", locale);

for (const theme of ["light", "dark"]) {
  await mkdir(path.join(out, theme), { recursive: true });
  for (const [capture, id] of Object.entries(MAP)) {
    const info = await sharp(path.join(src, theme, `${capture}.png`))
      .resize(WIDTH, HEIGHT, { fit: "cover" })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(out, theme, `${id}.webp`));
    console.log(`${locale}/${theme}/${id}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
