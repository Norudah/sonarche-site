/*
 * 2:1 dimetric projection on a 560×420 stage. World axes: +x lower right, +y lower left, +z up.
 * Everything is placed in world units through these helpers, never as hand-drawn paths.
 */

export const STAGE = { width: 560, height: 420 } as const;

/** The world origin on screen: mid-stage, at sea level. */
const OX = 280;
const OY = 250;

export type Vec3 = readonly [x: number, y: number, z: number];

export function project(x: number, y: number, z = 0): [number, number] {
  return [OX + (x - y), OY + (x + y) / 2 - z];
}

export function polygon(points: readonly Vec3[]): string {
  return polyline(points) + " Z";
}

/** An open run of segments, for rims and wires. */
export function polyline(points: readonly Vec3[]): string {
  return points
    .map(([x, y, z], i) => {
      const [sx, sy] = project(x, y, z);
      return `${i ? "L" : "M"}${round(sx)},${round(sy)}`;
    })
    .join(" ");
}

export type BoxFaces = { top: string; left: string; right: string };

/**
 * The three faces of an axis-aligned box that the camera sees: the top, the
 * face at y + d (lower left on screen) and the face at x + w (lower right).
 */
export function box(x: number, y: number, z: number, w: number, d: number, h: number): BoxFaces {
  const x1 = x + w;
  const y1 = y + d;
  const z1 = z + h;
  return {
    top: polygon([
      [x, y, z1],
      [x1, y, z1],
      [x1, y1, z1],
      [x, y1, z1],
    ]),
    left: polygon([
      [x, y1, z1],
      [x1, y1, z1],
      [x1, y1, z],
      [x, y1, z],
    ]),
    right: polygon([
      [x1, y, z1],
      [x1, y1, z1],
      [x1, y1, z],
      [x1, y, z],
    ]),
  };
}

/* Affine maps laying a flat 2D drawing on a plane: `u` along its reading direction, `v` down it. */

/** Lying on the floor at height z: u along +x, v along +y. */
export function onFloor(x: number, y: number, z = 0): string {
  const [sx, sy] = project(x, y, z);
  return `matrix(1 0.5 -1 0.5 ${round(sx)} ${round(sy)})`;
}

/** Standing, facing lower left (the plane y = const): u along +x, v down. */
export function onFront(x: number, y: number, z: number): string {
  const [sx, sy] = project(x, y, z);
  return `matrix(1 0.5 0 1 ${round(sx)} ${round(sy)})`;
}

/** Standing, facing lower right (the plane x = const): u along −y, v down. */
export function onSide(x: number, y: number, z: number): string {
  const [sx, sy] = project(x, y, z);
  return `matrix(1 -0.5 0 1 ${round(sx)} ${round(sy)})`;
}

/** A circle of radius r lying on the floor at height z, as ellipse attributes. */
export function floorEllipse(x: number, y: number, z: number, r: number) {
  const [cx, cy] = project(x, y, z);
  return { cx: round(cx), cy: round(cy), rx: round(r * Math.SQRT2), ry: round(r * Math.SQRT1_2) };
}

/** A world-space offset as a screen-space {x, y} tween target. */
export function shift(dx: number, dy: number, dz = 0): { x: number; y: number } {
  return { x: dx - dy, y: (dx + dy) / 2 - dz };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
