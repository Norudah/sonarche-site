import { Vector4 } from "three";

/*
 * Rings travelling across the water: the sonar ping the ark sends out, its
 * echoes (their loudness is the weather's, see weather.ts), the wake a pointer
 * leaves when it drags across the sea and the ping a click sends.
 *
 * A fixed pool of uniforms rather than anything clever: the sea's vertex shader
 * loops over every slot for every bar, so the pool size is the frame budget's
 * dial. A new ring takes the oldest slot — by the time the pool wraps, that ring
 * has long since died out.
 */

export const RIPPLE_SLOTS = 12;

export type RingSpec = {
  /** Height the ring throws the bars to, and how bright they flash. */
  strength: number;
  /** World units per second. */
  speed: number;
  /** Thickness of the ring, world units. */
  width: number;
};

export const PING: RingSpec = { strength: 1.5, speed: 30, width: 3.2 };
export const WAKE: RingSpec = { strength: 0.55, speed: 10, width: 1.6 };
export const CLICK: RingSpec = { strength: 1.2, speed: 20, width: 2.6 };

export function createRipples() {
  // x, z, start time, strength — and speed, width. Start at -1000 so every slot
  // is born long dead.
  const where = Array.from({ length: RIPPLE_SLOTS }, () => new Vector4(0, 0, -1000, 0));
  const how = Array.from({ length: RIPPLE_SLOTS }, () => new Vector4(1, 1, 0, 0));
  let next = 0;

  function spawn(x: number, z: number, time: number, ring: RingSpec) {
    where[next].set(x, z, time, ring.strength);
    how[next].set(ring.speed, ring.width, 0, 0);
    next = (next + 1) % RIPPLE_SLOTS;
  }

  return { where, how, spawn };
}

export const RIPPLE_GLSL = /* glsl */ `
#define RIPPLE_SLOTS ${RIPPLE_SLOTS}
uniform vec4 uRipWhere[RIPPLE_SLOTS];
uniform vec4 uRipHow[RIPPLE_SLOTS];

// x: how far the ring lifts this point, y: how bright it flashes.
vec2 ripples(vec2 p, float t) {
  vec2 acc = vec2(0.0);
  for (int i = 0; i < RIPPLE_SLOTS; i++) {
    vec4 w = uRipWhere[i];
    float age = t - w.z;
    if (age < 0.0 || age > 6.0) continue;
    vec4 h = uRipHow[i];
    float d = distance(p, w.xy);
    float k = (d - age * h.x) / h.y;
    float ring = exp(-k * k) * w.w * exp(-age * 0.75);
    // The trailing edge rings back down a little: a wave, not a bump.
    acc += vec2(ring - 0.35 * exp(-(k + 1.6) * (k + 1.6)) * w.w * exp(-age * 0.9), ring);
  }
  return acc;
}
`;
