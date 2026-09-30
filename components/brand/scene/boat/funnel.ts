import gsap from "gsap";
import { CircleGeometry, CylinderGeometry, Group, Mesh, TorusGeometry, Vector3, type BufferGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { COUGH, PUFF, STEAM, type createBursts } from "../bursts";
import { INK, type Kit } from "./materials";

/*
 * The funnel — the vessel's engine, stood on the deck behind the head, not on
 * it: the head is a face, and a face with a chimney on it stops being one.
 *
 * A tug's stack, and a proper one: taller than the head, dead upright, a
 * straight cylinder, hooped, with the cargo's amber band and a sooty cap, on an engine casing
 * with louvres and a door. A brass whistle and a ladder up its flank say how
 * big it is. It breathes a puff every couple of seconds while the engine
 * runs. When the head has digested a note, the funnel sings it: the stack
 * sucks in, swells, the whistle blows, and the note pops out of the mouth in
 * a cloud, floats up and bursts into sparks.
 */

type FunnelOptions = {
  kit: Kit;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
  /** What comes out of the top: a note, from this point in the world. */
  sing: (from: Vector3) => void;
};

const CASING = { w: 1.75, h: 0.85, d: 1.75 };
const HEIGHT = 3.1;
const BOTTOM = 0.74;
const TOP = 0.74;
/** The puff every couple of seconds; the storm's wind takes it aft. */
const BREATH = [1.8, 2.8];

/** The stack's radius at height y up it. */
const radius = (y: number) => BOTTOM + (TOP - BOTTOM) * (y / HEIGHT);

function merge(pieces: BufferGeometry[]): BufferGeometry {
  const flat = pieces.map((g) => (g.index ? g.toNonIndexed() : g));
  const merged = mergeGeometries(flat);
  new Set([...pieces, ...flat]).forEach((g) => g.dispose());
  return merged;
}

export function createFunnel({ kit, bursts, now, sing }: FunnelOptions) {
  const group = new Group();
  const dark = kit.paint(INK.eye, 0.55);

  // --- The engine casing ---------------------------------------------------
  const casing = new Mesh(
    kit.keep(new RoundedBoxGeometry(CASING.w, CASING.h, CASING.d, 5, 0.14)),
    kit.paint(INK.hull, 0.45),
  );
  casing.position.y = CASING.h / 2;
  const slats = merge(
    Array.from({ length: 4 }, (_, i) =>
      new RoundedBoxGeometry(0.62, 0.05, 0.04, 2, 0.015).translate(0.42, 0.26 + i * 0.12, CASING.d / 2 + 0.01),
    ),
  );
  const louvres = new Mesh(kit.keep(slats), dark);
  const door = new Mesh(kit.keep(new RoundedBoxGeometry(0.42, 0.62, 0.05, 3, 0.06)), kit.paint(INK.cabin, 0.42));
  door.position.set(-0.4, 0.37, CASING.d / 2 + 0.01);
  const pane = new Mesh(kit.keep(new CircleGeometry(0.1, 28)), kit.glow(INK.rail, INK.rail, 0.5));
  pane.position.set(-0.4, 0.5, CASING.d / 2 + 0.04);
  group.add(casing, louvres, door, pane);

  // --- The stack, on its own pivot so it can squash and swell about its foot ---
  const stack = new Group();
  stack.position.y = CASING.h;
  group.add(stack);
  const oval = new Group();
  stack.add(oval);

  const body = new Mesh(kit.keep(new CylinderGeometry(TOP, BOTTOM, HEIGHT, 72)), kit.paint(INK.strake, 0.42));
  body.position.y = HEIGHT / 2;
  const band = new Mesh(
    kit.keep(new CylinderGeometry(radius(2.9) + 0.012, radius(2.3) + 0.012, 0.6, 72)),
    kit.paint(INK.amber, 0.4),
  );
  band.position.y = 2.6;
  const cap = new Mesh(
    kit.keep(new CylinderGeometry(TOP + 0.014, radius(2.9) + 0.014, HEIGHT - 2.9, 72)),
    kit.paint(INK.keel, 0.5),
  );
  cap.position.y = (HEIGHT + 2.9) / 2;
  const rim = new Mesh(kit.keep(new TorusGeometry(TOP, 0.07, 16, 72)), kit.paint(INK.keel, 0.4));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = HEIGHT;
  const mouth = new Mesh(kit.keep(new CircleGeometry(TOP - 0.02, 48)), kit.paint(INK.eye, 0.9));
  mouth.rotation.x = -Math.PI / 2;
  mouth.position.y = HEIGHT - 0.12;
  oval.add(body, band, cap, rim, mouth);

  // Riveted hoops round it, and cream pinstripes either side of the band.
  const hoopInk = kit.metal(INK.rail, 0.35);
  for (const y of [0.18, 1.2, 2.05]) {
    const hoop = new Mesh(kit.keep(new TorusGeometry(radius(y) + 0.02, 0.035, 10, 72)), hoopInk);
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = y;
    oval.add(hoop);
  }
  const stripeInk = kit.paint(INK.amberBand, 0.4);
  for (const y of [2.26, 2.94]) {
    const stripe = new Mesh(kit.keep(new TorusGeometry(radius(y) + 0.02, 0.028, 10, 72)), stripeInk);
    stripe.rotation.x = Math.PI / 2;
    stripe.position.y = y;
    oval.add(stripe);
  }

  // The whistle: a brass bell on a pipe, on the side facing the camera.
  const brass = kit.metal(INK.amber, 0.3);
  const whistle = new Group();
  whistle.position.set(0.18, 2.0, radius(2.0) + 0.08);
  const bell = new Mesh(kit.keep(new CylinderGeometry(0.07, 0.09, 0.32, 24)), brass);
  bell.position.y = 0.2;
  const pipe = new Mesh(kit.keep(new CylinderGeometry(0.03, 0.03, 0.4, 12)), brass);
  pipe.position.y = -0.1;
  whistle.add(bell, pipe);
  stack.add(whistle);

  // A ladder up its flank, standing off the plating.
  const rungs: BufferGeometry[] = [];
  const ladderX = -0.62;
  for (let i = 0; i < 11; i++) {
    const y = 0.35 + i * 0.22;
    rungs.push(new CylinderGeometry(0.018, 0.018, 0.3, 8).rotateZ(Math.PI / 2).translate(ladderX, y, 0.62));
  }
  for (const dx of [-0.15, 0.15]) {
    rungs.push(new CylinderGeometry(0.024, 0.024, 2.5, 8).translate(ladderX + dx, 1.5, 0.62));
  }
  const ladder = new Mesh(kit.keep(merge(rungs)), kit.metal(INK.glint, 0.3));
  ladder.rotation.y = 0.55;
  stack.add(ladder);

  const pump = { y: 1 };
  const ctx = gsap.context(() => {});
  const at = new Vector3();
  let nextBreath = BREATH[0];

  const top = (out: Vector3) => stack.localToWorld(out.set(0, HEIGHT + 0.2, 0));

  return {
    group,
    /** The head has digested a note: the stack gulps, swells, whistles and sings it. */
    toot() {
      ctx.add(() =>
        gsap
          .timeline()
          .to(pump, { y: 0.86, duration: 0.22, ease: "power2.in" })
          .call(() => bursts.fire(whistle.localToWorld(at.set(0, 0.4, 0)), now(), STEAM))
          .to(pump, { y: 1.14, duration: 0.12, ease: "power2.out" })
          .call(() => {
            bursts.fire(top(at), now(), COUGH);
            sing(top(at));
          })
          .to(pump, { y: 1, duration: 0.9, ease: "elastic.out(1.1, 0.3)" }),
      );
    },
    update(t: number) {
      const s = 1 / Math.sqrt(pump.y);
      stack.scale.set(s, pump.y, s);
      if (t > nextBreath) {
        nextBreath = t + BREATH[0] + Math.random() * (BREATH[1] - BREATH[0]);
        bursts.fire(top(at), now(), PUFF);
      }
    },
    dispose() {
      ctx.revert();
    },
  };
}
