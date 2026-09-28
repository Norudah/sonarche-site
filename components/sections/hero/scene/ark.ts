import {
  CircleGeometry,
  Color,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  type BufferGeometry,
  type Material,
} from "three";

import { oklch } from "./color";
import { ARK_SPAN } from "./framing";

/*
 * The ark, in volume.
 *
 * Built from the brand mark's own paths — components/brand/SonarcheMark.tsx and
 * Ark.tsx — transcribed point for point, then extruded. Seen head-on it is the
 * logo, pixel for pixel, in the logo's flat colours; it is only when it rolls
 * and yaws on the swell that the beam, the set-back cabin and the cargo stacked
 * two deep show that it has a body. Do not let the hull drift from the SVG: the
 * poster underneath is that SVG, and the handover depends on them agreeing.
 *
 * Unlit on purpose. Faces take the mark's colours exactly; sides take the same
 * colour darkened, like a paper model. Lighting would put a gradient on a brand
 * that has none.
 *
 * Every loop is the CSS one it replaces (ark.module.css), same periods, so the
 * vessel moves the way the site already taught the visitor it moves.
 */

/** One unit of the mark's 24-unit viewBox, in world units. */
const K = ARK_SPAN / 24;
/*
 * The viewBox row that sits on the water. The hull bottoms out at 19.8, so a
 * good third of it is under: seen from above, the rows in front of the berth
 * have to climb the hull for the vessel to read as afloat rather than parked on
 * the surface. The poster gets away with less because it has no perspective.
 */
const WATERLINE = 18.0;

const X = (x: number) => (x - 12) * K;
const Y = (y: number) => (WATERLINE - y) * K;

const TAU = Math.PI * 2;

/** Rounded rectangle, in viewBox coordinates (x, y the top-left corner). */
function roundRect(x: number, y: number, w: number, h: number, r: number): Shape {
  const [l, rt, t, b] = [X(x), X(x + w), Y(y), Y(y + h)];
  const k = r * K;
  const s = new Shape();
  s.moveTo(l + k, b);
  s.lineTo(rt - k, b);
  s.quadraticCurveTo(rt, b, rt, b + k);
  s.lineTo(rt, t - k);
  s.quadraticCurveTo(rt, t, rt - k, t);
  s.lineTo(l + k, t);
  s.quadraticCurveTo(l, t, l, t - k);
  s.lineTo(l, b + k);
  s.quadraticCurveTo(l, b, l + k, b);
  return s;
}

// M2.2 13.2h19.6q.75 0 .65.75l-.45 2.6q-.6 3.25-3.4 3.25H5.4q-2.8 0-3.4-3.25l-.45-2.6q-.1-.75.65-.75Z
function hull(): Shape {
  const s = new Shape();
  s.moveTo(X(2.2), Y(13.2));
  s.lineTo(X(21.8), Y(13.2));
  s.quadraticCurveTo(X(22.55), Y(13.2), X(22.45), Y(13.95));
  s.lineTo(X(22.0), Y(16.55));
  s.quadraticCurveTo(X(21.4), Y(19.8), X(18.6), Y(19.8));
  s.lineTo(X(5.4), Y(19.8));
  s.quadraticCurveTo(X(2.6), Y(19.8), X(2.0), Y(16.55));
  s.lineTo(X(1.55), Y(13.95));
  s.quadraticCurveTo(X(1.45), Y(13.2), X(2.2), Y(13.2));
  return s;
}

// M2.2 13.2h19.6q.75 0 .65.75H1.55q-.1-.75.65-.75Z
function strake(): Shape {
  const s = new Shape();
  s.moveTo(X(2.2), Y(13.2));
  s.lineTo(X(21.8), Y(13.2));
  s.quadraticCurveTo(X(22.55), Y(13.2), X(22.45), Y(13.95));
  s.lineTo(X(1.55), Y(13.95));
  s.quadraticCurveTo(X(1.45), Y(13.2), X(2.2), Y(13.2));
  return s;
}

