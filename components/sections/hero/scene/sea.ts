import { DoubleSide, InstancedBufferAttribute, Mesh, ShaderMaterial, Vector2, Vector3 } from "three";

import { cardGeometry } from "./card";
import { OKLCH_GLSL } from "./color";
import { PITCH, type Framing } from "./framing";
import { RIPPLE_GLSL, type createRipples } from "./ripples";

/*
 * The sea, as the poster draws it — a field of equalizer bars — but seen in
 * depth: rows of them running from under the camera out to a horizon that
 * dissolves into the sky.
 *
 * The bars stay flat cards facing the camera, rounded at the top, exactly the
 * 4px sticks of the CSS sea. That is the whole art direction of the scene: it
 * does not re-imagine the brand in 3D, it puts the drawing the site already has
 * into perspective. Water here is sound; it has no specular, no normals, no
 * foam — it has bars that rise and fall.
 *
 * Columns are laid out in screen space rather than on a world grid: each row is
 * spaced so its bars land a constant few pixels apart, whatever their depth. A
 * world grid seen at this angle packs the far rows into a moiré band a pixel
 * high; this keeps the texture of the poster all the way to the horizon, and
 * lets the row count, not the width of the screen, set the cost.
 *
 * Everything moves in the vertex shader. The CPU writes a dozen uniforms a frame
 * and never touches a bar.
 */

/** Rows, nearest first, grow apart by this fraction of their distance. */
const ROW_GROWTH = 0.085;
/** Target spacing between two bars of a row, px, at full density. */
const COLUMN_PX = 6;
/** How far past the frame's edges a row still gets bars, px. */
const OVERSCAN = 80;
/** How deep a bar's foot runs under the surface — the body of water. */
export const DEPTH = 2.6;

