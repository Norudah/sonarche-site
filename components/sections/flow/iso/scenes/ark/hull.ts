/* The sea is a disc of bars with the hull's footprint cut out. A bar that runs into the hull when
   walking away from the camera (−x, −y) is in front of it, so it is painted after the hull. */

export const HULL: readonly (readonly [number, number])[] = [
  [-105, -36],
  [55, -36],
  [80, -31],
  [100, -21],
  [113, -10],
  [118, 0],
  [113, 10],
  [100, 21],
  [80, 31],
  [55, 36],
  [-105, 36],
];

export const DECK = 18;
export const KEEL = -2;

function insideHull(x: number, y: number, margin = 0): boolean {
  let inside = false;
  for (let i = 0, j = HULL.length - 1; i < HULL.length; j = i++) {
    const [xi, yi] = HULL[i];
    const [xj, yj] = HULL[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  if (inside || !margin) return inside;
  return [
    [margin, 0],
    [-margin, 0],
    [0, margin],
    [0, -margin],
  ].some(([dx, dy]) => insideHull(x + dx, y + dy));
}

const SEA = { x: 6, y: 2, r: 150, step: 16 } as const;

type SeaBar = { x: number; y: number; k: number };

function build() {
  const back: SeaBar[] = [];
  const front: SeaBar[] = [];
  const n = Math.ceil(SEA.r / SEA.step) + 1;
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = Math.round((SEA.x + i * SEA.step + (j % 2 ? SEA.step / 2 : 0)) * 10) / 10;
      const y = Math.round((SEA.y + j * SEA.step * 0.9) * 10) / 10;
      const k = Math.round((Math.hypot(x - SEA.x, y - SEA.y) / SEA.r) * 100) / 100;
      if (k > 1 || insideHull(x, y, 6)) continue;
      let hits = false;
      for (let s = 4; s < 260 && !hits; s += 4) hits = insideHull(x - s, y - s);
      (hits ? front : back).push({ x, y, k });
    }
  }
  const order = (a: SeaBar, b: SeaBar) => a.x + a.y - (b.x + b.y) || a.x - b.x;
  return { back: back.sort(order), front: front.sort(order) };
}

export const WATER = build();

export function swell(x: number, y: number, t: number) {
  const k = Math.hypot(x - SEA.x, y - SEA.y) / SEA.r;
  const fade = 1 - 0.75 * k * k;
  return fade * (8 + 4.5 * Math.sin(t * 1.5 - x * 0.05 - y * 0.04) + 2.5 * Math.sin(t * 1.05 + k * 6));
}
