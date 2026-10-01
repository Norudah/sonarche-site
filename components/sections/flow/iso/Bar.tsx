import gsap from "gsap";

import { box, onFront, onSide, type Vec3 } from "./iso";
import type { Tone } from "./tones";

/* Scaling a projected box would shear its edges off the iso slope. Each side face is a rect laid on
   its plane by a matrix, so scaling along its own axis stays on the plane and the cap rides along. */

type BarProps = {
  at: Vec3;
  /** [w, d, h]: h is the height drawn without motion. */
  size: Vec3;
  tone: Tone;
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

/** A per-frame, allocation-free height setter for formula-driven loops. */
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
