import { CatmullRomCurve3, DoubleSide, Mesh, MeshBasicMaterial, Plane, TubeGeometry, Vector3 } from "three";

import { waterline } from "./hull";
import type { Kit } from "./materials";

/*
 * Where the vessel meets the sea.
 *
 * The sea is a field of bars, and a hull drawn whole behind the rows in front
 * of it reads as a comb laid over the boat, not as water it sits in. So the
 * hull is cut at the surface: `surface` clips it at the water's height, and
 * below that line the bars behind show through, which is what water does. The
 * cut moves on the hull as it heaves and rolls — a real waterline — and a line
 * of foam hugs it, riding the patrol and the heading but not the swell: the
 * water stays level and the hull moves in it.
 */

/**
 * @param freeboard how high the hull rides: the water meets it at -freeboard in its own frame.
 * @param size the vessel's scale, which the foam (riding outside it) is given.
 */
export function createWaterline(kit: Kit, freeboard: number, size = 1) {
  const ink = new MeshBasicMaterial({ color: "#eef0ff", transparent: true, opacity: 0.85, side: DoubleSide });
  const foam = new Mesh(
    kit.keep(
      new TubeGeometry(new CatmullRomCurve3(waterline(-freeboard, 0.06), true, "centripetal"), 256, 0.1, 10, true),
    ),
    ink,
  );
  foam.scale.y = 0.3;
  foam.position.y = 0.02;
  foam.renderOrder = 1;

  // The water's surface where the vessel is: moved with the swell it rides.
  const surface = new Plane(new Vector3(0, 1, 0), 0);

  return {
    foam,
    surface,
    /** The foam breathes against the hull as it heaves. */
    update(t: number) {
      const s = 1 + Math.sin(t * 1.9) * 0.012;
      foam.scale.set(s * size, 0.3, s * size);
      ink.opacity = 0.7 + Math.sin(t * 2.3) * 0.15;
    },
    dispose() {
      ink.dispose();
    },
  };
}
