import { BufferAttribute, InstancedBufferGeometry } from "three";

/* A unit card, x -0.5..0.5, y 0..1, stretched by each instanced layer's shader. */
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
