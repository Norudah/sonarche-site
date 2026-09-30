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

/*
 * A shipping container, for real: corrugated long walls, corner castings,
 * locking bars on the doors, a dark hold inside and a roof that opens as a
 * butterfly hatch, two halves hinged along the long sides, so it opens in a
 * low V rather than standing up in front of everything. A row of lights, one
 * per note it holds, on the doors or on the long side that faces the camera.
 *
 * Merged by material (shell, ribs, castings, bars), so each is a handful of
 * draw calls however much detail it carries; only the roof (it moves) and the
 * lights (they change) are separate. Identical ones share their build.
 *
 * It has a spring in it: a note set down or a hatch slammed makes the whole box
 * squash and bounce on its base, which is most of what makes the stowing land.
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
  /** How many notes it holds: one light each. */
  slots: number;
  /** Where its lights are: over the doors, or down the long side. */
  lamps: "doors" | "side";
  /** Already full: every light on, and never opened. */
  full?: boolean;
};

export type Container = {
  spec: ContainerSpec;
  group: Group;
  hatch: { open: number };
  lights: MeshStandardMaterial[];
  stored: number;
  /** The middle of its floor, in the boat's frame. */
  floor: Vector3;
  /** Its roof's height over its floor. */
  depth: number;
  /** Where light `i` is, in the boat's frame. */
  lamp: (i: number) => Vector3;
  /** Its roof's seam, in the boat's frame: where dust flies when it slams. */
  seam: Vector3;
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

function build(kit: Kit, palette: Palette, [w, l, h]: [number, number, number]): Group {
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
  return group;
}

export function containerFactory(kit: Kit, lampGeometry: SphereGeometry) {
  const builds = new Map<string, Group>();

  return function container(spec: ContainerSpec): Container {
    const [w, l, h] = spec.size;
    // Identical containers share one build: a clone reuses its geometry and paint.
    const key = `${spec.palette.shell}:${spec.size.join(":")}`;
    const built = builds.get(key);
    const body = built ? built.clone() : build(kit, spec.palette, spec.size);
    if (!built) builds.set(key, body.clone());
    const halves = [body.getObjectByName("hatch-1")!, body.getObjectByName("hatch1")!];

    const base = HULL.deck + (spec.y ?? 0);
    body.position.set(spec.x, base, spec.z);
    body.rotation.y = spec.yaw;
    const toBoat = new Matrix4().makeRotationY(spec.yaw).setPosition(spec.x, base, spec.z);

    const along = (i: number) => (i - (spec.slots - 1) / 2) * 0.3;
    const lampAt = (i: number) =>
      spec.lamps === "doors"
        ? new Vector3(along(i), h - 0.24, l / 2 + 0.07)
        : new Vector3(w / 2 + 0.08, h - 0.26, along(i));

    const lights = Array.from({ length: spec.slots }, (_, i) => {
      const ink = kit.glow(spec.full ? LIT : UNLIT, "#6d74ff", spec.full ? 1.8 : 0);
      const lamp = new Mesh(lampGeometry, ink);
      lamp.position.copy(lampAt(i));
      body.add(lamp);
      return ink;
    });

    const hatch = { open: 0 };
    const spring = { y: 0, v: 0 };

    return {
      spec,
      group: body,
      hatch,
      lights,
      stored: spec.full ? spec.slots : 0,
      floor: new Vector3(0, WALL, 0).applyMatrix4(toBoat),
      depth: h - WALL,
      lamp: (i) => lampAt(i).applyMatrix4(toBoat),
      seam: new Vector3(0, h + 0.1, l / 2).applyMatrix4(toBoat),
      light(i, on) {
        lights[i].color.set(on ? LIT : UNLIT);
        lights[i].emissiveIntensity = on ? 1.8 : 0;
      },
      bump(k) {
        spring.v -= k;
      },
      update(dt) {
        halves.forEach((half, i) => (half.rotation.z = (i === 0 ? 1 : -1) * hatch.open * 1.95));
        const step = Math.min(dt, 1 / 30);
        spring.v += (-190 * spring.y - 11 * spring.v) * step;
        spring.y += spring.v * step;
        body.scale.set(1 - spring.y * 0.5, 1 + spring.y, 1 - spring.y * 0.5);
      },
    };
  };
}
