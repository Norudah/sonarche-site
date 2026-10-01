import { Color, MeshStandardMaterial, type BufferGeometry, type Material } from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { oklch } from "@/components/brand/scene/color";

/* The logo's hex values as lit satin materials. A Kit tracks every geometry and material for one-call disposal. */

export const INK = {
  hull: "#3d4097",
  strake: "#4f52c1",
  keel: "#2e3172",
  rail: "#818cf9",
  cabin: "#c5cbef",
  brow: "#a5aede",
  eye: "#222652",
  glint: "#e4e7ff",
  amber: "#efa831",
  amberBand: "#fae1b8",
  deck: "#5b5fc7",
} as const;

/** --accent: the equalizer, the notes, anything that is sound. */
export const ACCENT = oklch(0.505, 0.185, 277);

export type Kit = {
  /** Satin paint: the hull, the cabin, the crates. */
  paint(hex: string | Color, roughness?: number): MeshStandardMaterial;
  /** Machined metal: pins, gears, the rams' rods. Takes the environment's sheen. */
  metal(hex: string | Color, roughness?: number): MeshStandardMaterial;
  /** Something that glows: portholes, glints, notes, the beacon. */
  glow(hex: string | Color, emissive: string | Color, intensity: number): MeshStandardMaterial;
  keep<T extends BufferGeometry>(geometry: T): T;
  /** Kept, with normals smoothed across edges under 50° so extruded curves don't read as polygons. */
  smooth(geometry: BufferGeometry): BufferGeometry;
  dispose(): void;
};

export function createKit(): Kit {
  const materials: Material[] = [];
  const geometries: BufferGeometry[] = [];

  return {
    paint(hex, roughness = 0.52) {
      const m = new MeshStandardMaterial({ color: hex, roughness, metalness: 0 });
      materials.push(m);
      return m;
    },
    metal(hex, roughness = 0.3) {
      const m = new MeshStandardMaterial({ color: hex, roughness, metalness: 0.65 });
      materials.push(m);
      return m;
    },
    glow(hex, emissive, intensity) {
      const m = new MeshStandardMaterial({
        color: hex,
        emissive,
        emissiveIntensity: intensity,
        roughness: 0.25,
        metalness: 0,
      });
      materials.push(m);
      return m;
    },
    keep(geometry) {
      geometries.push(geometry);
      return geometry;
    },
    smooth(geometry) {
      const smoothed = toCreasedNormals(geometry, (50 * Math.PI) / 180);
      geometry.dispose();
      geometries.push(smoothed);
      return smoothed;
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
