import gsap from "gsap";
import { Group, Vector3, type Vector4 } from "three";

import { SPRAY, type BurstKind, type createBursts } from "../bursts";
import type { createRipples, RingSpec } from "../ripples";
import { WAKE } from "../ripples";
import { surfaceAt, type Sea } from "../swell";
import { CABIN_X, createCabin } from "./cabin";
import { createCargo } from "./cargo";
import { GRASP } from "./crane/claw";
import { CRANE_BASE, createCrane } from "./crane/crane";
import { createCrew } from "./crew";
import { createVoyage } from "./fishing";
import { createFunnel } from "./funnel";
import { createGlyphs } from "./glyphs";
import { createHull, HULL } from "./hull";
import { createKit } from "./materials";
import { createSwarm, type Note } from "./notes";
import { stow } from "./overflow";
import { createShadows } from "./shadows";
import { createTrawl, GANTRY } from "./trawl";
import { createWaterline } from "./waterline";

/*
 * Sonarche, the vessel — the mascot, and how it carries itself.
 *
 * It arrives by dropping out of the sky into the sea it was drawn in: a fall,
 * a splash, a dip under its own waterline and a few damped bobs back up, the
 * hull squashing on impact like the toy it is. That is the only time it
 * bounces. From then on it is a boat: it rides the swell the sea is drawn
 * with (swell.ts), lifting and falling with it, pitching and rolling to its
 * slopes, and it is always under way, steaming across the frame and back
 * with a wake astern and spray at the bow, fishing as it goes (fishing.ts):
 * a crane at the bow, a trawl off the stern. Two deckhands carry the catch to
 * the head (crew.ts); the funnel sings each note the head takes in. It looks
 * at what it is fishing, and heels a little to the load on its crane.
 *
 * Home from the voyage (the footer) it lies moored and full: every box
 * stuffed, notes on the deck, the odd one sliding off into the harbour
 * (overflow.ts).
 *
 * Frames, outermost first: `sail` carries the passage, the heading, the
 * water's height where it is and the foam; `float` the drop and the vessel's
 * size; `body` the roll, the pitch, the squash and everything bolted on. The
 * crane's last run of cable, its claw, the trawl and every note that is not
 * aboard live in world space (`world`), outside all three.
 */

type BoatOptions = {
  ripples: ReturnType<typeof createRipples>;
  bursts: ReturnType<typeof createBursts>;
  /** The scene's clock, for ripples and bursts spawned on the shared timeline. */
  now: () => number;
  /** How far either side of the middle it may steam, world units; 0 keeps it moored. */
  patrol: number;
  /** Home from the voyage: the hold full to overflowing. */
  laden: boolean;
  /** How many notes the sea keeps afloat around it. */
  shoal: number;
};

const TAU = Math.PI * 2;
/** The hull landing: the loudest ring the sea makes. */
const SPLASH: RingSpec = { strength: 1.6, speed: 20, width: 3 };
/** Spray thrown off the bow while under way. */
const BOW: BurstKind = { ...SPRAY, speed: 3.6, size: 4, count: 14, lift: 0.55 };
/** How high the hull rides: enough that the mark's dark boot-top shows above the water. */
const RIDE = 0.45;
/** The vessel's scale in the scene: a size up on the mark's proportions, so it holds the frame. */
const SIZE = 1.08;
/** Where the drop starts, above the water: low enough that the crane never crosses the copy. */
const DROP_FROM = 3.6;
const GRAVITY = -34;
/** Where the eyes are, over the deck: what the gaze is measured from. */
const EYES_Y = 1.25;
/** Where the swell is sampled for the pitch and the roll, in the boat's frame. */
const REACH = { length: 7, beam: 2.5 };

