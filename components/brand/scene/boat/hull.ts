import {
  BufferAttribute,
  type Plane,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Mesh,
  Shape,
  ShapeGeometry,
  TubeGeometry,
  Vector3,
} from "three";

import { INK, type Kit } from "./materials";

/* Lofted from superellipse rings, deck to keel; the mark's three bands are vertex colours. Longer and
   higher than the logo's silhouette to make room for the deck's gear. */

export const HULL = {
  halfLength: 10,
  halfBeam: 2.7,
  /** Deck height above the water. */
  deck: 2.25,
  /** Keel depth, below the water. */
  keel: -1.5,
};

const BOTTOM_HALF_LENGTH = 7.35;
const BOTTOM_HALF_BEAM = 1.55;
const SEGMENTS = 160;
/** Down the side, 0 at the deck and 1 at the keel; doubled up at the band edges. */
const LEVELS = [
  0, 0.03, 0.08, 0.15, 0.165, 0.25, 0.35, 0.45, 0.55, 0.61, 0.625, 0.7, 0.78, 0.85, 0.9, 0.94, 0.97, 0.99, 1,
];

type Plan = { a: number; b: number; n: number; y: number };

/** The ring at depth t: half-length, half-beam, squareness, height. */
function planAt(t: number): Plan {
  const round = Math.sqrt(Math.max(0, 1 - t ** 2.4));
  return {
    a: BOTTOM_HALF_LENGTH + (HULL.halfLength - BOTTOM_HALF_LENGTH) * round,
    b: BOTTOM_HALF_BEAM + (HULL.halfBeam - BOTTOM_HALF_BEAM) * round,
    n: 3.6 - 1.1 * t,
    y: HULL.deck + (HULL.keel - HULL.deck) * t,
  };
}

function ring({ a, b, n }: Plan, i: number): [number, number] {
  const th = (i / SEGMENTS) * Math.PI * 2;
  const c = Math.cos(th);
  const s = Math.sin(th);
  return [a * Math.sign(c) * Math.abs(c) ** (2 / n), b * Math.sign(s) * Math.abs(s) ** (2 / n)];
}

function bandAt(t: number): string {
  if (t < 0.16) return INK.strake;
  if (t < 0.62) return INK.hull;
  return INK.keel;
}

/** The hull's outline at height y in its own frame, slightly proud of it. */
export function waterline(y: number, proud: number): Vector3[] {
  return outline(proud, planAt((HULL.deck - y) / (HULL.deck - HULL.keel)));
}

/** Where the hull's side is, at length x and depth t — for fittings on it. */
export function sideAt(x: number, t: number): { y: number; z: number } {
  const { a, b, n, y } = planAt(t);
  const u = Math.min(1, Math.abs(x) / a);
  return { y, z: b * (1 - u ** n) ** (1 / n) };
}

function hullGeometry(): BufferGeometry {
  const rows = LEVELS.length;
  const positions = new Float32Array((rows * SEGMENTS + 1) * 3);
  const colors = new Float32Array((rows * SEGMENTS + 1) * 3);
  const color = new Color();

  LEVELS.forEach((t, r) => {
    const plan = planAt(t);
    color.set(bandAt(t));
    for (let i = 0; i < SEGMENTS; i++) {
      const [x, z] = ring(plan, i);
      const k = (r * SEGMENTS + i) * 3;
      positions.set([x, plan.y, z], k);
      colors.set([color.r, color.g, color.b], k);
    }
  });
  // The keel's centre, closing the bottom.
  const centre = rows * SEGMENTS;
  positions.set([0, HULL.keel, 0], centre * 3);
  color.set(INK.keel);
  colors.set([color.r, color.g, color.b], centre * 3);

  const index: number[] = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = r * SEGMENTS + i;
      const b = r * SEGMENTS + ((i + 1) % SEGMENTS);
      const c = a + SEGMENTS;
      const d = b + SEGMENTS;
      index.push(a, b, c, b, d, c);
    }
  }
  const last = (rows - 1) * SEGMENTS;
  for (let i = 0; i < SEGMENTS; i++) index.push(last + i, last + ((i + 1) % SEGMENTS), centre);

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function outline(inset: number, plan: Plan = planAt(0)): Vector3[] {
  const scaled = { ...plan, a: plan.a + inset, b: plan.b + inset };
  return Array.from({ length: SEGMENTS }, (_, i) => {
    const [x, z] = ring(scaled, i);
    return new Vector3(x, 0, z);
  });
}

/** @param surface the water's surface, where the hull is cut (waterline.ts). */
export function createHull(kit: Kit, surface: Plane) {
  const paint = kit.paint("#ffffff", 0.5);
  paint.vertexColors = true;
  // Cut at the surface: below it, the sea (see waterline.ts).
  paint.clippingPlanes = [surface];
  const hull = new Mesh(kit.keep(hullGeometry()), paint);

  // The deck: the top ring, filled, a step lighter than the hull so the
  // cargo stands on something.
  const deckShape = new Shape();
  outline(-0.02).forEach((p, i) => (i ? deckShape.lineTo(p.x, -p.z) : deckShape.moveTo(p.x, -p.z)));
  const deckGeometry = kit.keep(new ShapeGeometry(deckShape));
  deckGeometry.rotateX(-Math.PI / 2);
  const deck = new Mesh(deckGeometry, kit.paint(INK.deck, 0.7));
  deck.position.y = HULL.deck - 0.02;

  // The rail: the mark's lavender gunwale, as a rounded bumper all the way round.
  const railPath = new CatmullRomCurve3(outline(0.06), true, "centripetal");
  const rail = new Mesh(kit.keep(new TubeGeometry(railPath, 256, 0.2, 20, true)), kit.paint(INK.rail, 0.42));
  rail.position.y = HULL.deck + 0.08;

  return [hull, deck, rail];
}
