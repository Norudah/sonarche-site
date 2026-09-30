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
 * The trawl: the other way the vessel fishes, off its stern (the right-hand
 * end, where the crane is at the bow), for the shoals.
 *
 * A beam trawl, the toy kind: a steel beam on two D-shaped runners, amber
 * floats along it, and a net bag behind it tied off at the cod-end. It is
 * worked from an A-frame gantry standing on the transom, which two rams tip
 * outboard over the water or inboard over the deck, with a block at its head
 * the warps run through.
 *
 * Shot, it is lowered to the water and, as the vessel gets under way, streams
 * out astern on its warps, the floats riding the swell, and whatever the net
 * passes through goes into the bag. Hauled, the warps come in, the beam comes
 * up under the block, the bag hanging heavy and dripping, and the gantry tips
 * it inboard over one of the two boxes at its foot; the cod-end is untied and
 * the catch drops in through the open hatch.
 *
 * Driven by `pose`: the gantry's tilt, how far the rig hangs below the block,
 * whether it is streamed or hanging (`hang`, blended so shooting and hauling
 * are one continuous motion), and the cod-end.
 */

/** The gantry's pivot on the transom, in the boat's frame, its height and where its legs stand. */
export const GANTRY = { x: 9.25, height: 3.8, feet: 1.15 };
/** How far astern the rig streams when towed, world units. */
const TOW = 6;

export type TrawlPose = {
  /** Radians: positive tips the gantry outboard, over the water. */
  tilt: number;
  /** How far the beam hangs below the block when it hangs. */
  drop: number;
  /** 0 streamed astern on the water, 1 hanging from the block. */
  hang: number;
  /** 0..1: the cod-end untied. */
  open: number;
  /** 0..1: how full the bag hangs. */
  fill: number;
};

export const TRAWL_REST: TrawlPose = { tilt: 0, drop: 0.35, hang: 1, open: 0, fill: 0 };

/** The tilt that puts the block over a point `x` along the deck. */
export const tiltOver = (x: number) => -Math.asin(Math.min(1, (GANTRY.x - x) / GANTRY.height));

function netting(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "rgba(255, 255, 255, 1)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, size);
  ctx.moveTo(size, 0);
  ctx.lineTo(0, size);
  ctx.stroke();
  const texture = new CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(12, 4);
  return texture;
}

const UP = new Vector3(0, 1, 0);

