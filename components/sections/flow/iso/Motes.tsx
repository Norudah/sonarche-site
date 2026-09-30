import type { CSSProperties } from "react";

import { project } from "./iso";
import styles from "./motes.module.css";

/*
 * Pixels coming off the water and drifting up: the stream's dust, and the
 * page's reminder that the sea is made of the web.
 *
 * Plain CSS loops, so the flow's AnimationGate pauses them off-screen and
 * reduced motion simply never shows them. Positions come from a seeded
 * generator and are rounded: the server and the browser must draw the same
 * specks.
 */

type MotesProps = {
  /** The floor area they rise from, in world units. */
  area: { x: number; y: number; w: number; d: number; z?: number };
  count: number;
  seed: number;
  /** How far up they drift, in screen units. */
  rise?: number;
  colors?: readonly string[];
};

const DEFAULT_COLORS = ["oklch(0.62 0.17 277)", "oklch(0.78 0.1 280)", "white"];

export function Motes({ area, count, seed, rise = 90, colors = DEFAULT_COLORS }: MotesProps) {
  const random = mulberry32(seed);

  return (
    <g aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const [sx, sy] = project(area.x + random() * area.w, area.y + random() * area.d, (area.z ?? 0) + random() * 18);
        const size = r2(1.8 + random() * 2.4);
        const style = {
          "--rise": `${-r2(rise * (0.6 + random() * 0.6))}px`,
          "--o": r2(0.45 + random() * 0.5),
          animationDuration: `${r2(3.6 + random() * 3.2)}s`,
          animationDelay: `${-r2(random() * 7)}s`,
        } as CSSProperties;
        return (
          <rect
            key={i}
            className={styles.mote}
            x={r2(sx - size / 2)}
            y={r2(sy - size / 2)}
            width={size}
            height={size}
            fill={colors[i % colors.length]}
            style={style}
          />
        );
      })}
    </g>
  );
}

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
