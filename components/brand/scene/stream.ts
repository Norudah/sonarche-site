import { InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3 } from "three";

import { cardGeometry } from "./card";
import { OKLCH_GLSL } from "./color";

/*
 * A note condensing out of the sea of pixels.
 *
 * When a note surfaces (boat/boat.ts), a swarm of pixels spirals in on it
 * from the water around it and is absorbed: the music is made of the stream,
 * and this is the moment it is picked out. The swarm stays local — a few
 * world units round the note — so nothing ever drifts across the vessel: an
 * isolated square floating in front of the hull reads as a rendering fault,
 * not as a pixel.
 *
 * `uStream` wakes the pixels one seed at a time, so a burst starts as a
 * trickle and becomes a swirl.
 */

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function layout(count: number): Float32Array {
  const rnd = lehmer(1104);
  const out = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) out.set([rnd() * Math.PI * 2, 2.2 + rnd() * 3.6, rnd(), rnd()], i * 4);
  return out;
}

const vertex = /* glsl */ `
${OKLCH_GLSL}

attribute vec4 aPixel; // angle, radius, seed, kind

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
  float cycle = 1.1 + seed * 0.9;
  float u = fract(uTime / cycle + seed * 5.7);
  float e = u * u * (3.0 - 2.0 * u);

  // A spiral in: the angle winds as the radius closes, and the pixel lifts
  // off the water on the way.
  float angle = aPixel.x + e * 2.4;
  float radius = aPixel.y * (1.0 - e);
  vec3 p = uHold + vec3(cos(angle) * radius, (1.0 - e) * (0.3 + seed * 1.8) - 0.5 * (1.0 - e) * (1.0 - e), sin(angle) * radius * 0.7);

  float dist = distance(uEye, p);
  float px = mix(5.5, 1.5, e);
  float size = px * dist / uFocal;

  float a = seed * 6.2831 + uTime * (1.0 + seed);
  mat2 spin = mat2(cos(a), sin(a), -sin(a), cos(a));
  vec2 corner = spin * position.xy * size;

  float awake = clamp((uStream - seed) * 6.0, 0.0, 1.0);
  vAlpha = smoothstep(0.0, 0.15, u) * (1.0 - smoothstep(0.85, 1.0, u)) * awake;
  vCorner = position.xy * 2.0;

  float kind = aPixel.w;
  vColor = kind < 0.45 ? oklch(0.78, 0.15, 75.0) : kind < 0.8 ? oklch(0.6, 0.19, 277.0) : oklch(0.86, 0.07, 280.0);

  gl_Position = projectionMatrix * viewMatrix * vec4(p + vec3(corner, 0.0), 1.0);
}
`;

const fragment = /* glsl */ `
varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 q = abs(vCorner) - vec2(0.55);
  float d = length(max(q, 0.0)) - 0.45;
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
  geometry.setAttribute("aPixel", new InstancedBufferAttribute(layout(count), 4));
  geometry.instanceCount = count;

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 3;

  return {
    mesh,
    uniforms: material.uniforms,
    relayout(framing: { focal: number }) {
      material.uniforms.uFocal.value = framing.focal;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
