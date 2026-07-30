import type { ReactNode } from "react";

import { buildHeroDecor, type SeaBar as SeaBarData } from "./decor";
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
 */

export function Storm({ children }: { children: ReactNode }) {
  const { rain, ripples, seaBack, seaFront, seaDeep } = buildHeroDecor();

  return (
    <>
      {/*
       * The rain stops at the waterline rather than at the section's edge: the
       * layer is clipped 160px up, so a drop is swallowed exactly where the sea
       * begins. Its tip is the opaque end of the gradient, so it reads as
       * entering the water and not as being cut off.
       */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 bottom-40 overflow-hidden">
        {rain.map((drop, i) => (
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

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={`${styles.seaDriftSlow} absolute inset-0`}>
          {seaDeep.map((bar, i) => (
            <SeaBar key={i} bar={bar} deep />
          ))}
        </div>
        <div className={`${styles.seaDrift} absolute inset-0`}>
          {seaBack.map((bar, i) => (
            <SeaBar key={i} bar={bar} />
          ))}
        </div>
      </div>

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

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className={`${styles.seaDrift} absolute inset-0`}>
          {seaFront.map((bar, i) => (
            <SeaBar key={i} bar={bar} />
          ))}
        </div>
      </div>
    </>
  );
}

function SeaBar({ bar, deep = false }: { bar: SeaBarData; deep?: boolean }) {
  return (
    <span
      className={deep ? `${styles.seaBar} ${styles.seaBarDeep}` : styles.seaBar}
      style={{
        left: bar.left,
        height: bar.height,
        background: bar.background,
        opacity: bar.opacity,
        animationDuration: bar.duration,
        animationDelay: bar.delay,
      }}
    />
  );
}
