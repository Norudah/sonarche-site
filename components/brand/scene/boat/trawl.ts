import {
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Quaternion,
  RepeatWrapping,
  SphereGeometry,
  Vector2,
  Vector3,
  type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { ram } from "./crane/parts";
import { HULL } from "./hull";
import { INK, type Kit } from "./materials";

/*
 * Worked from an A-frame gantry on the transom, with a pound on deck for the catch. It obeys its
 * warps: shot, it lies where it lands until the boat steams far enough for them to come taut, then
 * streams astern. `pose`: gantry tilt, warp paid out, hang below the block, in water or hoisted,
 * cod-end open, fill.
 */

/** The gantry's pivot on the transom, in the boat's frame, its height and where its legs stand. */
export const GANTRY = { x: 9.25, height: 3.8, feet: 1.15 };
/** The pound, on the deck forward of the gantry: where the catch is emptied, in the boat's frame. */
export const POUND = { from: 5.4, to: 8.5, back: -0.95, front: 1.15 };

export type TrawlPose = {
  /** Radians: positive tips the gantry outboard, over the water. */
  tilt: number;
  /** How far the net hangs below the block when hoisted, boat units. */
  drop: number;
  /** 0 in the water, obeying its warps; 1 hoisted under the block. */
  hang: number;
  /** Warp paid out, world units. */
  warp: number;
  /** 0..1: the cod-end untied. */
  open: number;
  /** 0..1: how full the cod-end hangs. */
  fill: number;
};

export const TRAWL_REST: TrawlPose = { tilt: 0, drop: 0.35, hang: 1, warp: 0, open: 0, fill: 0 };

/** The tilt that puts the block over a point `x` along the deck. */
export const tiltOver = (x: number) => -Math.asin(Math.min(1, (GANTRY.x - x) / GANTRY.height));

/** The net's shape, in the water and hoisted: half its mouth's height and width, its length. */
const SPREAD = { height: [0.42, 0.26], width: [1.35, 0.34], length: [5.4, 2.1] };

function netting(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(14, 9);
  return texture;
}

const UP = new Vector3(0, 1, 0);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export function createTrawl(kit: Kit, size: number) {
  const indigo = kit.paint(INK.hull, 0.45);
  const strake = kit.paint(INK.strake, 0.42);
  const amber = kit.paint(INK.amber, 0.42);
  const steel = kit.metal(INK.rail, 0.32);
  const chrome = kit.metal(INK.glint, 0.2);
  const dark = kit.paint(INK.eye, 0.5);
  const H = GANTRY.height;

  // --- The gantry and the pound --------------------------------------------------
  const group = new Group();
  group.position.set(GANTRY.x, HULL.deck, 0);
  const frame = new Group();
  group.add(frame);
  const legGeometry = kit.keep(new CylinderGeometry(0.085, 0.1, H, 24));
  const shoeGeometry = kit.keep(new RoundedBoxGeometry(0.36, 0.2, 0.3, 3, 0.05));
  for (const z of [-GANTRY.feet, GANTRY.feet]) {
    const leg = new Mesh(legGeometry, strake);
    leg.position.set(0, H / 2, z);
    frame.add(leg);
    const shoe = new Mesh(shoeGeometry, indigo);
    shoe.position.set(0, 0.1, z);
    group.add(shoe);
  }
  const bar = new Mesh(
    kit.keep(new CylinderGeometry(0.11, 0.11, GANTRY.feet * 2 + 0.3, 24)).rotateX(Math.PI / 2),
    amber,
  );
  bar.position.y = H;
  const block = new Group();
  block.position.y = H - 0.26;
  const wheel = new Mesh(kit.keep(new CylinderGeometry(0.19, 0.19, 0.1, 28)).rotateX(Math.PI / 2), steel);
  const cheeks = new Mesh(kit.keep(new RoundedBoxGeometry(0.3, 0.46, 0.2, 2, 0.04)), indigo);
  cheeks.position.y = 0.08;
  block.add(cheeks, wheel);
  const lampInk = kit.glow(INK.amber, INK.amber, 1.2);
  const lamp = new Mesh(kit.keep(new SphereGeometry(0.14, 24, 16)), lampInk);
  lamp.position.y = H + 0.2;
  frame.add(bar, block, lamp);

  const rams = [-1, 1].map((side) => {
    const r = ram(kit, indigo, chrome, 0.075, 1.0);
    group.add(...r.parts);
    return { r, base: new Vector3(-1.25, 0.12, side * (GANTRY.feet - 0.16)), end: new Vector3() };
  });

  // The pound: low boards on the deck, behind and forward of where the catch lands.
  const pound = new Group();
  const plank = (length: number) => kit.keep(new RoundedBoxGeometry(length, 0.34, 0.08, 2, 0.03));
  const back = new Mesh(plank(POUND.to - POUND.from), strake);
  back.position.set((POUND.from + POUND.to) / 2 - GANTRY.x, 0.17, POUND.back);
  const side = new Mesh(plank(POUND.front - POUND.back - 0.5), strake);
  side.rotation.y = Math.PI / 2;
  side.position.set(POUND.from - GANTRY.x, 0.17, (POUND.front + POUND.back - 0.5) / 2);
  const postGeometry = kit.keep(new CylinderGeometry(0.06, 0.06, 0.46, 12));
  for (const [px, pz] of [
    [POUND.from, POUND.back],
    [POUND.to, POUND.back],
    [POUND.from, POUND.front - 0.5],
  ]) {
    const post = new Mesh(postGeometry, amber);
    post.position.set(px - GANTRY.x, 0.23, pz);
    pound.add(post);
  }
  pound.add(back, side);
  group.add(pound);

  // --- The net -------------------------------------------------------------------
  const rig = new Group();
  const netMap = netting();
  const netInk = new MeshStandardMaterial({
    color: INK.strake,
    map: netMap,
    alphaMap: netMap,
    transparent: true,
    alphaTest: 0.3,
    side: DoubleSide,
    roughness: 0.6,
  });
  // A long cone, unit-sized: mouth at the top, the cod-end a little fuller at the bottom.
  const profile = [
    [1, 0],
    [0.9, -0.12],
    [0.7, -0.3],
    [0.48, -0.5],
    [0.3, -0.7],
    [0.22, -0.82],
    [0.24, -0.9],
    [0.2, -0.97],
    [0.001, -1],
  ].map(([px, py]) => new Vector2(px, py));
  const bag = new Mesh(kit.keep(new LatheGeometry(profile, 48)), netInk);
  const knot = new Mesh(kit.keep(new SphereGeometry(0.1, 14, 10)), amber);
  const holder = new Group();
  rig.add(bag, knot, holder);

  // The mouth: floats along the headline, bobbins along the ground-rope, and
  // the two otter boards that spread it, on bridles.
  const floatGeometry = kit.keep(new SphereGeometry(0.11, 16, 12));
  const bobbinGeometry = kit.keep(new CylinderGeometry(0.08, 0.08, 0.06, 14)).rotateX(Math.PI / 2);
  const floats = Array.from({ length: 7 }, () => {
    const m = new Mesh(floatGeometry, amber);
    rig.add(m);
    return m;
  });
  const bobbins = Array.from({ length: 7 }, () => {
    const m = new Mesh(bobbinGeometry, dark);
    rig.add(m);
    return m;
  });
  const doorGeometry = kit.keep(new RoundedBoxGeometry(0.1, 0.5, 0.9, 3, 0.04));
  const rimGeometry = kit.keep(new RoundedBoxGeometry(0.12, 0.08, 0.92, 2, 0.03));
  const doors = [-1, 1].map((s) => {
    const door = new Group();
    const plate = new Mesh(doorGeometry, indigo);
    const rim = new Mesh(rimGeometry, amber);
    rim.position.y = 0.26;
    door.add(plate, rim);
    door.userData.side = s;
    rig.add(door);
    return door;
  });
  rig.scale.setScalar(size);

  const strand = kit.keep(new CylinderGeometry(0.022, 0.022, 1, 8));
  const warps = Array.from({ length: 4 }, () => new Mesh(strand, dark));
  const bridles = Array.from({ length: 2 }, () => new Mesh(strand, dark));
  const rigging = new Group();
  rigging.add(rig, ...warps, ...bridles);

  const pose: TrawlPose = { ...TRAWL_REST };
  const lying = new Vector3();
  const blockAt = new Vector3();
  const hoisted = new Vector3();
  const along = new Vector3();
  const upright = new Quaternion();
  const streamed = new Quaternion();
  const basis = new Matrix4();
  const ax = new Vector3();
  const ay = new Vector3();
  const az = new Vector3();
  const a = new Vector3();
  const b = new Vector3();
  const mid = new Vector3();
  let placed = false;

  function run(m: Mesh, from: Vector3, to: Vector3) {
    along.subVectors(to, from);
    const l = along.length();
    m.position.copy(from).addScaledVector(along, 0.5);
    m.scale.set(1, Math.max(0.001, l), 1);
    m.quaternion.setFromUnitVectors(UP, along.normalize());
  }

  /** A warp from the block to a door, sagging by however much of it is slack. */
  function warp(i: number, to: Vector3) {
    const slack = Math.max(0, pose.warp - blockAt.distanceTo(to)) * (1 - pose.hang);
    mid.lerpVectors(blockAt, to, 0.5);
    mid.y -= slack * 0.45;
    run(warps[i * 2], blockAt, mid);
    run(warps[i * 2 + 1], mid, to);
  }

  return {
    group,
    /** World-space: the net and its warps. */
    rigging,
    pose,
    /** What the catch is held in: the cod-end. */
    holder: holder as Object3D,
    /** Where the net's mouth is in the world. */
    mouth: (out: Vector3) => out.copy(rig.position),
    /** Where the net is in the water, mouth to cod-end, for the sea to keep its crests under; empty when hoisted. */
    lying(out: Vector3[]) {
      if (pose.hang > 0.5) return 0;
      out.forEach((v, i) =>
        rig.localToWorld(v.set(0, -(i / (out.length - 1)) * mix(SPREAD.length[0], SPREAD.length[1], pose.hang), 0)),
      );
      return out.length;
    },
    /** Where the block is in the world: what the warps run from. */
    block: (out: Vector3) => out.copy(blockAt),
    /** Half the mouth's width, world units, as it is now. */
    spread: () => mix(SPREAD.width[0], SPREAD.width[1], pose.hang) * size,
    /** A place in the cod-end for the i-th note, in the holder's frame. */
    pocket(i: number) {
      const angle = i * 2.4;
      return new Vector3(Math.cos(angle) * 0.12, i * 0.09, Math.sin(angle) * 0.12);
    },
    /**
     * @param body the boat's frame.
     * @param water the sea's height at a point, so the net lies in it.
     */
    update(t: number, dt: number, body: Object3D, water: (x: number, z: number) => number) {
      frame.rotation.z = -pose.tilt;
      for (const r of rams) {
        r.end.set(Math.sin(pose.tilt) * 1.7, Math.cos(pose.tilt) * 1.7, r.base.z);
        r.r.set(r.base, r.end);
      }
      lampInk.emissiveIntensity = (t % 2.4) / 2.4 < 0.12 ? 2.4 : 0.35;

      group.updateWorldMatrix(true, true);
      block.getWorldPosition(blockAt);
      body.getWorldQuaternion(upright);

      // In the water, the net goes where its warps let it: nowhere, while they
      // are slack; dragged after the block once they come taut.
      if (!placed || pose.hang > 0.999) {
        lying.set(blockAt.x, 0, blockAt.z);
        placed = true;
      } else {
        const drop = Math.max(0, blockAt.y - water(lying.x, lying.z));
        const reach = Math.sqrt(Math.max(0, pose.warp * pose.warp - drop * drop));
        const dx = lying.x - blockAt.x;
        const dz = lying.z - blockAt.z;
        const d = Math.hypot(dx, dz);
        if (d > reach && d > 0) {
          lying.x = blockAt.x + (dx / d) * reach;
          lying.z = blockAt.z + (dz / d) * reach;
        }
      }
      lying.y = water(lying.x, lying.z) - 0.05;

      // Lying in the water, it streams away from the block; hoisted, it hangs.
      ay.set(blockAt.x - lying.x, 0, blockAt.z - lying.z);
      if (ay.lengthSq() < 0.01) ay.set(-1, 0, 0).applyQuaternion(upright).setY(0);
      ay.normalize();
      ay.y = 0.12;
      ay.normalize();
      az.set(0, 0, 1).applyQuaternion(upright);
      ax.crossVectors(ay, az).normalize();
      az.crossVectors(ax, ay).normalize();
      basis.makeBasis(ax, ay, az);
      streamed.setFromRotationMatrix(basis);

      const h = pose.hang;
      hoisted.copy(blockAt).setY(blockAt.y - (0.3 + pose.drop) * size);
      rig.position.lerpVectors(lying, hoisted, h);
      rig.quaternion.slerpQuaternions(streamed, upright, h);

      // Its shape: spread wide and long in the water, bunched hanging, fuller when full.
      const f = pose.fill;
      const hx = mix(SPREAD.height[0], SPREAD.height[1] * (1 + f * 0.5), h);
      const hz = mix(SPREAD.width[0], SPREAD.width[1] * (1 + f * 0.5), h);
      const length = mix(SPREAD.length[0], SPREAD.length[1], h);
      bag.scale.set(hx, length, hz);
      knot.position.y = -length - 0.05;
      knot.scale.setScalar(Math.max(0.001, 1 - pose.open));
      holder.position.y = -length * 0.88;
      floats.forEach((m, i) => {
        const th = -Math.PI / 2 + (i / (floats.length - 1)) * Math.PI;
        m.position.set(Math.cos(th) * hx + 0.08, 0, Math.sin(th) * hz);
      });
      bobbins.forEach((m, i) => {
        const th = Math.PI / 2 + (i / (bobbins.length - 1)) * Math.PI;
        m.position.set(Math.cos(th) * hx, -0.04, Math.sin(th) * hz);
      });
      doors.forEach((door) => {
        const s = door.userData.side as number;
        door.position.set(0, mix(0.9, 0.25, h), s * (hz + mix(0.55, 0.12, h)));
        door.rotation.x = s * mix(0.35, 0, h);
      });

      rig.updateMatrixWorld(true);
      doors.forEach((door, i) => {
        door.getWorldPosition(a);
        warp(i, a);
        rig.localToWorld(b.set(0, 0, (door.userData.side as number) * hz));
        run(bridles[i], a, b);
      });
    },
    dispose() {
      netMap.dispose();
      netInk.dispose();
    },
  };
}
