import { Color, InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3, Vector4 } from "three";

import { cardGeometry } from "./card";

/*
 * Small ballistic bursts: spray when something hits the water, sparks when a
 * note is stowed. Nothing in the scene should appear or vanish without a cause
 * the eye can see, and these are the cause.
 *
 * A fixed pool of slots, each a handful of round droplets thrown up and out
 * from an origin and pulled back down; the vertex shader does all of it from
 * the slot's origin, start time and kind. A new burst takes the oldest slot.
 */

const SLOTS = 6;
const PER_SLOT = 30;

export type BurstKind = {
  color: Color;
  /** Launch speed, world units per second. */
  speed: number;
  /** Droplet size, px. */
  size: number;
  /** Seconds a droplet lives. */
  life: number;
  /** How upward the throw is, 0 flat to 1 straight up. */
  lift: number;
};

export const SPRAY: BurstKind = { color: new Color("#eef0ff"), speed: 7, size: 5, life: 0.9, lift: 0.75 };
export const SPARK: BurstKind = { color: new Color("#f7c25c"), speed: 4.5, size: 4, life: 0.8, lift: 0.9 };

const vertex = /* glsl */ `
#define SLOTS ${SLOTS}
attribute vec2 aDrop; // slot, seed

uniform float uTime;
uniform float uFocal;
uniform vec3 uEye;
uniform vec4 uOrigin[SLOTS]; // x, y, z, start
uniform vec4 uKind[SLOTS];   // speed, size, life, lift
uniform vec3 uColor[SLOTS];

varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;

void main() {
  int slot = int(aDrop.x);
  float seed = aDrop.y;
  vec4 o = uOrigin[slot];
  vec4 k = uKind[slot];
  float age = uTime - o.w;
  float life = k.z * (0.7 + fract(seed * 7.3) * 0.5);
  float alive = step(0.0, age) * step(age, life);

  float a = seed * 6.2831;
  float up = mix(0.3, 1.0, k.w) * (0.6 + fract(seed * 3.1) * 0.6);
  vec3 dir = normalize(vec3(cos(a), up * 2.0, sin(a) * 0.8));
  float speed = k.x * (0.5 + fract(seed * 11.7) * 0.7);
  vec3 p = o.xyz + dir * speed * age + vec3(0.0, -9.8 * age * age, 0.0);

  float dist = distance(uEye, p);
  float px = k.y * (1.0 - smoothstep(0.4, 1.0, age / life) * 0.6);
  vec2 corner = position.xy * px * dist / uFocal;

  vAlpha = alive * (1.0 - smoothstep(0.55, 1.0, age / life));
  vCorner = position.xy * 2.0;
  vColor = uColor[slot];
  gl_Position = projectionMatrix * viewMatrix * vec4(p + vec3(corner, 0.0), 1.0);
}
`;

const fragment = /* glsl */ `
varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(vCorner);
  float aa = fwidth(d);
  float edge = 1.0 - smoothstep(1.0 - aa, 1.0, d);
  if (edge * vAlpha <= 0.0) discard;
  gl_FragColor = vec4(vColor, edge * vAlpha);
  #include <colorspace_fragment>
}
`;

export function createBursts() {
  const origins = Array.from({ length: SLOTS }, () => new Vector4(0, 0, 0, -1000));
  const kinds = Array.from({ length: SLOTS }, () => new Vector4(1, 1, 1, 1));
  const colors = Array.from({ length: SLOTS }, () => new Color());

  const drops = new Float32Array(SLOTS * PER_SLOT * 2);
  for (let s = 0; s < SLOTS; s++) {
    for (let i = 0; i < PER_SLOT; i++) drops.set([s, (i + 0.5) / PER_SLOT + s * 0.137], (s * PER_SLOT + i) * 2);
  }

  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uFocal: { value: 1 },
      uEye: { value: new Vector3() },
      uOrigin: { value: origins },
      uKind: { value: kinds },
      uColor: { value: colors },
    },
  });

  const geometry = cardGeometry(true);
  geometry.setAttribute("aDrop", new InstancedBufferAttribute(drops, 2));
  geometry.instanceCount = SLOTS * PER_SLOT;

  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = 4;

  let next = 0;

  return {
    mesh,
    uniforms: material.uniforms,
    fire(at: Vector3, time: number, kind: BurstKind) {
      origins[next].set(at.x, at.y, at.z, time);
      kinds[next].set(kind.speed, kind.size, kind.life, kind.lift);
      colors[next].copy(kind.color);
      next = (next + 1) % SLOTS;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
