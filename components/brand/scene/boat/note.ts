import { CanvasTexture, ExtrudeGeometry, Group, Mesh, Shape, Sprite, SpriteMaterial, type BufferGeometry } from "three";

import { ACCENT, INK, type Kit } from "./materials";

/*
 * What the crane fishes out: music, as a note — small, chunky and lit, like a
 * sweet you would want to pick up. Two glyphs, the single ♪ and the beamed ♫,
 * mostly in the cargo's amber (the colour of the containers they go into, and
 * the one that stands off the indigo sea), now and then in the accent.
 *
 * Sized to the hold: a note is a little shorter than a container is deep, so
 * it visibly goes in, below the rim, before the hatch closes on it.
 *
 * It has a life of its own, because a prop that only moves when moved reads as
 * a prop: afloat it bobs and turns; in the claw it dangles; hauled up it
 * stretches and settles back. A soft halo behind it keeps it readable against
 * the water, and shows through an open hatch once it is inside.
 *
 * The glyphs are built once and shared: the catch and the notes the funnel
 * lets out are the same two shapes at two sizes.
 */

function single(): Shape[] {
  const head = new Shape();
  head.absellipse(0, 0, 0.48, 0.35, 0, Math.PI * 2, false, -0.38);
  const stem = new Shape();
  stem.moveTo(0.3, 0.08);
  stem.lineTo(0.48, 0.08);
  stem.lineTo(0.48, 1.55);
  stem.lineTo(0.3, 1.55);
  stem.lineTo(0.3, 0.08);
  // The flag: out and down from the head of the stem, curling back at the tip.
  const flag = new Shape();
  flag.moveTo(0.3, 1.55);
  flag.lineTo(0.48, 1.55);
  flag.bezierCurveTo(0.56, 1.26, 1.02, 1.16, 1.04, 0.8);
  flag.bezierCurveTo(1.05, 0.64, 1.0, 0.5, 0.92, 0.4);
  flag.bezierCurveTo(1.0, 0.64, 0.92, 0.94, 0.48, 1.08);
  flag.lineTo(0.3, 1.1);
  flag.lineTo(0.3, 1.55);
  return [head, stem, flag];
}

function beamed(): Shape[] {
  const shapes: Shape[] = [];
  for (const x of [0, 0.95]) {
    const head = new Shape();
    head.absellipse(x, 0, 0.4, 0.3, 0, Math.PI * 2, false, -0.38);
    const stem = new Shape();
    stem.moveTo(x + 0.24, 0.08);
    stem.lineTo(x + 0.4, 0.08);
    stem.lineTo(x + 0.4, 1.46);
    stem.lineTo(x + 0.24, 1.46);
    stem.lineTo(x + 0.24, 0.08);
    shapes.push(head, stem);
  }
  const beam = new Shape();
  beam.moveTo(0.24, 1.26);
  beam.lineTo(1.35, 1.44);
  beam.lineTo(1.35, 1.7);
  beam.lineTo(0.24, 1.52);
  beam.lineTo(0.24, 1.26);
  shapes.push(beam);
  return shapes;
}

function halo(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 250, 238, 0.9)");
  g.addColorStop(0.45, "rgba(255, 244, 222, 0.35)");
  g.addColorStop(1, "rgba(255, 244, 222, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
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

/** The two glyphs, centred, with how far each reaches above its centre at size 1. */
export function createGlyphs(kit: Kit): Glyphs {
  const shapes = [single(), beamed()].map((s) => {
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

export function createNote(kit: Kit, glyphs: Glyphs, size: number) {
  const accent = kit.glow(ACCENT, ACCENT, 0.9);
  const amber = kit.glow(INK.amber, INK.amber, 0.55);
  amber.roughness = 0.3;
  const mesh = new Mesh(glyphs.shapes[0], amber);
  mesh.scale.setScalar(size);
  let glyph = 0;

  const glowTexture = halo();
  const glowInk = new SpriteMaterial({ map: glowTexture, depthWrite: false, transparent: true, opacity: 0.8 });
  const glow = new Sprite(glowInk);
  glow.scale.setScalar(size * 2.9);
  glow.renderOrder = 1;

  const group = new Group();
  group.add(glow, mesh);
  group.visible = false;

  // Stretch when yanked: set by the choreography, relaxed here.
  const squash = { y: 1 };
  // 0..1: extra light, when it is set down in the dark of a hold.
  const shine = { v: 0 };

  return {
    group,
    squash,
    shine,
    /** A fresh catch: glyph and colour. */
    dress(golden: boolean, beamedGlyph: boolean) {
      glyph = beamedGlyph ? 1 : 0;
      mesh.material = golden ? amber : accent;
      mesh.geometry = glyphs.shapes[glyph];
    },
    /** Centre to top, world units: where the claw takes hold. */
    top: () => glyphs.halfHeight[glyph] * size,
    /** Afloat: a bob and a slow turn. Carried: a dangle. */
    idle(t: number, afloat: boolean) {
      mesh.position.y = afloat ? Math.sin(t * 2.1) * 0.06 : 0;
      mesh.rotation.y = afloat ? Math.sin(t * 0.8) * 0.8 : Math.sin(t * 1.7) * 0.25;
      mesh.rotation.z = Math.sin(t * 1.3) * (afloat ? 0.1 : 0.06);
      mesh.scale.set(size / Math.sqrt(squash.y), size * squash.y, size / Math.sqrt(squash.y));
      glowInk.opacity = 0.55 + Math.sin(t * 3) * 0.12 + shine.v * 0.4;
      glow.scale.setScalar(size * (2.9 + shine.v * 1.2));
    },
    dispose() {
      glowTexture.dispose();
      glowInk.dispose();
    },
  };
}
