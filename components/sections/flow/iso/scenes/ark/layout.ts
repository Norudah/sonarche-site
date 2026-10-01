import { CRANE } from "./Crane";
import { DECK } from "./hull";

export const PIT = { x: -46, y: -22, w: 94, d: 44, floor: DECK - 14 } as const;
export const CRATE = { w: 26, d: 38, h: 20, sling: 14 } as const;
export const BERTHS = [-44, -14, 16].map((x) => ({ x, y: -CRATE.d / 2, cx: x + CRATE.w / 2 }));

export const CABIN = { x: -100, y: -26, w: 44, d: 52, h: 38 } as const;
export const CABIN_TOP = DECK + CABIN.h;
export const PORTS = [10, 22, 34] as const;

/* Where the crates are fished from: the water off the port side. */
export const FISH = { x: 14, y: 92 } as const;
export const WATER_BOTTOM = -6;

export const FOAM = [
  [-105, 36],
  [55, 36],
  [80, 31],
  [100, 21],
  [113, 10],
  [118, 0],
  [113, -10],
  [100, -21],
] as const;

export const toward = (x: number, y: number) => Math.atan2(y - CRANE.y, x - CRANE.x);
export const reach = (x: number, y: number) => Math.hypot(x - CRANE.x, y - CRANE.y);
export const hookAbove = (bottom: number) => CRANE.top - (bottom + CRATE.h + CRATE.sling);
