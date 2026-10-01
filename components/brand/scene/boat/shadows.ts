import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, type Object3D } from "three";

import { HULL } from "./hull";
import type { Kit } from "./materials";

/* Painted contact shadows: one gradient quad per item instead of a shadow map's second pass. */

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

/** A footprint on the deck: x, z, half-length along its own x, half-width, yaw. */
export type Footprint = readonly [number, number, number, number, number];

export function createShadows(kit: Kit, deck: Object3D, footprints: readonly Footprint[]) {
  const texture = pool();
  const ink = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const quad = kit.keep(new PlaneGeometry(2, 2)).rotateX(-Math.PI / 2);
  for (const [x, z, a, b, yaw] of footprints) {
    const shadow = new Mesh(quad, ink);
    shadow.position.set(x + 0.25, HULL.deck + 0.01, z + 0.2);
    shadow.rotation.y = yaw;
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
