import { ExtrudeGeometry, Group, Mesh, Shape } from "three";

import { ACCENT, INK, type Kit } from "./materials";

/*
 * What the crane fishes out: music, as a note — the eighth note everyone reads
 * as a song. A lit, bevelled glyph, mostly in the cargo's amber (the crates it
 * is going into, and the one colour that stands off the indigo sea), now and
 * then in the accent, bobbing and turning slowly where it surfaced, so the eye finds it on
 * the water before the crane does.
 *
 * One note at a time: the boat recycles it from catch to catch.
 */

function glyph(): Shape[] {
  const head = new Shape();
  head.absellipse(0, 0, 0.44, 0.32, 0, Math.PI * 2, false, -0.35);

  const stem = new Shape();
  stem.moveTo(0.3, 0.08);
  stem.lineTo(0.44, 0.08);
  stem.lineTo(0.44, 1.62);
  stem.lineTo(0.3, 1.62);
  stem.lineTo(0.3, 0.08);

  const flag = new Shape();
  flag.moveTo(0.3, 1.62);
  flag.bezierCurveTo(0.42, 1.2, 1.05, 1.18, 0.86, 0.52);
  flag.bezierCurveTo(1.18, 1.02, 0.66, 1.2, 0.44, 1.36);
  flag.lineTo(0.44, 1.62);
  flag.lineTo(0.3, 1.62);
  return [head, stem, flag];
}

export function createNote(kit: Kit) {
  const geometry = kit.keep(
    new ExtrudeGeometry(glyph(), {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: 3,
      curveSegments: 20,
    }),
  );
  geometry.center();

  const accent = kit.glow(ACCENT, ACCENT, 1.1);
  const amber = kit.glow(INK.amber, INK.amber, 0.8);
  const mesh = new Mesh(geometry, accent);

  const group = new Group();
  // Big enough to read from across the page: the catch is the point.
  mesh.scale.setScalar(1.35);
  group.add(mesh);
  group.visible = false;

  return {
    group,
    /** Most catches are amber, the colour of the cargo they join. */
    recolour(golden: boolean) {
      mesh.material = golden ? amber : accent;
    },
    /** Afloat: a bob and a slow turn. Carried: a gentle sway on the hook. */
    idle(t: number, afloat: boolean) {
      mesh.position.y = afloat ? Math.sin(t * 2.1) * 0.12 : 0;
      mesh.rotation.y = afloat ? t * 0.9 : Math.sin(t * 1.7) * 0.4;
      mesh.rotation.z = Math.sin(t * 1.3) * 0.12;
    },
  };
}
