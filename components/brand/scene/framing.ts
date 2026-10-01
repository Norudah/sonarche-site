import type { Stage } from "./weather";

/* Solved from the poster it replaces so the 3D ark lands on the drawn one. The waterline is placed
   with a lens shift, not a tilt, which would change the sea's angle whenever the host's height did. */

/** Degrees the camera looks down at the water. Low: a sailor's eye, not a map. */
export const PITCH = 10;
/** Vertical field of view, degrees. Narrow, so the sea compresses like a long lens. */
export const FOV = 30;
/** World width of the mark's 24-unit viewBox — the ark's scale in the scene. */
const ARK_SPAN = 12;

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
