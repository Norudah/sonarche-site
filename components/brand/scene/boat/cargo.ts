import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  SphereGeometry,
  Vector3,
  type BufferGeometry,
  type Color,
  type MeshStandardMaterial,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { HULL } from "./hull";
import { INK, type Kit } from "./materials";

/*
 * The hold, above deck: real shipping containers.
 *
 * The mark stows amber crates at the ends and indigo ones amidships. Here the
 * amber ones become the working pair at the stern — two containers laid across
 * the beam, corrugated sides, corner castings, locking bars on the doors that
 * face the camera, and a roof that swings open for the crane. Three lights over
 * each door count the notes inside. The bow carries an indigo one, sealed, all
 * three lights on: cargo already carried home.
 *
 * A container is merged by material — shell, ribs, castings, bars — so each is
 * a handful of draw calls however much detail it carries; only the roof (it
 * moves) and the lights (they change) are separate.
 */

export const SLOTS_PER_CONTAINER = 3;

const W = 1.3;
const L = 2.3;
const H = 1.2;
const WALL = 0.07;

export type Container = {
  group: Group;
  /** The hatch's two halves; `open` 0..1 swings them apart. */
  hatch: { open: number };
  lights: MeshStandardMaterial[];
  /** Notes inside. */
  stored: number;
  /** Floor of the container, in the boat's frame: where a note is lowered to. */
  floor: Vector3;
  /** World-free position of each light, in the boat's frame. */
  lamp: (i: number) => Vector3;
};

type Palette = { shell: string | Color; ribs: string; bars: string };

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

function build(kit: Kit, palette: Palette, w: number, l: number, h: number) {
  const shell: BufferGeometry[] = [
    box(w, WALL, l, 0, WALL / 2, 0), // floor
    box(WALL, h, l, -w / 2 + WALL / 2, h / 2, 0), // long walls
    box(WALL, h, l, w / 2 - WALL / 2, h / 2, 0),
    box(w, h, WALL, 0, h / 2, -l / 2 + WALL / 2), // back end
    box(w / 2 - 0.01, h - 0.04, WALL, -w / 4, h / 2, l / 2 - WALL / 2), // the doors
    box(w / 2 - 0.01, h - 0.04, WALL, w / 4, h / 2, l / 2 - WALL / 2),
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

  // Corner castings.
  const castings: BufferGeometry[] = [];
  for (const x of [-1, 1]) {
    for (const y of [0, 1]) {
      for (const z of [-1, 1]) {
        castings.push(block(0.16, 0.14, 0.16, (x * (w - 0.12)) / 2, y * (h - 0.1) + 0.05, (z * (l - 0.12)) / 2));
      }
    }
  }

  // Locking bars down the doors, with their handles.
  const bars: BufferGeometry[] = [];
  for (const x of [-0.42, -0.14, 0.14, 0.42]) {
    bars.push(new CylinderGeometry(0.025, 0.025, h - 0.16, 10).translate(x * w, h / 2, l / 2 + 0.03));
    bars.push(block(0.05, 0.16, 0.06, x * w + 0.05, h * 0.45, l / 2 + 0.06));
  }

  const group = new Group();
  const parts: [BufferGeometry[], MeshStandardMaterial][] = [
    [shell, kit.paint(palette.shell, 0.55)],
    [ribs, kit.paint(palette.ribs, 0.5)],
    [castings, kit.paint(INK.keel, 0.45)],
    [bars, kit.paint(palette.bars, 0.35)],
  ];
  for (const [pieces, material] of parts) group.add(new Mesh(kit.keep(merge(pieces)), material));

  // The inside, dark, so an open container reads as a hold and not a block.
  const inside = new Mesh(
    kit.keep(box(w - 2 * WALL, 0.02, l - 2 * WALL, 0, WALL + 0.01, 0, 0.01)),
    kit.paint(INK.keel, 0.8),
  );
  group.add(inside);

  // The roof: a butterfly hatch, two halves hinged along the long sides, so
  // it opens in a low V rather than standing up in front of everything.
  const roof = new Group();
  roof.position.y = h;
  for (const side of [-1, 1]) {
    const hinge = new Group();
    hinge.position.x = (side * (w + 0.04)) / 2;
    const pieces = [box(w / 2 + 0.02, 0.08, l + 0.04, (-side * (w / 2 + 0.02)) / 2, 0.04, 0)];
    for (let i = 0; i < 5; i++) {
      pieces.push(
        block(w / 2 - 0.12, 0.05, 0.06, (-side * (w / 2 + 0.02)) / 2, 0.1, -l / 2 + 0.25 + (i * (l - 0.5)) / 4),
      );
    }
    hinge.add(new Mesh(kit.keep(merge(pieces)), kit.paint(palette.shell, 0.5)));
    hinge.name = `hatch${side}`;
    roof.add(hinge);
  }
  group.add(roof);

  return { group };
}

export function createCargo(kit: Kit) {
  const group = new Group();
  const swings: (() => void)[] = [];
  const builds = new Map<string, Group>();
  const lampGeometry = kit.keep(new SphereGeometry(0.1, 24, 16));

  function container(x: number, palette: Palette, w: number, l: number, h: number, lit: boolean): Container {
    // Identical containers share one build: a clone reuses its geometry and paint.
    const key = `${palette.shell}:${w}:${l}:${h}`;
    const built = builds.get(key);
    const body = built ? built.clone() : build(kit, palette, w, l, h).group;
    // Cached bare, before this container's own lights go on it.
    if (!built) builds.set(key, body.clone());
    const halves = [body.getObjectByName("hatch-1")!, body.getObjectByName("hatch1")!];
    const hatch = { open: 0 };
    // Read by the boat every frame through `swing`.
    swings.push(() => halves.forEach((half, i) => (half.rotation.z = (i === 0 ? 1 : -1) * hatch.open * 1.95)));
    body.position.set(x, HULL.deck, 0);

    const lights = Array.from({ length: SLOTS_PER_CONTAINER }, (_, i) => {
      const light = kit.glow(lit ? "#8f96ff" : "#2e3172", "#6d74ff", lit ? 1.8 : 0);
      const lamp = new Mesh(lampGeometry, light);
      lamp.position.set((i - 1) * 0.28, h - 0.24, l / 2 + 0.07);
      body.add(lamp);
      return light;
    });

    group.add(body);
    return {
      group: body,
      hatch,
      lights,
      stored: lit ? SLOTS_PER_CONTAINER : 0,
      floor: new Vector3(x, HULL.deck + WALL, 0),
      lamp: (i) => new Vector3(x + (i - 1) * 0.28, HULL.deck + h - 0.24, l / 2 + 0.07),
    };
  }

  const amber: Palette = { shell: INK.amber, ribs: "#e0961f", bars: INK.cabin };
  const indigo: Palette = { shell: INK.hull, ribs: INK.strake, bars: INK.rail };

  // The working pair at the stern, nearest the crane last.
  const stern = [container(-3.35, amber, W, L, H, false), container(-4.8, amber, W, L, H, false)];
  // The archive at the bow: sealed, full.
  const bow = container(3.45, indigo, 1.2, 2.0, 1.05, true);

  return {
    group,
    stern,
    bow,
    /** The next container with room, or undefined once both are full. */
    next: () => stern.find((c) => c.stored < SLOTS_PER_CONTAINER),
    /** Applies each hatch's `open` to its halves. */
    swing: () => swings.forEach((s) => s()),
  };
}
