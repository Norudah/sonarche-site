import { CylinderGeometry, Group, Mesh, SphereGeometry, TorusGeometry, Vector3 } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { INK, type Kit } from "@/components/brand/scene/boat/materials";

/* A collar sliding on the shaft pulls fixed-length links that curl the fingers: `grip` (0 open, 1
   shut) solves the collar's travel each frame, so it is a linkage, not three agreeing rotations.
   Its origin is the cable's end. */

const FINGERS = 3;
const HUB_Y = -0.5;
const HINGE_R = 0.14;
const UPPER = 0.36;
const LOWER = 0.26;
/** Where the link takes the upper phalanx, from the hinge. */
const LINK_AT = 0.15;
const LINK = 0.2;
const COLLAR_R = 0.06;

/** Open to shut: the upper phalanx's swing out, the knuckle's curl in. */
const SWING = [0.78, 0.14];
const CURL = [-0.2, -0.78];

/** From the cable's end to where a held note's top sits. */
export const GRASP = 0.88;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function createClaw(kit: Kit) {
  const group = new Group();

  const chrome = kit.metal(INK.glint, 0.22);
  const steel = kit.metal(INK.rail, 0.34);
  const amber = kit.paint(INK.amber, 0.42);
  const indigo = kit.paint(INK.hull, 0.45);

  const shackle = new Mesh(kit.keep(new TorusGeometry(0.075, 0.024, 12, 32)), chrome);
  shackle.position.y = -0.07;
  const swivel = new Mesh(kit.keep(new CylinderGeometry(0.045, 0.045, 0.1, 20)), chrome);
  swivel.position.y = -0.17;
  const cap = new Mesh(kit.keep(new CylinderGeometry(0.08, 0.18, 0.09, 36)), amber);
  cap.position.y = -0.245;
  const housing = new Mesh(kit.keep(new CylinderGeometry(0.18, 0.19, 0.22, 36)), amber);
  housing.position.y = -0.4;
  const band = new Mesh(kit.keep(new TorusGeometry(0.19, 0.026, 12, 40)), steel);
  band.rotation.x = Math.PI / 2;
  band.position.y = -0.43;
  const hub = new Mesh(kit.keep(new CylinderGeometry(0.17, 0.14, 0.09, 36)), indigo);
  hub.position.y = HUB_Y - 0.01;
  const shaft = new Mesh(kit.keep(new CylinderGeometry(0.026, 0.026, 0.4, 14)), chrome);
  shaft.position.y = HUB_Y - 0.2;
  const collar = new Mesh(kit.keep(new CylinderGeometry(COLLAR_R, COLLAR_R, 0.05, 20)), steel);
  group.add(shackle, swivel, cap, housing, band, hub, shaft, collar);

  const upperGeometry = kit.keep(new RoundedBoxGeometry(0.08, UPPER + 0.04, 0.075, 3, 0.03));
  const lowerGeometry = kit.keep(new RoundedBoxGeometry(0.07, LOWER + 0.02, 0.065, 3, 0.028));
  const knuckleGeometry = kit.keep(new SphereGeometry(0.048, 16, 12));
  const padGeometry = kit.keep(new SphereGeometry(0.05, 16, 12));
  const linkGeometry = kit.keep(new CylinderGeometry(0.017, 0.017, LINK, 10));

  const fingers = Array.from({ length: FINGERS }, (_, i) => {
    // Local +x is radially out; the finger swings in the xy plane.
    const root = new Group();
    root.rotation.y = (i / FINGERS) * Math.PI * 2 + Math.PI / 6;
    const upper = new Group();
    upper.position.set(HINGE_R, HUB_Y, 0);
    const upperMesh = new Mesh(upperGeometry, steel);
    upperMesh.position.y = -UPPER / 2;
    const knuckle = new Group();
    knuckle.position.y = -UPPER;
    const lowerMesh = new Mesh(lowerGeometry, steel);
    lowerMesh.position.y = -LOWER / 2;
    const pad = new Mesh(padGeometry, amber);
    pad.position.set(-0.012, -LOWER, 0);
    pad.scale.set(0.85, 1.1, 1.2);
    knuckle.add(new Mesh(knuckleGeometry, chrome), lowerMesh, pad);
    upper.add(new Mesh(knuckleGeometry, chrome), upperMesh, knuckle);
    const link = new Mesh(linkGeometry, chrome);
    root.add(upper, link);
    group.add(root);
    return { upper, knuckle, link };
  });

  const at = new Vector3();

  return {
    group,
    /** @param grip 0 open to 1 shut; overshoot is fine, it reads as a snap. */
    update(grip: number) {
      const swing = mix(SWING[0], SWING[1], grip);
      const curl = mix(CURL[0], CURL[1], grip);
      // Where the link meets the upper phalanx, in the finger's plane…
      at.set(HINGE_R + Math.sin(swing) * LINK_AT, HUB_Y - Math.cos(swing) * LINK_AT, 0);
      // …and the collar height that keeps the link its length.
      const dx = at.x - COLLAR_R;
      const collarY = at.y - Math.sqrt(Math.max(0, LINK * LINK - dx * dx));
      collar.position.y = collarY;
      const angle = Math.atan2(at.y - collarY, dx);
      for (const f of fingers) {
        f.upper.rotation.z = swing;
        f.knuckle.rotation.z = curl;
        f.link.position.set((at.x + COLLAR_R) / 2, (at.y + collarY) / 2, 0);
        f.link.rotation.z = angle - Math.PI / 2;
      }
    },
  };
}
