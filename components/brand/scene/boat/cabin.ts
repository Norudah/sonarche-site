import gsap from "gsap";
import { CircleGeometry, ExtrudeGeometry, Group, Mesh, Shape, TorusGeometry, type MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { HULL, sideAt } from "./hull";
import { INK, type Kit } from "./materials";

/*
 * The face of the thing — the mark's basket-handle cabin with its two eyes,
 * now a rounded body with screens for eyes, in the middle of the deck, and a
 * row of portholes each side of the hull. The mark's wave has gone from its
 * roof: in three dimensions the sound is the notes it fishes.
 *
 * It is where the music goes. In the brow under its eyes there is a slot,
 * brass-framed like a letterbox; the deckhands post the notes through it.
 * The head gulps, its eyes run a scan down their screens while it works out
 * what it has been given, and then it is pleased: the portholes light up one
 * after another from the middle out, and it smiles with its eyes.
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
/** Where the cabin stands on the deck: amidships, the middle of the picture. */
export const CABIN_X = 0;
/** The roof's crown, over the deck. */
export const ROOF = (12 - 7.88) * 0.625 + BEVEL;
/** The letterbox in the brow, over the deck, and how far forward its face is. */
const SLOT = { y: 0.2, z: DEPTH / 2 + 0.25, w: 1.15, h: 0.2 };
/** The slot's mouth, in the boat's frame: where a note is posted. */
export const LETTERBOX = { x: CABIN_X, y: SLOT.y, z: SLOT.z };
const PORTHOLES = [-7.2, -4.3, -1.45, 1.45, 4.3, 7.2];
const TAU = Math.PI * 2;

export function createCabin(kit: Kit) {
  const group = new Group();
  group.position.set(CABIN_X, HULL.deck, 0);
  // The head proper, on its own pivot at its foot, so it can gulp.
  const face = new Group();
  group.add(face);

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
  face.add(head);

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
  face.add(band);

  // The letterbox: a dark slot in a brass frame, and a flap hinged at its top
  // that swings in when something is posted.
  const frame = new Mesh(
    kit.smooth(
      new ExtrudeGeometry(roundRect(0, 0, SLOT.w + 0.14, SLOT.h + 0.12, 0.08), {
        depth: 0.03,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 2,
        curveSegments: 12,
      }),
    ),
    kit.metal(INK.amber, 0.3),
  );
  frame.position.set(0, SLOT.y, SLOT.z);
  const hole = new Mesh(kit.keep(new CircleGeometry(1, 32)), kit.paint(INK.eye, 0.9));
  hole.scale.set(SLOT.w / 2, SLOT.h / 2, 1);
  hole.position.set(0, SLOT.y, SLOT.z + 0.05);
  const hinge = new Group();
  hinge.position.set(0, SLOT.y + SLOT.h / 2, SLOT.z + 0.07);
  const flap = new Mesh(
    kit.keep(new RoundedBoxGeometry(SLOT.w, SLOT.h + 0.02, 0.03, 3, 0.012)),
    kit.metal(INK.amber, 0.28),
  );
  flap.position.y = -(SLOT.h + 0.02) / 2;
  hinge.add(flap);
  face.add(frame, hole, hinge);

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
  const scans: Mesh[] = [];
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
  const scanGeometry = kit.keep(new RoundedBoxGeometry(0.86, 0.07, 0.02, 2, 0.02));
  const scanInk = kit.glow(INK.glint, INK.rail, 2.2);
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
    // The scan line that runs down the screen while it reads a note.
    const scan = new Mesh(scanGeometry, scanInk);
    scan.position.z = 0.15;
    scan.visible = false;
    socket.add(pupil, glint, smile, cheek, scan);
    eyes.add(socket);
    scans.push(scan);
    pupils.push(pupil);
    glints.push(glint);
    smiles.push(smile);
    cheeks.push(cheek);
  }
  face.add(eyes);

  // Portholes, six a side along the strake: a lavender ring round a lit pane.
  const ringGeometry = kit.keep(new TorusGeometry(0.3, 0.075, 16, 64));
  const paneGeometry = kit.keep(new CircleGeometry(0.27, 48));
  const ringInk = kit.paint(INK.cabin, 0.35);
  const panes: MeshStandardMaterial[] = [];
  const portholes = new Group();
  for (const side of [1, -1]) {
    PORTHOLES.forEach((x, i) => {
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

  let kick = 0;
  // Tweened by `post`, read every frame.
  const mouth = { open: 0 };
  const gulp = { y: 1 };
  const reading = { v: -1 };
  // A light running out along the portholes from the middle: the library taking it in.
  let wave = -1;
  const ctx = gsap.context(() => {});
  // The ^^: how long it has left, and the spring the arcs pop on.
  let pleased = 0;
  const joy = { v: 0, speed: 0 };

  return {
    group,
    dispose() {
      ctx.revert();
    },
    /** A ping, or a note stowed: the portholes flare. */
    kick() {
      kick = 1;
    },
    /** Pleased: ^^ for a moment. */
    happy() {
      pleased = 1.5;
    },
    /** Something is coming to the letterbox: the flap swings in. */
    open() {
      ctx.add(() => gsap.to(mouth, { open: 1, duration: 0.25, ease: "back.out(2)" }));
    },
    /**
     * It has been posted: the flap snaps shut, the head gulps, reads it, and
     * is pleased. `then` when it is done reading.
     */
    swallow(then: () => void) {
      ctx.add(() =>
        gsap
          .timeline()
          .to(mouth, { open: 0, duration: 0.3, ease: "bounce.out" })
          .to(gulp, { y: 0.9, duration: 0.12, ease: "power2.in" }, 0.05)
          .to(gulp, { y: 1, duration: 0.6, ease: "elastic.out(1.2, 0.35)" })
          .fromTo(reading, { v: 0 }, { v: 1, duration: 0.5, ease: "none", repeat: 1 }, 0.3)
          .call(() => {
            reading.v = -1;
            pleased = 1.6;
            wave = 0;
            then();
          }),
      );
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

      hinge.rotation.x = -mouth.open * 1.35;
      face.scale.set(1 / Math.sqrt(gulp.y), gulp.y, 1 / Math.sqrt(gulp.y));
      scans.forEach((sc) => {
        sc.visible = reading.v >= 0 && shut < 0.5;
        sc.position.y = 0.5 - reading.v;
      });

      if (wave >= 0) wave += dt;
      const middle = (PORTHOLES.length - 1) / 2;
      panes.forEach((m, i) => {
        const lit = wave >= 0 ? Math.max(0, 1 - Math.abs(wave * 5 - Math.abs(i - middle)) * 0.8) : 0;
        m.emissiveIntensity = 0.35 + 0.5 * ease(2.8, -i * 0.7) + kick * 1.6 + lit * 2.4;
      });
      if (wave > 1.5) wave = -1;

      kick = Math.max(0, kick - dt * 1.4);
    },
  };
}
