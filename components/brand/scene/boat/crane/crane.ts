import {
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  Path,
  Quaternion,
  Shape,
  SphereGeometry,
  Vector3,
  type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { HULL } from "../hull";
import { INK, type Kit } from "../materials";
import { createClaw } from "./claw";
import { beam, gear, meshing, ram } from "./parts";

/*
 * The crane: a knuckle-boom deck crane, the kind working boats carry, and the
 * vessel's arm.
 *
 * On a pedestal at the stern, a slewing platform turns on a toothed ring, driven
 * by a pinion that visibly walks round it. The platform carries the operator's
 * cab, the power pack and a counterweight, and a post whose cheeks hold the
 * main boom's pin. The main boom is lifted by a ram from the platform; the jib,
 * pinned at the knuckle beside it, is folded and unfolded by a second ram
 * riding on the main boom. The winch rides the main boom too: a drum between
 * two geared flanges, turned by a motor through a pinion, paying cable out over
 * a sheave at the knuckle and another at the jib's head. Every one of those
 * turns or slides by exactly what the pose says, which is what makes it read
 * as a machine: nothing moves unless something drives it.
 *
 * Five numbers drive it all (`pose`): slew, the two joint angles, the cable
 * paid out, and the claw's grip. The cable's last run and the claw hang in
 * world space (`rigging`), on a damped pendulum, because gravity does not roll
 * with the hull. `reach` solves a pose for a point in the world: slew to face
 * it, then a two-bone solve to put the jib's head where the cable should drop.
 */

/** Where the pedestal stands, in the boat's frame. */
export const CRANE_BASE = new Vector3(-7.4, HULL.deck, 0);
const DECK = 0.42;
/** The main boom's pin, in the slewing frame (x out along the boom, y up from the platform). */
const PIN = { x: 0.18, y: 1.2 };
const MAIN = 3.0;
const JIB = 2.8;
/** The jib sits beside the main boom, not in line with it: they fold past each other. */
const JIB_Z = 0.33;
/** Where the cable leaves the jib's head sheave, beyond its pin. */
const DROP = 0.2;
const DRUM = { x: 0.8, y: 0.4, r: 0.13 };
const TAU = Math.PI * 2;

export type Pose = { slew: number; shoulder: number; elbow: number; cable: number; grip: number };

/** Folded: the jib tucked down behind the main boom, the claw shut, over the stern. */
export const REST: Pose = { slew: -2.55, shoulder: 1.2, elbow: -2.3, cable: 0.35, grip: 1 };

const UP = new Vector3(0, 1, 0);

/** The jib head's drop point for a pose, in the slewing plane. */
function tip(shoulder: number, elbow: number) {
  const kx = PIN.x + Math.cos(shoulder) * MAIN;
  const ky = PIN.y + Math.sin(shoulder) * MAIN;
  const a = shoulder + elbow;
  return { x: kx + Math.cos(a) * (JIB + DROP), y: ky + Math.sin(a) * (JIB + DROP) };
}

/** A two-bone solve: the joint angles that put the drop point at (h, y), elbow up. */
function solve(h: number, y: number): { shoulder: number; elbow: number } {
  const l1 = MAIN;
  const l2 = JIB + DROP;
  const dx = h - PIN.x;
  const dy = y - PIN.y;
  const d = Math.min(l1 + l2 - 0.05, Math.max(0.8, Math.hypot(dx, dy)));
  const clamp = (v: number) => Math.min(1, Math.max(-1, v));
  const toward = Math.atan2(dy, dx);
  const shoulder = toward + Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)));
  const elbow = -(Math.PI - Math.acos(clamp((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))));
  return { shoulder: Math.min(1.5, shoulder), elbow: Math.max(-2.75, elbow) };
}

/** A sheave: a disc with four windows in it, so it can be seen to turn. */
function sheave(kit: Kit, r: number, width: number) {
  const s = new Shape();
  s.absarc(0, 0, r, 0, TAU, false);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * TAU;
    const h = new Path();
    h.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.22, 0, TAU, true);
    s.holes.push(h);
  }
  return kit
    .smooth(
      new ExtrudeGeometry(s, {
        depth: width,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.02,
        curveSegments: 24,
      }),
    )
    .translate(0, 0, -width / 2);
}

