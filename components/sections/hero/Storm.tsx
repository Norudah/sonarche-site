import type { ReactNode } from "react";

import { SeaBody } from "@/components/brand/sea/SeaBody";
import { SeaLayer } from "@/components/brand/sea/SeaLayer";
import { buildSea, SEA_STORM } from "@/components/brand/sea/sea";

import { buildRain } from "./decor";
import styles from "./hero.module.css";

/*
 * The sea Sonarche fishes music out of: rain over the whole hero, a swell along
 * its bottom edge, and the ark's berth kept calm in the middle.
 *
 * A server component with no state — the geometry is generated once at build
 * time and the motion is pure CSS, so this ships zero JavaScript despite being
 * the busiest thing on the page.
 *
 * The ark goes in `children`: it has to sit between the flanking swell and the
 * berth's own water, so that the hull is *in* the sea and not on top of it.
 * That is also why the near row carries a z-index — the ark is lifted above the
 * page's own layers, and the water it displaces has to be lifted past it.
 */

/** The surface, in px above the hero's bottom edge. Also where the rain stops. */
export const WATERLINE = 110;

export function Storm({ children }: { children: ReactNode }) {
  const { drops, ripples } = buildRain();
  const sea = buildSea(SEA_STORM, WATERLINE);

  return (
    <div className="absolute inset-0" style={sea.style}>
      {/*
       * The rain stops at the waterline rather than at the section's edge: the
       * layer is clipped there, so a drop is swallowed exactly where the sea
       * begins. Its tip is the opaque end of the gradient, so it reads as
       * entering the water and not as being cut off.
       */}
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

      {/* The impacts sit on the surface but under the hull — the ark floats on
          the water, it does not get rained through. */}
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
