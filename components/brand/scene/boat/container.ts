import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Matrix4,
  Mesh,
  Vector3,
  type BufferGeometry,
  type MeshStandardMaterial,
  type SphereGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { HULL } from "./hull";
import { INK, type Kit } from "./materials";
import type { Note } from "./notes";

/*
 * A shipping container, for real: corrugated long walls, corner castings, a
 * dark hold inside, two doors on hinges with their locking bars, and a roof
 * that opens as a butterfly hatch, two halves hinged along the long sides, so
 * it opens in a low V rather than standing up in front of everything. A row
 * of lights, one per note it holds, over the doors or down the long side.
 *
 * The crane and the net put notes in through the roof; the deckhands take
 * them out through the doors. A box that is only ever cargo (`sealed`) is
 * built with its doors and roof merged into its walls: fewer draw calls for
 * something that never opens.
 *
 * It has a spring in it: a note set down or a hatch slammed makes the whole
 * box squash and bounce on its base, which is most of what makes stowing land.
 */

const WALL = 0.07;
const LIT = "#8f96ff";
const UNLIT = "#2e3172";

export type Palette = { shell: string; ribs: string; bars: string };

export type ContainerSpec = {
  /** Centre of its footprint on the deck, in the boat's frame. */
  x: number;
  z: number;
  /** Height of its floor above the deck: above 0, it is stacked. */
  y?: number;
  yaw: number;
  /** Width, length, height; the doors are at the end of its length. */
  size: [number, number, number];
  palette: Palette;
  /** How many notes it holds: one light each. 0: cargo, sealed. */
  slots: number;
  /** Where its lights are: over the doors, or down the long side. */
  lamps?: "doors" | "side";
  /** Which of the boat's gear fills it. */
  side?: "crane" | "trawl";
};

export type Container = {
  spec: ContainerSpec;
  group: Group;
  hatch: { open: number };
  doors: { open: number };
  lights: MeshStandardMaterial[];
  /** The notes inside, in the order they went in. */
  held: Note[];
  /** Spoken for: something is on its way to it, or taking from it. */
  busy: boolean;
  /** Where note `i` rests on the floor, in its own frame. */
  slot: (i: number) => Vector3;
  /** Its own frame to the boat's. */
  toBoat: Matrix4;
  /** Where a deckhand stands to work its doors, in the boat's frame. */
  landing: Vector3;
  /** Just inside the doors, in its own frame: where a note is handed out. */
  threshold: Vector3;
  /** Its roof's seam, in the boat's frame: where dust flies when it slams. */
  seam: Vector3;
  /** Where light `i` is, in the boat's frame. */
  lamp: (i: number) => Vector3;
  height: number;
  light(i: number, on: boolean): void;
  /** A knock: the box squashes by `k` and springs back. */
  bump(k: number): void;
  update(dt: number): void;
};

/** A rounded box, for the pieces big enough to show their edges. */
function box(w: number, h: number, d: number, x: number, y: number, z: number, r = 0.03): BufferGeometry {
  return new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2)).translate(x, y, z);
}

/** A plain one, for ribs and fittings too small for a radius to register. */
function block(w: number, h: number, d: number, x: number, y: number, z: number): BufferGeometry {
  return new BoxGeometry(w, h, d).translate(x, y, z);
}

/** Merged into one geometry; the parts are disposed of. Mixed index layouts are flattened first. */
function merge(pieces: BufferGeometry[]): BufferGeometry {
  const flat = pieces.map((g) => (g.index ? g.toNonIndexed() : g));
  const merged = mergeGeometries(flat);
  new Set([...pieces, ...flat]).forEach((g) => g.dispose());
  return merged;
}

