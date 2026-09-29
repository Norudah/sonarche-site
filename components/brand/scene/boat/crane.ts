import { CylinderGeometry, Group, Mesh, Quaternion, TorusGeometry, Vector3, type Object3D } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { HULL } from "./hull";
import { INK, type Kit } from "./materials";

/*
 * The crane — the one thing the mark never had room for, and the reason the
 * vessel is a working boat now and not a figurehead.
 *
 * A slewing jib crane at the stern: a turret, a post, an amber boom that luffs
 * on a pin at the post's head, a counterweight behind it. Three numbers drive
 * it (`pose`): slew about the post, luff of the boom, and how much cable is
 * paid out. The cable and hook hang in world space, not the boat's: gravity
 * does not roll with the hull, and the hook swings on a damped pendulum as the
 * boom slews, which is most of what makes it read as machinery rather than as
 * an animation.
 *
 * `reach` solves a pose for a point in the world: slew to face it, luff to put
 * the boom's tip over it, and the cable length that brings the hook to it.
 */

export const BOOM = 5.3;
const POST = 1.35;
const TURRET = 0.38;
/** Where the post stands, in the boat's frame. */
export const CRANE_BASE = new Vector3(-6, HULL.deck, 0);

export type Pose = { slew: number; luff: number; cable: number };

/** Folded: boom out over the stern and kept low, clear of the copy above. */
export const REST: Pose = { slew: -2.75, luff: 0.62, cable: 0.9 };

const UP = new Vector3(0, 1, 0);

export function createCrane(kit: Kit) {
  const group = new Group();
  group.position.copy(CRANE_BASE);

  const turret = new Mesh(kit.keep(new CylinderGeometry(0.58, 0.66, TURRET, 56)), kit.paint(INK.rail, 0.42));
  turret.position.y = TURRET / 2;
  group.add(turret);

  const slew = new Group();
  slew.position.y = TURRET;
  group.add(slew);

  const post = new Mesh(kit.keep(new CylinderGeometry(0.2, 0.26, POST, 40)), kit.paint(INK.hull, 0.45));
  post.position.y = POST / 2;
  // The operator's cab, riding the slew: a little cabin-coloured box with a window.
  const cab = new Mesh(kit.keep(new RoundedBoxGeometry(0.72, 0.62, 0.66, 5, 0.12)), kit.paint(INK.cabin, 0.42));
  cab.position.set(-0.28, 0.42, 0.42);
  const glass = new Mesh(kit.keep(new RoundedBoxGeometry(0.44, 0.26, 0.05, 4, 0.02)), kit.paint(INK.eye, 0.12));
  glass.position.set(-0.28, 0.5, 0.76);
  slew.add(post, cab, glass);

  const pin = new Group();
  pin.position.y = POST;
  slew.add(pin);

  const amber = kit.paint(INK.amber, 0.45);
  const boom = new Mesh(kit.keep(new RoundedBoxGeometry(BOOM + 0.3, 0.26, 0.3, 5, 0.1)), amber);
  boom.position.x = BOOM / 2;
  const counterweight = new Mesh(kit.keep(new RoundedBoxGeometry(0.7, 0.5, 0.5, 5, 0.1)), kit.paint(INK.hull, 0.45));
  counterweight.position.x = -0.55;
  const hub = new Mesh(kit.keep(new CylinderGeometry(0.2, 0.2, 0.44, 40)), kit.paint(INK.rail, 0.4));
  hub.rotation.x = Math.PI / 2;
  const sheave = new Mesh(kit.keep(new TorusGeometry(0.16, 0.06, 14, 40)), kit.paint(INK.rail, 0.4));
  sheave.position.x = BOOM;
  const tip = new Group();
  tip.position.set(BOOM, -0.18, 0);
  pin.add(boom, counterweight, hub, sheave, tip);

  // The rigging, in world space.
  const rigging = new Group();
  const cable = new Mesh(kit.keep(new CylinderGeometry(0.028, 0.028, 1, 10)), kit.paint(INK.eye, 0.5));
  const hook = new Group();
  const block = new Mesh(kit.keep(new CylinderGeometry(0.17, 0.17, 0.3, 32)), kit.paint(INK.rail, 0.4));
  const claw = new Mesh(kit.keep(new TorusGeometry(0.18, 0.05, 14, 36, Math.PI * 1.4)), amber);
  claw.position.y = -0.3;
  claw.rotation.z = Math.PI * 0.8;
  hook.add(block, claw);
  rigging.add(cable, hook);

  const pose: Pose = { ...REST };
  const tipAt = new Vector3();
  const hanging = new Vector3();
  const swing = new Vector3();
  const velocity = new Vector3();
  const axis = new Vector3();
  const turn = new Quaternion();
  let settled = false;

  function apply() {
    slew.rotation.y = pose.slew;
    pin.rotation.z = pose.luff;
  }

  /** The hook's world position this frame. */
  const hookAt = () => hook.position;

  /**
   * A pose whose hook sits `above` world units over the point, given where the
   * boat is now. `frame` is the group the crane is mounted in.
   */
  function reach(target: Vector3, above: number, frame: Object3D): Pose {
    const local = frame.worldToLocal(target.clone()).sub(CRANE_BASE);
    const h = Math.hypot(local.x, local.z);
    const luff = Math.acos(Math.min(0.97, h / BOOM));
    const tipY = TURRET + POST + BOOM * Math.sin(luff) - 0.18 - local.y;
    return { slew: Math.atan2(-local.z, local.x), luff, cable: Math.max(0.6, tipY - above) };
  }

  apply();

  return {
    group,
    rigging,
    pose,
    reach,
    hookAt,
    update(dt: number) {
      apply();
      group.updateWorldMatrix(true, true);
      tip.getWorldPosition(tipAt);

      // The hook hangs straight below the tip, and swings towards that point
      // on a lightly damped spring: a slew leaves it lagging, then rocking.
      hanging.set(tipAt.x, tipAt.y - pose.cable, tipAt.z);
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
      hook.position.copy(swing);

      // The cable runs from the sheave to the hook, whatever the swing.
      axis.subVectors(swing, tipAt);
      const length = axis.length();
      cable.position.copy(tipAt).addScaledVector(axis, 0.5);
      cable.scale.set(1, length, 1);
      turn.setFromUnitVectors(UP, axis.normalize().negate());
      cable.quaternion.copy(turn);
    },
  };
}
