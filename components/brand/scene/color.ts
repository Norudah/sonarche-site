import { Color, LinearSRGBColorSpace } from "three";

/*
 * The palette is written in oklch everywhere else on the site, so it is written
 * in oklch here too — converting by eye to hex is how a scene drifts off-brand.
 *
 * Two halves of one conversion: `oklch()` for the colours set once from
 * JavaScript, and OKLCH_GLSL for the ones the sea computes per bar, where the
 * tint is a continuum and not a handful of constants. Both land in linear sRGB,
 * which is what three works in; the renderer encodes to sRGB on output.
 */

export function oklch(l: number, c: number, h: number): Color {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return new Color().setRGB(
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
    LinearSRGBColorSpace,
  );
}

export const OKLCH_GLSL = /* glsl */ `
vec3 oklch(float l, float c, float h) {
  float rad = radians(h);
  float a = c * cos(rad);
  float b = c * sin(rad);
  float l_ = pow(l + 0.3963377774 * a + 0.2158037573 * b, 3.0);
  float m_ = pow(l - 0.1055613458 * a - 0.0638541728 * b, 3.0);
  float s_ = pow(l - 0.0894841775 * a - 1.291485548 * b, 3.0);
  return vec3(
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
  );
}
`;
