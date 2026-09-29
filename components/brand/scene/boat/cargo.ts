import { Group, Mesh, PlaneGeometry, Vector3, type MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import { HULL } from "./hull";
import { ACCENT, INK, type Kit } from "./materials";

/*
 * The hold, above deck: where the music goes.
 *
 * The mark stows amber crates at the ends and indigo ones amidships. Here the
 * amber ones are the working rack at the stern — four crates the crane fills,
 * one note each, lids hinged at the back so they open towards the camera —
 * and the indigo ones are stacked at the bow, cargo already carried home.
 *
 * A crate is a group: body, band, a dark inside that only shows with the lid
 * up, and the lid on its hinge. The fishing choreography (boat.ts) opens,
 * fills and closes them; this only builds them and says where they are.
 */

const CRATE = 1.2;
const CRATE_HEIGHT = 1;

export type Crate = {
  group: Group;
  /** The lid's hinge: rotation.x < 0 opens it. */
  lid: Group;
  /** The band, which flares when a note is stowed. */
  band: MeshStandardMaterial;
  /** The top of the crate, in the boat's frame: where a note is lowered to. */
  mouth: Vector3;
  filled: boolean;
};

/** Stern rack, camera side first: the crates the visitor sees fill first. */
const RACK = [
  [-3.45, 0.7],
  [-4.8, 0.7],
  [-3.45, -0.7],
  [-4.8, -0.7],
];

export function createCargo(kit: Kit) {
  const group = new Group();

  const body = kit.keep(new RoundedBoxGeometry(CRATE, CRATE_HEIGHT, CRATE, 3, 0.14));
  const bandGeometry = kit.keep(new RoundedBoxGeometry(CRATE + 0.05, 0.16, CRATE + 0.05, 2, 0.07));
  const lidGeometry = kit.keep(new RoundedBoxGeometry(CRATE + 0.06, 0.18, CRATE + 0.06, 2, 0.08));
  const insideGeometry = kit.keep(new PlaneGeometry(CRATE - 0.3, CRATE - 0.3)).rotateX(-Math.PI / 2);
  const amber = kit.paint(INK.amber, 0.5);
  const lidInk = kit.paint("#e79d22", 0.48);
  const inside = kit.glow(INK.keel, ACCENT, 0.15);

  const crates: Crate[] = RACK.map(([x, z]) => {
    const crate = new Group();
    crate.position.set(x, HULL.deck + CRATE_HEIGHT / 2, z);

    const box = new Mesh(body, amber);
    const band = kit.glow(INK.amberBand, INK.amber, 0);
    const strap = new Mesh(bandGeometry, band);
    strap.position.y = 0.05;
    const hollow = new Mesh(insideGeometry, inside);
    hollow.position.y = CRATE_HEIGHT / 2 + 0.005;

    const lid = new Group();
    lid.position.set(0, CRATE_HEIGHT / 2, -CRATE / 2);
    const cover = new Mesh(lidGeometry, lidInk);
    cover.position.set(0, 0.09, CRATE / 2);
    lid.add(cover);

    crate.add(box, strap, hollow, lid);
    group.add(crate);

    return {
      group: crate,
      lid,
      band,
      mouth: new Vector3(x, HULL.deck + CRATE_HEIGHT, z),
      filled: false,
    };
  });

  // The bow's stack: the mark's indigo crates, cargo already home.
  const small = kit.keep(new RoundedBoxGeometry(0.95, 0.8, 0.95, 3, 0.12));
  const smallBand = kit.keep(new RoundedBoxGeometry(0.99, 0.13, 0.99, 2, 0.06));
  const indigo = kit.paint(INK.hull, 0.5);
  const lavender = kit.paint(INK.rail, 0.45);
  for (const [x, y, z] of [
    [3.25, 0, 0.6],
    [3.25, 0, -0.6],
    [3.3, 0.8, 0],
  ]) {
    const box = new Mesh(small, indigo);
    const strap = new Mesh(smallBand, lavender);
    box.position.set(x, HULL.deck + 0.4 + y, z);
    strap.position.copy(box.position);
    group.add(box, strap);
  }

  return {
    group,
    crates,
    /** The next crate to fill, or undefined once the rack is full. */
    next: () => crates.find((c) => !c.filled),
  };
}
