import {
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { ram } from "./crane/parts";
import { HULL } from "./hull";
import { INK, type Kit } from "./materials";

/*
 * The net: the other way the vessel fishes, at the bow, for the shoals.
 *
 * Where the crane picks one note at a time, this scoops several: a landing
 * net on a telescopic pole. A turret turns it; a ram luffs the pole; an inner
 * tube slides out of the outer to reach; and a wrist at the end rolls the
 * hoop, so the net can be dragged mouth-first through the water, turned
 * mouth-up to trap what it caught, and tipped over a hatch to pour it out.
 * The bow lamp rides the turret and blinks, so the vessel is manned.
 *
 * Driven like the crane, by where the hoop should be rather than by joints
 * (`pose`): which way the turret faces, how far out and how high the hoop's
 * centre is, and the wrist's roll. The pole's angle and extension are solved
 * from those every frame.
 */

/** Where the turret stands, in the boat's frame. */
export const NET_BASE = new Vector3(8.3, HULL.deck, 0);
const PIVOT = { x: 0.05, y: 0.62 };
const OUTER = 2.9;
const INNER = 2.7;
/** From the pole's tip to the hoop's centre. */
const NECK = 0.78;
const HOOP = 0.72;

export type NetPose = {
  slew: number;
  /** The hoop's centre: out from the turret, and up from its base. */
  reach: number;
  lift: number;
  /** The wrist's roll: 0 mouth up, π/2 mouth first along the sweep, beyond that tipping out. */
  roll: number;
  /** 0..1: how full the bag hangs. */
  fill: number;
};

/** Parked: the pole raised back over the bow, the net hung up to dry. */
export const NET_REST: NetPose = { slew: Math.PI, reach: 2.1, lift: 3.4, roll: 0, fill: 0 };

function netting(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(14, 5);
  return texture;
}

export function createNet(kit: Kit) {
  const indigo = kit.paint(INK.hull, 0.45);
  const strake = kit.paint(INK.strake, 0.42);
  const chrome = kit.metal(INK.glint, 0.2);
  const steel = kit.metal(INK.rail, 0.32);
  const amber = kit.paint(INK.amber, 0.42);

  const group = new Group();
  group.position.copy(NET_BASE);

  const pedestal = new Mesh(kit.keep(new CylinderGeometry(0.42, 0.52, 0.3, 40)), indigo);
  pedestal.position.y = 0.15;
  group.add(pedestal);

  const turret = new Group();
  turret.position.y = 0.3;
  group.add(turret);
  const head = new Mesh(kit.keep(new RoundedBoxGeometry(0.78, 0.5, 0.72, 4, 0.1)), strake);
  head.position.set(-0.05, 0.25, 0);
  const cheekGeometry = kit.keep(new RoundedBoxGeometry(0.4, 0.42, 0.06, 2, 0.03));
  for (const z of [-0.2, 0.2]) {
    const cheek = new Mesh(cheekGeometry, indigo);
    cheek.position.set(PIVOT.x, PIVOT.y, z);
    turret.add(cheek);
  }
  // The bow lamp on a short mast off the turret's back.
  const mast = new Mesh(kit.keep(new CylinderGeometry(0.05, 0.06, 1.1, 16)), indigo);
  mast.position.set(-0.32, 0.95, -0.22);
  const lampInk = kit.glow(INK.amber, INK.amber, 1.2);
  const lamp = new Mesh(kit.keep(new SphereGeometry(0.15, 28, 18)), lampInk);
  lamp.position.set(-0.32, 1.55, -0.22);
  turret.add(head, mast, lamp);

  // The pole: an outer tube on the pivot, an inner one sliding out of it.
  const pole = new Group();
  pole.position.set(PIVOT.x, PIVOT.y, 0);
  turret.add(pole);
  const outer = new Mesh(kit.keep(new CylinderGeometry(0.12, 0.13, OUTER, 28)).rotateZ(-Math.PI / 2), indigo);
  outer.position.x = OUTER / 2 - 0.15;
  const collar = new Mesh(kit.keep(new CylinderGeometry(0.15, 0.15, 0.14, 28)).rotateZ(-Math.PI / 2), amber);
  collar.position.x = OUTER - 0.18;
  const inner = new Mesh(kit.keep(new CylinderGeometry(0.08, 0.08, INNER, 24)).rotateZ(-Math.PI / 2), chrome);
  const pin = new Mesh(kit.keep(new CylinderGeometry(0.07, 0.07, 0.5, 20)).rotateX(Math.PI / 2), chrome);
  const lug = new Mesh(kit.keep(new RoundedBoxGeometry(0.16, 0.12, 0.12, 2, 0.03)), indigo);
  lug.position.set(1.0, -0.17, 0);
  pole.add(outer, collar, inner, pin, lug);

  const lift = ram(kit, indigo, chrome, 0.075, 0.7);
  const RAM_BASE = new Vector3(0.36, 0.08, 0);
  turret.add(...lift.parts);

  // The wrist, riding the tip but squared to the turret, so the hoop keeps its
  // own attitude whatever the pole's angle.
  const wrist = new Group();
  turret.add(wrist);
  const housing = new Mesh(kit.keep(new CylinderGeometry(0.13, 0.13, 0.26, 24)).rotateZ(-Math.PI / 2), strake);
  wrist.add(housing);
  const roll = new Group();
  wrist.add(roll);
  const neck = new Mesh(
    kit.keep(new CylinderGeometry(0.045, 0.045, NECK - HOOP * 0.1, 12)).rotateZ(-Math.PI / 2),
    steel,
  );
  neck.position.x = (NECK - HOOP * 0.1) / 2;
  const hoop = new Group();
  hoop.position.x = NECK;
  const ring = new Mesh(kit.keep(new TorusGeometry(HOOP, 0.055, 14, 64)).rotateX(Math.PI / 2), steel);

  const netMap = netting();
  const netInk = new MeshStandardMaterial({
    color: INK.glint,
    map: netMap,
    alphaMap: netMap,
    transparent: true,
    alphaTest: 0.35,
    side: DoubleSide,
    roughness: 0.6,
  });
  const profile = [
    [HOOP, 0],
    [HOOP * 0.98, -0.22],
    [HOOP * 0.88, -0.5],
    [HOOP * 0.68, -0.78],
    [HOOP * 0.42, -0.98],
    [HOOP * 0.14, -1.08],
    [0.001, -1.1],
  ].map(([x, y]) => new Vector2(x, y));
  const bag = new Mesh(kit.keep(new LatheGeometry(profile, 40)), netInk);
  const cod = new Mesh(kit.keep(new SphereGeometry(0.06, 12, 8)), amber);
  cod.position.y = -1.1;
  hoop.add(ring, bag, cod);
  roll.add(neck, hoop);

  const pose: NetPose = { ...NET_REST };
  const tip = new Vector3();
  const end = new Vector3();

  function apply() {
    turret.rotation.y = pose.slew;
    // The hoop's centre is NECK beyond the tip, along the turret's x: solve the pole for the tip.
    const tx = pose.reach - NECK - PIVOT.x;
    const ty = pose.lift - 0.3 - PIVOT.y;
    const angle = Math.atan2(ty, tx);
    const length = Math.min(OUTER + INNER - 0.4, Math.max(OUTER - 0.2, Math.hypot(tx, ty)));
    pole.rotation.z = angle;
    inner.position.x = length - INNER / 2;
    tip.set(PIVOT.x + Math.cos(angle) * length, PIVOT.y + Math.sin(angle) * length, 0);
    wrist.position.copy(tip);
    roll.rotation.x = pose.roll;
    const f = pose.fill;
    bag.scale.set(1 + f * 0.12, 1 + f * 0.22, 1 + f * 0.12);
    cod.position.y = -1.1 * (1 + f * 0.22);
    lift.set(
      RAM_BASE,
      end.set(
        PIVOT.x + Math.cos(angle) * 1.0 + Math.sin(angle) * 0.17,
        PIVOT.y + Math.sin(angle) * 1.0 - Math.cos(angle) * 0.17,
        0,
      ),
    );
  }
  apply();

  return {
    group,
    pose,
    /** What the caught notes are held in: the hoop, whose frame the bag hangs from. */
    holder: hoop as Object3D,
    /** A place inside the bag for the i-th of n notes, in the hoop's frame. */
    pocket(i: number, n: number) {
      const a = (i / Math.max(1, n)) * Math.PI * 2 + 0.4;
      const r = n > 1 ? 0.26 : 0;
      return new Vector3(Math.cos(a) * r, -0.55 - (i % 2) * 0.12, Math.sin(a) * r);
    },
    /** The pose that puts the hoop's centre at a point in the world, given where the boat is now. */
    aim(target: Vector3, frame: Object3D, over: number, rollTo = pose.roll): NetPose {
      const local = frame.worldToLocal(target.clone()).sub(NET_BASE);
      return {
        slew: Math.atan2(-local.z, local.x),
        reach: Math.hypot(local.x, local.z),
        lift: local.y + over,
        roll: rollTo,
        fill: pose.fill,
      };
    },
    /** Where the hoop's centre is in the world. */
    hoopAt: (out: Vector3) => hoop.getWorldPosition(out),
    update(t: number) {
      apply();
      lampInk.emissiveIntensity = (t % 2.4) / 2.4 < 0.12 ? 2.4 : 0.35;
    },
    dispose() {
      netMap.dispose();
      netInk.dispose();
    },
  };
}
