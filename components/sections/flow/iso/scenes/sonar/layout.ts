import { LAVENDER, type Tone } from "@/components/sections/flow/iso/tones";

import { ORB } from "./Orb";

export const DISC = { r: 126, z: -14 } as const;
export const DISC_TONE: Tone = { top: "oklch(0.975 0.008 279)", left: LAVENDER.left, right: LAVENDER.right };

/* The ring spectrum: two rings of bars around the hub. */
const RINGS = [
  { r: 86, n: 44, offset: 0 },
  { r: 66, n: 34, offset: 0.5 },
] as const;

function energy(a: number, ring: number): number {
  const v = 0.5 + 0.28 * Math.sin(3 * a + ring) + 0.2 * Math.sin(7 * a + 1.3 + ring * 2);
  return Math.min(1, Math.max(0.05, v));
}

export const BARS = RINGS.flatMap((ring, ri) =>
  Array.from({ length: ring.n }, (_, k) => {
    const a = ((k + ring.offset) / ring.n) * Math.PI * 2;
    const e = energy(a, ri);
    return {
      a: Math.round(a * 1000) / 1000,
      ring: ri,
      x: Math.round(ring.r * Math.cos(a) * 10) / 10,
      y: Math.round(ring.r * Math.sin(a) * 10) / 10,
      lit: e > 0.52,
      k: Math.round((1 - e) * 100) / 100,
    };
  }),
).sort((p, q) => p.x + p.y - (q.x + q.y) || p.x - q.x);

export const BAR = 5.6;
const SPIN = 0.55;

export function height(bar: (typeof BARS)[number], t: number): number {
  return 4 + 30 * energy(bar.a - SPIN * t, bar.ring) + 2.5 * Math.sin(t * 5 + bar.a * 9);
}

/* The hub and the crate on it. */
export const HUB = { r: 26, h: 16 } as const;
export const CRATE = { s: 22, h: 16 } as const;

/* The answer card's resting place over the hub, and where it starts: the
   middle of the three candidates the orb weighs, fanned out to its left. */
export const ANSWER = { x: 257, y: 128 } as const;
export const CANDIDATES = [
  { x: ORB.x - 230, y: ORB.y + 18 },
  { x: ORB.x - 160, y: ORB.y - 2 },
  { x: ORB.x - 90, y: ORB.y - 22 },
] as const;

export const SCAN = { at: 0.4, pass: 2.8 } as const;