export function createBoat({ ripples, bursts, now, patrol, laden, shoal }: BoatOptions) {
  const kit = createKit();

  const sail = new Group();
  const float = new Group();
  const body = new Group();
  sail.add(float);
  float.add(body);
  float.scale.setScalar(SIZE);

  const sea: Sea = { time: 0, storm: 0, ark: 0 };
  const water = (x: number, z: number) => surfaceAt(x, z, sea);

  const glyphs = createGlyphs(kit);
  const swarm = createSwarm({ glyphs, bursts, ripples, now, water, population: shoal, reach: 34 });
  const cabin = createCabin(kit);
  const cargo = createCargo(kit);
  const crane = createCrane(kit, SIZE);
  const trawl = createTrawl(kit, SIZE);
  const funnel = createFunnel({ kit, bursts, now, sing: (from) => swarm.sing(from) });
  funnel.group.position.set(-3.45, HULL.deck, -0.75);
  const line = createWaterline(kit, RIDE / SIZE, SIZE);
  body.add(...createHull(kit, line.surface), cabin.group, cargo.group, crane.group, trawl.group, funnel.group);
  const shadows = createShadows(kit, body, [
    [CABIN_X, 0, 2.7, 1.95, 0],
    [CRANE_BASE.x, 0, 0.85, 0.85, 0],
    [GANTRY.x, -GANTRY.feet, 0.3, 0.3, 0],
    [GANTRY.x, GANTRY.feet, 0.3, 0.3, 0],
    [-3.45, -0.75, 1, 1, 0],
    ...cargo.footprints,
  ]);
  sail.add(line.foam);

  const world = new Group();
  world.add(crane.rigging, trawl.rigging, ...swarm.meshes, swarm.halos);

  // Tweened by the voyage; read every frame.
  const travel = { x: 0, heading: 0, surfacing: 0 };
  const focus = { note: null as Note | null, watched: false, load: 0 };
  // The trawl's catch on the deck, between the net and the crew.
  const landed: Note[] = [];
  // The drop: height over the ride line and its speed; `settle` blends the swell back in.
  const drop = { active: false, falling: false, y: 0, v: 0, settle: 1 };
  const squash = { y: 1, v: 0 };
  // Where the eyes look: the cursor, or the catch, blended by `gaze`.
  const gaze = { on: 0, x: 0, y: 0 };
  let roam = patrol;
  let landing = 0;
  let lastX = 0;
  let lastWake = 0;
  let lastSpray = 0;

  const ctx = gsap.context(() => {});
  const scratch = new Vector3();
  const eyes = new Vector3();
  const watching = { crane: new Vector3(), trawl: new Vector3() };

  const voyage = laden
    ? undefined
    : createVoyage({
        body,
        sail,
        cabin,
        cargo,
        crane,
        trawl,
        swarm,
        ripples,
        bursts,
        now,
        roam: () => roam,
        size: SIZE,
        water,
        travel,
        focus,
        landed,
      });
  const crew = laden
    ? undefined
    : createCrew({
        kit,
        body,
        cabin,
        cargo,
        funnel,
        swarm,
        bursts,
        now,
        landed,
        watch: { crane: () => watching.crane, trawl: () => watching.trawl },
      });
  const overflow = laden
    ? stow({ kit, body, cargo, swarm, bursts, now, claw: crane.holder, trawl, grasp: GRASP })
    : undefined;

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
        [0, -3],
        [0, 3],
        [-9, 2],
        [9, 2],
      ]) {
        bursts.fire(scratch.set(x + dx, sail.position.y + 0.2, z), now(), SPRAY);
      }
      squash.v = -3.2;
      cabin.kick();
      landing = 1;
      drop.v *= 0.35;
      return;
    }
    // Buoyancy: pushed back up in proportion to how far under it is, damped by the water.
    drop.v += (-70 * drop.y - 6 * drop.v) * dt;
    drop.y += drop.v * dt;
    if (Math.abs(drop.y) < 0.004 && Math.abs(drop.v) < 0.02) drop.active = false;
  }

  function update(t: number, dt: number, look: { x: number; y: number }, swell: Omit<Sea, "ark">) {
    const ease = (period: number, phase = 0) => 0.5 - 0.5 * Math.cos(((t + phase) / period) * TAU);
    const step = Math.min(dt, 1 / 30);
    sea.time = swell.time;
    sea.storm = swell.storm;
    sea.ark = sail.position.x;

    // Under way: the leading end swings a little towards the camera, so a turn
    // shows the vessel's length before it settles side-on, and it wanders a
    // degree or two off its course.
    const vx = dt > 0 ? (travel.x - lastX) / dt : 0;
    lastX = travel.x;
    travel.heading += (Math.max(-0.25, Math.min(0.25, -vx * 0.09)) - travel.heading) * Math.min(1, dt * 1.2);
    sail.position.x = travel.x;
    sail.rotation.y = travel.heading + Math.sin((t / 11.7) * TAU) * 0.035 + Math.sin((t / 4.3) * TAU) * 0.01;

    // Riding the swell: the water's height where it is, and its slopes along and across the hull.
    const x = sail.position.x;
    const level = water(x, 0);
    const along = (water(x + REACH.length, 0) - water(x - REACH.length, 0)) / (2 * REACH.length);
    const across = (water(x, REACH.beam) - water(x, -REACH.beam)) / (2 * REACH.beam);
    const settle = drop.settle;
    sail.position.y = level * settle;
    line.surface.constant = -sail.position.y;

    fall(step);
    drop.settle += ((drop.active ? 0 : 1) - drop.settle) * Math.min(1, dt * 1.2);
    float.position.y = RIDE + drop.y + (0.07 * ease(3.1) + landing * 0.18) * settle;

    // Squash and stretch about the keel, on a stiff spring: the landing only.
    squash.v += (-160 * (squash.y - 1) - 9 * squash.v) * step;
    squash.y += squash.v * step;
    body.scale.set(1 / Math.sqrt(squash.y), squash.y, 1 / Math.sqrt(squash.y));

    // A load on the crane heels the boat towards it: over the side, and down by the head.
    let heel = 0;
    let trim = 0;
    if (focus.load > 0) {
      body.worldToLocal(scratch.copy(crane.hookAt()));
      heel = Math.max(-1, Math.min(1, scratch.z / 4)) * 0.035 * focus.load;
      trim = Math.max(-1, Math.min(1, -scratch.x / 14)) * 0.02 * focus.load;
    }

    // Pitching and rolling: to the swell's slopes, a roll of its own, and a
    // bow that lifts a hair when it gets under way. Nose down in the fall.
    const diving = drop.active && drop.falling ? Math.min(1, -drop.v / 20) : 0;
    body.rotation.z =
      (Math.atan(along) * 1.4 + (ease(7.4) * 2 - 1) * 0.018) * settle +
      Math.max(-0.02, Math.min(0.02, -vx * 0.012)) +
      trim;
    body.rotation.x =
      (-Math.atan(across) * 1.4 + Math.sin((t / 5.3) * TAU) * 0.03) * settle +
      diving * 0.1 +
      (drop.active ? drop.v * 0.01 : 0) -
      landing * 0.026 +
      heel;

    // The eyes: on the catch while there is one, on the visitor otherwise.
    gaze.on += ((focus.watched && focus.note ? 1 : 0) - gaze.on) * Math.min(1, dt * 3);
    if (gaze.on > 0.001 && focus.note) {
      swarm.where(focus.note, scratch);
      body.localToWorld(eyes.set(CABIN_X, HULL.deck + EYES_Y, 0));
      gaze.x = Math.max(-1, Math.min(1, (scratch.x - eyes.x) / 7));
      gaze.y = Math.max(-1, Math.min(1, (scratch.y - eyes.y) / 4));
    }
    const sight = { x: look.x + (gaze.x - look.x) * gaze.on, y: look.y + (gaze.y - look.y) * gaze.on };

    cabin.update(t, dt, sight);
    funnel.update(t);
    line.update(t);
    line.foam.visible = !(drop.active && drop.falling);
    cargo.update(dt);
    crane.update(t, step);
    trawl.update(t, step, body, water);
    watching.crane.copy(crane.hookAt());
    trawl.mouth(watching.trawl);
    crew?.update(t, dt);
    overflow?.update(t, dt);
    swarm.follow(sail.position.x);
    swarm.update(t, step);

    // Under way: a wake off the trailing end, spray off the leading one.
    const moving = Math.abs(vx) > 0.25;
    if (moving && t - lastWake > 0.22) {
      lastWake = t;
      body.localToWorld(scratch.set(Math.sign(vx) * -HULL.halfLength, 0, 0));
      ripples.spawn(scratch.x, scratch.z, now(), WAKE);
    }
    if (moving && t - lastSpray > 0.45 + Math.random() * 0.4) {
      lastSpray = t;
      body.localToWorld(scratch.set(Math.sign(vx) * (HULL.halfLength + 0.2), -RIDE / SIZE, 1.2));
      bursts.fire(scratch, now(), BOW);
    }

    landing = Math.max(0, landing - dt * 1.6);
  }

  const held = new Vector3();
  const net = [new Vector3(), new Vector3(), new Vector3()];

  return {
    group: sail,
    /** World-space parts: the crane's last run of cable and its claw, the trawl, and the notes. */
    world,
    update,
    /** The boat's place on the water, for the berth the sea calms around it. */
    x: () => sail.position.x,
    /** The water's height under it: its waterline, for the crests in front of it. */
    level: () => sail.position.y,
    /** How far either way it may steam, from how much sea the frame shows either side, world units. */
    roam(halfWidth: number) {
      roam = Math.max(0, Math.min(patrol, halfWidth - 16));
    },
    /** 0..1 while a note is forming: the scene's pixels swirl into it. */
    surfacing: () => travel.surfacing,
    /** Where the pixels go: the note the sonar called up. */
    target: () => (focus.note ? swarm.where(focus.note, held) : held),
    /** The notes in the water, for the sea to keep its crests under: x, z, height to show, on. */
    sight(out: Vector4[]) {
      swarm.sights(out);
      // The trawl, while it is in the water, takes the last few: its whole length stays in view.
      const n = trawl.lying(net);
      for (let i = 0; i < n; i++) {
        const p = net[i];
        out[out.length - 1 - i].set(p.x, p.z, p.y - 0.45, 1);
      }
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
    /** The ark answers a ping: its portholes flare. */
    ping() {
      cabin.kick();
    },
    /** Starts the work: the gear fishing, the crew carrying. */
    work() {
      voyage?.start();
      crew?.start();
    },
    dispose() {
      voyage?.dispose();
      crew?.dispose();
      overflow?.dispose();
      funnel.dispose();
      cabin.dispose();
      trawl.dispose();
      ctx.revert();
      line.dispose();
      shadows.dispose();
      swarm.dispose();
      kit.dispose();
    },
  };
}
