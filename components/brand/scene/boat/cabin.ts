import {
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
import { INK, type Kit } from "./materials";

/*
 * The face of the thing — the mark's basket-handle cabin with its two eyes,
 * now a rounded body with screens for eyes, a row of portholes each side and a
 * lamp at the bow. The mark's wave has gone from its roof: in three
 * dimensions the sound is the notes it fishes, and the roof carries the funnel
 * they come out of (funnel.ts).
 *
 * The cabin's outline is the mark's HEAD path, taller in proportion: this is a
 * mascot's head now, and it carries the vessel's expression. The eyes are dark
 * glass with a glint that follows whatever it is looking at (the visitor's
 * cursor, or a note); they blink on the mark's own 6.8s. When a note is
 * stowed it is pleased with itself: the screens shut into two happy arcs,
 * ^^, and it blushes.
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

/** The happy eye: an arc, ∩, the shape a drawn face makes when it smiles with its eyes. */
function arc(): Shape {
  const [outer, inner, from] = [0.4, 0.23, 0.32];
  const s = new Shape();
  s.moveTo(Math.cos(from) * outer, Math.sin(from) * outer);
  s.absarc(0, 0, outer, from, Math.PI - from, false);
  s.absarc(Math.cos(Math.PI - from) * 0.315, Math.sin(Math.PI - from) * 0.315, 0.085, Math.PI - from, -from, false);
  s.absarc(0, 0, inner, Math.PI - from, from, true);
  s.absarc(Math.cos(from) * 0.315, Math.sin(from) * 0.315, 0.085, Math.PI + from, from, false);
  return s;
}

const DEPTH = 3;
const BEVEL = 0.18;
/** The cabin's face plane, where the eyes sit. */
const FACE = DEPTH / 2 + BEVEL;
/** Where the cabin stands on the deck: forward of amidships, to leave the crane a hold. */
export const CABIN_X = 1;
/** The roof's crown, over the deck. */
export const ROOF = (12 - 7.88) * 0.625 + BEVEL;
/** The bow lamp's mast, in the hull's frame. */
const MAST_X = 6.9;
const TAU = Math.PI * 2;

export function createCabin(kit: Kit) {
  const group = new Group();
  group.position.set(CABIN_X, HULL.deck, 0);

  const head = new Mesh(
    kit.smooth(
      new ExtrudeGeometry(headShape(), {
        depth: DEPTH,
        bevelEnabled: true,
        bevelThickness: BEVEL,
        bevelSize: BEVEL,
        bevelSegments: 6,
        curveSegments: 36,
      }).translate(0, 0, -DEPTH / 2),
    ),
    kit.paint(INK.cabin, 0.42),
  );
  group.add(head);

  // The brow the mark draws under the eyes, as a moulded band round the base.
  const band = new Mesh(
    kit.smooth(
      new ExtrudeGeometry(roundRect(0, 0.2, 4.95, 0.4, 0.16), {
        depth: DEPTH + 0.5,
        bevelEnabled: false,
        curveSegments: 12,
      }).translate(0, 0, -(DEPTH + 0.5) / 2),
    ),
    kit.paint(INK.brow, 0.5),
  );
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
  const smiles: Mesh[] = [];
  const cheeks: Mesh[] = [];
  const eyeGeometry = kit.smooth(
    new ExtrudeGeometry(roundRect(0, 0, 1.08, 1.2, 0.42), {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 5,
      curveSegments: 32,
    }),
  );
  const glintGeometry = kit.keep(new CircleGeometry(0.2, 40));
  const smileGeometry = kit.smooth(
    new ExtrudeGeometry(arc(), {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 32,
    }).translate(0, -0.2, 0),
  );
  const cheekGeometry = kit.keep(new CircleGeometry(0.2, 32));
  const blush = kit.glow("#f7c25c", "#efa831", 0.25);
  blush.transparent = true;
  blush.opacity = 0;
  blush.depthWrite = false;
  for (const x of [X(10), X(14)]) {
    const socket = new Group();
    socket.position.x = x;
    const pupil = new Mesh(eyeGeometry, glass);
    const glint = new Mesh(glintGeometry, glintInk);
    glint.position.z = 0.16;
    const smile = new Mesh(smileGeometry, glass);
    smile.scale.setScalar(0);
    const cheek = new Mesh(cheekGeometry, blush);
    cheek.position.set(Math.sign(x) * 0.28, -0.68, 0.012);
    cheek.scale.set(1.35, 0.7, 1);
    socket.add(pupil, glint, smile, cheek);
    eyes.add(socket);
    pupils.push(pupil);
    glints.push(glint);
    smiles.push(smile);
    cheeks.push(cheek);
  }
  group.add(eyes);

  // Portholes, four a side along the strake: a lavender ring round a lit pane.
  const ringGeometry = kit.keep(new TorusGeometry(0.3, 0.075, 16, 64));
  const paneGeometry = kit.keep(new CircleGeometry(0.27, 48));
  const ringInk = kit.paint(INK.cabin, 0.35);
  const panes: MeshStandardMaterial[] = [];
  const portholes = new Group();
  for (const side of [1, -1]) {
    [-5.1, -1.7, 1.7, 5.1].forEach((x, i) => {
      const { y, z } = sideAt(x, 0.34);
      // Both sides share a pane material, so the pair pulses as one.
      panes[i] ??= kit.glow(INK.rail, INK.rail, 0.6);
      const port = new Group();
      port.position.set(x - CABIN_X, y - HULL.deck, side * (z + 0.03));
      port.rotation.y = side === 1 ? 0 : Math.PI;
      port.add(new Mesh(ringGeometry, ringInk), new Mesh(paneGeometry, panes[i]));
      portholes.add(port);
    });
  }
  group.add(portholes);

  // The bow lamp, amber, on a short mast: it blinks, so the vessel is manned.
  const mast = new Mesh(kit.keep(new CylinderGeometry(0.06, 0.07, 1.3, 20)), kit.paint(INK.hull, 0.4));
  mast.position.set(MAST_X - CABIN_X, 0.65, 0);
  const lampInk = kit.glow(INK.amber, INK.amber, 1.2);
  const lamp = new Mesh(kit.keep(new SphereGeometry(0.17, 32, 20)), lampInk);
  lamp.position.set(MAST_X - CABIN_X, 1.38, 0);
  group.add(mast, lamp);

  let kick = 0;
  // The ^^: how long it has left, and the spring the arcs pop on.
  let pleased = 0;
  const joy = { v: 0, speed: 0 };

  return {
    group,
    /** A ping, or a note stowed: the portholes flare. */
    kick() {
      kick = 1;
    },
    /** A note stowed: ^^ for a moment. */
    happy() {
      pleased = 1.5;
    },
    /**
     * @param look the visitor's cursor, -1..1 each way, y up. At rest the eyes
     * are the logo's; the glints and, a little, the screens slide towards it.
     */
    update(t: number, dt: number, look: { x: number; y: number }) {
      const ease = (period: number, phase = 0) => 0.5 - 0.5 * Math.cos(((t + phase) / period) * TAU);

      pleased = Math.max(0, pleased - dt);
      const step = Math.min(dt, 1 / 30);
      joy.speed += (240 * ((pleased > 0 ? 1 : 0) - joy.v) - 16 * joy.speed) * step;
      joy.v += joy.speed * step;
      const shut = Math.min(1, Math.max(0, joy.v * 1.6));

      const blink = (t % 6.8) / 6.8;
      const blinking = blink > 0.92 ? 1 - 0.92 * Math.sin(((blink - 0.92) / 0.08) * Math.PI) : 1;
      const lx = Math.max(-1, Math.min(1, look.x));
      const ly = Math.max(-1, Math.min(1, look.y));
      pupils.forEach((p) => {
        p.position.set(lx * 0.08, ly * 0.06, 0);
        p.scale.y = Math.max(0.001, blinking * (1 - shut));
        p.visible = shut < 0.9;
      });
      glints.forEach((g) => {
        g.position.set(-0.22 + lx * 0.34, 0.24 + ly * 0.26, 0.16);
        g.scale.setScalar(Math.max(0.001, 1 - shut));
        g.visible = shut < 0.9;
      });
      smiles.forEach((s) => s.scale.setScalar(Math.max(0.001, joy.v)));
      cheeks.forEach((c) => (c.visible = joy.v > 0.02));
      blush.opacity = Math.min(1, Math.max(0, joy.v)) * 0.75;

      panes.forEach((m, i) => (m.emissiveIntensity = 0.35 + 0.5 * ease(2.8, -i * 0.7) + kick * 1.6));
      lampInk.emissiveIntensity = (t % 2.4) / 2.4 < 0.12 ? 2.4 : 0.35;

      kick = Math.max(0, kick - dt * 1.4);
    },
  };
}
