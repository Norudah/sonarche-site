import gsap from "gsap";
import { Group, Vector3 } from "three";

import type { createRipples, RingSpec } from "../ripples";
import { WAKE } from "../ripples";
import { createCabin } from "./cabin";
import { createCargo, type Crate } from "./cargo";
import { createCrane, REST } from "./crane";
import { createHull, HULL } from "./hull";
import { createKit } from "./materials";
import { createNote } from "./note";
import { createShadows } from "./shadows";
import { createWaterline } from "./waterline";

/*
 * Sonarche, the vessel — the mascot, and what it does all day.
 *
 * It patrols the sea it was drawn in, stops, and fishes: a note surfaces off
 * the stern (the scene's pixels converge on it as it forms), the crane slews
 * out, pays out its cable, hooks the note, hauls it in over the rack and
 * lowers it into an open crate; the lid snaps shut, the band flares, the
 * portholes and the equalizer answer. When the four crates are full they go
 * down into the hold and come back up empty. Then it sails on.
 *
 * That loop is the landing's thesis — music taken out of the stream and
 * stowed where it is yours — acted out rather than said. The footer's weather
 * does not fish: at home the crates are full and the crane is stowed.
 *
 * Frames, outermost first: `sail` carries the patrol and the heading; `float`
 * the swell's heave; `body` the roll and pitch, and everything bolted on. The
 * crane's cable and the note hang in world space (`world`), outside all three.
 */

type BoatOptions = {
  ripples: ReturnType<typeof createRipples>;
  /** The scene's clock, for ripples spawned on the shared timeline. */
  now: () => number;
  /** Half the width of the patrol, world units; 0 keeps the boat on station. */
  patrol: number;
};

const TAU = Math.PI * 2;
/** A note breaking the surface: a small, bright ring. */
const SURFACE: RingSpec = { strength: 0.9, speed: 11, width: 1.6 };
/** Where the note is fished from, in the boat's frame: off the stern, on the camera's side. */
const SPOT = new Vector3(-8.1, 0.35, 3.7);
/** How high the hull rides: enough that the mark's dark boot-top shows above the water. */
const RIDE = 0.45;
/** The note hangs this far under the hook. */
const SLING = 0.8;

/** `angle`, wrapped to the turn nearest `from`: the crane slews the short way. */
function near(angle: number, from: number): number {
  let a = angle;
  while (a - from > Math.PI) a -= TAU;
  while (a - from < -Math.PI) a += TAU;
  return a;
}

