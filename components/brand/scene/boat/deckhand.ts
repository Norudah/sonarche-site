import { CapsuleGeometry, CylinderGeometry, Group, Mesh, SphereGeometry } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { INK, type Kit } from "./materials";

/*
 * A deckhand: a little automaton, the vessel's crew, in its colours — a
 * lavender capsule of a body, a round head with a dark visor and two lit eyes
 * like the vessel's own, an antenna with an amber bulb, amber boots. Small
 * enough that a note is a load, big enough to read as someone.
 *
 * It only knows how to hold itself: walking (legs and arms swinging, a bob in
 * its step), carrying (arms up, the load over its head), posting (bent over,
 * arms forward), and standing about (breathing, looking round). Where it goes
 * and what it does is crew.ts's business. Its local +z is the way it faces.
 */

type Stance = "idle" | "carry" | "post" | "reach";

const ARMS: Record<Stance, number> = { idle: 0, carry: -2.85, post: -1.35, reach: -1.6 };

/** Its height against the boxes: a head shorter than the short ones. */
const SCALE = 1.3;

export function createDeckhand(kit: Kit) {
  const group = new Group();
  group.scale.setScalar(SCALE);
  const bodyInk = kit.paint(INK.cabin, 0.42);
  const limbInk = kit.paint(INK.rail, 0.42);
  const legInk = kit.paint(INK.hull, 0.45);
  const bootInk = kit.paint(INK.amber, 0.42);

  const torso = new Group();
  torso.position.y = 0.34;
  group.add(torso);
  const body = new Mesh(kit.keep(new CapsuleGeometry(0.15, 0.2, 8, 20)), bodyInk);
  body.position.y = 0.2;
  const belt = new Mesh(kit.keep(new CylinderGeometry(0.155, 0.155, 0.05, 20)), limbInk);
  belt.position.y = 0.08;

  const head = new Group();
  head.position.y = 0.55;
  const skull = new Mesh(kit.keep(new SphereGeometry(0.16, 24, 16)), bodyInk);
  const visor = new Mesh(kit.keep(new RoundedBoxGeometry(0.24, 0.12, 0.08, 3, 0.04)), kit.paint(INK.eye, 0.15));
  visor.position.set(0, 0.01, 0.13);
  const eyeInk = kit.glow(INK.glint, INK.glint, 1.2);
  const eyeGeometry = kit.keep(new SphereGeometry(0.022, 10, 8));
  const eyes = [-0.05, 0.05].map((x) => {
    const e = new Mesh(eyeGeometry, eyeInk);
    e.position.set(x, 0.015, 0.175);
    return e;
  });
  const stalk = new Mesh(kit.keep(new CylinderGeometry(0.012, 0.012, 0.16, 8)), legInk);
  stalk.position.y = 0.22;
  const bulbInk = kit.glow(INK.amber, INK.amber, 0.8);
  const bulb = new Mesh(kit.keep(new SphereGeometry(0.035, 12, 10)), bulbInk);
  bulb.position.y = 0.31;
  head.add(skull, visor, ...eyes, stalk, bulb);
  torso.add(body, belt, head);

  const armGeometry = kit.keep(new CapsuleGeometry(0.04, 0.24, 6, 12).translate(0, -0.16, 0));
  const handGeometry = kit.keep(new SphereGeometry(0.05, 12, 10));
  const arms = [-1, 1].map((side) => {
    const shoulder = new Group();
    shoulder.position.set(side * 0.19, 0.3, 0);
    const hand = new Mesh(handGeometry, bodyInk);
    hand.position.y = -0.32;
    shoulder.add(new Mesh(armGeometry, limbInk), hand);
    torso.add(shoulder);
    return shoulder;
  });

  const legGeometry = kit.keep(new CapsuleGeometry(0.05, 0.16, 6, 12).translate(0, -0.13, 0));
  const bootGeometry = kit.keep(new RoundedBoxGeometry(0.11, 0.07, 0.17, 2, 0.03));
  const legs = [-1, 1].map((side) => {
    const hip = new Group();
    hip.position.set(side * 0.075, 0.3, 0);
    const boot = new Mesh(bootGeometry, bootInk);
    boot.position.set(0, -0.27, 0.03);
    hip.add(new Mesh(legGeometry, legInk), boot);
    group.add(hip);
    return hip;
  });

  // What it carries is held here: over its head, or out in front when posting.
  const load = new Group();
  load.position.set(0, 1.32, 0);
  group.add(load);

  const state = { stance: "idle" as Stance, walking: 0, look: 0 };
  let arm = 0;
  let stride = 0;
  let bend = 0;

  return {
    group,
    load,
    state,
    update(t: number, dt: number, speed: number) {
      const k = Math.min(1, dt * 8);
      state.walking += ((speed > 0.05 ? 1 : 0) - state.walking) * k;
      stride += dt * (speed * 7 + 1);
      const swing = Math.sin(stride) * 0.55 * state.walking;

      legs[0].rotation.x = swing;
      legs[1].rotation.x = -swing;
      torso.position.y = 0.34 + Math.abs(Math.cos(stride)) * 0.03 * state.walking + Math.sin(t * 2.4) * 0.006;

      arm += (ARMS[state.stance] - arm) * k;
      const free = state.stance === "idle" ? 1 : 0;
      arms[0].rotation.x = arm - swing * 0.8 * free;
      arms[1].rotation.x = arm + swing * 0.8 * free;
      arms.forEach((a, i) => (a.rotation.z = (i ? -1 : 1) * (state.stance === "carry" ? 0.18 : 0.08)));

      bend += ((state.stance === "post" ? 0.42 : 0) - bend) * k;
      torso.rotation.x = bend;
      load.position.set(
        0,
        state.stance === "post" ? 0.55 : 1.32 + Math.abs(Math.cos(stride)) * 0.03 * state.walking,
        state.stance === "post" ? 0.42 : 0,
      );

      head.rotation.y += (state.look - head.rotation.y) * Math.min(1, dt * 4);
      head.rotation.x = -bend * 0.6 + (state.stance === "carry" ? -0.25 : 0);
      bulbInk.emissiveIntensity = 0.5 + Math.max(0, Math.sin(t * 3 + group.id)) * 1.2;
    },
  };
}
