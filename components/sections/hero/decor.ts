/* Seeded, so the server markup is identical on every build. RAIN_COUNT is the frame-budget dial. */

const SEED = 42;
const RAIN_COUNT = 170;

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

type RainDrop = {
  left: string;
  height: string;
  opacity: number;
  duration: string;
  delay: string;
};

type Ripple = {
  left: string;
  width: string;
  /** Its drop's period and phase, so the ring opens as the drop lands. */
  duration: string;
  delay: string;
};

export type Rain = {
  drops: RainDrop[];
  ripples: Ripple[];
};

/* At one in two the rings drew the eye away from the ark. */
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
        // Tied to its own drop, with no extra randomness, so the two read as one event.
        width: `${Math.round(9 + ((height - 26) / 52) * 13)}px`,
        duration: drop.duration,
        delay: drop.delay,
      });
    }
  }

  return { drops, ripples };
}