function build(kit: Kit, palette: Palette, [w, l, h]: [number, number, number], sealed: boolean): Group {
  const shellInk = kit.paint(palette.shell, 0.55);
  const barInk = kit.paint(palette.bars, 0.35);
  const shell: BufferGeometry[] = [
    box(w, WALL, l, 0, WALL / 2, 0), // floor
    box(WALL, h, l, -w / 2 + WALL / 2, h / 2, 0), // long walls
    box(WALL, h, l, w / 2 - WALL / 2, h / 2, 0),
    box(w, h, WALL, 0, h / 2, -l / 2 + WALL / 2), // back end
  ];

  // Corrugation: ribs standing proud of both long walls.
  const ribs: BufferGeometry[] = [];
  const count = Math.round(l / 0.28);
  for (let i = 0; i < count; i++) {
    const z = -l / 2 + 0.2 + (i * (l - 0.4)) / (count - 1);
    for (const side of [-1, 1]) ribs.push(block(0.05, h - 0.2, 0.1, side * (w / 2 + 0.01), h / 2, z));
  }
  // Top and bottom rails round the door frame.
  ribs.push(block(w + 0.02, 0.1, 0.08, 0, h - 0.05, l / 2), block(w + 0.02, 0.1, 0.08, 0, 0.05, l / 2));

  const castings: BufferGeometry[] = [];
  for (const x of [-1, 1]) {
    for (const y of [0, 1]) {
      for (const z of [-1, 1]) {
        castings.push(block(0.16, 0.14, 0.16, (x * (w - 0.12)) / 2, y * (h - 0.1) + 0.05, (z * (l - 0.12)) / 2));
      }
    }
  }

  // The doors: each a leaf with two locking bars and their handles, hung on
  // its outer edge. Sealed, they are simply part of the walls.
  const leaf = (side: number) => box(w / 2 - 0.01, h - 0.04, WALL, (-side * (w / 2 - 0.01)) / 2, h / 2, 0);
  const leafBars = (side: number) =>
    [0.08, 0.28].flatMap((f) => {
      const x = -side * f * w;
      return [
        new CylinderGeometry(0.025, 0.025, h - 0.16, 10).translate(x, h / 2, 0.06),
        block(0.05, 0.16, 0.06, x + 0.05 * side, h * 0.45, 0.09),
      ];
    });

  const group = new Group();
  const bars: BufferGeometry[] = [];
  if (sealed) {
    for (const side of [-1, 1]) {
      const at = (g: BufferGeometry) => g.translate((side * w) / 2, 0, l / 2 - WALL / 2);
      shell.push(at(leaf(side)));
      bars.push(...leafBars(side).map(at));
    }
  } else {
    for (const side of [-1, 1]) {
      const hinge = new Group();
      hinge.position.set((side * w) / 2, 0, l / 2 - WALL / 2);
      hinge.add(new Mesh(kit.keep(leaf(side)), shellInk), new Mesh(kit.keep(merge(leafBars(side))), barInk));
      hinge.name = `door${side}`;
      group.add(hinge);
    }
  }

  const parts: [BufferGeometry[], MeshStandardMaterial][] = [
    [shell, shellInk],
    [ribs, kit.paint(palette.ribs, 0.5)],
    [castings, kit.paint(INK.keel, 0.45)],
  ];
  if (bars.length) parts.push([bars, barInk]);

  // The roof: a butterfly hatch, or, sealed, a lid merged into the shell.
  const roof = new Group();
  roof.position.y = h;
  for (const side of [-1, 1]) {
    const pieces = [box(w / 2 + 0.02, 0.08, l + 0.04, (-side * (w / 2 + 0.02)) / 2, 0.04, 0)];
    for (let i = 0; i < 5; i++) {
      pieces.push(
        block(w / 2 - 0.12, 0.05, 0.06, (-side * (w / 2 + 0.02)) / 2, 0.1, -l / 2 + 0.25 + (i * (l - 0.5)) / 4),
      );
    }
    if (sealed) {
      shell.push(...pieces.map((p) => p.translate((side * (w + 0.04)) / 2, h, 0)));
      continue;
    }
    const hinge = new Group();
    hinge.position.x = (side * (w + 0.04)) / 2;
    hinge.add(new Mesh(kit.keep(merge(pieces)), shellInk));
    hinge.name = `hatch${side}`;
    roof.add(hinge);
  }
  if (!sealed) group.add(roof);

  for (const [pieces, material] of parts) group.add(new Mesh(kit.keep(merge(pieces)), material));

  if (!sealed) {
    // The inside, dark, so an open container reads as a hold and not a block.
    const inside = new Mesh(
      kit.keep(box(w - 2 * WALL, 0.02, l - 2 * WALL, 0, WALL + 0.01, 0, 0.01)),
      kit.paint(INK.keel, 0.8),
    );
    group.add(inside);
  }
  return group;
}

