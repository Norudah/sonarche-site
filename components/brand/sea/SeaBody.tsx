import type { SeaBody as SeaBodyShape } from "./sea";
import styles from "./sea.module.css";

/* A box clipped to the heaving surface, so the crests rise out of a mass of water, not a ruled line. */

export function SeaBody({ body }: { body: SeaBodyShape }) {
  return (
    <div
      aria-hidden
      className={`${styles.body} pointer-events-none`}
      style={{ height: body.height, background: body.background, clipPath: body.clipPath }}
    />
  );
}
