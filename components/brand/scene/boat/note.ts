import { CanvasTexture, ExtrudeGeometry, Group, Mesh, Shape, Sprite, SpriteMaterial } from "three";

import { ACCENT, INK, type Kit } from "./materials";

/*
 * What the crane fishes out: music, as a note — small, chunky and lit, like a
 * sweet you would want to pick up. Two glyphs, the single ♪ and the beamed ♫,
 * mostly in the cargo's amber (the colour of the containers they go into, and
 * the one that stands off the indigo sea), now and then in the accent.
 *
 * It has a life of its own, because a prop that only moves when moved reads as
 * a prop: afloat it bobs and turns; on the hook it dangles and swings; hauled
 * up it stretches and settles back. A soft halo behind it keeps it readable
 * against the water.
 *
 * One note at a time: the boat recycles it from catch to catch.
 */

function single(): Shape[] {
  const head = new Shape();
  head.absellipse(0, 0, 0.46, 0.36, 0, Math.PI * 2, false, -0.35);
  const stem = new Shape();
  stem.moveTo(0.28, 0.1);
  stem.lineTo(0.46, 0.1);
  stem.lineTo(0.46, 1.5);
  stem.lineTo(0.28, 1.5);
  stem.lineTo(0.28, 0.1);
  const flag = new Shape();
  flag.moveTo(0.28, 1.5);
  flag.bezierCurveTo(0.5, 1.2, 1.0, 1.15, 0.92, 0.66);
  flag.bezierCurveTo(1.16, 1.1, 0.74, 1.24, 0.46, 1.3);
  flag.lineTo(0.46, 1.5);
  flag.lineTo(0.28, 1.5);
  return [head, stem, flag];
}

function beamed(): Shape[] {
  const shapes: Shape[] = [];
  for (const x of [0, 0.95]) {
    const head = new Shape();
    head.absellipse(x, 0, 0.4, 0.31, 0, Math.PI * 2, false, -0.35);
    const stem = new Shape();
    stem.moveTo(x + 0.24, 0.08);
    stem.lineTo(x + 0.4, 0.08);
    stem.lineTo(x + 0.4, 1.4);
    stem.lineTo(x + 0.24, 1.4);
    stem.lineTo(x + 0.24, 0.08);
    shapes.push(head, stem);
  }
  const beam = new Shape();
  beam.moveTo(0.24, 1.28);
  beam.lineTo(1.35, 1.46);
  beam.lineTo(1.35, 1.7);
  beam.lineTo(0.24, 1.52);
  beam.lineTo(0.24, 1.28);
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

export function createNote(kit: Kit) {
  const glyphs = [single(), beamed()].map((shapes) => {
    const geometry = kit.smooth(new ExtrudeGeometry(shapes, OPTIONS));
    geometry.center();
    return geometry;
  });

  const accent = kit.glow(ACCENT, ACCENT, 0.9);
  const amber = kit.glow(INK.amber, INK.amber, 0.55);
  amber.roughness = 0.3;
  const mesh = new Mesh(glyphs[0], amber);
  mesh.scale.setScalar(0.95);

  const glowTexture = halo();
  const glowInk = new SpriteMaterial({ map: glowTexture, depthWrite: false, transparent: true, opacity: 0.8 });
  const glow = new Sprite(glowInk);
  glow.scale.setScalar(2.6);
  glow.renderOrder = 1;

  const group = new Group();
  group.add(glow, mesh);
  group.visible = false;

  // Stretch when yanked: set by the choreography, relaxed here.
  const squash = { y: 1 };

  return {
    group,
    squash,
    /** A fresh catch: glyph and colour. */
    dress(golden: boolean, beamedGlyph: boolean) {
      mesh.material = golden ? amber : accent;
      mesh.geometry = glyphs[beamedGlyph ? 1 : 0];
    },
    /** Afloat: a bob and a slow turn. Carried: a dangle. */
    idle(t: number, afloat: boolean) {
      mesh.position.y = afloat ? Math.sin(t * 2.1) * 0.1 : 0;
      mesh.rotation.y = afloat ? Math.sin(t * 0.8) * 0.9 : Math.sin(t * 1.7) * 0.35;
      mesh.rotation.z = Math.sin(t * 1.3) * (afloat ? 0.1 : 0.18);
      const s = 0.95;
      mesh.scale.set(s / Math.sqrt(squash.y), s * squash.y, s / Math.sqrt(squash.y));
      glowInk.opacity = 0.55 + Math.sin(t * 3) * 0.12;
    },
    dispose() {
      glowTexture.dispose();
      glowInk.dispose();
    },
  };
}
