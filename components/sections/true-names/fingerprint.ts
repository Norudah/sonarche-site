/*
 * The thirty bars of the fingerprint reading.
 *
 * Same generator as the hero's storm — a Lehmer LCG, so the reading is the same
 * on every build and there is no hydration drift. It is deliberately *not* the
 * same seed: two identical-looking waveforms on one page would read as a bug.
 */

const SEED = 1103;
const BAR_COUNT = 30;

export type FingerprintBar = {
  height: string;
  opacity: number;
  duration: string;
  delay: string;
};

export function fingerprintBars(): FingerprintBar[] {
  let s = SEED;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

  return Array.from({ length: BAR_COUNT }, () => ({
    height: `${Math.round(12 + rnd() * 44)}px`,
    opacity: Number((0.35 + rnd() * 0.65).toFixed(2)),
    duration: `${(0.7 + rnd() * 0.8).toFixed(2)}s`,
    delay: `-${(rnd() * 1.4).toFixed(2)}s`,
  }));
}
