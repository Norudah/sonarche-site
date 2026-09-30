/*
 * The sea's surface, on the CPU: the same heave the sea's vertex shader
 * lifts its bars by (sea.ts), so what floats on it — the vessel, the notes,
 * the trawl — rides the water that is drawn, not a flat plane under it.
 *
 * Keep the two in step: the numbers here are the shader's `heave` and its
 * berth's shelter, one for one.
 */

/** How much of the swell reaches the water right round the vessel, and the berth's reach. */
export const SHELTER = { floor: 0.45, from: 5, to: 17 };

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export type Sea = { time: number; storm: number; ark: number };

/** The water's height at (x, z): the long heave, damped in the vessel's berth. */
export function surfaceAt(x: number, z: number, { time, storm, ark }: Sea): number {
  const heave =
    1.3 *
    (0.62 * Math.sin(0.04 * x + 0.028 * z - 0.45 * time + 0.47) +
      0.38 * Math.sin(-0.065 * x + 0.045 * z - 0.7 * time + 2.4));
  const berth = Math.hypot(x - ark, z * 1.2);
  const shelter = SHELTER.floor + (1 - SHELTER.floor) * smoothstep(SHELTER.from, SHELTER.to, berth);
  return heave * shelter * storm;
}