function lehmer(seed: number): () => number {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Instance data, far rows first so the blended cards stack back to front. */
function layout(framing: Framing, density: number): Float32Array {
  const { width, focal, eyeY, eyeZ } = framing;
  const rnd = lehmer(42);

  // The nearest row is the closest one whose crest can still reach over the
  // frame's bottom edge.
  const bottomRay = (PITCH * Math.PI) / 180 + Math.atan((framing.height / 2 - framing.shift) / focal);
  const nearest = Math.max(4, (eyeY - 3) / Math.tan(bottomRay));
  const farthest = framing.distance * 2.8;

  const rows: number[][] = [];
  for (let dz = nearest; dz < farthest; dz += Math.max(2.2, (dz * ROW_GROWTH) / density)) {
    const row: number[] = [];
    // Near rows open up a little on screen, far rows close in: enough of a
    // gradient to read as depth, not so much that the horizon turns solid.
    const px = (COLUMN_PX / density) * Math.pow(dz / framing.distance, -0.22);
    const spacing = (px * dz) / focal;
    const half = ((width / 2 + OVERSCAN) * dz) / focal;
    const z = eyeZ - dz;
    for (let x = -half; x <= half; x += spacing) {
      row.push(x + (rnd() - 0.5) * spacing * 0.3, z, rnd(), spacing);
    }
    rows.push(row);
  }

  return new Float32Array(rows.reverse().flat());
}

const vertex = /* glsl */ `
${OKLCH_GLSL}
${RIPPLE_GLSL}

attribute vec4 aBar; // x, z, seed, column spacing

uniform float uTime;
uniform float uStorm;
uniform vec2 uArk;
uniform vec3 uEye;
uniform vec2 uFade;

varying float vX;
varying float vFromTop;
varying float vY;
varying float vSurface;
varying float vTop;
varying float vFlash;
varying float vFar;
varying vec3 vFoot;
varying vec3 vCrest;

const float TAU = 6.2831853;
const float DEPTH = ${DEPTH.toFixed(2)};

// The poster's three sines (components/brand/sea/sea.ts), now travelling in two
// dimensions: one long swell carrying most of the height, two shorter ones
// riding on it.
float swell(vec2 p, float t) {
  float lng = 0.52 * sin(dot(p, vec2(0.075, 0.05)) - 0.8 * t + 0.9);
  float wave = 0.30 * sin(dot(p, vec2(-0.19, 0.11)) - 1.3 * t + 1.7);
  float chop = 0.20 * sin(dot(p, vec2(0.52, -0.3)) - 2.2 * t);
  return 0.5 + 0.5 * (lng + wave + chop);
}

// The mass of water heaving under the crests: longer and slower.
float heave(vec2 p, float t) {
  return 1.3 * (0.62 * sin(dot(p, vec2(0.04, 0.028)) - 0.45 * t + 0.47)
               + 0.38 * sin(dot(p, vec2(-0.065, 0.045)) - 0.7 * t + 2.4));
}

void main() {
  vec2 p = aBar.xy;
  float seed = aBar.z;
  float t = uTime;

  // The berth: the ark sits still in sheltered water, the storm is out on the
  // flanks. Elliptical, longer across the beam than along it.
  float berth = length((p - uArk) * vec2(1.0, 1.2));
  float shelter = 0.1 + 0.9 * smoothstep(5.0, 17.0, berth);
  float rise = smoothstep(6.0, 34.0, abs(p.x - uArk.x));

  float s = swell(p, t);
  float breath = 0.18 * sin(t * TAU / (2.1 + seed * 0.7) + seed * TAU);
  float h = 0.3 + uStorm * (0.05 + 2.3 * s * s * (0.5 + 0.7 * rise) + 0.15 * seed);
  h *= (0.4 + 0.6 * shelter) * (1.0 + breath);

  // Rain landing: one bar at a time jumps and falls back.
  float splash = pow(max(0.0, sin(t * (1.1 + seed * 1.7) + seed * 91.0)), 90.0);
  h += splash * 0.7 * uStorm;

  vec2 ring = ripples(p, t);
  h = max(0.12, h + ring.x * 2.4);

  float surface = heave(p, t) * shelter * uStorm;
  float top = surface + h;
  float y = mix(surface - DEPTH, top, position.y);

  float barWidth = aBar.w * 0.62;
  vec3 world = vec3(p.x + position.x * barWidth, y, p.y);

  float far = distance(uEye.xz, p);
  vFar = smoothstep(uFade.x, uFade.y, far);

  // The poster's tint continuum: deep indigo at the foot, paler and bluer as a
  // bar rises into the light. Where a bar lands on it is its swell, its place
  // on the flanks and a little of its own noise.
  float k = clamp(0.25 * rise + 0.8 * s * s + 0.2 * (fract(seed * 7.13) - 0.5), 0.0, 1.0);
  vFoot = oklch(0.545 + 0.135 * k, 0.2 - 0.062 * k, 276.0 + 7.0 * k);
  vCrest = oklch(0.705 + 0.135 * k, 0.14 - 0.075 * k, 274.0 + 9.0 * k);

  vX = position.x * 2.0;
  vFromTop = (top - y) / (barWidth * 0.5);
  vY = y;
  vSurface = surface;
  vTop = top;
  vFlash = clamp(ring.y, 0.0, 1.0) + splash * 0.4;

  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const fragment = /* glsl */ `
${OKLCH_GLSL}

uniform float uFadeBottom;
uniform float uPresence;

varying float vX;
varying float vFromTop;
varying float vY;
varying float vSurface;
varying float vTop;
varying float vFlash;
varying float vFar;
varying vec3 vFoot;
varying vec3 vCrest;

const float DEPTH = ${DEPTH.toFixed(2)};

void main() {
  // A rounded cap, antialiased on its own edge: the card is a pill, not a quad.
  float aa = fwidth(vX) * 1.2;
  float r = vFromTop < 1.0 ? length(vec2(vX, 1.0 - vFromTop)) : abs(vX);
  float edge = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
  if (edge <= 0.0) discard;

  vec3 col;
  float alpha;
  if (vY >= vSurface) {
    col = mix(vFoot, vCrest, clamp((vY - vSurface) / max(0.001, vTop - vSurface), 0.0, 1.0));
    alpha = 0.93;
  } else {
    // Under the surface the bar becomes the body of water: paler and thinner
    // with depth, so the rows stack into one translucent mass.
    float d = clamp((vSurface - vY) / DEPTH, 0.0, 1.0);
    col = mix(vFoot, oklch(0.83, 0.07, 277.0), smoothstep(0.0, 0.6, d));
    alpha = mix(0.9, 0.0, d);
  }

  // The ping lights a bar up as it passes: the sea answering the sonar.
  col = mix(col, oklch(0.6, 0.23, 280.0), clamp(vFlash, 0.0, 1.0) * 0.85);

  // Distance takes a bar towards the poster's far row — pale, hazy — and then
  // away altogether, so the horizon is the sky's and not the scene's.
  col = mix(col, oklch(0.84, 0.045, 278.0), vFar * 0.8);
  alpha *= (1.0 - smoothstep(0.55, 1.0, vFar)) * uPresence;

  // The hero hands over to the next section on paper, not on a cut through
  // the water: the bottom of the frame fades the way the poster's body does.
  alpha *= smoothstep(0.0, uFadeBottom, gl_FragCoord.y);

  gl_FragColor = vec4(col, alpha * edge);
  #include <colorspace_fragment>
}
`;

export function createSea(ripples: ReturnType<typeof createRipples>, density: number) {
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uStorm: { value: 1 },
      uArk: { value: new Vector2() },
      uEye: { value: new Vector3() },
      uFade: { value: new Vector2(60, 180) },
      uFadeBottom: { value: 60 },
      uPresence: { value: 1 },
      uRipWhere: { value: ripples.where },
      uRipHow: { value: ripples.how },
    },
  });

  let geometry = cardGeometry();
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;

  function relayout(framing: Framing, pixelRatio: number) {
    const bars = layout(framing, density);
    geometry.dispose();
    geometry = cardGeometry();
    geometry.setAttribute("aBar", new InstancedBufferAttribute(bars, 4));
    geometry.instanceCount = bars.length / 4;
    mesh.geometry = geometry;

    const u = material.uniforms;
    u.uEye.value.set(0, framing.eyeY, framing.eyeZ);
    u.uFade.value.set(framing.distance * 0.9, framing.distance * 2.6);
    u.uFadeBottom.value = 70 * pixelRatio;
  }

  return {
    mesh,
    uniforms: material.uniforms,
    relayout,
    count: () => geometry.instanceCount,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
