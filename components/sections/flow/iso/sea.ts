import gsap from "gsap";

import { barSetter } from "./Bar";

/* Bar heights follow a swell plus shock rings, written at most 30 times a second: the swell is slow. */

type SeaCell = { x: number; y: number };

type Ripple = { x: number; y: number; t0: number; a: number };

type SeaOptions = {
  bars: Element[];
  cells: readonly SeaCell[];
  /** Resting height at (x, y) and time t, in world units. */
  swell: (x: number, y: number, t: number) => number;
  intro: gsap.core.Timeline;
  onFrame: (fn: () => void) => void;
  /** Their y follows the surface under them. */
  floaters?: { el: Element; x: number; y: number; lift?: number }[];
};

const RIPPLE = { speed: 95, width: 11, life: 2.4 } as const;
const STEP = 1 / 30;

export function animateSea({ bars, cells, swell, intro, onFrame, floaters = [] }: SeaOptions) {
  const setters = bars.map(barSetter);
  const riders = floaters.map((f) => ({ ...f, set: gsap.quickSetter(f.el, "y") }));
  const ripples: Ripple[] = [];
  const level = { a: 0 };
  let last = -1;

  const height = (x: number, y: number, t: number) => {
    let h = swell(x, y, t);
    for (const r of ripples) {
      const age = t - r.t0;
      const d = Math.hypot(x - r.x, y - r.y) - age * RIPPLE.speed;
      h += r.a * Math.exp(-(d * d) / (2 * RIPPLE.width * RIPPLE.width)) * (1 - age / RIPPLE.life);
    }
    return Math.max(0, h) * level.a;
  };

  const draw = (force = false) => {
    const t = gsap.ticker.time;
    if (!force && t - last < STEP) return;
    last = t;
    for (let i = ripples.length - 1; i >= 0; i--) if (t - ripples[i].t0 > RIPPLE.life) ripples.splice(i, 1);
    for (let i = 0; i < setters.length; i++) setters[i](height(cells[i].x, cells[i].y, t));
    for (const r of riders) r.set(-height(r.x, r.y, t) - (r.lift ?? 0) * level.a);
  };

  draw(true);
  intro.to(level, { a: 1, duration: 1.6, ease: "power2.out", onUpdate: () => draw(true) }, 0.3);
  onFrame(() => draw());

  return {
    /** A shock ring from (x, y), `a` units tall at its crest. */
    splash(x: number, y: number, a = 14) {
      ripples.push({ x, y, t0: gsap.ticker.time, a });
    },
  };
}
