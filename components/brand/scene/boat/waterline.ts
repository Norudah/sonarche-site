import { CatmullRomCurve3, DoubleSide, Mesh, MeshBasicMaterial, Plane, TubeGeometry, Vector3 } from "three";

import { waterline } from "./hull";
import type { Kit } from "./materials";

/*
 * Where the vessel meets the sea.
 *
 * The sea is a field of bars, and a hull drawn whole behind the rows in front
 * of it reads as a comb laid over the boat, not as water it sits in. So the
 * hull is cut at the surface: `SURFACE` clips it at y = 0 in the world, and
 * below that line the bars behind show through, which is what water does. The
 * cut moves on the hull as it heaves and rolls — a real waterline — and a line
 * of foam hugs it, riding the patrol and the heading but not the swell: the
 * water stays level and the hull moves in it.
 */

export const SURFACE = new Plane(new Vector3(0, 1, 0), 0);

/** @param freeboard how high the hull rides: the water meets it at -freeboard in its own frame. */
export function createWaterline(kit: Kit, freeboard: number) {
  const ink = new MeshBasicMaterial({ color: "#eef0ff", transparent: true, opacity: 0.85, side: DoubleSide });
  const foam = new Mesh(
    kit.keep(
      new TubeGeometry(new CatmullRomCurve3(waterline(-freeboard, 0.06), true, "centripetal"), 160, 0.1, 6, true),
    ),
    ink,
  );
  foam.scale.y = 0.3;
  foam.position.y = 0.02;
  foam.renderOrder = 1;

  return {
    foam,
    /** The foam breathes against the hull as it heaves. */
    update(t: number) {
      const s = 1 + Math.sin(t * 1.9) * 0.012;
      foam.scale.set(s, 0.3, s);
      ink.opacity = 0.7 + Math.sin(t * 2.3) * 0.15;
    },
    dispose() {
      ink.dispose();
    },
  };
}
