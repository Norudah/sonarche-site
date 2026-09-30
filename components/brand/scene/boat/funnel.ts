import gsap from "gsap";
import { CircleGeometry, Color, CylinderGeometry, Group, Mesh, TorusGeometry, Vector3 } from "three";

import { COUGH, PUFF, SPARK, type createBursts, type BurstKind } from "../bursts";
import { INK, type Kit } from "./materials";
import { createNote, type Glyphs } from "./note";

/*
 * The funnel, where the mark had its wave: the vessel is a working boat now,
 * and what comes out of the top of it is the sound.
 *
 * A tug's stack, raked aft, oval, with the cargo's amber band round it. It
 * breathes a small puff every couple of seconds while the engine runs. When a
 * note is stowed it coughs one up: the stack sucks in, swells, and a little
 * note pops out of the mouth in a cloud, floats up wobbling, and bursts into
 * sparks. Every catch leaves a tune in the air.
 */

type FunnelOptions = {
  kit: Kit;
  glyphs: Glyphs;
  bursts: ReturnType<typeof createBursts>;
  now: () => number;
};

const HEIGHT = 1.15;
/** The puff every couple of seconds; the storm's wind takes it aft. */
const BREATH = [1.7, 2.6];
const ACCENT_SPARK: BurstKind = { ...SPARK, color: new Color("#8f96ff"), count: 16 };

export function createFunnel({ kit, glyphs, bursts, now }: FunnelOptions) {
  const group = new Group();

  const collar = new Mesh(kit.keep(new CylinderGeometry(0.46, 0.54, 0.14, 40)), kit.paint(INK.hull, 0.45));
  collar.position.y = 0.07;
  group.add(collar);

  // The stack, on its own pivot so it can squash and swell about its foot.
  const stack = new Group();
  stack.rotation.z = 0.14;
  stack.scale.z = 0.8;
  group.add(stack);

  const body = new Mesh(kit.keep(new CylinderGeometry(0.36, 0.42, HEIGHT, 48)), kit.paint(INK.strake, 0.4));
  body.position.y = HEIGHT / 2;
  const band = new Mesh(kit.keep(new CylinderGeometry(0.386, 0.392, 0.24, 48)), kit.paint(INK.amber, 0.4));
  band.position.y = 0.74;
  const rim = new Mesh(kit.keep(new TorusGeometry(0.35, 0.05, 14, 48)), kit.paint(INK.keel, 0.4));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = HEIGHT;
  const mouth = new Mesh(kit.keep(new CircleGeometry(0.32, 40)), kit.paint(INK.eye, 0.8));
  mouth.rotation.x = -Math.PI / 2;
  mouth.position.y = HEIGHT + 0.005;
  stack.add(body, band, rim, mouth);

  // The note it lets out, in world space once it is free.
  const note = createNote(kit, glyphs, 0.27);
  const flight = { active: false, age: 0, from: new Vector3() };

  const pump = { y: 1 };
  const ctx = gsap.context(() => {});
  const at = new Vector3();
  let nextBreath = BREATH[0];

  function top(out: Vector3) {
    return stack.localToWorld(out.set(0, HEIGHT + 0.15, 0));
  }

  return {
    group,
    /** The escaping note, for the scene's world-space layer. */
    note: note.group,
    /** A note is stowed: the stack gulps, swells and coughs one up. */
    toot() {
      ctx.add(() =>
        gsap
          .timeline()
          .to(pump, { y: 0.8, duration: 0.2, ease: "power2.in" })
          .to(pump, { y: 1.28, duration: 0.1, ease: "power2.out" })
          .call(() => {
            bursts.fire(top(at), now(), COUGH);
            note.dress(Math.random() < 0.6, Math.random() < 0.4);
            flight.from.copy(at);
            flight.age = 0;
            flight.active = true;
            note.group.visible = true;
          })
          .to(pump, { y: 1, duration: 0.8, ease: "elastic.out(1.2, 0.3)" }),
      );
    },
    update(t: number, dt: number) {
      const s = 1 / Math.sqrt(pump.y);
      stack.scale.set(s, pump.y, s * 0.8);

      if (t > nextBreath) {
        nextBreath = t + BREATH[0] + Math.random() * (BREATH[1] - BREATH[0]);
        bursts.fire(top(at), now(), PUFF);
      }

      if (!flight.active) return;
      flight.age += dt;
      const age = flight.age;
      // Up and away downwind, swaying the way a drawn note floats.
      note.group.position.set(
        flight.from.x - age * 0.55 + Math.sin(age * 5) * 0.16,
        flight.from.y + 2.1 * (1 - Math.exp(-age * 1.8)) + age * 0.35,
        flight.from.z + age * 0.1,
      );
      note.group.rotation.z = Math.sin(age * 5 + 1) * 0.3;
      note.group.scale.setScalar(Math.min(1, age * 5) * (1 + Math.sin(Math.min(1, age * 3) * Math.PI) * 0.25));
      note.idle(t, false);
      if (age > 1.8) {
        flight.active = false;
        note.group.visible = false;
        bursts.fire(note.group.position, now(), ACCENT_SPARK);
      }
    },
    dispose() {
      ctx.revert();
      note.dispose();
    },
  };
}
