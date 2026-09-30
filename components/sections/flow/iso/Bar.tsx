import gsap from "gsap";

import { box, onFront, onSide, type Vec3 } from "./iso";
import type { Tone } from "./tones";

/*
 * A box whose height can be tweened with transforms alone.
 *
 * Scaling a projected box vertically would shear its top and bottom edges off
 * the iso slope. Here each side face is a plain rect laid on its plane by a
 * matrix, so scaling the rect along its own v axis stays on the plane, and the
 * cap simply rides up or down by the difference. The server renders the bar at
 * its drawn height; `barTo` moves it from there.
 */

type BarProps = {
  at: Vec3;
  /** [w, d, h]: h is the drawn height, the one the page shows without motion. */
  size: Vec3;
  tone: Tone;
  /** 0 for a bar the settled frame does not show; the director fades it in. */
  opacity?: number;
};

export function Bar({ at, size, tone, opacity }: BarProps) {
  const [x, y, z] = at;
  const [w, d, h] = size;

  return (
    <g data-bar-h={h} opacity={opacity}>
      <g transform={onFront(x, y + d, z + h)}>
        <rect data-bar-face width={w} height={h} fill={tone.left} />
      </g>
      <g transform={onSide(x + w, y + d, z + h)}>
        <rect data-bar-face width={d} height={h} fill={tone.right} />
      </g>
      <path data-bar-cap d={box(x, y, z + h, w, d, 0).top} fill={tone.top} stroke={tone.top} strokeWidth={0.6} />
    </g>
  );
}

/**
 * A per-frame height setter for one bar, for loops driven by a formula rather
 * than a timeline. Built on quickSetter, so it allocates nothing per call.
 */
export function barSetter(bar: Element): (height: number) => void {
  const drawn = Number((bar as SVGGElement).dataset.barH);
  const faces = bar.querySelectorAll("[data-bar-face]");
  const cap = bar.querySelector("[data-bar-cap]");
  gsap.set(faces, { transformOrigin: "50% 100%" });
  const scale = gsap.quickSetter(faces, "scaleY");
  const lift = gsap.quickSetter(cap, "y");
  return (h) => {
    const safe = Math.max(0.001, h);
    scale(safe / drawn);
    lift(drawn - safe);
  };
}

/**
 * Tween every bar in `bars` to `height(i)` on `tl`, the i-th starting
 * `each * i` after `at` (a time or a label, never a relative "<").
 */
export function barTo(
  tl: gsap.core.Timeline,
  bars: Element[],
  height: (index: number) => number,
  vars: gsap.TweenVars & { each?: number },
  at: number | string,
) {
  const { each = 0, ...rest } = vars;
  bars.forEach((bar, i) => {
    const drawn = Number((bar as SVGGElement).dataset.barH);
    const h = Math.max(0.001, height(i));
    const position = typeof at === "number" ? at + each * i : `${at}+=${each * i}`;
    tl.to(
      bar.querySelectorAll("[data-bar-face]"),
      { ...rest, scaleY: h / drawn, transformOrigin: "50% 100%" },
      position,
    );
    tl.to(bar.querySelector("[data-bar-cap]"), { ...rest, y: drawn - h }, position);
  });
}