export function createCrane(kit: Kit) {
  const amber = kit.paint(INK.amber, 0.42);
  const indigo = kit.paint(INK.hull, 0.45);
  const strake = kit.paint(INK.strake, 0.45);
  const lavender = kit.paint(INK.cabin, 0.42);
  const steel = kit.metal(INK.rail, 0.32);
  const chrome = kit.metal(INK.glint, 0.18);
  const dark = kit.paint(INK.eye, 0.5);

  const group = new Group();
  group.position.copy(CRANE_BASE);

  // --- The pedestal and the slewing ring -----------------------------------
  const pedestal = new Mesh(kit.keep(new CylinderGeometry(0.58, 0.7, 0.3, 48)), indigo);
  pedestal.position.y = 0.15;
  const RING_TEETH = 32;
  const ring = new Mesh(kit.keep(gear(kit, RING_TEETH, 0.7, 0.12, 0.2).rotateX(-Math.PI / 2)), steel);
  ring.position.y = 0.34;
  group.add(pedestal, ring);

  const slew = new Group();
  slew.position.y = DECK;
  group.add(slew);

  const platform = new Mesh(kit.keep(new RoundedBoxGeometry(2.15, 0.12, 1.4, 4, 0.05)), strake);
  platform.position.set(-0.28, 0.02, 0);
  // The slewing pinion, under the platform's edge where it meets the ring, and its motor.
  const PINION_TEETH = 9;
  const pinion = new Mesh(kit.keep(gear(kit, PINION_TEETH, 0.19, 0.1, 0.4).rotateX(-Math.PI / 2)), steel);
  pinion.position.set(0.35, ring.position.y - DECK, 0.77);
  const slewMotor = new Mesh(kit.keep(new CylinderGeometry(0.11, 0.11, 0.26, 24)), dark);
  slewMotor.position.set(0.35, 0.21, 0.6);
  slew.add(platform, pinion, slewMotor);

  // --- The post, the cab, the power pack, the counterweight ----------------
  const core = new Mesh(kit.keep(new RoundedBoxGeometry(0.52, 0.84, 0.44, 4, 0.06)), indigo);
  core.position.set(PIN.x, 0.5, 0);
  const cheekGeometry = kit.keep(new RoundedBoxGeometry(0.6, 0.66, 0.07, 3, 0.03));
  const pinGeometry = kit.keep(new CylinderGeometry(0.07, 0.07, 1, 20)).rotateX(Math.PI / 2);
  const capGeometry = kit.keep(new CylinderGeometry(0.1, 0.1, 0.05, 24)).rotateX(Math.PI / 2);
  for (const z of [-0.245, 0.245]) {
    const cheek = new Mesh(cheekGeometry, indigo);
    cheek.position.set(PIN.x, PIN.y - 0.1, z);
    const cap = new Mesh(capGeometry, chrome);
    cap.position.set(PIN.x, PIN.y, z * 1.25);
    slew.add(cheek, cap);
  }
  const pin = new Mesh(pinGeometry, chrome);
  pin.scale.z = 0.6;
  pin.position.set(PIN.x, PIN.y, 0);
  slew.add(core, pin);

  // The operator's cab, on the post's flank, looking out along the boom.
  const cab = new Mesh(kit.keep(new RoundedBoxGeometry(0.62, 0.62, 0.5, 5, 0.12)), lavender);
  cab.position.set(0.32, 0.4, -0.5);
  const glassInk = kit.paint(INK.eye, 0.1);
  glassInk.metalness = 0.3;
  const pane = new Mesh(kit.keep(new RoundedBoxGeometry(0.06, 0.28, 0.36, 3, 0.025)), glassInk);
  pane.position.set(0.63, 0.48, -0.5);
  const side = new Mesh(kit.keep(new RoundedBoxGeometry(0.34, 0.26, 0.06, 3, 0.025)), glassInk);
  side.position.set(0.34, 0.48, -0.75);
  slew.add(cab, pane, side);

  // The power pack, louvred, with the beacon on its roof.
  const pack = new Mesh(kit.keep(new RoundedBoxGeometry(0.9, 0.62, 0.96, 5, 0.1)), lavender);
  pack.position.set(-0.62, 0.39, 0);
  const louvre = kit.keep(new RoundedBoxGeometry(0.5, 0.045, 0.03, 2, 0.012));
  for (const z of [-0.49, 0.49]) {
    for (let i = 0; i < 4; i++) {
      const slat = new Mesh(louvre, dark);
      slat.position.set(-0.62, 0.26 + i * 0.1, z);
      slew.add(slat);
    }
  }
  const beaconInk = kit.glow(INK.amber, INK.amber, 0.4);
  const beacon = new Mesh(kit.keep(new SphereGeometry(0.1, 20, 14, 0, TAU, 0, Math.PI / 2)), beaconInk);
  beacon.position.set(-0.55, 0.7, 0.22);
  const beaconBase = new Mesh(kit.keep(new CylinderGeometry(0.11, 0.11, 0.05, 20)), dark);
  beaconBase.position.set(-0.55, 0.705, 0.22);
  // The counterweight: a slab across the back, banded.
  const weight = new Mesh(kit.keep(new RoundedBoxGeometry(0.34, 0.58, 1.1, 4, 0.08)), indigo);
  weight.position.set(-1.2, 0.37, 0);
  const band = new Mesh(kit.keep(new RoundedBoxGeometry(0.36, 0.1, 1.12, 2, 0.03)), amber);
  band.position.set(-1.2, 0.46, 0);
  slew.add(pack, beacon, beaconBase, weight, band);

  // --- The main boom -------------------------------------------------------
  const shoulder = new Group();
  shoulder.position.set(PIN.x, PIN.y, 0);
  slew.add(shoulder);
  shoulder.add(new Mesh(beam(kit, MAIN, 0.26, 0.21, 0.34), amber));

  // The winch, riding the boom: a drum of dark cable between two geared
  // flanges, and a motor behind driving both gears through its pinions.
  const winch = new Group();
  winch.position.set(DRUM.x, DRUM.y, 0);
  const drum = new Group();
  const cableRoll = new Mesh(kit.keep(new CylinderGeometry(DRUM.r, DRUM.r, 0.3, 28)).rotateX(Math.PI / 2), dark);
  drum.add(cableRoll);
  const DRUM_TEETH = 14;
  const MOTOR_TEETH = 8;
  const drumGear = gear(kit, DRUM_TEETH, 0.24, 0.05);
  const motorGear = gear(kit, MOTOR_TEETH, 0.13, 0.05, 0.5);
  const toward = (3 * Math.PI) / 4;
  const [drumPhase, motorPhase] = meshing(DRUM_TEETH, MOTOR_TEETH, toward);
  const motorAt = { x: Math.cos(toward) * 0.31, y: Math.sin(toward) * 0.31 };
  const pinions: Mesh[] = [];
  for (const z of [-0.2, 0.2]) {
    const g = new Mesh(drumGear, steel);
    g.position.z = z;
    drum.add(g);
    const p = new Mesh(motorGear, steel);
    p.position.set(motorAt.x, motorAt.y, z);
    pinions.push(p);
    winch.add(p);
  }
  const motor = new Mesh(kit.keep(new CylinderGeometry(0.09, 0.09, 0.34, 24)).rotateX(Math.PI / 2), dark);
  motor.position.set(motorAt.x, motorAt.y, 0);
  const axle = new Mesh(pinGeometry, chrome);
  axle.scale.set(0.6, 0.6, 0.5);
  winch.add(drum, motor, axle);
  // Its brackets down to the boom.
  const bracketGeometry = kit.keep(new RoundedBoxGeometry(0.34, 0.26, 0.05, 2, 0.02));
  for (const z of [-0.14, 0.14]) {
    const b = new Mesh(bracketGeometry, indigo);
    b.position.set(DRUM.x - 0.12, 0.26, z);
    shoulder.add(b);
  }
  shoulder.add(winch);

  // The knuckle: the pin through both booms, and the guide sheave on the main boom's head.
  const knuckle = new Mesh(pinGeometry, chrome);
  knuckle.scale.z = 0.75;
  knuckle.position.set(MAIN, 0, JIB_Z / 2);
  const guide = new Mesh(sheave(kit, 0.16, 0.06), steel);
  guide.position.set(MAIN - 0.12, 0.3, 0);
  shoulder.add(knuckle, guide);

  // --- The jib -------------------------------------------------------------
  const elbow = new Group();
  elbow.position.set(MAIN, 0, JIB_Z);
  shoulder.add(elbow);
  elbow.add(new Mesh(beam(kit, JIB, 0.21, 0.15, 0.26), amber));
  const head = new Group();
  head.position.set(JIB, 0, 0);
  const headSheaves = [-0.16, 0.16].map((z) => {
    const s = new Mesh(sheave(kit, 0.2, 0.05), steel);
    s.position.z = z;
    head.add(s);
    return s;
  });
  const headPin = new Mesh(pinGeometry, chrome);
  headPin.scale.z = 0.42;
  head.add(headPin);
  elbow.add(head);

  // --- The rams --------------------------------------------------------------
  const lug = kit.keep(new RoundedBoxGeometry(0.16, 0.12, 0.12, 2, 0.03));
  const mainRam = ram(kit, indigo, chrome, 0.085, 0.95);
  const MAIN_BASE = new Vector3(0.74, 0.14, 0);
  const MAIN_END = { x: 1.25, y: -0.25 };
  const mainLug = new Mesh(lug, indigo);
  mainLug.position.set(MAIN_END.x, MAIN_END.y + 0.04, 0);
  shoulder.add(mainLug);
  const baseLug = new Mesh(lug, indigo);
  baseLug.position.copy(MAIN_BASE);
  slew.add(baseLug, ...mainRam.parts);

  const jibRam = ram(kit, indigo, chrome, 0.07, 1.0);
  const JIB_BASE = new Vector3(1.55, 0.31, JIB_Z);
  const JIB_END = { x: 0.62, y: 0.25 };
  // Its mount, standing off the main boom's flank into the jib's plane.
  const mount = new Mesh(kit.keep(new RoundedBoxGeometry(0.2, 0.16, JIB_Z + 0.08, 2, 0.03)), indigo);
  mount.position.set(JIB_BASE.x, JIB_BASE.y - 0.06, JIB_Z / 2 + 0.02);
  const jibLug = new Mesh(lug, indigo);
  jibLug.position.set(JIB_END.x, JIB_END.y - 0.03, 0);
  elbow.add(jibLug);
  shoulder.add(mount, ...jibRam.parts);

  // --- The cable ---------------------------------------------------------------
  const strand = kit.keep(new CylinderGeometry(0.02, 0.02, 1, 8));
  const runs = [new Mesh(strand, dark), new Mesh(strand, dark), new Mesh(strand, dark)];
  slew.add(...runs);

  // The rigging, in world space: the last run of cable, and the claw.
  const rigging = new Group();
  const fall = new Mesh(strand, dark);
  const claw = createClaw(kit);
  rigging.add(fall, claw.group);

  const pose: Pose = { ...REST };
  const last = { ...REST };
  const dropAt = new Vector3();
  const hanging = new Vector3();
  const swing = new Vector3();
  const velocity = new Vector3();
  const axis = new Vector3();
  const turn = new Quaternion();
  const twist = new Quaternion();
  const a = new Vector3();
  const b = new Vector3();
  const c = new Vector3();
  const e = new Vector3();
  let settled = false;
  let busy = 0;
  let spin = 0;
  let spinV = 0;

  /** A point on the main boom, or on the jib, into the slewing frame. */
  function onMain(x: number, y: number, out: Vector3) {
    const c = Math.cos(pose.shoulder);
    const s = Math.sin(pose.shoulder);
    return out.set(PIN.x + c * x - s * y, PIN.y + s * x + c * y, 0);
  }
  function onJib(x: number, y: number, out: Vector3) {
    const k = onMain(MAIN, 0, out);
    const t = pose.shoulder + pose.elbow;
    const c = Math.cos(t);
    const s = Math.sin(t);
    return out.set(k.x + c * x - s * y, k.y + s * x + c * y, JIB_Z);
  }

  function run(m: Mesh, from: Vector3, to: Vector3) {
    axis.subVectors(to, from);
    const length = axis.length();
    m.position.copy(from).addScaledVector(axis, 0.5);
    m.scale.set(1, Math.max(0.001, length), 1);
    m.quaternion.setFromUnitVectors(UP, axis.normalize());
  }

  function apply() {
    slew.rotation.y = pose.slew;
    shoulder.rotation.z = pose.shoulder;
    elbow.rotation.z = pose.elbow;

    // Rams: from their base lugs to their end lugs, the rods sliding.
    const mc = Math.cos(pose.shoulder);
    const ms = Math.sin(pose.shoulder);
    mainRam.set(
      MAIN_BASE,
      a.set(PIN.x + mc * MAIN_END.x - ms * MAIN_END.y, PIN.y + ms * MAIN_END.x + mc * MAIN_END.y, 0),
    );
    const ec = Math.cos(pose.elbow);
    const es = Math.sin(pose.elbow);
    jibRam.set(JIB_BASE, b.set(MAIN + ec * JIB_END.x - es * JIB_END.y, es * JIB_END.x + ec * JIB_END.y, JIB_Z));

    // The winch: the drum turns by the cable it pays out; the motor's pinion
    // turns the other way, faster, in step with its teeth.
    const turned = pose.cable / DRUM.r;
    drum.rotation.z = drumPhase - turned;
    pinions.forEach((p) => (p.rotation.z = motorPhase + turned * (DRUM_TEETH / MOTOR_TEETH)));
    guide.rotation.z = -pose.cable / 0.16;
    headSheaves.forEach((s) => (s.rotation.z = -pose.cable / 0.2));
    // The slewing pinion walks round the fixed ring.
    pinion.rotation.y = pose.slew * (RING_TEETH / PINION_TEETH);

    // The cable: off the drum, over the knuckle's sheave, along the jib to its head.
    const d = onMain(DRUM.x, DRUM.y + DRUM.r, a);
    const g = onMain(MAIN - 0.12, 0.46, b);
    run(runs[0], d, g);
    const j = onJib(0.4, 0.27, c);
    run(runs[1], g, j);
    run(runs[2], j, onJib(JIB, 0.2, e));
  }

  /**
   * A pose that hangs the cable's end `hook` world units over the point with
   * `cable` paid out, given where the boat is now. `frame` is the group the
   * crane is mounted in.
   */
  function reach(target: Vector3, frame: Object3D, hook: number, cable: number): Pose {
    const local = frame.worldToLocal(target.clone()).sub(CRANE_BASE);
    const h = Math.hypot(local.x, local.z);
    const joints = solve(h, local.y + hook + cable - DECK);
    return { slew: Math.atan2(-local.z, local.x), ...joints, cable, grip: pose.grip };
  }

  apply();

  return {
    group,
    rigging,
    pose,
    reach,
    /** Where the cable ends, in the world, this frame. */
    hookAt: () => claw.group.position,
    /** The claw, for a note to be held in (`attach`). */
    holder: claw.group,
    update(t: number, dt: number) {
      apply();
      group.updateWorldMatrix(true, true);
      const { x, y } = tip(pose.shoulder, pose.elbow);
      dropAt.set(x, y, 0);
      slew.localToWorld(dropAt);

      // The hook hangs straight below the jib's head, and swings towards that
      // point on a lightly damped spring: a slew leaves it lagging, then rocking.
      hanging.set(dropAt.x, dropAt.y - pose.cable, dropAt.z);
      if (!settled) {
        swing.copy(hanging);
        settled = true;
      }
      const k = 16;
      const damp = 2.2;
      velocity.x += ((hanging.x - swing.x) * k - velocity.x * damp) * dt;
      velocity.z += ((hanging.z - swing.z) * k - velocity.z * damp) * dt;
      swing.x += velocity.x * dt;
      swing.z += velocity.z * dt;
      swing.y = hanging.y;
      claw.group.position.copy(swing);
      run(fall, dropAt, swing);

      // The claw hangs along its cable, and turns a little on its swivel:
      // winding up when the cable runs fast, unwinding after.
      const moved =
        Math.abs(pose.slew - last.slew) +
        Math.abs(pose.shoulder - last.shoulder) +
        Math.abs(pose.elbow - last.elbow) +
        Math.abs(pose.cable - last.cable) * 0.5;
      const reel = dt > 0 ? (pose.cable - last.cable) / dt : 0;
      spinV += (reel * 1.5 - spin * 6 - spinV * 1.8) * dt;
      spin += spinV * dt;
      Object.assign(last, pose);
      axis.subVectors(dropAt, swing).normalize();
      turn.setFromUnitVectors(UP, axis);
      twist.setFromAxisAngle(UP, spin + Math.sin(t * 0.7) * 0.25);
      claw.group.quaternion.copy(turn).multiply(twist);
      claw.update(pose.grip);

      // The beacon turns over while the crane works, and dims when it rests.
      busy += ((dt > 0 && moved / dt > 0.05 ? 1 : 0) - busy) * Math.min(1, dt * 3);
      beaconInk.emissiveIntensity = 0.35 + busy * (0.9 + 1.4 * Math.max(0, Math.sin(t * 9)));
    },
  };
}
