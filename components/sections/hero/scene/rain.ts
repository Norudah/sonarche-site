import { InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3 } from "three";

import { cardGeometry } from "./card";
import { OKLCH_GLSL } from "./color";
import type { Framing } from "./framing";

/*
 * The storm's rain, in depth.
 *
 * The poster's drops are one plane of 1px lines. Here they fall at every
 * distance from just past the lens to far out over the water, and that parallax
 * — thick, fast, soft streaks up close against fine ones behind the ark — is
 * most of what makes the scene read as a volume in the first second.
 *
 * Width is set in pixels, not world units: a drop is a hair on screen at any
 * distance, and only the closest few are allowed to swell into a blur.
 */

/** Top of the fall, world units above the water. */
const CEILING = 34;

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function layout(framing: Framing, count: number): Float32Array {
  const rnd = lehmer(7);
  const out = new Float32Array(count * 4);
  const near = framing.distance * 0.32;
  const far = framing.distance * 1.9;
  for (let i = 0; i < count; i++) {
    // Squared so the drops thin out with distance instead of piling up behind
    // the ark, where they would be a grey veil rather than rain.
    const dz = near + (far - near) * rnd() ** 1.6;
    const half = ((framing.width / 2 + 40) * dz) / framing.focal;
    out.set([(rnd() * 2 - 1) * half, framing.eyeZ - dz, rnd(), dz], i * 4);
  }
  return out;
}

const vertex = /* glsl */ `
attribute vec4 aDrop; // x, z, seed, distance

uniform float uTime;
uniform float uFocal;
uniform float uDistance;
uniform vec3 uReveal;

varying float vAlong;
varying float vAlpha;
varying float vY;
varying float vReveal;

void main() {
  float seed = aDrop.z;
  float dz = aDrop.w;
  float len = 1.6 + seed * 2.4;
  float speed = 30.0 + seed * 22.0;
  float span = ${CEILING.toFixed(1)} + len;
  float foot = ${CEILING.toFixed(1)} - mod(uTime * speed + seed * 97.0, span);

  // A hair on screen, but the drops right at the lens are close enough to blur.
  float near = dz / uDistance;
  float px = 1.0 + 0.8 * (1.0 - smoothstep(0.35, 0.7, near));
  float w = px * dz / uFocal;

  vec3 world = vec3(aDrop.x + position.x * w, foot + position.y * len, aDrop.y);
  // Drops fall only where the ark's first ping has reached (see sea.ts).
  vReveal = smoothstep(uReveal.x, uReveal.x - uReveal.y, length(aDrop.xy));
  vAlong = position.y;
  vY = world.y;
  vAlpha = (0.14 + fract(seed * 13.7) * 0.34) * (1.0 - smoothstep(0.7, 2.0, near) * 0.6);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const fragment = /* glsl */ `
${OKLCH_GLSL}

uniform float uRain;

varying float vAlong;
varying float vAlpha;
varying float vY;
varying float vReveal;

void main() {
  // Swallowed by the water, like the poster's drops clipped at the waterline.
  if (vY < 0.2) discard;
  // Transparent at the tail, the poster's gradient: the tip is what lands.
  // Thinner high up, where it falls behind the copy: the storm is on the
  // water, and the headline should not have to read through it.
  float a = (1.0 - vAlong) * vAlpha * uRain * vReveal * mix(1.0, 0.45, smoothstep(6.0, 26.0, vY));
  gl_FragColor = vec4(oklch(0.6, 0.16, 277.0), a);
  #include <colorspace_fragment>
}
`;

export function createRain(count: number) {
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uFocal: { value: 1 },
      uDistance: { value: 60 },
      uRain: { value: 1 },
      uReveal: { value: new Vector3(1e5, 1, 0) },
    },
  });

  const geometry = cardGeometry();
  geometry.instanceCount = count;

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  // Drawn after the sea, which has its own back-to-front order.
  mesh.renderOrder = 2;

  return {
    mesh,
    uniforms: material.uniforms,
    relayout(framing: Framing) {
      geometry.setAttribute("aDrop", new InstancedBufferAttribute(layout(framing, count), 4));
      material.uniforms.uFocal.value = framing.focal;
      material.uniforms.uDistance.value = framing.distance;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
