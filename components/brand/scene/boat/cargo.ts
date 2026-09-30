import { Group, SphereGeometry } from "three";

import { containerFactory, type Container, type ContainerSpec, type Palette } from "./container";
import { INK, type Kit } from "./materials";

/*
 * The hold, above deck — loaded the way a working boat is, not the way a
 * diagram is, on either side of the head so the head stays the middle of the
 * picture.
 *
 * In front, where the camera and the deckhands can get at them, the working
 * boxes: two by the crane that it fills, and one astern of the head where
 * the deckhand stows some of what the trawl lands on the deck, their doors
 * facing the walkway along the rail. Behind them, cargo already carried
 * home: sealed boxes stacked two and three high and knocked askew, in every
 * colour the mark has, so the deck reads as a lifetime's haul and not as a
 * product shot.
 */

const P = (shell: string, ribs: string, bars: string): Palette => ({ shell, ribs, bars });
const amber = P(INK.amber, "#e0961f", INK.cabin);
const cream = P(INK.amberBand, INK.amber, INK.hull);
const indigo = P(INK.hull, INK.strake, INK.rail);
const lavender = P(INK.rail, INK.strake, INK.cabin);
const strake = P(INK.strake, INK.rail, INK.amberBand);
const pale = P(INK.cabin, INK.brow, INK.hull);
const night = P(INK.keel, INK.strake, INK.amber);
const banded = P(INK.amber, INK.hull, INK.cabin);

const BIG: [number, number, number] = [1.45, 2.4, 1.4];
const SHORT: [number, number, number] = [1.15, 1.35, 1.25];
const TURN = Math.PI / 2;

export type Side = "crane" | "trawl";

const WORKING: ContainerSpec[] = [
  { x: -6.95, z: 0.2, yaw: 0, size: BIG, palette: amber, slots: 3, side: "crane" },
  { x: -5.45, z: 0.72, yaw: 0.03, size: SHORT, palette: strake, slots: 2, side: "crane" },
  { x: 3.35, z: 0.72, yaw: -0.03, size: SHORT, palette: lavender, slots: 2, side: "trawl" },
];

const CARGO: ContainerSpec[] = [
  // Aft: two stacks behind the working pair.
  { x: -7.0, z: -1.63, yaw: TURN + 0.05, size: SHORT, palette: night, slots: 0 },
  { x: -6.95, z: -1.45, y: SHORT[2], yaw: 0.3, size: SHORT, palette: banded, slots: 0 },
  { x: -5.5, z: -1.1, yaw: TURN - 0.04, size: SHORT, palette: indigo, slots: 0 },
  { x: -5.45, z: -1.2, y: SHORT[2], yaw: -0.42, size: SHORT, palette: pale, slots: 0 },
  // Astern of the head: a tower of three and a pair, behind the deck the trawl is emptied on.
  { x: 3.4, z: -1.1, yaw: TURN, size: SHORT, palette: amber, slots: 0 },
  { x: 3.45, z: -1.2, y: SHORT[2], yaw: 0.35, size: SHORT, palette: indigo, slots: 0 },
  { x: 3.3, z: -1.05, y: SHORT[2] * 2, yaw: -0.2, size: [1.05, 1.25, 1.1], palette: lavender, slots: 0 },
  { x: 5.1, z: -1.63, yaw: TURN - 0.06, size: SHORT, palette: strake, slots: 0 },
  { x: 5.05, z: -1.5, y: SHORT[2], yaw: 0.25, size: SHORT, palette: cream, slots: 0 },
];

export function createCargo(kit: Kit) {
  const group = new Group();
  const container = containerFactory(kit, kit.keep(new SphereGeometry(0.1, 24, 16)));
  const working = WORKING.map(container);
  const all = [...working, ...CARGO.map(container)];
  all.forEach((c) => group.add(c.group));
  const last = new Map<string, Container>();

  return {
    group,
    working,
    /** Footprints on the deck for the contact shadows: x, z, half-width, half-length, yaw. */
    footprints: all
      .filter((c) => !c.spec.y)
      .map(({ spec }) => [spec.x, spec.z, spec.size[0] / 2, spec.size[1] / 2, spec.yaw] as const),
    /**
     * A box on this side with room that nobody is working, never the one just
     * filled if another will do.
     */
    pick(side: Side, room = 1): Container | undefined {
      const open = working.filter((c) => c.spec.side === side && !c.busy && c.spec.slots - c.held.length >= room);
      const fresh = open.filter((c) => c !== last.get(side));
      const from = fresh.length ? fresh : open;
      const chosen = from[Math.floor(Math.random() * from.length)];
      if (chosen) last.set(side, chosen);
      return chosen;
    },
    /** A full box on this side, for a deckhand to empty. */
    full(side: Side): Container | undefined {
      return working.find((c) => c.spec.side === side && !c.busy && c.held.length >= c.spec.slots);
    },
    update(dt: number) {
      all.forEach((c) => c.update(dt));
    },
  };
}
