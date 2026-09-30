import { Color, InstancedBufferAttribute, Mesh, ShaderMaterial, Vector3, Vector4 } from "three";

import { cardGeometry } from "./card";

/*
 * Small ballistic bursts: spray when something hits the water, sparks when a
 * note is stowed, dust when a hatch slams, smoke from the funnel. Nothing in
 * the scene should appear or vanish without a cause the eye can see, and these
 * are the cause.
 *
 * A fixed pool of slots, each up to a few dozen round droplets thrown up and
 * out from an origin; the vertex shader does all of it from the slot's origin,
 * start time and kind. Droplets fall (spray) or rise and swell (smoke, which
 * is drawn soft and drifts downwind). A new burst takes the oldest slot.
 */

const SLOTS = 24;
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
  /** Vertical pull, world units per second squared; positive rises. */
  gravity?: number;
  /** Air drag: the throw slows to a drift. */
  drag?: number;
  /** How much a droplet swells over its life; above 0 it is drawn soft, like smoke. */
  grow?: number;
  /** Droplets thrown, at most 30. */
  count?: number;
  opacity?: number;
};

export const SPRAY: BurstKind = { color: new Color("#eef0ff"), speed: 7, size: 5, life: 0.9, lift: 0.75 };
export const SPARK: BurstKind = { color: new Color("#f7c25c"), speed: 4.5, size: 4, life: 0.8, lift: 0.9 };
/** Water running off a note as it is lifted clear. */
export const DRIP: BurstKind = { color: new Color("#eef0ff"), speed: 1.1, size: 3.5, life: 0.7, lift: 0.1, count: 9 };
/** A hatch slammed shut: a flat ring of dust off the seam. */
export const DUST: BurstKind = {
  color: new Color("#fae1b8"),
  speed: 3.2,
  size: 4,
  life: 0.55,
  lift: 0,
  gravity: -1,
  drag: 3.5,
  count: 18,
};
/** The claw biting: a few bright chips. */
export const BITE: BurstKind = { color: new Color("#e4e7ff"), speed: 2.6, size: 3, life: 0.4, lift: 0.5, count: 10 };
/** A funnel puff, idle. */
export const PUFF: BurstKind = {
  color: new Color("#eceeff"),
  speed: 0.8,
  size: 16,
  life: 2.1,
  lift: 1,
  gravity: 0.35,
  drag: 1.2,
  grow: 2.2,
  count: 4,
  opacity: 0.5,
};
/** The funnel's cough when it sings a note. */
export const COUGH: BurstKind = { ...PUFF, speed: 2, size: 19, life: 1.7, count: 12, opacity: 0.8 };
/** The whistle blowing: a thin jet of steam. */
export const STEAM: BurstKind = {
  ...PUFF,
  speed: 1.6,
  size: 7,
  life: 0.9,
  gravity: 0.9,
  drag: 2.2,
  grow: 1.6,
  count: 9,
  opacity: 0.85,
};
/** Crumbs of light as the head bites down on a note. */
export const CRUMB: BurstKind = { color: new Color("#f7c25c"), speed: 2.2, size: 3.5, life: 0.5, lift: 0.4, count: 12 };

const vertex = /* glsl */ `
#define SLOTS ${SLOTS}
attribute vec2 aDrop; // index in slot, seed

uniform float uTime;
uniform float uFocal;
uniform vec3 uEye;
uniform vec3 uWind;
uniform vec4 uOrigin[SLOTS]; // x, y, z, start
uniform vec4 uKind[SLOTS];   // speed, size, life, lift
uniform vec4 uMotion[SLOTS]; // gravity, drag, grow, count
uniform vec4 uColor[SLOTS];  // rgb, opacity

varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;
varying float vSoft;

void main() {
  int slot = int(aDrop.x / ${PER_SLOT}.0);
  float index = mod(aDrop.x, ${PER_SLOT}.0);
  float seed = aDrop.y;
  vec4 o = uOrigin[slot];
  vec4 k = uKind[slot];
  vec4 m = uMotion[slot];
  float age = uTime - o.w;
  float life = k.z * (0.7 + fract(seed * 7.3) * 0.5);
  float alive = step(0.0, age) * step(age, life) * step(index, m.w - 0.5);
  float soft = step(0.001, m.z);

  float a = seed * 6.2831;
  float up = mix(0.3, 1.0, k.w) * (0.6 + fract(seed * 3.1) * 0.6);
  vec3 dir = normalize(vec3(cos(a), up * 2.0, sin(a) * 0.8));
  float speed = k.x * (0.5 + fract(seed * 11.7) * 0.7);
  float run = m.y > 0.0 ? (1.0 - exp(-m.y * age)) / m.y : age;
  vec3 p = o.xyz + dir * speed * run + vec3(0.0, m.x * age * age, 0.0) + uWind * age * soft;

  float dist = distance(uEye, p);
  float t = age / life;
  float px = k.y * mix(1.0 - smoothstep(0.4, 1.0, t) * 0.6, 1.0 + m.z * t, soft);
  vec2 corner = position.xy * px * dist / uFocal;

  vAlpha = alive * (1.0 - smoothstep(0.55, 1.0, t)) * mix(1.0, smoothstep(0.0, 0.12, t), soft) * uColor[slot].a;
  vCorner = position.xy * 2.0;
  vColor = uColor[slot].rgb;
  vSoft = soft;
  gl_Position = projectionMatrix * viewMatrix * vec4(p + vec3(corner, 0.0), 1.0);
}
`;

const fragment = /* glsl */ `
varying vec2 vCorner;
varying float vAlpha;
varying vec3 vColor;
varying float vSoft;

void main() {
  float d = length(vCorner);
  float aa = fwidth(d);
  float edge = 1.0 - smoothstep(1.0 - aa, 1.0, d);
  float body = mix(edge, edge * (1.0 - d * d), vSoft);
  if (body * vAlpha <= 0.0) discard;
  gl_FragColor = vec4(vColor, body * vAlpha);
  #include <colorspace_fragment>
}
`;

export function createBursts() {
  const origins = Array.from({ length: SLOTS }, () => new Vector4(0, 0, 0, -1000));
  const kinds = Array.from({ length: SLOTS }, () => new Vector4(1, 1, 1, 1));
  const motions = Array.from({ length: SLOTS }, () => new Vector4());
  const colors = Array.from({ length: SLOTS }, () => new Vector4());

  const drops = new Float32Array(SLOTS * PER_SLOT * 2);
  for (let s = 0; s < SLOTS; s++) {
    for (let i = 0; i < PER_SLOT; i++) {
      drops.set([s * PER_SLOT + i, (i + 0.5) / PER_SLOT + s * 0.137], (s * PER_SLOT + i) * 2);
    }
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
      uWind: { value: new Vector3(-0.55, 0, 0.1) },
      uOrigin: { value: origins },
      uKind: { value: kinds },
      uMotion: { value: motions },
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
      motions[next].set(
        kind.gravity ?? -9.8,
        kind.drag ?? 0,
        kind.grow ?? 0,
        Math.min(PER_SLOT, kind.count ?? PER_SLOT),
      );
      const { r, g, b } = kind.color;
      colors[next].set(r, g, b, kind.opacity ?? 1);
      next = (next + 1) % SLOTS;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