// M3.7 16.5h16.6l-.3 1.15q-.75 2.45-2.9 2.45H6.9q-2.15 0-2.9-2.45Z
function keel(): Shape {
  const s = new Shape();
  s.moveTo(X(3.7), Y(16.5));
  s.lineTo(X(20.3), Y(16.5));
  s.lineTo(X(20.0), Y(17.65));
  s.quadraticCurveTo(X(19.25), Y(20.1), X(17.1), Y(20.1));
  s.lineTo(X(6.9), Y(20.1));
  s.quadraticCurveTo(X(4.75), Y(20.1), X(4.0), Y(17.65));
  s.lineTo(X(3.7), Y(16.5));
  return s;
}

// M7.5 12V9.75C7.5 8.85 8.4 8.2 9.7 8 10.5 7.88 13.5 7.88 14.3 8 15.6 8.2 16.5 8.85 16.5 9.75V12Z
function head(): Shape {
  const s = new Shape();
  s.moveTo(X(7.5), Y(12));
  s.lineTo(X(7.5), Y(9.75));
  s.bezierCurveTo(X(7.5), Y(8.85), X(8.4), Y(8.2), X(9.7), Y(8));
  s.bezierCurveTo(X(10.5), Y(7.88), X(13.5), Y(7.88), X(14.3), Y(8));
  s.bezierCurveTo(X(15.6), Y(8.2), X(16.5), Y(8.85), X(16.5), Y(9.75));
  s.lineTo(X(16.5), Y(12));
  s.lineTo(X(7.5), Y(12));
  return s;
}

function circle(cx: number, cy: number, r: number): Shape {
  const s = new Shape();
  s.absarc(X(cx), Y(cy), r * K, 0, TAU, false);
  return s;
}

type Parts = {
  geometries: BufferGeometry[];
  materials: Material[];
};

function flat(parts: Parts, hex: string | Color): MeshBasicMaterial {
  const m = new MeshBasicMaterial({ color: hex });
  parts.materials.push(m);
  return m;
}

/** A face in the mark's colour, sides the same colour taken down a step. */
function solid(parts: Parts, shape: Shape, depth: number, hex: string | Color, bevel = 0.06): Mesh {
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 18,
  });
  geometry.translate(0, 0, -depth / 2);
  parts.geometries.push(geometry);
  const face = flat(parts, hex);
  const side = flat(parts, new Color(hex).multiplyScalar(0.62));
  return new Mesh(geometry, [face, side]);
}

/** A decal on a face: flat, a hair proud of it. */
function decal(parts: Parts, shape: Shape, z: number, material: Material): Mesh {
  const geometry = new ShapeGeometry(shape, 18);
  parts.geometries.push(geometry);
  const mesh = new Mesh(geometry, material);
  mesh.position.z = z;
  return mesh;
}

const HULL_BEAM = 5.4;
const RAIL_BEAM = 6.0;
const CABIN_BEAM = 3.1;
const BEVEL = 0.06;

const ONDE = [
  { height: 10, delay: -0.1 },
  { height: 18, delay: -0.35 },
  { height: 26, delay: -0.6 },
  { height: 16, delay: -0.2 },
  { height: 22, delay: -0.5 },
  { height: 12, delay: -0.75 },
];

/** The poster ark is 320px across 24 viewBox units: px → viewBox units. */
const PX = 24 / 320;

