import type { CSSProperties } from "react";

/*
 * The sea, generated rather than hand-placed.
 *
 * One body of water, two weathers: the storm the page opens on and the calm it
 * closes on. Same generator, same swell formula — the footer is literally the
 * hero's sea with the amplitude taken out of it, which is the narrative in two
 * pictures and the reason this is one module rather than two lookalikes.
 *
 * The formula is the mockup's: a Lehmer LCG for the noise and two beating sines
 * for the swell, so the crest line reads as one body of water travelling rather
 * than as a row of random sticks. Deterministic, and this runs on the server
 * only — the markup is byte-identical on every build, so there is no hydration
 * drift and no JavaScript shipped for any of it.
 *
 * A profile carries both the drawing and the motion: everything that says "how
 * rough is this water" is here, and the stylesheet only reads it out of custom
 * properties.
 */

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/*
 * The swell: 0 in a trough, 1 on a crest, at u across the width.
 *
 * Three signed sines rather than two multiplied ones. The old pair beat against
 * each other into an even chop — busy, but with no wave in it: the surface read
 * as a level meter, a horizontal band of equal noise. What makes water look like
 * water is one long body of it rising and falling across the whole frame, so the
 * long term is given more than half the amplitude and the shorter two only ride
 * on top of it.
 *
 * Written against a normalised u, not the bar index, so the drawing is the same
 * shape whatever a profile sets for `count`.
 */
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

/*
 * The waterline itself, in px above and below its nominal height.
 *
 * This is the thing that was missing. Every bar used to stand on the same
 * `bottom`, so however much the crests varied, the surface they grew out of was
 * a ruled line across the page and the sea read as a graph. Water does not have
 * a flat base: the whole body of it heaves. So the line the bars stand on gets
 * its own wave — longer and slower than the crests, because it is the mass
 * moving and not its texture.
 *
 * Phased so it crosses zero near the middle of the frame: the ark is berthed
 * there and it sits at a fixed height, so the sea has to arrive at its hull at
 * the height the hull expects. Either side of it, the surface is free to heave.
 */
const LIFT = 20;

function surfaceAt(u: number): number {
  return LIFT * (0.62 * Math.sin(u * TURN * 0.85 + 0.47) + 0.38 * Math.sin(u * TURN * 2.1 + 2.4));
}

/*
 * The heave, damped inside the berth exactly as the crests are.
 *
 * The berth is where the ark is moored, and the ark is a rigid horizontal
 * drawing at a fixed height. Letting the surface tilt across its beam put the
 * hull under water at one end and in mid-air at the other — the thing that made
 * the vessel look pasted onto the sea instead of sitting in it. Sheltered water
 * is flat water; the swell can do what it likes once it is clear of the hull.
 */
function heaveAt(u: number, profile: SeaProfile): number {
  const fromCentre = Math.abs(u * 100 - 50);
  const shelter = 0.08 + 0.92 * smooth(fromCentre / (profile.berth * 1.6));
  return surfaceAt(u) * profile.amplitude * shelter;
}

/*
 * The water's colour.
 *
 * Not two tints on a threshold — that is what made the old sea read as one
 * saturated block in the middle and a pale rail either side. Every bar picks its
 * own place on a continuum instead: deep, saturated indigo at the foot of a
 * trough, and a paler, bluer, lower-chroma crest as it rises into the light.
 * Where a bar lands is a mix of the swell it belongs to, how far it stands from
 * the berth, and a little noise, so neighbours differ without the surface
 * breaking into confetti.
 *
 * The continuum is quantised: with seven steps the eye reads a gradient, and the
 * markup still has seven repeated strings for brotli to eat rather than three
 * hundred unique ones.
 */
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
  // Dense right under the surface and gone by the bottom of the frame: the
  // hero's own gradient already darkens into the water, and the section below it
  // picks up from that colour. Water that stayed opaque all the way down would
  // put a step across the page at the hero's edge.
  bodyTint:
    "linear-gradient(180deg, oklch(0.83 0.07 277 / 0.62), oklch(0.82 0.08 277 / 0.5) 45%, oklch(0.86 0.05 277 / 0))",
  breath: 0.2,
  drift: "26px",
  driftTime: "29s",
  deepDriftTime: "38s",
};

/*
 * The footer: home water. Under two thirds of the swell over a lower floor — the
 * shape of the sea survives, its violence does not: the long wave still crosses
 * the frame, it just no longer throws anything. Breathing near enough twice as
 * slow, drifting half as far, and pushed towards the pale end of the water's own
 * range — nothing here is catching a hard light any more.
 */
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

/*
 * The water as one shape: a box the height of the waterline plus the heave,
 * clipped to the surface. Without it the bars would stand on nothing at their
 * high points and be buried at their low ones — the body is what makes the
 * heaving line read as the top of something rather than as a wobble.
 */
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

    // Amplitude scales the swell, not the whole bar: calm water is still water,
    // and a row of 4px stubs reads as dust rather than as a surface.
    // Only a little white noise on top: neighbours have to stay related or the
    // crest line turns into grass. The shape is the swell's job.
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
