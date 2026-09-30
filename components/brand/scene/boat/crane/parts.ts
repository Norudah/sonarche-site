import {
  CylinderGeometry,
  ExtrudeGeometry,
  Mesh,
  Path,
  Quaternion,
  Shape,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three";

import type { Kit } from "../materials";

/*
 * The crane's machine parts, as geometry: toothed gears, the boom's plate
 * sections pierced with lightening holes, and a hydraulic ram that can be set
 * between two points every frame.
 *
 * Everything is chunkier than the real thing. At the size the vessel is drawn
 * a true gear tooth is a pixel; these are drawn to be read as gears from
 * across the room, the way a toy's are.
 */

const TAU = Math.PI * 2;

/**
 * A spur gear in the xy plane, extruded along z and centred on it. Its first
 * tooth is centred at 0.325 of a pitch past the +x axis (see `meshing`).
 */
export function gear(kit: Kit, teeth: number, radius: number, width: number, bore = 0.3): BufferGeometry {
  const depth = Math.min(0.1, radius * 0.22);
  const inner = radius - depth;
  const step = TAU / teeth;
  const s = new Shape();
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const at = (r: number, f: number) => [Math.cos(a + f * step) * r, Math.sin(a + f * step) * r] as const;
    const p = [at(inner, 0), at(radius, 0.18), at(radius, 0.47), at(inner, 0.65)];
    if (i === 0) s.moveTo(...p[0]);
    else s.lineTo(...p[0]);
    for (const q of p.slice(1)) s.lineTo(...q);
  }
  s.closePath();
  // A bore, and lightening holes in the web of the bigger ones: they are what
  // makes a turning gear read as turning.
  const hole = (x: number, y: number, r: number) => {
    const h = new Path();
    h.absarc(x, y, r, 0, TAU, true);
    s.holes.push(h);
  };
  hole(0, 0, inner * bore * 0.6);
  if (teeth >= 12) {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU;
      hole(Math.cos(a) * inner * 0.58, Math.sin(a) * inner * 0.58, inner * 0.2);
    }
  }
  const bevel = Math.min(0.02, width * 0.2);
  return kit
    .smooth(
      new ExtrudeGeometry(s, {
        depth: width - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 2,
        curveSegments: 20,
      }),
    )
    .translate(0, 0, -(width - bevel * 2) / 2);
}

/** Where, at rotation 0, gear `a`'s tooth must sit (and `b`'s gap) for the two to mesh. */
export function meshing(teethA: number, teethB: number, towardB: number): [number, number] {
  const sa = TAU / teethA;
  const sb = TAU / teethB;
  return [towardB - 0.325 * sa, towardB + Math.PI - 0.325 * sb - sb / 2];
}

/**
 * A boom section, side on: a tapered stadium from its pin at the origin to its
 * head at `length` along x, pierced along its length, extruded `width` deep.
 */
export function beam(kit: Kit, length: number, root: number, head: number, width: number): BufferGeometry {
  const s = new Shape();
  s.moveTo(0, -root);
  s.lineTo(length, -head);
  s.absarc(length, 0, head, -Math.PI / 2, Math.PI / 2, false);
  s.lineTo(0, root);
  s.absarc(0, 0, root, Math.PI / 2, Math.PI * 1.5, false);

  const hole = (x: number, r: number) => {
    const h = new Path();
    h.absarc(x, 0, r, 0, TAU, true);
    s.holes.push(h);
  };
  // Pin holes at both ends, and a row of lightening holes between.
  hole(0, root * 0.38);
  hole(length, head * 0.38);
  const from = root * 2.1;
  const to = length - head * 2.1;
  const count = Math.max(1, Math.round((to - from) / (root * 1.5)));
  for (let i = 0; i <= count; i++) {
    const x = from + ((to - from) * i) / count;
    const half = root + (head - root) * (x / length);
    hole(x, half * 0.5);
  }

  const bevel = 0.035;
  return kit
    .smooth(
      new ExtrudeGeometry(s, {
        depth: width - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 3,
        curveSegments: 28,
      }),
    )
    .translate(0, 0, -(width - bevel * 2) / 2);
}

const UP = new Vector3(0, 1, 0);
const along = new Vector3();
const back = new Vector3();
const at = new Vector3();

/**
 * A hydraulic ram: a barrel on one pivot, a polished rod out of it to the
 * other. `set` places it between two points in its parent's frame; the barrel
 * keeps its length and the rod slides, so the stroke shows.
 */
export function ram(kit: Kit, barrelInk: Material, rodInk: Material, radius: number, barrel: number) {
  const cylinder = kit.keep(new CylinderGeometry(1, 1, 1, 24));
  const body = new Mesh(cylinder, barrelInk);
  const gland = new Mesh(cylinder, barrelInk);
  const rod = new Mesh(cylinder, rodInk);
  const turn = new Quaternion();

  function place(m: Mesh, from: Vector3, dir: Vector3, length: number, r: number) {
    m.position.copy(from).addScaledVector(dir, length / 2);
    m.scale.set(r, length, r);
    m.quaternion.copy(turn);
  }

  return {
    parts: [body, gland, rod],
    set(base: Vector3, end: Vector3) {
      along.subVectors(end, base);
      const length = along.length();
      along.normalize();
      turn.setFromUnitVectors(UP, along);
      const b = Math.min(barrel, length - 0.1);
      place(body, base, along, b, radius);
      // The gland: a collar where the rod leaves the barrel.
      place(gland, at.copy(base).addScaledVector(along, b - 0.06), along, 0.12, radius * 1.2);
      place(rod, end, back.copy(along).negate(), Math.min(length, length - b + 0.3), radius * 0.52);
    },
  };
}
