import {
  CapsuleGeometry,
  CircleGeometry,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  Shape,
  SphereGeometry,
  TorusGeometry,
  type MeshStandardMaterial,
} from "three";

import { HULL, sideAt } from "./hull";
import { ACCENT, INK, type Kit } from "./materials";

/*
 * The face of the thing — the mark's basket-handle cabin with its two eyes,
 * now a rounded body with screens for eyes, the equalizer on its roof, a row
 * of portholes each side and a lamp at the bow.
 *
 * The cabin's outline is the mark's HEAD path, taller in proportion: this is a
 * mascot's head now, and it carries the vessel's expression. The eyes are dark
 * glass with a glint that follows the visitor's cursor (see Face.look); they
 * blink on the mark's own 6.8s.
 */

const W = 0.511;
const H = 0.625;
const X = (x: number) => (x - 12) * W;
const Y = (y: number) => (12 - y) * H;

// M7.5 12V9.75C7.5 8.85 8.4 8.2 9.7 8 10.5 7.88 13.5 7.88 14.3 8 15.6 8.2 16.5 8.85 16.5 9.75V12Z
function headShape(): Shape {
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

function roundRect(cx: number, cy: number, w: number, h: number, r: number): Shape {
  const [l, rt, b, t] = [cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2];
  const s = new Shape();
  s.moveTo(l + r, b);
  s.lineTo(rt - r, b);
  s.quadraticCurveTo(rt, b, rt, b + r);
  s.lineTo(rt, t - r);
  s.quadraticCurveTo(rt, t, rt - r, t);
  s.lineTo(l + r, t);
  s.quadraticCurveTo(l, t, l, t - r);
  s.lineTo(l, b + r);
  s.quadraticCurveTo(l, b, l + r, b);
  return s;
}

const DEPTH = 3;
const BEVEL = 0.18;
/** The cabin's face plane, where the eyes sit. */
const FACE = DEPTH / 2 + BEVEL;
/** The equalizer's six bars, the Onde's heights (px on a 320px ark). */
const ONDE = [
  { height: 10, delay: -0.1 },
  { height: 18, delay: -0.35 },
  { height: 26, delay: -0.6 },
  { height: 16, delay: -0.2 },
  { height: 22, delay: -0.5 },
  { height: 12, delay: -0.75 },
];
const TAU = Math.PI * 2;

export function createCabin(kit: Kit) {
  const group = new Group();
  group.position.y = HULL.deck;

  const head = new Mesh(
    kit.keep(
      new ExtrudeGeometry(headShape(), {
        depth: DEPTH,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 6,
        curveSegments: 28,
      }).translate(0, 0, -DEPTH / 2),
    ),
    kit.paint(INK.cabin, 0.42),
  );
  group.add(head);

  // The brow the mark draws under the eyes, as a moulded band round the base.
  const band = new Mesh(
    kit.keep(new ExtrudeGeometry(roundRect(0, 0.2, 4.95, 0.4, 0.16), { depth: DEPTH + 0.5, bevelEnabled: false })),
    kit.paint(INK.brow, 0.5),
  );
  band.geometry.translate(0, 0, -(DEPTH + 0.5) / 2);
  group.add(band);

  // The eyes: dark glass screens, a hair proud of the face.
  const eyeY = Y(10.05);
  const glass = kit.paint(INK.eye, 0.12);
  glass.metalness = 0.25;
  const glintInk = kit.glow(INK.glint, INK.glint, 1.1);
  const eyes = new Group();
  eyes.position.set(0, eyeY, FACE);
  const pupils: Mesh[] = [];
  const glints: Mesh[] = [];
  const eyeGeometry = kit.keep(
    new ExtrudeGeometry(roundRect(0, 0, 1.08, 1.2, 0.42), {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
      curveSegments: 16,
    }),
  );
  const glintGeometry = kit.keep(new CircleGeometry(0.2, 24));
  for (const x of [X(10), X(14)]) {
    const socket = new Group();
    socket.position.x = x;
    const pupil = new Mesh(eyeGeometry, glass);
    const glint = new Mesh(glintGeometry, glintInk);
    glint.position.z = 0.16;
    socket.add(pupil, glint);
    eyes.add(socket);
    pupils.push(pupil);
    glints.push(glint);
  }
  group.add(eyes);

  // The equalizer on the roof: six bars of sound, the accent, lit from inside.
  const roof = Y(7.88) + BEVEL;
  const ondeInk = kit.glow(ACCENT, ACCENT, 0.55);
  const onde = new Group();
  onde.position.set(0, roof + 0.3, 0);
  const bars = ONDE.map((bar, i) => {
    const h = (bar.height / 26) * 0.95;
    const g = new Group();
    g.position.x = (i - 2.5) * 0.27;
    const capsule = new Mesh(kit.keep(new CapsuleGeometry(0.085, h, 6, 12)), ondeInk);
    capsule.position.y = h / 2 + 0.085;
    g.add(capsule);
    onde.add(g);
    return { group: g, delay: bar.delay };
  });
  group.add(onde);

  // Portholes, four a side along the strake: a lavender ring round a lit pane.
  const ringGeometry = kit.keep(new TorusGeometry(0.3, 0.075, 10, 32));
  const paneGeometry = kit.keep(new CircleGeometry(0.27, 28));
  const ringInk = kit.paint(INK.cabin, 0.35);
  const panes: MeshStandardMaterial[] = [];
  const portholes = new Group();
  for (const side of [1, -1]) {
    [-4.3, -1.45, 1.45, 4.3].forEach((x, i) => {
      const { y, z } = sideAt(x, 0.34);
      // Both sides share a pane material, so the pair pulses as one.
      panes[i] ??= kit.glow(INK.rail, INK.rail, 0.6);
      const port = new Group();
      port.position.set(x, y - HULL.deck, side * (z + 0.03));
      port.rotation.y = side === 1 ? 0 : Math.PI;
      port.add(new Mesh(ringGeometry, ringInk), new Mesh(paneGeometry, panes[i]));
      portholes.add(port);
    });
  }
  group.add(portholes);

  // The bow lamp, amber, on a short mast: it blinks, so the vessel is manned.
  const mast = new Mesh(kit.keep(new CylinderGeometry(0.06, 0.07, 1.3, 10)), kit.paint(INK.hull, 0.4));
  mast.position.set(5.7, 0.65, 0);
  const lampInk = kit.glow(INK.amber, INK.amber, 1.2);
  const lamp = new Mesh(kit.keep(new SphereGeometry(0.17, 16, 12)), lampInk);
  lamp.position.set(5.7, 1.38, 0);
  group.add(mast, lamp);

  let kick = 0;

  return {
    group,
    /** A ping, or a note stowed: the equalizer jumps and the portholes flare. */
    kick() {
      kick = 1;
    },
    /**
     * @param look the visitor's cursor, -1..1 each way, y up. At rest the eyes
     * are the logo's; the glints and, a little, the screens slide towards it.
     */
    update(t: number, dt: number, look: { x: number; y: number }) {
      const ease = (period: number, phase = 0) => 0.5 - 0.5 * Math.cos(((t + phase) / period) * TAU);

      const blink = (t % 6.8) / 6.8;
      eyes.scale.y = blink > 0.92 ? 1 - 0.92 * Math.sin(((blink - 0.92) / 0.08) * Math.PI) : 1;
      const lx = Math.max(-1, Math.min(1, look.x));
      const ly = Math.max(-1, Math.min(1, look.y));
      pupils.forEach((p) => p.position.set(lx * 0.08, ly * 0.06, 0));
      glints.forEach((g) => g.position.set(-0.22 + lx * 0.34, 0.24 + ly * 0.26, 0.16));

      bars.forEach(({ group: g, delay }) => {
        g.scale.y = Math.min(1.9, 0.3 + 0.7 * ease(0.9, delay) + kick * 0.9);
      });
      onde.position.x = Math.sin((t / 5.9) * TAU) * 0.05;

      panes.forEach((m, i) => (m.emissiveIntensity = 0.35 + 0.5 * ease(2.8, -i * 0.7) + kick * 1.6));
      lampInk.emissiveIntensity = (t % 2.4) / 2.4 < 0.12 ? 2.4 : 0.35;

      kick = Math.max(0, kick - dt * 1.4);
    },
  };
}
