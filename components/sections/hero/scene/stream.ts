import { InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3 } from "three";

import { cardGeometry } from "./card";
import { OKLCH_GLSL } from "./color";
import type { Framing } from "./framing";

/*
 * The rescue — the "Ark moment" of docs/CONTEXT.md, and the one thing in the
 * scene the poster could never do.
 *
 * The internet is a sea of pixels; the music worth keeping is lifted out of it.
 * So pixels detach from the water all across the field, arc up over the storm
 * and converge on the ark's hold, shrinking as they are taken aboard. Most are
 * the accent, some the pale indigo of the crests, a few the amber of the cargo
 * already stowed — the same three colours the vessel carries.
 *
 * `uStream` is a count, not a fade: raising it from 0 to 1 wakes the pixels one
 * seed at a time, so the intro starts as a trickle and becomes a current.
 */

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/*
 * Where the music is fished out: a handful of spots on the water, each feeding
 * its own ribbon. Pixels scattered evenly over the whole sea read as confetti;
 * gathered into streams they read as something being *taken* — which is the
 * point. x is a fraction of the half-width at the ark, z a multiple of the
 * camera's distance from the eye; all behind or beside the berth, so nothing
 * flies across the vessel's face.
 */
const SOURCES = [
  [-0.78, 1.25],
  [0.82, 1.05],
  [-0.38, 1.75],
  [0.46, 1.6],
  [-1.05, 0.72],
  [1.1, 0.8],
  [0.12, 2.05],
  [-0.12, 1.4],
];

function layout(framing: Framing, count: number): { pixels: Float32Array; arcs: Float32Array } {
  const rnd = lehmer(1104);
  const pixels = new Float32Array(count * 4);
  const arcs = new Float32Array(count * 2);
  const halfWidth = Math.max(((framing.width / 2) * framing.distance) / framing.focal, 24);
  const sources = SOURCES.map(([fx, fz]) => ({
    x: fx * halfWidth,
    z: framing.eyeZ - fz * framing.distance,
    height: 5 + rnd() * 9,
    cycle: 4.6 + rnd() * 2.4,
  }));
  for (let i = 0; i < count; i++) {
    const source = sources[i % sources.length];
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 2.6;
    pixels.set([source.x + Math.cos(a) * r, source.z + Math.sin(a) * r, rnd(), rnd()], i * 4);
    arcs.set([source.height + (rnd() - 0.5) * 1.6, source.cycle], i * 2);
  }
  return { pixels, arcs };
}

const vertex = /* glsl */ `
${OKLCH_GLSL}

attribute vec4 aPixel; // x, z, seed, kind
attribute vec2 aArc; // apex height, seconds per trip

uniform float uTime;
uniform float uStream;
uniform float uFocal;
uniform vec3 uEye;
uniform vec3 uHold;

varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float seed = aPixel.z;
  // One period per ribbon, phases spread along it: a string of pixels, not a burst.
  float u = fract(uTime / aArc.y + seed);
  // Slow off the water, quick into the hold.
  float e = pow(u, 1.55);

  vec3 from = vec3(aPixel.x, 0.4, aPixel.y);
  vec3 to = uHold + vec3((fract(seed * 17.1) - 0.5) * 2.0, (fract(seed * 23.7) - 0.5) * 0.7, 0.0);
  vec3 over = vec3(mix(from.x, to.x, 0.3), aArc.x, mix(from.z, to.z, 0.55));
  vec3 p = mix(mix(from, over, e), mix(over, to, e), e);

  float dist = distance(uEye, p);
  float px = mix(9.0, 2.5, smoothstep(0.55, 1.0, u)) * (0.75 + fract(seed * 3.3) * 0.6);
  float size = px * dist / uFocal;

  float a = fract(seed * 11.0) * 6.2831 + uTime * (0.5 + seed);
  mat2 spin = mat2(cos(a), sin(a), -sin(a), cos(a));
  vec2 corner = spin * position.xy * size;

  float awake = clamp((uStream - seed) * 10.0, 0.0, 1.0);
  vAlpha = smoothstep(0.0, 0.12, u) * (1.0 - smoothstep(0.9, 1.0, u)) * awake;
  vCorner = position.xy * 2.0;

  float kind = aPixel.w;
  vColor = kind < 0.16 ? oklch(0.78, 0.15, 75.0) : kind < 0.62 ? oklch(0.505, 0.185, 277.0) : oklch(0.7, 0.13, 280.0);

  gl_Position = projectionMatrix * viewMatrix * vec4(p + vec3(corner, 0.0), 1.0);
}
`;

const fragment = /* glsl */ `
varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;

void main() {
  // A pixel with its corners just softened — the app's own radius, not a dot.
  vec2 q = abs(vCorner) - vec2(0.6);
  float d = length(max(q, 0.0)) - 0.4;
  float aa = fwidth(d);
  float edge = 1.0 - smoothstep(-aa, aa, d);
  if (edge * vAlpha <= 0.0) discard;
  gl_FragColor = vec4(vColor, edge * vAlpha);
  #include <colorspace_fragment>
}
`;

export function createStream(count: number) {
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uStream: { value: 0 },
      uFocal: { value: 1 },
      uEye: { value: new Vector3() },
      uHold: { value: new Vector3() },
    },
  });

  const geometry = cardGeometry(true);
  geometry.instanceCount = count;

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;

  return {
    mesh,
    uniforms: material.uniforms,
    relayout(framing: Framing) {
      const { pixels, arcs } = layout(framing, count);
      geometry.setAttribute("aPixel", new InstancedBufferAttribute(pixels, 4));
      geometry.setAttribute("aArc", new InstancedBufferAttribute(arcs, 2));
      material.uniforms.uFocal.value = framing.focal;
      material.uniforms.uEye.value.set(0, framing.eyeY, framing.eyeZ);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
