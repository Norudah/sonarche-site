import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, type Object3D } from "three";

import { HULL } from "./hull";
import type { Kit } from "./materials";

/*
 * Contact shadows, painted: a soft indigo pool under whatever stands on the
 * deck. A real shadow map would cost a second pass of the boat every frame for
 * the same few pools; this is one small gradient texture and a quad per item.
 */

function pool(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(34, 38, 82, 0.55)");
  g.addColorStop(0.55, "rgba(34, 38, 82, 0.25)");
  g.addColorStop(1, "rgba(34, 38, 82, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/** Footprints on the deck: x, z, half-length, half-beam. */
const FOOTPRINTS = [
  [0, 0, 2.9, 1.95], // the cabin
  [-4.07, 0, 1.55, 1.35], // the stern containers
  [3.45, 0, 0.75, 1.15], // the archive at the bow
  [-6, 0, 0.85, 0.85], // the crane
];

export function createShadows(kit: Kit, deck: Object3D) {
  const texture = pool();
  const ink = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const quad = kit.keep(new PlaneGeometry(2, 2)).rotateX(-Math.PI / 2);
  for (const [x, z, a, b] of FOOTPRINTS) {
    const shadow = new Mesh(quad, ink);
    shadow.position.set(x + 0.25, HULL.deck + 0.01, z + 0.2);
    shadow.scale.set(a * 1.25, 1, b * 1.25);
    shadow.renderOrder = 1;
    deck.add(shadow);
  }
  return {
    dispose() {
      texture.dispose();
      ink.dispose();
    },
  };
}