export function createTrawl(kit: Kit, size: number) {
  const indigo = kit.paint(INK.hull, 0.45);
  const strake = kit.paint(INK.strake, 0.42);
  const amber = kit.paint(INK.amber, 0.42);
  const steel = kit.metal(INK.rail, 0.32);
  const chrome = kit.metal(INK.glint, 0.2);
  const dark = kit.paint(INK.eye, 0.5);
  const H = GANTRY.height;

  // --- The gantry --------------------------------------------------------------
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

  // Two rams, from the deck to each leg, tipping it.
  const rams = [-1, 1].map((side) => {
    const r = ram(kit, indigo, chrome, 0.075, 1.0);
    group.add(...r.parts);
    return { r, base: new Vector3(-1.25, 0.12, side * (GANTRY.feet - 0.16)), end: new Vector3() };
  });

  // --- The rig: beam, runners, floats, bag ---------------------------------------
  const rig = new Group();
  const beam = new Mesh(kit.keep(new CylinderGeometry(0.07, 0.07, 2.1, 20)).rotateX(Math.PI / 2), indigo);
  rig.add(beam);
  const runnerGeometry = kit.keep(new TorusGeometry(0.28, 0.05, 10, 24, Math.PI).rotateZ(Math.PI));
  for (const z of [-1.05, 1.05]) {
    const runner = new Mesh(runnerGeometry, amber);
    runner.position.z = z;
    rig.add(runner);
  }
  const floatGeometry = kit.keep(new SphereGeometry(0.12, 18, 12));
  for (const z of [-0.6, 0, 0.6]) {
    const float = new Mesh(floatGeometry, amber);
    float.position.set(0, 0.12, z);
    rig.add(float);
  }
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
  const profile = [
    [0.72, 0],
    [0.7, -0.22],
    [0.63, -0.5],
    [0.49, -0.78],
    [0.3, -0.98],
    [0.1, -1.08],
    [0.001, -1.1],
  ].map(([x, y]) => new Vector2(x, y));
  const bag = new Mesh(kit.keep(new LatheGeometry(profile, 40)), netInk);
  const BAG = { x: 0.55, y: 1.25, z: 1.35 };
  const knot = new Mesh(kit.keep(new SphereGeometry(0.1, 14, 10)), amber);
  const holder = new Group();
  holder.position.y = -0.95;
  rig.add(bag, knot, holder);
  rig.scale.setScalar(size);

  // The warps, from the block down to either end of the beam.
  const strand = kit.keep(new CylinderGeometry(0.022, 0.022, 1, 8));
  const warps = [new Mesh(strand, dark), new Mesh(strand, dark)];
  const rigging = new Group();
  rigging.add(rig, ...warps);

  const pose: TrawlPose = { ...TRAWL_REST };
  const trail = new Vector3();
  const blockAt = new Vector3();
  const target = new Vector3();
  const astern = new Vector3();
  const along = new Vector3();
  const hanging = new Quaternion();
  const streamed = new Quaternion();
  const basis = new Matrix4();
  const x = new Vector3();
  const y = new Vector3();
  const z = new Vector3();
  const a = new Vector3();
  const b = new Vector3();
  let started = false;

  function run(m: Mesh, from: Vector3, to: Vector3) {
    along.subVectors(to, from);
    const length = along.length();
    m.position.copy(from).addScaledVector(along, 0.5);
    m.scale.set(1, Math.max(0.001, length), 1);
    m.quaternion.setFromUnitVectors(UP, along.normalize());
  }

  return {
    group,
    /** World-space: the rig and its warps. */
    rigging,
    pose,
    /** What the catch is held in: the bag, near its cod-end. */
    holder: holder as Object3D,
    /** Where the net's mouth is in the world. */
    mouth: (out: Vector3) => out.copy(rig.position),
    /** A place in the bag for the i-th of n notes, in the holder's frame. */
    pocket(i: number) {
      return new Vector3(((i % 2) - 0.5) * 0.3, (i % 3) * 0.14, (i - 1) * 0.28);
    },
    /**
     * @param body the boat's frame, for where the stern is and which way is astern.
     * @param water the sea's height at a point, so the streamed rig rides it.
     */
    update(t: number, dt: number, body: Object3D, water: (x: number, z: number) => number) {
      frame.rotation.z = -pose.tilt;
      for (const side of rams) {
        side.end.set(Math.sin(pose.tilt) * 1.7, Math.cos(pose.tilt) * 1.7, side.base.z);
        side.r.set(side.base, side.end);
      }
      lampInk.emissiveIntensity = (t % 2.4) / 2.4 < 0.12 ? 2.4 : 0.35;

      group.updateWorldMatrix(true, true);
      block.getWorldPosition(blockAt);
      body.getWorldQuaternion(hanging);

      // Astern: where the rig streams to, lagging the boat as it turns and stops.
      astern.set(1, 0, 0).applyQuaternion(hanging).setY(0).normalize();
      body.localToWorld(target.set(HULL.halfLength, 0, 0)).addScaledVector(astern, TOW);
      if (!started || pose.hang > 0.98) trail.copy(blockAt);
      started = true;
      trail.x += (target.x - trail.x) * Math.min(1, dt * 1.4);
      trail.z += (target.z - trail.z) * Math.min(1, dt * 1.4);
      trail.y = water(trail.x, trail.z) + 0.05;

      // Streamed, the bag trails astern of the beam, just under the surface.
      y.subVectors(blockAt, trail).setY(0).normalize();
      y.y = 0.25;
      y.normalize();
      z.set(0, 0, 1).applyQuaternion(hanging);
      x.crossVectors(y, z).normalize();
      z.crossVectors(x, y).normalize();
      basis.makeBasis(x, y, z);
      streamed.setFromRotationMatrix(basis);

      const h = pose.hang;
      a.copy(blockAt).setY(blockAt.y - (0.3 + pose.drop) * size);
      rig.position.lerpVectors(trail, a, h);
      rig.quaternion.slerpQuaternions(streamed, hanging, h);

      const f = pose.fill;
      bag.scale.set(BAG.x * (1 + f * 0.25), BAG.y * (1 + f * 0.12), BAG.z * (1 + f * 0.1));
      knot.position.y = -1.1 * BAG.y * (1 + f * 0.12);
      knot.scale.setScalar(Math.max(0.001, 1 - pose.open));
      holder.position.y = knot.position.y + 0.4;

      rig.updateMatrixWorld(true);
      run(warps[0], blockAt, rig.localToWorld(a.set(0, 0, -1.0)));
      run(warps[1], blockAt, rig.localToWorld(b.set(0, 0, 1.0)));
    },
    dispose() {
      netMap.dispose();
      netInk.dispose();
    },
  };
}