export function createArk() {
  const parts: Parts = { geometries: [], materials: [] };

  // sail → float → roll, the nesting of Ark.tsx: the equalizer rides the first
  // two and not the third, so it travels with the hull without heeling.
  const sail = new Group();
  const float = new Group();
  const roll = new Group();
  sail.add(float);
  float.add(roll);

  // The roll pivots where the CSS one does: 74% down the box.
  const pivot = Y(24 * 0.74);
  roll.position.y = pivot;
  const body = new Group();
  body.position.y = -pivot;
  roll.add(body);

  const hullFront = HULL_BEAM / 2 + BEVEL + 0.01;
  body.add(solid(parts, hull(), HULL_BEAM, "#3d4097"));
  body.add(decal(parts, strake(), hullFront, flat(parts, "#4f52c1")));
  body.add(decal(parts, keel(), hullFront, flat(parts, "#2e3172")));
  body.add(solid(parts, roundRect(1.6, 12, 20.8, 1.1, 0.55), RAIL_BEAM, "#818cf9", 0.04));

  const portholes = [5.6, 9.7, 14.3, 18.4].map((cx) => {
    const m = flat(parts, "#818cf9");
    body.add(decal(parts, circle(cx, 15, 0.45), hullFront + 0.005, m));
    return m;
  });

  // The cabin sits back from the bow, so it slides against the hull as the
  // vessel yaws — the cheapest proof there is that this is not a drawing.
  const cabinFront = CABIN_BEAM / 2 + BEVEL + 0.01;
  body.add(solid(parts, head(), CABIN_BEAM, "#c5cbef"));
  body.add(decal(parts, roundRect(7.5, 11.4, 9, 0.6, 0), cabinFront, flat(parts, "#a5aede")));

  const eyes = new Group();
  const eyeInk = flat(parts, "#222652");
  const glint = flat(parts, "#818cf9");
  for (const x of [9, 13]) {
    eyes.add(decal(parts, roundRect(x, 9.05, 2, 2, 0.75), cabinFront + 0.005, eyeInk));
    eyes.add(decal(parts, circle(x + 0.6, 9.65, 0.42), cabinFront + 0.01, glint));
  }
  // Blinks about the eyes' own middle, like arkBlink's transform-origin.
  const eyeLine = Y(10.05);
  eyes.position.y = eyeLine;
  eyes.children.forEach((c) => (c.position.y -= eyeLine));
  body.add(eyes);

  // The cargo, two deep: amber crates at the ends, indigo amidships. On the
  // mark it is one row; here the second row is what the beam is for.
  const cargo = new Group();
  const cargoLate = new Group();
  const crate = (x: number, y: number, w: number, h: number, hex: string, band: string, z: number, into: Group) => {
    const box = solid(parts, roundRect(x, y, w, h, 0.45), w * K * 0.9, hex, 0.03);
    box.position.z = z;
    const front = (w * K * 0.9) / 2 + 0.04 + z;
    box.add(decal(parts, roundRect(x, y + h * 0.43, w, h * 0.17, 0), front - z, flat(parts, band)));
    into.add(box);
  };
  for (const z of [1.25, -1.25]) {
    crate(3, 9, 2, 3, "#efa831", "#fae1b8", z, cargo);
    crate(19, 9, 2, 3, "#efa831", "#fae1b8", z, cargo);
    crate(5.1, 10, 1.5, 2, "#3d4097", "#818cf9", z, cargoLate);
    crate(17.4, 10, 1.5, 2, "#3d4097", "#818cf9", z, cargoLate);
  }
  body.add(cargo, cargoLate);

  // The wake: a shadow on the water that breathes, from arkWake.
  const wakeMaterial = new MeshBasicMaterial({
    color: "#6163f2",
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    side: DoubleSide,
  });
  parts.materials.push(wakeMaterial);
  const wakeGeometry = new CircleGeometry(1, 48);
  parts.geometries.push(wakeGeometry);
  const wake = new Mesh(wakeGeometry, wakeMaterial);
  wake.rotation.x = -Math.PI / 2;
  wake.position.y = 0.04;
  wake.renderOrder = 1;
  float.add(wake);

  // The equalizer over the roof, the Onde of the poster: six bars on one 0.9s
  // loop, docked above the cabin, riding the sail and the float only.
  const onde = new Group();
  const bars = ONDE.map((bar, i) => {
    const w = 4 * PX;
    const h = bar.height * PX;
    const x = 12 - (39 * PX) / 2 + i * 7 * PX;
    // Drawn standing on y = 0, so scaling the group grows it from its foot.
    const g = new Group();
    g.add(solid(parts, roundRect(x, WATERLINE - h, w, h, w / 2), w * K, ACCENT, 0));
    onde.add(g);
    return { group: g, delay: bar.delay };
  });
  // Perched where Onde.tsx puts it: 67.2% up the box, plus 10px of air.
  onde.position.y = Y(24 * (1 - 0.672) - 10 * PX) - Y(WATERLINE);
  float.add(onde);

  let kick = 0;

  function update(t: number, dt: number) {
    const cos = (period: number, phase = 0) => Math.cos(((t + phase) / period) * TAU);
    const ease = (period: number, phase = 0) => 0.5 - 0.5 * cos(period, phase);

    // arkSail: ±drift over the sea's drift time, ease-in-out, alternate.
    sail.position.x = (ease(58) * 2 - 1) * 1.0;
    // arkFloat: 6.1s, +1.5px .. -4px.
    float.position.y = (-1.5 + 5.5 * ease(6.1)) * PX * K + kick * 0.25;
    // arkRoll: ±1.3° over 7.4s — and the two the drawing never had.
    roll.rotation.z = (ease(7.4) * 2 - 1) * 0.0227;
    roll.rotation.x = Math.sin((t / 5.3) * TAU) * 0.018 - kick * 0.03;
    roll.rotation.y = Math.sin((t / 11.7) * TAU) * 0.075 + Math.sin((t / 4.1) * TAU) * 0.012;

    // arkBlink: 6.8s, shut for a sliver around 95%.
    const blink = (t % 6.8) / 6.8;
    eyes.scale.y = blink > 0.92 ? 1 - 0.92 * Math.sin(((blink - 0.92) / 0.08) * Math.PI) : 1;

    // arkCargo: settling apart on 3.9s.
    cargo.position.y = Math.sin((t / 3.9) * TAU) * 0.14 * K;
    cargoLate.position.y = Math.sin(((t - 1.3) / 3.9) * TAU) * 0.14 * K;

    // arkWake: 3.4s.
    const w = ease(3.4);
    wake.scale.set(11.4 * K * (0.88 + 0.26 * w), 2.6, 1);
    wakeMaterial.opacity = 0.35 * (0.5 - 0.38 * w) * 2;

    // arkPorthole: 2.8s, 0.7s apart — plus a flare whenever a ping goes out.
    portholes.forEach((m, i) => {
      const lit = Math.min(1, 0.45 + 0.55 * ease(2.8, -i * 0.7) + kick);
      m.color.copy(HULL).lerp(LIT, lit);
    });

    // ondeBar: 0.9s between 0.3 and full, and eqFloat's wander on top.
    bars.forEach(({ group, delay }) => {
      group.scale.y = Math.min(1.8, 0.3 + 0.7 * ease(0.9, delay) + kick * 0.8);
    });
    onde.position.x = Math.sin((t / 5.9) * TAU) * 2.5 * PX * K;

    kick = Math.max(0, kick - dt * 1.6);
  }

  return {
    group: sail,
    /** World position the stream converges on: the hold, between the crates. */
    hold: () => [sail.position.x, float.position.y + Y(10.5), 0] as const,
    /** The ark answers its own ping: a lift, a nod, portholes and sound flaring. */
    ping() {
      kick = 1;
    },
    update,
    dispose() {
      parts.geometries.forEach((g) => g.dispose());
      parts.materials.forEach((m) => m.dispose());
    },
  };
}

const HULL = new Color("#3d4097");
const LIT = new Color("#c7ccff");
/** --accent, the Onde bars' colour. */
const ACCENT = oklch(0.505, 0.185, 277);
