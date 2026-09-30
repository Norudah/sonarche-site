import { ExtrudeGeometry, Shape, type BufferGeometry } from "three";

import type { Kit } from "./materials";

/*
 * The music, as shapes: four note glyphs, chunky and bevelled like sweets —
 * the single ♪, the beamed pair ♫, the plain crotchet ♩ and the double-beamed
 * ♬. Built once, centred on their bounding box, and shared by every note in
 * the scene.
 */

function stem(x: number, from: number, to: number, w = 0.18): Shape {
  const s = new Shape();
  s.moveTo(x, from);
  s.lineTo(x + w, from);
  s.lineTo(x + w, to);
  s.lineTo(x, to);
  s.lineTo(x, from);
  return s;
}

function head(x: number, rx = 0.48, ry = 0.35): Shape {
  const s = new Shape();
  s.absellipse(x, 0, rx, ry, 0, Math.PI * 2, false, -0.38);
  return s;
}

function beam(x0: number, x1: number, y: number, h = 0.26): Shape {
  const s = new Shape();
  s.moveTo(x0, y);
  s.lineTo(x1, y + 0.18);
  s.lineTo(x1, y + 0.18 + h);
  s.lineTo(x0, y + h);
  s.lineTo(x0, y);
  return s;
}

function single(): Shape[] {
  // The flag: out and down from the head of the stem, curling back at the tip.
  const flag = new Shape();
  flag.moveTo(0.3, 1.55);
  flag.lineTo(0.48, 1.55);
  flag.bezierCurveTo(0.56, 1.26, 1.02, 1.16, 1.04, 0.8);
  flag.bezierCurveTo(1.05, 0.64, 1.0, 0.5, 0.92, 0.4);
  flag.bezierCurveTo(1.0, 0.64, 0.92, 0.94, 0.48, 1.08);
  flag.lineTo(0.3, 1.1);
  flag.lineTo(0.3, 1.55);
  return [head(0), stem(0.3, 0.08, 1.55), flag];
}

function crotchet(): Shape[] {
  return [head(0, 0.5, 0.37), stem(0.31, 0.08, 1.6)];
}

function beamed(double: boolean): Shape[] {
  const shapes = [head(0, 0.4, 0.3), stem(0.24, 0.08, 1.46, 0.16), head(0.95, 0.4, 0.3), stem(1.19, 0.08, 1.46, 0.16)];
  shapes.push(beam(0.24, 1.35, 1.26));
  if (double) shapes.push(beam(0.24, 1.35, 0.9, 0.2));
  return shapes;
}

const OPTIONS = {
  depth: 0.2,
  bevelEnabled: true,
  bevelThickness: 0.09,
  bevelSize: 0.07,
  bevelSegments: 5,
  curveSegments: 32,
};

export type Glyphs = { shapes: BufferGeometry[]; halfHeight: number[] };

/** The glyphs, centred, with how far each reaches above its centre at size 1. */
export function createGlyphs(kit: Kit): Glyphs {
  const shapes = [single(), beamed(false), crotchet(), beamed(true)].map((s) => {
    const geometry = kit.smooth(new ExtrudeGeometry(s, OPTIONS));
    geometry.center();
    return geometry;
  });
  const halfHeight = shapes.map((g) => {
    g.computeBoundingBox();
    return g.boundingBox!.max.y;
  });
  return { shapes, halfHeight };
}
