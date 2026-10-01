import type { CSSProperties } from "react";

/* One generator, two weathers: the footer is the hero's sea with the amplitude taken out. Seeded and
   server-only, so the markup is identical on every build and ships no JavaScript. */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/* The swell, 0 in a trough to 1 on a crest, at u across the width. One long wave carries most of the
   amplitude; two shorter ones ride on it. */
const TURN = Math.PI * 2;

function swellAt(u: number): number {
  const long = 0.52 * Math.sin(u * TURN * 1.15 + 0.9);
  const wave = 0.3 * Math.sin(u * TURN * 2.7 + 1.7);
  const chop = 0.2 * Math.sin(u * TURN * 8);
  return 0.5 + 0.5 * (long + wave + chop);
}

const smooth = (n: number) => {
  const c = clamp01(n);
  return c * c * (3 - 2 * c);
};

/** How tall a crest stands over a trough, before a profile's amplitude. */
const REACH = 44;

/* The waterline's own heave in px, slower than the crests: water has no flat base. It crosses zero
   mid-frame, where the ark is berthed at a fixed height. */
const LIFT = 20;

function surfaceAt(u: number): number {
  return LIFT * (0.62 * Math.sin(u * TURN * 0.85 + 0.47) + 0.38 * Math.sin(u * TURN * 2.1 + 2.4));
}

/* Flat inside the berth: a surface tilting across the beam put one end of the hull underwater. */
function heaveAt(u: number, profile: SeaProfile): number {
  const fromCentre = Math.abs(u * 100 - 50);
  const shelter = 0.08 + 0.92 * smooth(fromCentre / (profile.berth * 1.6));
  return surfaceAt(u) * profile.amplitude * shelter;
}

/* Each bar picks a place on a deep-trough to pale-crest continuum, from its swell, its distance to
   the berth and some noise. Quantised to seven steps so the markup compresses well. */
const TINTS = 7;

function seaTint(t: number): string {
  const k = Math.round(clamp01(t) * (TINTS - 1)) / (TINTS - 1);
  const foot = `oklch(${(0.545 + 0.135 * k).toFixed(3)} ${(0.2 - 0.062 * k).toFixed(3)} ${Math.round(276 + 7 * k)})`;
  const crest = `oklch(${(0.705 + 0.135 * k).toFixed(3)} ${(0.14 - 0.075 * k).toFixed(3)} ${Math.round(274 + 9 * k)})`;
  return `linear-gradient(to top, ${foot}, ${crest})`;
}

/** The far row is flat and hazy — four steps are plenty behind everything else. */
function deepTint(t: number): string {
  const k = Math.round(clamp01(t) * 3) / 3;
  return `oklch(${(0.775 + 0.055 * k).toFixed(3)} ${(0.075 - 0.028 * k).toFixed(3)} 278)`;
}

export type SeaBar = {
  left: string;
  /** px this bar's foot sits above the nominal waterline — the heave. */
  lift: number;
  height: string;
  background: string;
  opacity: number;
  duration: string;
  delay: string;
};

/** The mass of water under the crests, clipped to the heaving surface. */
export type SeaBody = {
  /** px of the container's bottom edge the water covers, at its highest. */
  height: number;
  clipPath: string;
  background: string;
};

export type Sea = {
  /** The water itself. Drawn first, behind every row. */
  body: SeaBody;
  /** A sparser, paler row for depth — drawn furthest back. */
  deep: SeaBar[];
  /** The two banks flanking the berth — drawn behind the ark. */
  back: SeaBar[];
  /** The calmer water of the berth itself — drawn in front of the hull. */
  front: SeaBar[];
  /** The weather, as custom properties. Goes on the container the layers sit in. */
  style: CSSProperties;
};

export type SeaProfile = {
  seed: number;
  /** Bars across the full width; also the sampling rate of the swell. */
  count: number;
  /** The height every bar has before the swell adds anything — the still water. */
  floor: number;
  /** Half-width, in percent, of the calmer water the ark is berthed in. */
  berth: number;
  /** Height of the swell, 1 being the storm. */
  amplitude: number;
  /** Time multiplier on a bar's breath — above 1 the water breathes slower. */
  tempo: number;
  /** Opacity multiplier. */
  presence: number;
  /** Pushes the whole surface towards its pale end. 0 is the storm's full range. */
  pallor: number;
  /** The body of water under the crests, top to bottom. */
  bodyTint: string;
  /** How far a bar stretches and squashes, as a fraction of its height. */
  breath: number;
  /** How far the whole surface slides sideways, and over how long. */
  drift: string;
  driftTime: string;
  deepDriftTime: string;
};

