/* The crane's arm, in the slewing frame: x out along the boom, y up from the platform. */

export const DECK = 0.42;
/** The main boom's pin. */
export const PIN = { x: 0.18, y: 1.2 };
export const MAIN = 3.0;
export const JIB = 2.8;
/** The jib sits beside the main boom, not in line with it: they fold past each other. */
export const JIB_Z = 0.33;
/** Where the cable leaves the jib's head sheave, beyond its pin. */
export const DROP = 0.2;
export const DRUM = { x: 0.8, y: 0.4, r: 0.13 };

/** A two-bone solve: the joint angles that put the drop point at (h, y), elbow up. */
export function solve(h: number, y: number): { shoulder: number; elbow: number } {
  const l1 = MAIN;
  const l2 = JIB + DROP;
  const dx = h - PIN.x;
  const dy = y - PIN.y;
  const d = Math.min(l1 + l2 - 0.05, Math.max(0.8, Math.hypot(dx, dy)));
  const clamp = (v: number) => Math.min(1, Math.max(-1, v));
  const toward = Math.atan2(dy, dx);
  const shoulder = toward + Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const elbow = -(Math.PI - Math.acos(clamp((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))));
  return { shoulder: Math.min(1.5, shoulder), elbow: Math.max(-2.75, elbow) };
}
