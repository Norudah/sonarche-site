import gsap from "gsap";
import { Group, Vector3, type Vector4 } from "three";

import { SPRAY, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import { WAKE } from "../ripples";
import { CABIN_X, createCabin, ROOF } from "./cabin";
import { createCargo } from "./cargo";
import { CRANE_BASE, createCrane } from "./crane/crane";
import { createVoyage } from "./fishing";
import { createFunnel } from "./funnel";
import { createHull, HULL } from "./hull";
import { createKit } from "./materials";
import { createGlyphs, createNote } from "./note";
import { createShadows } from "./shadows";
import { createWaterline } from "./waterline";

/*
 * Sonarche, the vessel — the mascot, and how it carries itself.
 *
 * It arrives by dropping out of the sky into the sea it was drawn in: a fall,
 * a splash, a dip under its own waterline and a few damped bobs back up, the
 * hull squashing a little on impact like the toy it is. Then it works (see
 * fishing.ts): it hops when it spots something, looks at what it is fishing,
 * lists towards the load on its crane, and is pleased with itself after.
 *
 * Frames, outermost first: `sail` carries the patrol, the heading and the
 * foam; `float` the heave (and the drop); `body` the roll, the pitch, the
 * squash and everything bolted on. The crane's cable, the claw and the notes
 * hang in world space (`world`), outside all three.
 */

type BoatOptions = {
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  /** The scene's clock, for ripples and bursts spawned on the shared timeline. */
  now: () => number;
  /** Half the width of the patrol, world units; 0 keeps the boat on station. */
  patrol: number;
  /** Home from the voyage: the hold full, every light on. */
  laden: boolean;
};

const TAU = Math.PI * 2;
/** The hull landing: the loudest ring the sea makes. */
const SPLASH: RingSpec = { strength: 1.6, speed: 20, width: 3 };
/** How high the hull rides: enough that the mark's dark boot-top shows above the water. */
const RIDE = 0.45;
/** Where the drop starts, above the water: low enough that the crane never crosses the copy. */
const DROP_FROM = 3.6;
const GRAVITY = -34;
/** Where the eyes are, over the deck: what the gaze is measured from. */
const EYES_Y = 1.25;

export function createBoat({ ripples, bursts, now, patrol, laden }: BoatOptions) {
  const kit = createKit();

  const sail = new Group();
  const float = new Group();
  const body = new Group();
  sail.add(float);
  float.add(body);

  const glyphs = createGlyphs(kit);
  const cabin = createCabin(kit);
  const cargo = createCargo(kit);
  const crane = createCrane(kit);
  const funnel = createFunnel({ kit, glyphs, bursts, now });
  funnel.group.position.set(-0.55, ROOF - 0.1, 0);
  cabin.group.add(funnel.group);
  const note = createNote(kit, glyphs, 0.5);
  const water = createWaterline(kit, RIDE);
  body.add(...createHull(kit), cabin.group, cargo.group, crane.group);
  const shadows = createShadows(kit, body, [
    [CABIN_X, 0, 2.9, 1.95, 0],
    [CRANE_BASE.x, 0, 0.85, 0.85, 0],
    ...cargo.footprints,
  ]);
  if (laden) cargo.fill();
  sail.add(water.foam);

  const world = new Group();
  world.add(crane.rigging, note.group, funnel.note);

  // Tweened by the voyage; read every frame.
  const travel = { x: 0, heading: 0, surfacing: 0 };
  const catchState = { afloat: false, carried: false, watched: false, load: 0 };
  // The drop: height over the ride line and its speed; `settle` blends the idle swell back in.
  const drop = { active: false, falling: false, y: 0, v: 0, settle: 1 };
  const squash = { y: 1, v: 0 };
  // Where the eyes look: the cursor, or the catch, blended by `gaze`.
  const gaze = { on: 0, x: 0, y: 0 };
  // How much the sea keeps out of the way of the note in the water.
  let sighted = 0;
  const sightAt = new Vector3();
  let kick = 0;
  let lastX = 0;
  let lastWake = 0;

  const ctx = gsap.context(() => {});
  const scratch = new Vector3();
  const eyes = new Vector3();

  function hop(k: number) {
    kick = Math.max(kick, k);
    squash.v -= k * 2.2;
  }

  const voyage = createVoyage({
    kit,
    world,
    sail,
    body,
    cabin,
    cargo,
    crane,
    funnel,
    note,
    ripples,
    bursts,
    now,
    patrol,
    ride: RIDE,
    travel,
    catchState,
    hop,
  });

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
        [-6.8, 2],
        [6.8, 2],
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
    const step = Math.min(dt, 1 / 30);

    // Heading follows the patrol: the leading end swings a little towards the
    // camera, so a turn shows the vessel's length before it settles side-on.
    const vx = dt > 0 ? (travel.x - lastX) / dt : 0;
    lastX = travel.x;
    travel.heading += (Math.max(-0.4, Math.min(0.4, -vx * 0.16)) - travel.heading) * Math.min(1, dt * 1.5);
    sail.position.x = travel.x;
    sail.rotation.y = travel.heading + Math.sin((t / 11.7) * TAU) * 0.05;

    fall(step);
    drop.settle += ((drop.active ? 0 : 1) - drop.settle) * Math.min(1, dt * 1.2);
    float.position.y = RIDE + drop.y + (0.14 * ease(6.1) + kick * 0.18) * drop.settle;

    // Squash and stretch about the keel, on a stiff spring.
    squash.v += (-160 * (squash.y - 1) - 9 * squash.v) * step;
    squash.y += squash.v * step;
    body.scale.set(1 / Math.sqrt(squash.y), squash.y, 1 / Math.sqrt(squash.y));

    // A load on the crane heels the boat towards it: over the side, and down by the stern.
    let heel = 0;
    let trim = 0;
    if (catchState.load > 0) {
      body.worldToLocal(scratch.copy(crane.hookAt()));
      heel = Math.max(-1, Math.min(1, scratch.z / 4)) * 0.045 * catchState.load;
      trim = Math.max(-1, Math.min(1, -scratch.x / 12)) * 0.03 * catchState.load;
    }

    // Nose down in the fall, a nod on landing.
    const diving = drop.active && drop.falling ? Math.min(1, -drop.v / 20) : 0;
    body.rotation.z = (ease(7.4) * 2 - 1) * 0.024 + vx * 0.004 + trim;
    body.rotation.x =
      Math.sin((t / 5.3) * TAU) * 0.018 - kick * 0.03 + diving * 0.12 + (drop.active ? drop.v * 0.01 : 0) + heel;

    // The eyes: on the catch while there is one, on the visitor otherwise.
    gaze.on += ((catchState.watched ? 1 : 0) - gaze.on) * Math.min(1, dt * 3);
    if (gaze.on > 0.001) {
      note.group.getWorldPosition(scratch);
      body.localToWorld(eyes.set(CABIN_X, HULL.deck + EYES_Y, 0));
      gaze.x = Math.max(-1, Math.min(1, (scratch.x - eyes.x) / 6));
      gaze.y = Math.max(-1, Math.min(1, (scratch.y - eyes.y) / 3.5));
    }
    const sight = { x: look.x + (gaze.x - look.x) * gaze.on, y: look.y + (gaze.y - look.y) * gaze.on };

    sighted += ((catchState.afloat ? 1 : 0) - sighted) * Math.min(1, dt * 3);
    if (catchState.afloat) sightAt.copy(note.group.position).y -= note.top() * 0.7;

    cabin.update(t, dt, sight);
    funnel.update(t, dt);
    water.update(t);
    water.foam.visible = !(drop.active && drop.falling);
    crane.update(t, step);
    cargo.update(dt);
    note.idle(t, catchState.afloat);

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
    /** World-space parts: the crane's last run of cable and its claw, and the notes. */
    world,
    update,
    /** The boat's place on the water, for the berth the sea calms around it. */
    x: () => sail.position.x,
    /** 0..1 while a note is forming: the scene's pixels swirl into it. */
    surfacing: () => travel.surfacing,
    /** Where the pixels go: the note while it forms. */
    target: () => note.group.position,
    /** The note in the water, for the sea to keep its crests under: x, z, height to show, on. */
    sight(out: Vector4) {
      return out.set(sightAt.x, sightAt.z, sightAt.y, sighted);
    },
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
    /** The ark answers a ping: a lift, a nod, portholes flaring. */
    ping() {
      cabin.kick();
      kick = 1;
    },
    /** Starts the fishing: a first catch, then the patrol. */
    work() {
      voyage.start();
    },
    dispose() {
      voyage.dispose();
      funnel.dispose();
      ctx.revert();
      water.dispose();
      shadows.dispose();
      note.dispose();
      kit.dispose();
    },
  };
}
