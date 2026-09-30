import { Group, SphereGeometry } from "three";

import { containerFactory, type Container, type ContainerSpec, type Palette } from "./container";
import { INK, type Kit } from "./materials";

/*
 * The hold, above deck — loaded the way a working boat is, not the way a
 * diagram is: a stack at the stern with the top box knocked askew, a short one
 * wedged in front of it at an angle, a long one laid fore and aft, and at the
 * bow the archive, sealed, a smaller box dropped crosswise on top of it.
 *
 * The mark stows amber crates aft and indigo ones forward, and so does this:
 * the amber ones (and a cream one, the mark's amber band) are the working
 * hold the crane fills; the indigo ones at the bow are cargo already carried
 * home. Only a box with nothing on top of it can open, so the one under the
 * stack is full and stays shut. The crane does not always pick the same one.
 */

const amber: Palette = { shell: INK.amber, ribs: "#e0961f", bars: INK.cabin };
const cream: Palette = { shell: INK.amberBand, ribs: INK.amber, bars: INK.hull };
const indigo: Palette = { shell: INK.hull, ribs: INK.strake, bars: INK.rail };
const lavender: Palette = { shell: INK.rail, ribs: INK.strake, bars: INK.cabin };

const BIG: [number, number, number] = [1.45, 2.4, 1.4];
const SHORT: [number, number, number] = [1.15, 1.35, 1.25];

const STERN: ContainerSpec[] = [
  { x: -4.95, z: -0.95, yaw: 0, size: BIG, palette: amber, slots: 3, lamps: "doors", full: true },
  { x: -4.88, z: -1.1, y: BIG[2], yaw: 0.12, size: BIG, palette: cream, slots: 2, lamps: "doors" },
  { x: -5.0, z: 1.4, yaw: -0.4, size: SHORT, palette: amber, slots: 1, lamps: "doors" },
  { x: -2.85, z: 0.62, yaw: -Math.PI / 2 + 0.04, size: BIG, palette: amber, slots: 3, lamps: "side" },
];

const BOW: ContainerSpec[] = [
  { x: 4.85, z: 0, yaw: 0, size: [1.35, 2.3, 1.25], palette: indigo, slots: 3, lamps: "doors", full: true },
  {
    x: 4.72,
    z: -0.3,
    y: 1.25,
    yaw: 1.25,
    size: [1.1, 1.4, 1.05],
    palette: lavender,
    slots: 2,
    lamps: "side",
    full: true,
  },
];

export function createCargo(kit: Kit) {
  const group = new Group();
  const container = containerFactory(kit, kit.keep(new SphereGeometry(0.1, 24, 16)));
  const stern = STERN.map(container);
  const bow = BOW.map(container);
  const all = [...stern, ...bow];
  all.forEach((c) => group.add(c.group));

  /** The ones the crane can fill: amber, and nothing stacked on them. */
  const hold = stern.filter((c) => !c.spec.full);
  let last: Container | undefined;

  return {
    group,
    hold,
    /** Where the archive's lights gather. */
    archive: bow[0],
    /** Footprints on the deck for the contact shadows: x, z, half-width, half-length, yaw. */
    footprints: all
      .filter((c) => !c.spec.y)
      .map(({ spec }) => [spec.x, spec.z, spec.size[0] / 2, spec.size[1] / 2, spec.yaw] as const),
    /**
     * A container with room, never the one just filled if another will do.
     * Undefined once the whole hold is full.
     */
    pick(): Container | undefined {
      const open = hold.filter((c) => c.stored < c.spec.slots);
      const fresh = open.filter((c) => c !== last);
      const from = fresh.length ? fresh : open;
      last = from[Math.floor(Math.random() * from.length)];
      return last;
    },
    /** Every light on and every box full: home from the voyage. */
    fill() {
      for (const c of hold) {
        c.stored = c.spec.slots;
        c.lights.forEach((_, i) => c.light(i, true));
      }
    },
    update(dt: number) {
      all.forEach((c) => c.update(dt));
    },
  };
}
