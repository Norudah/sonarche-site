import { project } from "@/components/sections/flow/iso/iso";

/* A disc of bars, deep in the middle, pale and short at the rim. */
export const SEA = { x: 34, y: 18, r: 122, step: 15 } as const;
export const CELLS = (() => {
  const cells: { x: number; y: number; k: number }[] = [];
  const n = Math.ceil(SEA.r / SEA.step) + 1;
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = SEA.x + i * SEA.step + (j % 2 ? SEA.step / 2 : 0);
      const y = SEA.y + j * SEA.step * 0.9;
      const k = Math.hypot(x - SEA.x, y - SEA.y) / SEA.r;
      if (k <= 1) cells.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, k: Math.round(k * 100) / 100 });
    }
  }
  return cells.sort((a, b) => a.x + a.y - (b.x + b.y) || a.x - b.x);
})();

export function swell(x: number, y: number, t: number) {
  const k = Math.hypot(x - SEA.x, y - SEA.y) / SEA.r;
  const fade = 1 - 0.75 * k * k;
  return fade * (9 + 5 * Math.sin(t * 1.7 - x * 0.055 - y * 0.035) + 3 * Math.sin(t * 1.1 + k * 7));
}

/* The composer: a window floating over the back of the water, facing right.
   `x` is its screen's plane, `y` its near end, `w` runs back from there. */
export const WIN = { x: -62, y: 62, z: 162, w: 150, h: 112, t: 8 } as const;

/* The link token as docked in the composer's field. */
export const CHIP = { y: 15, z: 121.5, w: 40, d: 5, h: 17 } as const;

/* Where it floats before it is rescued. */
export const FISH = { x: 12, y: 66 } as const;

/* The rest of the stream's flotsam: what is not taken, this time. */
export const FLOTSAM = [
  { x: 92, y: -38, kind: "note" },
  { x: 128, y: 34, kind: "pixel" },
  { x: 62, y: 104, kind: "link" },
  { x: 2, y: -22, kind: "pixel" },
  { x: 104, y: 92, kind: "note" },
  { x: 52, y: 18, kind: "pixel" },
] as const;

/* Queue rows. The settled list is three: the one already in the hold is drawn
   hidden in the third slot, and the fourth track is drawn in that slot too. */
export const ROWS = [
  { slot: 0, title: 70, artist: 38 },
  { slot: 1, title: 54, artist: 48 },
  { slot: 2, title: 62, artist: 32, duplicate: true },
  { slot: 2, title: 76, artist: 42 },
] as const;
export const ROW_TOP = 58;
export const ROW_STEP = 14.5;

/* The beam's rungs climb from the water to the composer's underside. */
export const [FX, FY] = project(FISH.x, FISH.y, 6);
export const RUNG = (() => {
  const [tx, ty] = project(WIN.x, CHIP.y + CHIP.w / 2, WIN.z - WIN.h);
  return { x: tx - FX, y: ty - FY };
})();
