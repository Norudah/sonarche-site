import { project, shift } from "@/components/sections/flow/iso/iso";

import { SLOT, SLOT_FACE } from "./Shelf";

/* The pedestal, and the file held over it, scaled up for the tagging. */
export const PEDESTAL = { x: -84, y: 46, r: 30, h: 12 } as const;
export const [PX, PY] = project(PEDESTAL.x, PEDESTAL.y, PEDESTAL.h);
export const POSE = { x: PX, y: PY - 74, scale: 2.8 } as const;

/* The tags' orbit, in screen units round the held file. */
export const ORBIT = { x: PX, y: PY - 58, rx: 96, ry: 30, speed: 0.9 } as const;

/* The file flies in front of its cubby before it slides home. */
export const APPROACH = shift(0, 34, 0);

/* A point on the file's face, in face units, as it appears while held up. */
export function posed(u: number, v: number): [number, number] {
  const [sx, sy] = project(SLOT.x + u, SLOT.y + SLOT.t, SLOT.z + SLOT.h - v);
  return [POSE.x + (sx - SLOT_FACE[0]) * POSE.scale, POSE.y + (sy - SLOT_FACE[1]) * POSE.scale];
}
