import gsap from "gsap";
import { Group, Mesh, SphereGeometry, Vector3 } from "three";

import { SPARK, SPRAY, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import { WAKE } from "../ripples";
import { createCabin } from "./cabin";
import { createCargo, SLOTS_PER_CONTAINER, type Container } from "./cargo";
import { createCrane, REST } from "./crane";
import { createHull, HULL } from "./hull";
import { ACCENT, createKit } from "./materials";
import { createNote } from "./note";
import { createShadows } from "./shadows";
import { createWaterline } from "./waterline";

/*
 * Sonarche, the vessel — the mascot, and what it does all day.
 *
 * It arrives by dropping out of the sky into the sea it was drawn in: a fall,
 * a splash, a dip under its own waterline and a few damped bobs back up, the
 * hull squashing a little on impact like the toy it is. Then it patrols,
 * stops, and fishes: a note condenses out of the sea's pixels and pops up in a
 * spray; the crane slews out, pays out its cable, hooks it (the note stretches
 * as it is yanked), hauls it over the containers, the roof swings open, the
 * note is lowered inside, the roof closes on it and a light over the doors
 * comes on in a shower of sparks. When both containers are full, their lights
 * travel along the deck into the sealed container at the bow — the archive —
 * and the pair is empty again. Then it sails on.
 *
 * Nothing appears or vanishes without a cause on screen: that was the brief.
 *
 * Frames, outermost first: `sail` carries the patrol, the heading and the
 * foam; `float` the heave (and the drop); `body` the roll, the pitch, the
 * squash and everything bolted on. The crane's cable and the note hang in
 * world space (`world`), outside all three.
 */

type BoatOptions = {
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  /** The scene's clock, for ripples and bursts spawned on the shared timeline. */
  now: () => number;
  /** Half the width of the patrol, world units; 0 keeps the boat on station. */
  patrol: number;
  /** Home from the voyage: the containers full, every light on. */
  laden: boolean;
};

const TAU = Math.PI * 2;
/** A note breaking the surface: a small, bright ring. */
const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };
/** The hull landing: the loudest ring the sea makes. */
const SPLASH: RingSpec = { strength: 1.6, speed: 20, width: 3 };
/** Where the note is fished from, in the boat's frame: off the stern, on the camera's side. */
const SPOT = new Vector3(-8.1, 0.35, 3.7);
/** How high the hull rides: enough that the mark's dark boot-top shows above the water. */
const RIDE = 0.45;
/** The note hangs this far under the hook. */
const SLING = 0.75;
/** Where the drop starts, above the water: low enough that the crane never crosses the copy. */
const DROP_FROM = 3.6;
const GRAVITY = -34;

/** `angle`, wrapped to the turn nearest `from`: the crane slews the short way. */
function near(angle: number, from: number): number {
  let a = angle;
  while (a - from > Math.PI) a -= TAU;
  while (a - from < -Math.PI) a += TAU;
  return a;
}

