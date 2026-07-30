/*
 * The storm's rain, generated rather than hand-placed.
 *
 * The water it falls into is not here: the sea is shared with the footer and
 * lives in components/brand/sea. What is left is the weather that belongs to
 * the hero alone — the rain, and the rings it leaves on the surface.
 *
 * Same Lehmer LCG as the sea, seeded at 42, deterministic and server-only: the
 * markup is byte-identical on every build, so there is no hydration drift and
 * nothing here ships JavaScript.
 *
 * The count is the frame budget's dial. Every drop animates transform and
 * opacity and nothing else.
 */

const SEED = 42;
const RAIN_COUNT = 170;

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export type RainDrop = {
  left: string;
  height: string;
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

export type Rain = {
  drops: RainDrop[];
  ripples: Ripple[];
};

/*
 * One drop in five lands loudly enough to leave a ring. All of them reach the
 * water, but rings are the loudest thing on a quiet horizon: at one in two the
 * surface read as static, and the eye went to the noise instead of the ark. One
 * in five leaves three or four open at any instant — enough to say the sea is
 * being rained on, not enough to be looked at.
 */
const RIPPLE_EVERY = 5;

export function buildRain(): Rain {
  const rnd = lehmer(SEED);

  const drops: RainDrop[] = [];
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
    drops.push(drop);

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

  return { drops, ripples };
}
