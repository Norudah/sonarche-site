import type { SeaBar } from "./sea";
import styles from "./sea.module.css";

/* A row, not a slot in a `<Sea>` wrapper: the call site interleaves rows and the ark so the near row
   sits in front of the hull. Styling comes from buildSea's custom properties. */

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