export function createBoat({ ripples, now, patrol }: BoatOptions) {
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
  sail.add(water.foam);

  const world = new Group();
  world.add(crane.rigging, note.group);

  // Tweened by the choreography; read every frame.
  const travel = { x: 0, heading: 0, surfacing: 0 };
  const noteState = { afloat: false, carried: false };
  let kick = 0;
  let lastX = 0;
  let lastWake = 0;

  const ctx = gsap.context(() => {});
  const scratch = new Vector3();

  function stow(crate: Crate) {
    crate.filled = true;
    cabin.kick();
    kick = 0.6;
    gsap.fromTo(crate.band, { emissiveIntensity: 2.2 }, { emissiveIntensity: 0, duration: 1.6, ease: "power2.out" });
  }

  /** Four full crates go below and come back up empty. */
  function unload(tl: gsap.core.Timeline) {
    const groups = cargo.crates.map((c) => c.group.position);
    tl.to(groups, { y: HULL.deck - 1.3, duration: 0.9, ease: "power2.in", stagger: 0.12 }, "+=0.4")
      .call(() => cargo.crates.forEach((c) => (c.filled = false)))
      .to(groups, { y: HULL.deck + 0.5, duration: 0.8, ease: "back.out(1.6)", stagger: 0.12 }, "+=0.3");
  }

  function fish() {
    const crate = cargo.next();
    if (!crate) return sailOn();

    const spot = sail.localToWorld(
      SPOT.clone().add(new Vector3((Math.random() - 0.5) * 1.2, 0, (Math.random() - 0.5) * 0.8)),
    );
    const mouth = body.localToWorld(crate.mouth.clone());
    const out = crane.reach(spot, 2.4, body);
    const over = { ...out, slew: near(out.slew, crane.pose.slew) };
    const down = crane.reach(spot, SLING + 0.05, body).cable;
    // Measured from the fishing pose, so the slew in over the rack goes the
    // short way from where the boom will actually be.
    const aboard = crane.reach(mouth, 2.6, body);
    const slew = near(aboard.slew, over.slew);
    const home = { ...REST, slew: near(REST.slew, slew) };
    const into = crane.reach(mouth, SLING + 0.2, body).cable;
    const last = cargo.crates.every((c) => c.filled || c === crate);

    ctx.add(() => {
      const tl = gsap.timeline({ onComplete: sailOn });
      tl.call(() => {
        note.recolour(Math.random() < 0.75);
        note.group.position.set(spot.x, -1.6, spot.z);
        note.group.scale.setScalar(0.2);
        note.group.visible = true;
        noteState.afloat = true;
        ripples.spawn(spot.x, spot.z, now(), SURFACE);
      })
        .to(travel, { surfacing: 1, duration: 0.5 }, 0)
        .to(note.group.position, { y: spot.y, duration: 1.3, ease: "back.out(1.8)" }, 0.15)
        .to(note.group.scale, { x: 1, y: 1, z: 1, duration: 1.1, ease: "back.out(2)" }, 0.15)
        .to(travel, { surfacing: 0, duration: 1.2 }, 1.2)
        // Out over the water, then down to the note.
        .to(crane.pose, { ...over, duration: 1.5, ease: "power2.inOut" }, 0.5)
        .to(crane.pose, { cable: down, duration: 0.8, ease: "power1.inOut" }, 2.05)
        .call(() => {
          noteState.afloat = false;
          noteState.carried = true;
          ripples.spawn(spot.x, spot.z, now(), SURFACE);
        })
        .to(crane.pose, { cable: 1.4, duration: 0.9, ease: "power2.out" }, "+=0.15")
        // In over the rack, lid up, down into the crate.
        .to(crane.pose, { slew, luff: aboard.luff, cable: aboard.cable, duration: 1.6, ease: "power2.inOut" })
        .to(crate.lid.rotation, { x: -1.9, duration: 0.5, ease: "back.out(1.5)" }, "<0.6")
        .to(crane.pose, { cable: into, duration: 0.7, ease: "power1.inOut" }, ">0.3")
        .to(note.group.scale, { x: 0.05, y: 0.05, z: 0.05, duration: 0.3, ease: "power2.in" })
        .call(() => {
          noteState.carried = false;
          note.group.visible = false;
          stow(crate);
        })
        .to(crate.lid.rotation, { x: 0, duration: 0.5, ease: "bounce.out" })
        .to(crane.pose, { ...home, duration: 1.4, ease: "power2.inOut" }, "<0.1");
      if (last) unload(tl);
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

  function update(t: number, dt: number, look: { x: number; y: number }) {
    const ease = (period: number, phase = 0) => 0.5 - 0.5 * Math.cos(((t + phase) / period) * TAU);

    // Heading follows the patrol: the leading end swings a little towards the
    // camera, so a turn shows the vessel's length before it settles side-on.
    const vx = dt > 0 ? (travel.x - lastX) / dt : 0;
    lastX = travel.x;
    travel.heading += (Math.max(-0.4, Math.min(0.4, -vx * 0.16)) - travel.heading) * Math.min(1, dt * 1.5);
    sail.position.x = travel.x;
    sail.rotation.y = travel.heading + Math.sin((t / 11.7) * TAU) * 0.05;

    float.position.y = RIDE + 0.14 * ease(6.1) + kick * 0.18;
    body.rotation.z = (ease(7.4) * 2 - 1) * 0.024 + vx * 0.004;
    body.rotation.x = Math.sin((t / 5.3) * TAU) * 0.018 - kick * 0.03;

    cabin.update(t, dt, look);
    water.update(t);
    crane.update(dt);

    if (noteState.carried) {
      note.group.position.copy(crane.hookAt()).y -= SLING;
    }
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
    /** 0..1 while a note is forming: the scene's pixels stream to it. */
    surfacing: () => travel.surfacing,
    /** Where the pixels go: the note while it forms. */
    target: () => note.group.position,
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
      kit.dispose();
    },
  };
}
