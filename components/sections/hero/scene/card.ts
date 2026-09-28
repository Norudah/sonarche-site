import { BufferAttribute, InstancedBufferGeometry } from "three";

/*
 * The one shape every instanced layer draws: a unit card, x across -0.5..0.5,
 * y up 0..1. The shaders stretch it into a bar, a drop or a pixel.
 */
export function cardGeometry(centered = false): InstancedBufferGeometry {
  const y0 = centered ? -0.5 : 0;
  const y1 = centered ? 0.5 : 1;
  const geometry = new InstancedBufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(new Float32Array([-0.5, y0, 0, 0.5, y0, 0, 0.5, y1, 0, -0.5, y1, 0]), 3),
  );
  geometry.setIndex([0, 1, 2, 0, 2, 3]);
  return geometry;
}
