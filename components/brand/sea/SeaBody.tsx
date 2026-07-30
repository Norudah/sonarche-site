import type { SeaBody as SeaBodyShape } from "./sea";
import styles from "./sea.module.css";

/*
 * The water the bars stand in.
 *
 * One box, clipped to the heaving surface (see buildSea). It goes behind every
 * row, so the crests read as coming out of a mass of water rather than growing
 * off a ruled line — which is the whole difference between a sea and a bar
 * chart. It is deliberately quiet: the section's own gradient still does most
 * of the work below the waterline, and this only has to make the surface a
 * thing you can see the top of.
 */

export function SeaBody({ body }: { body: SeaBodyShape }) {
  return (
    <div
      aria-hidden
      className={`${styles.body} pointer-events-none`}
      style={{ height: body.height, background: body.background, clipPath: body.clipPath }}
    />
  );
}
