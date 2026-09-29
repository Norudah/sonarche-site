import type { Stage } from "./weather";

/*
 * Where the camera stands, derived from the poster it replaces.
 *
 * The scene takes over from a CSS drawing (the hero's storm, the footer's
 * harbour), so its first frame has to put the ark where the poster already
 * has it: centred, on the poster's waterline, as wide as the poster's ark box.
 * Every number here is solved from those facts (the Stage) rather than tuned by
 * eye, which is what lets the handover read as the drawing coming alive
 * instead of as one picture replaced by another.
 *
 * The waterline is placed with a lens shift, not by tilting the camera: tilting
 * would change the angle the sea is seen at every time the host changed
 * height, and the angle is the composition.
 */

/** Degrees the camera looks down at the water. Low: a sailor's eye, not a map. */
export const PITCH = 10;
/** Vertical field of view, degrees. Narrow, so the sea compresses like a long lens. */
export const FOV = 30;
/** World width of the mark's 24-unit viewBox — the ark's scale in the scene. */
export const ARK_SPAN = 12;

export type Framing = {
  width: number;
  height: number;
  /** px per world unit at one unit of distance. */
  focal: number;
  /** Camera to ark, world units. */
  distance: number;
  /** Camera height and horizontal distance, from the pitch. */
  eyeY: number;
  eyeZ: number;
  /** Lens shift, px: how far below the frame's centre the ark sits. */
  shift: number;
};

export function frame(width: number, height: number, { arkPx, waterline }: Stage): Framing {
  const focal = height / (2 * Math.tan(((FOV / 2) * Math.PI) / 180));
  const distance = (ARK_SPAN * focal) / arkPx;
  const pitch = (PITCH * Math.PI) / 180;

  return {
    width,
    height,
    focal,
    distance,
    eyeY: distance * Math.sin(pitch),
    eyeZ: distance * Math.cos(pitch),
    shift: height / 2 - waterline,
  };
}
