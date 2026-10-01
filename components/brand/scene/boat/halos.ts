import { CanvasTexture, InstancedBufferAttribute, Mesh, ShaderMaterial, type Color, type Vector3 } from "three";

import { cardGeometry } from "@/components/brand/scene/card";

const vertex = /* glsl */ `
attribute vec4 aHalo; // centre, size
attribute vec4 aTint; // rgb, alpha
varying vec2 vUv;
varying vec4 vTint;
void main() {
  vec4 mv = viewMatrix * vec4(aHalo.xyz, 1.0);
  mv.xy += position.xy * aHalo.w;
  // Behind the note, so it glows round it rather than veiling it.
  mv.z -= aHalo.w * 0.35;
  vUv = position.xy + 0.5;
  vTint = aTint;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform sampler2D uMap;
varying vec2 vUv;
varying vec4 vTint;
void main() {
  float a = texture2D(uMap, vUv).a * vTint.a;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(vTint.rgb, a);
  #include <colorspace_fragment>
}
`;

function glowTexture(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 255, 255, 0.9)");
  g.addColorStop(0.45, "rgba(255, 255, 255, 0.33)");
  g.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/** One instanced layer of soft halos that keeps every note readable against the water. */
export function createHalos(max: number) {
  const map = glowTexture();
  const geometry = cardGeometry(true);
  const centres = new Float32Array(max * 4);
  const tints = new Float32Array(max * 4);
  const centreAttribute = new InstancedBufferAttribute(centres, 4);
  const tintAttribute = new InstancedBufferAttribute(tints, 4);
  geometry.setAttribute("aHalo", centreAttribute);
  geometry.setAttribute("aTint", tintAttribute);
  geometry.instanceCount = 0;
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: { uMap: { value: map } },
    transparent: true,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 1;

  return {
    mesh,
    set(i: number, at: Vector3, size: number, tint: Color, alpha: number) {
      centres.set([at.x, at.y, at.z, size], i * 4);
      tints.set([0.85 + tint.r * 0.15, 0.85 + tint.g * 0.15, 0.85 + tint.b * 0.15, alpha], i * 4);
    },
    commit(count: number) {
      geometry.instanceCount = count;
      centreAttribute.needsUpdate = true;
      tintAttribute.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      map.dispose();
    },
  };
}