/** The hero: the stream Sonarche fishes music out of. */
export const SEA_STORM: SeaProfile = {
  seed: 42,
  count: 320,
  floor: 9,
  berth: 13,
  amplitude: 1,
  tempo: 1,
  presence: 1,
  pallor: 0,
  // Fades out by the frame's bottom, where the hero's own gradient takes over.
  bodyTint:
    "linear-gradient(180deg, oklch(0.83 0.07 277 / 0.62), oklch(0.82 0.08 277 / 0.5) 45%, oklch(0.86 0.05 277 / 0))",
  breath: 0.2,
  drift: "26px",
  driftTime: "29s",
  deepDriftTime: "38s",
};

/* Home water: the long wave survives, its violence does not. Slower, shorter drift, paler. */
export const SEA_CALM: SeaProfile = {
  seed: 1104,
  count: 240,
  floor: 6,
  berth: 15,
  amplitude: 0.62,
  tempo: 1.85,
  presence: 0.78,
  pallor: 0.22,
  // The footer's water keeps its body all the way down: nothing follows it, and
  // the page should end on the sea rather than fade back to paper.
  bodyTint: "linear-gradient(180deg, oklch(0.9 0.04 279 / 0.55), oklch(0.85 0.06 279 / 0.68))",
  breath: 0.08,
  drift: "13px",
  driftTime: "46s",
  deepDriftTime: "61s",
};

/** Samples along the surface. Seventy-odd is ~20px a facet at 1440 — smooth. */
const SURFACE_STEPS = 72;

function buildBody(profile: SeaProfile, line: number): SeaBody {
  const crest = Math.ceil(LIFT * profile.amplitude);
  const points: string[] = [];
  for (let k = 0; k <= SURFACE_STEPS; k++) {
    const u = k / SURFACE_STEPS;
    const y = crest - heaveAt(u, profile);
    points.push(`${(u * 100).toFixed(2)}% ${y.toFixed(1)}px`);
  }
  points.push("100% 100%", "0% 100%");

  return {
    height: line + crest,
    clipPath: `polygon(${points.join(",")})`,
    background: profile.bodyTint,
  };
}

/**
 * @param line where the surface sits, in px above the container's bottom edge.
 */
export function buildSea(profile: SeaProfile, line: number): Sea {
  const { seed, count, floor, berth, amplitude, tempo, presence, pallor } = profile;
  const rnd = lehmer(seed);

  const deep: SeaBar[] = [];
  const back: SeaBar[] = [];
  const front: SeaBar[] = [];

  for (let i = 0; i < count; i++) {
    const u = i / (count - 1);
    const pct = u * 100;
    const fromCentre = Math.abs(pct - 50);
    const left = `${pct.toFixed(2)}%`;

    // How far out of the berth this bar stands: 0 in the lee, 1 on the flank.
    const rise = clamp01((fromCentre - berth) / 26);
    const swell = swellAt(u);
    // Where the water's own surface is here, which is what this bar stands on.
    const lift = Math.round(heaveAt(u, profile));

    // Amplitude scales the swell, not the bar: calm water of 4px stubs would read as dust.
    let height = floor + amplitude * (2 + REACH * swell * (0.55 + rise * 0.55) + rnd() * 3.5);
    // The lee of the berth, ramped smoothly out past its own edge. A hard step
    // back to full height right where the berth ends is a visible notch in the
    // sea, and the taller the swell the more it shows.
    height *= 0.42 + 0.58 * smooth(fromCentre / (berth * 1.6));

    const bar: SeaBar = {
      left,
      lift,
      height: `${Math.round(height)}px`,
      background: seaTint(0.32 * rise + 0.5 * swell + 0.34 * (rnd() - 0.5) + pallor),
      // Barely dimmer on the flanks than in the lee: the old 0.45 fall is what
      // made the edges of the sea read as a different, tireder material.
      opacity: Number(((0.92 - rise * 0.16) * presence).toFixed(2)),
      duration: `${((2.1 + (i % 5) * 0.14) * tempo).toFixed(2)}s`,
      delay: `-${(i * 0.043 * tempo).toFixed(2)}s`,
    };
    (fromCentre < berth ? front : back).push(bar);

    if (i % 4 === 0) {
      // The far row runs a quarter of a wavelength behind the near one. Two rows
      // cresting together read as one drawing repeated; offset, they read as
      // water with something behind it.
      const far = swellAt(u + 0.16);
      deep.push({
        left,
        lift,
        height: `${Math.round(floor + 4 + amplitude * (3 + REACH * 0.8 * far + rnd() * 4))}px`,
        background: deepTint(0.55 * far + 0.5 * rnd() + pallor),
        opacity: Number(((0.42 - rise * 0.08) * presence).toFixed(2)),
        duration: `${((3.3 + (i % 3) * 0.25) * tempo).toFixed(2)}s`,
        delay: `-${(i * 0.08 * tempo).toFixed(2)}s`,
      });
    }
  }

  const style = {
    "--sea-line": `${line}px`,
    "--sea-breath": profile.breath,
    "--sea-drift": profile.drift,
    "--sea-drift-time": profile.driftTime,
    "--sea-deep-drift-time": profile.deepDriftTime,
  } as CSSProperties;

  return { body: buildBody(profile, line), deep, back, front, style };
}