export function createBoat({ ripples, bursts, now, patrol, laden }: BoatOptions) {
  const kit = createKit();

  const sail = new Group();
  const float = new Group();
  const body = new Group();
  sail.add(float);
  float.add(body);

  const cabin = createCabin(kit);
  const cargo = createCargo(kit);
  const crane = createCrane(kit);
  const note = createNote(kit);
  const water = createWaterline(kit, RIDE);
  body.add(...createHull(kit), cabin.group, cargo.group, crane.group);
  const shadows = createShadows(kit, body);
  if (laden) {
    for (const c of cargo.stern) {
      c.stored = SLOTS_PER_CONTAINER;
      c.lights.forEach((ink) => {
        ink.color.set("#8f96ff");
        ink.emissiveIntensity = 1.8;
      });
    }
  }
  sail.add(water.foam);

  const world = new Group();
  world.add(crane.rigging, note.group);

  // The archive's couriers: one glowing orb per light, carried to the bow.
  const orbGeometry = kit.keep(new SphereGeometry(0.11, 20, 14));
  const orbInk = kit.glow(ACCENT, ACCENT, 2);
  const orbs = cargo.stern.flatMap(() =>
    Array.from({ length: SLOTS_PER_CONTAINER }, () => {
      const orb = new Mesh(orbGeometry, orbInk);
      orb.visible = false;
      body.add(orb);
      return orb;
    }),
  );

  // Tweened by the choreography; read every frame.
  const travel = { x: 0, heading: 0, surfacing: 0 };
  const noteState = { afloat: false, carried: false };
  // The drop: height over the ride line and its speed; `settle` blends the idle swell back in.
  const drop = { active: false, falling: false, y: 0, v: 0, settle: 1 };
  const squash = { y: 1, v: 0 };
  let kick = 0;
  let lastX = 0;
  let lastWake = 0;

  const ctx = gsap.context(() => {});
  const scratch = new Vector3();

  function stow(container: Container) {
    const i = container.stored;
    container.stored += 1;
    cabin.kick();
    kick = 0.5;
    const lamp = container.lights[i];
    lamp.color.set("#8f96ff");
    ctx.add(() => gsap.fromTo(lamp, { emissiveIntensity: 5 }, { emissiveIntensity: 1.8, duration: 0.6 }));
    bursts.fire(body.localToWorld(container.lamp(i)), now(), SPARK);
  }

  /** Both full: every light is carried along the deck into the archive at the bow. */
  function archive(tl: gsap.core.Timeline) {
    const target = cargo.bow.lamp(1);
    cargo.stern.forEach((c, ci) => {
      c.lights.forEach((ink, i) => {
        const orb = orbs[ci * SLOTS_PER_CONTAINER + i];
        const from = c.lamp(i);
        const arc = { p: 0 };
        tl.call(
          () => {
            orb.visible = true;
            orb.position.copy(from);
            ink.emissiveIntensity = 0;
            ink.color.set("#2e3172");
          },
          [],
          ">-0.8",
        ).to(arc, {
          p: 1,
          duration: 1.1,
          ease: "power1.inOut",
          onUpdate: () => {
            orb.position.lerpVectors(from, target, arc.p);
            orb.position.y += Math.sin(arc.p * Math.PI) * 2.2;
          },
          onComplete: () => {
            orb.visible = false;
            cabin.kick();
            bursts.fire(body.localToWorld(target.clone()), now(), SPARK);
            ctx.add(() =>
              gsap.fromTo(cargo.bow.lights, { emissiveIntensity: 5 }, { emissiveIntensity: 1.8, duration: 0.5 }),
            );
          },
        });
      });
      tl.call(() => {
        c.stored = 0;
      });
    });
  }

  function fish() {
    const container = cargo.next();
    if (!container) return sailOn();

    const spot = sail.localToWorld(
      SPOT.clone().add(new Vector3((Math.random() - 0.5) * 1.2, 0, (Math.random() - 0.5) * 0.8)),
    );
    const inside = body.localToWorld(container.floor.clone().add(new Vector3(0, 0.45, 0)));
    const out = crane.reach(spot, 2.4, body);
    const over = { ...out, slew: near(out.slew, crane.pose.slew) };
    const down = crane.reach(spot, SLING + 0.05, body).cable;
    const above = crane.reach(inside, 3.1, body);
    const slew = near(above.slew, over.slew);
    const into = crane.reach(inside, SLING, body).cable;
    const home = { ...REST, slew: near(REST.slew, slew) };
    const last =
      container.stored === SLOTS_PER_CONTAINER - 1 &&
      cargo.stern.every((c) => c === container || c.stored >= SLOTS_PER_CONTAINER);

    ctx.add(() => {
      const tl = gsap.timeline({ onComplete: sailOn });
      tl.call(() => {
        note.dress(Math.random() < 0.85, Math.random() < 0.35);
        note.group.position.set(spot.x, -1.2, spot.z);
        note.group.scale.setScalar(0.3);
        note.group.visible = true;
        noteState.afloat = true;
        ripples.spawn(spot.x, spot.z, now(), SURFACE);
      })
        .to(travel, { surfacing: 1, duration: 0.4 }, 0)
        .call(() => bursts.fire(spot, now(), SPRAY), [], 0.45)
        .to(note.group.position, { y: spot.y, duration: 1.1, ease: "back.out(2.2)" }, 0.4)
        .to(note.group.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "elastic.out(1, 0.5)" }, 0.4)
        .to(travel, { surfacing: 0, duration: 1 }, 1.3)
        // Out over the water, then down to the note.
        .to(crane.pose, { ...over, duration: 1.5, ease: "power2.inOut" }, 0.6)
        .to(crane.pose, { cable: down, duration: 0.8, ease: "power1.inOut" }, 2.15)
        .call(() => {
          noteState.afloat = false;
          noteState.carried = true;
          ripples.spawn(spot.x, spot.z, now(), SURFACE);
          bursts.fire(spot, now(), SPRAY);
        })
        // Yanked out: the note stretches, then settles.
        .fromTo(note.squash, { y: 1.3 }, { y: 1, duration: 0.9, ease: "elastic.out(1.2, 0.35)" }, "<")
        .to(crane.pose, { cable: 1.4, duration: 0.9, ease: "power2.out" }, "<0.1")
        // In over the container; the roof swings open ahead of it.
        .to(crane.pose, { slew, luff: above.luff, cable: above.cable, duration: 1.6, ease: "power2.inOut" })
        .to(container.hatch, { open: 1, duration: 0.6, ease: "back.out(1.4)" }, "<0.5")
        .to(crane.pose, { cable: into, duration: 0.9, ease: "power1.inOut" }, ">0.2")
        .call(() => {
          noteState.carried = false;
        })
        .to(crane.pose, { cable: above.cable, duration: 0.6, ease: "power2.in" })
        .to(container.hatch, { open: 0, duration: 0.55, ease: "bounce.out" }, "<0.15")
        .call(
          () => {
            note.group.visible = false;
            stow(container);
          },
          [],
          ">-0.3",
        )
        .to(crane.pose, { ...home, duration: 1.4, ease: "power2.inOut" }, ">0.1");
      if (last) archive(tl);
    });
  }

  function sailOn() {
    ctx.add(() => {
      const to = patrol ? (travel.x > 0 ? -1 : 1) * patrol * (0.55 + Math.random() * 0.45) : 0;
      gsap
        .timeline({ onComplete: fish })
        .to(travel, { x: to, duration: 3.6 + Math.abs(to - travel.x) * 0.25, ease: "sine.inOut" })
        .to({}, { duration: 0.6 });
    });
  }

  /** The drop's physics: free fall, then a damped spring about the ride line. */
  function fall(dt: number) {
    if (!drop.active) return;
    if (drop.falling) {
      drop.v += GRAVITY * dt;
      drop.y += drop.v * dt;
      if (drop.y > 0) return;
      // Impact: spray both sides and off each end, the loudest ring, a squash.
      drop.falling = false;
      const x = sail.position.x;
      ripples.spawn(x, 0, now(), SPLASH);
      for (const [dx, z] of [
        [0, -2.8],
        [0, 2.8],
        [-6, 2],
        [6, 2],
      ]) {
        bursts.fire(scratch.set(x + dx, 0.2, z), now(), SPRAY);
      }
      squash.v = -3.2;
      cabin.kick();
      kick = 1;
      drop.v *= 0.35;
      return;
    }
    // Buoyancy: pushed back up in proportion to how far under it is, damped by the water.
    drop.v += (-70 * drop.y - 6 * drop.v) * dt;
    drop.y += drop.v * dt;
    if (Math.abs(drop.y) < 0.004 && Math.abs(drop.v) < 0.02) drop.active = false;
  }

  function update(t: number, dt: number, look: { x: number; y: number }) {
    const ease = (period: number, phase = 0) => 0.5 - 0.5 * Math.cos(((t + phase) / period) * TAU);

    // Heading follows the patrol: the leading end swings a little towards the
    // camera, so a turn shows the vessel's length before it settles side-on.
    const vx = dt > 0 ? (travel.x - lastX) / dt : 0;
    lastX = travel.x;
    travel.heading += (Math.max(-0.4, Math.min(0.4, -vx * 0.16)) - travel.heading) * Math.min(1, dt * 1.5);
    sail.position.x = travel.x;
    sail.rotation.y = travel.heading + Math.sin((t / 11.7) * TAU) * 0.05;

    fall(Math.min(dt, 1 / 30));
    drop.settle += ((drop.active ? 0 : 1) - drop.settle) * Math.min(1, dt * 1.2);
    float.position.y = RIDE + drop.y + (0.14 * ease(6.1) + kick * 0.18) * drop.settle;

    // Squash and stretch about the keel, on a stiff spring.
    squash.v += (-160 * (squash.y - 1) - 9 * squash.v) * Math.min(dt, 1 / 30);
    squash.y += squash.v * Math.min(dt, 1 / 30);
    body.scale.set(1 / Math.sqrt(squash.y), squash.y, 1 / Math.sqrt(squash.y));

    // Nose down in the fall, a nod on landing.
    const diving = drop.active && drop.falling ? Math.min(1, -drop.v / 20) : 0;
    body.rotation.z = (ease(7.4) * 2 - 1) * 0.024 + vx * 0.004;
    body.rotation.x =
      Math.sin((t / 5.3) * TAU) * 0.018 - kick * 0.03 + diving * 0.12 + (drop.active ? drop.v * 0.01 : 0);

    cabin.update(t, dt, look);
    water.update(t);
    water.foam.visible = !(drop.active && drop.falling);
    crane.update(dt);
    cargo.swing();

    if (noteState.carried) note.group.position.copy(crane.hookAt()).y -= SLING;
    note.idle(t, noteState.afloat);

    // A wake off the stern while under way.
    if (Math.abs(vx) > 0.25 && t - lastWake > 0.22) {
      lastWake = t;
      body.localToWorld(scratch.set(Math.sign(vx) * -HULL.halfLength, 0, 0));
      ripples.spawn(scratch.x, scratch.z, now(), WAKE);
    }

    kick = Math.max(0, kick - dt * 1.6);
  }

  return {
    group: sail,
    /** World-space parts: the crane's cable and hook, and the note. */
    world,
    update,
    /** The boat's place on the water, for the berth the sea calms around it. */
    x: () => sail.position.x,
    /** 0..1 while a note is forming: the scene's pixels swirl into it. */
    surfacing: () => travel.surfacing,
    /** Where the pixels go: the note while it forms. */
    target: () => note.group.position,
    /** Out of sight until it drops. */
    hide() {
      sail.visible = false;
    },
    /** Arrival: from above the frame's sea into the water, with a splash. */
    drop() {
      sail.visible = true;
      Object.assign(drop, { active: true, falling: true, y: DROP_FROM, v: -4, settle: 0 });
      ctx.add(() =>
        gsap.fromTo(sail.scale, { x: 0.7, y: 0.7, z: 0.7 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: "back.out(2)" }),
      );
    },
    /** The ark answers a ping: a lift, a nod, portholes and sound flaring. */
    ping() {
      cabin.kick();
      kick = 1;
    },
    /** Starts the fishing: a first catch, then the patrol. */
    work() {
      fish();
    },
    dispose() {
      ctx.revert();
      water.dispose();
      shadows.dispose();
      note.dispose();
      kit.dispose();
    },
  };
}