export function containerFactory(kit: Kit, lampGeometry: SphereGeometry) {
  const builds = new Map<string, Group>();

  return function container(spec: ContainerSpec): Container {
    const [w, l, h] = spec.size;
    const sealed = spec.slots === 0;
    // Identical containers share one build: a clone reuses its geometry and paint.
    const key = `${spec.palette.shell}:${spec.palette.ribs}:${spec.size.join(":")}:${sealed}`;
    const built = builds.get(key);
    const body = built ? built.clone() : build(kit, spec.palette, spec.size, sealed);
    if (!built) builds.set(key, body.clone());
    const halves = sealed ? [] : [body.getObjectByName("hatch-1")!, body.getObjectByName("hatch1")!];
    const leaves = sealed ? [] : [body.getObjectByName("door-1")!, body.getObjectByName("door1")!];

    const base = HULL.deck + (spec.y ?? 0);
    body.position.set(spec.x, base, spec.z);
    body.rotation.y = spec.yaw;
    const toBoat = new Matrix4().makeRotationY(spec.yaw).setPosition(spec.x, base, spec.z);

    const along = (i: number) => (i - (spec.slots - 1) / 2) * 0.3;
    const lampAt = (i: number) =>
      spec.lamps === "side"
        ? new Vector3(w / 2 + 0.08, h - 0.26, along(i))
        : new Vector3(along(i), h - 0.24, l / 2 + 0.07);

    const lights = Array.from({ length: spec.slots }, (_, i) => {
      const ink = kit.glow(UNLIT, "#6d74ff", 0);
      const lamp = new Mesh(lampGeometry, ink);
      lamp.position.copy(lampAt(i));
      body.add(lamp);
      return ink;
    });

    const hatch = { open: 0 };
    const doors = { open: 0 };
    const spring = { y: 0, v: 0 };
    const spacing = Math.min(0.62, (l - 0.5) / Math.max(1, spec.slots));

    return {
      spec,
      group: body,
      hatch,
      doors,
      lights,
      held: [],
      busy: false,
      toBoat,
      slot: (i) => new Vector3(0, WALL, (i - (spec.slots - 1) / 2) * spacing),
      landing: new Vector3(0, 0, l / 2 + 0.6).applyMatrix4(toBoat),
      threshold: new Vector3(0, WALL + 0.1, l / 2 - 0.25),
      seam: new Vector3(0, h + 0.1, l / 2).applyMatrix4(toBoat),
      lamp: (i) => lampAt(i).applyMatrix4(toBoat),
      height: h,
      light(i, on) {
        lights[i].color.set(on ? LIT : UNLIT);
        lights[i].emissiveIntensity = on ? 1.8 : 0;
      },
      bump(k) {
        spring.v -= k;
      },
      update(dt) {
        halves.forEach((half, i) => (half.rotation.z = (i === 0 ? 1 : -1) * hatch.open * 1.95));
        leaves.forEach((leaf, i) => (leaf.rotation.y = (i === 0 ? -1 : 1) * doors.open * 1.9));
        const step = Math.min(dt, 1 / 30);
        spring.v += (-190 * spring.y - 11 * spring.v) * step;
        spring.y += spring.v * step;
        body.scale.set(1 - spring.y * 0.5, 1 + spring.y, 1 - spring.y * 0.5);
      },
    };
  };
}
