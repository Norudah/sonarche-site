import type { ReactNode } from "react";

import { SeaBody } from "@/components/brand/sea/SeaBody";
import { SeaLayer } from "@/components/brand/sea/SeaLayer";
import { buildSea, SEA_STORM } from "@/components/brand/sea/sea";

import { buildRain } from "./decor";
import styles from "./hero.module.css";

/*
 * Server-rendered, CSS-animated: no JavaScript. The ark goes in `children`, between the back swell
 * and the front row, so the hull sits in the water rather than on it.
 */

/** Px above the hero's bottom edge; the rain layer is clipped there. */
export const WATERLINE = 110;

export function Storm({ children }: { children: ReactNode }) {
  const { drops, ripples } = buildRain();
  const sea = buildSea(SEA_STORM, WATERLINE);

  return (
    <div className="absolute inset-0" style={sea.style}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ bottom: WATERLINE }}
      >
        {drops.map((drop, i) => (
          <span
            key={i}
            className={styles.rainDrop}
            style={{
              left: drop.left,
              height: drop.height,
              opacity: drop.opacity,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
            }}
          />
        ))}
      </div>

      <SeaBody body={sea.body} />
      <SeaLayer bars={sea.deep} deep />
      <SeaLayer bars={sea.back} />

      {/* Under the hull: the ark is not rained through. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {ripples.map((ripple, i) => (
          <span
            key={i}
            className={styles.ripple}
            style={{
              left: ripple.left,
              width: ripple.width,
              marginLeft: `calc(${ripple.width} / -2)`,
              animationDuration: ripple.duration,
              animationDelay: ripple.delay,
            }}
          />
        ))}
      </div>

      {children}

      <SeaLayer bars={sea.front} className="z-[3]" />
    </div>
  );
}
