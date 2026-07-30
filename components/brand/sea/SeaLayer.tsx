import type { SeaBar } from "./sea";
import styles from "./sea.module.css";

/*
 * One row of water.
 *
 * A row is a component rather than a slot inside a `<Sea>` wrapper because the
 * ark has to be *inside* the sea, not on top of it: the call site interleaves
 * the rows and the vessel itself, and owns the stacking that puts the near row
 * in front of the hull. That ordering is the only thing that makes the ark
 * float rather than sit.
 *
 * The weather comes from custom properties inherited from the container (see
 * buildSea), so a row takes no styling decisions of its own.
 */

type SeaLayerProps = {
  bars: SeaBar[];
  /** The far row: wider, paler, lower, drifting the other way. */
  deep?: boolean;
  className?: string;
};

export function SeaLayer({ bars, deep = false, className = "" }: SeaLayerProps) {
  const layer = deep ? `${styles.layer} ${styles.layerDeep}` : styles.layer;
  const bar = deep ? `${styles.bar} ${styles.barDeep}` : styles.bar;

  return (
    <div aria-hidden className={`${layer} pointer-events-none ${className}`}>
      {bars.map((water, i) => (
        <span
          key={i}
          className={bar}
          style={{
            left: water.left,
            // The foot of the bar rides the surface, not the container's edge.
            ["--sea-rise" as string]: `${water.lift}px`,
            height: water.height,
            background: water.background,
            opacity: water.opacity,
            animationDuration: water.duration,
            animationDelay: water.delay,
          }}
        />
      ))}
    </div>
  );
}
