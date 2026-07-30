/*
 * The storm's texture — rain and sea, generated rather than hand-placed.
 *
 * The generator and the swell formula are the mockup's own: a Lehmer LCG seeded
 * at 42. Deterministic, so the markup is byte-identical on every build and there
 * is no hydration drift — this runs on the server only. The draw order differs
 * from the mockup (its loose splashes are replaced by rings tied to the rain,
 * and two of its decorative layers are not built), so the rain lands on
 * different numbers than the design; the swell, which is what actually reads,
 * is the same shape.
 *
 * Counts are the frame budget's dial. The mockup's own values are the starting
 * point; every element here animates transform or opacity and nothing else.
 */

const SEED = 42;
const RAIN_COUNT = 170;
/** Sea bars across the full width. The middle third is the ark's berth. */
const SEA_COUNT = 280;
/** Half-width, in percent, of the calmer water the ark sits in. */
const BERTH = 13;

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export type RainDrop = {
  left: string;
  height: string;
  opacity: number;
  duration: string;
  delay: string;
};

export type SeaBar = {
  left: string;
  height: string;
  background: string;
  opacity: number;
  duration: string;
  delay: string;
};

/** A drop landing: a ring on the surface, phase-locked to the drop that makes it. */
export type Ripple = {
  left: string;
  width: string;
  /** Same period and phase as its drop, so the ring opens when the drop arrives. */
  duration: string;
  delay: string;
};

export type HeroDecor = {
  rain: RainDrop[];
  ripples: Ripple[];
  /** The two banks flanking the berth — drawn behind the ark. */
  seaBack: SeaBar[];
  /** The calmer water of the berth itself — drawn in front of the hull. */
  seaFront: SeaBar[];
  /** A sparser, paler row for depth. */
  seaDeep: SeaBar[];
};

/*
 * One drop in five lands loudly enough to leave a ring. All of them reach the
 * water, but rings are the loudest thing on a quiet horizon: at one in two the
 * surface read as static, and the eye went to the noise instead of the ark. One
 * in five leaves three or four open at any instant — enough to say the sea is
 * being rained on, not enough to be looked at.
 */
const RIPPLE_EVERY = 5;

/* The water's two tints, on the accent hue. A crest catches the light flat;
   everything below it is a gradient climbing out of the indigo. */
const CREST = "oklch(0.77 0.05 277)";
const SWELL = "linear-gradient(to top, oklch(0.62 0.19 277), oklch(0.79 0.1 277))";
const DEEP = "oklch(0.81 0.055 277)";

export function buildHeroDecor(): HeroDecor {
  const rnd = lehmer(SEED);

  const rain: RainDrop[] = [];
  const ripples: Ripple[] = [];
  for (let i = 0; i < RAIN_COUNT; i++) {
    const height = Math.round(26 + rnd() * 52);
    const drop: RainDrop = {
      left: `${(rnd() * 100).toFixed(2)}%`,
      height: `${height}px`,
      opacity: Number((0.22 + rnd() * 0.44).toFixed(2)),
      duration: `${(0.5 + rnd() * 0.55).toFixed(2)}s`,
      delay: `-${(rnd() * 2).toFixed(2)}s`,
    };
    rain.push(drop);

    if (i % RIPPLE_EVERY === 0) {
      ripples.push({
        left: drop.left,
        // A fatter drop lands wider. No extra randomness: keeping the ring tied
        // to its own drop is what makes the two read as one event.
        width: `${Math.round(9 + ((height - 26) / 52) * 13)}px`,
        duration: drop.duration,
        delay: drop.delay,
      });
    }
  }

  const seaBack: SeaBar[] = [];
  const seaFront: SeaBar[] = [];
  const seaDeep: SeaBar[] = [];

  for (let i = 0; i < SEA_COUNT; i++) {
    const pct = (i / (SEA_COUNT - 1)) * 100;
    const fromCentre = Math.abs(pct - 50);
    const left = `${pct.toFixed(2)}%`;

    // How far out of the berth this bar stands: 0 in the lee, 1 on the flank.
    const rise = clamp01((fromCentre - BERTH) / 26);
    // A travelling swell, not noise — two sines beating against each other so
    // the crest line reads as one body of water moving.
    const swell = (0.5 + 0.5 * Math.sin(i * 0.21)) * (0.55 + 0.45 * Math.sin(i * 0.061 + 1.7));

    let height = 11 + 32 * swell * (0.6 + rise * 0.6) + rnd() * 7;
    if (fromCentre < BERTH) height *= 0.44 + 0.3 * (fromCentre / BERTH);

    const bar: SeaBar = {
      left,
      height: `${Math.round(height)}px`,
      background: rise > 0.66 ? CREST : SWELL,
      opacity: Number((0.9 - rise * 0.45).toFixed(2)),
      duration: `${(2.1 + (i % 5) * 0.14).toFixed(2)}s`,
      delay: `-${(i * 0.043).toFixed(2)}s`,
    };
    (fromCentre < BERTH ? seaFront : seaBack).push(bar);

    if (i % 4 === 0) {
      seaDeep.push({
        left,
        height: `${Math.round(16 + 36 * swell + rnd() * 8)}px`,
        background: DEEP,
        opacity: Number((0.36 - rise * 0.14).toFixed(2)),
        duration: `${(3.3 + (i % 3) * 0.25).toFixed(2)}s`,
        delay: `-${(i * 0.08).toFixed(2)}s`,
      });
    }
  }

  return { rain, ripples, seaBack, seaFront, seaDeep };
}
