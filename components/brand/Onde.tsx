import styles from "./ark.module.css";

/*
 * The equalizer docked above the ark.
 *
 * The brand mark carries a frozen six-bar wave; here it is replaced by a live
 * one, detached from the drawing and floating a little above the hull. That is
 * the whole point of the hero: the vessel is not only loaded, it is playing.
 *
 * It renders inside the ark (as its child) so that it sails and rises with the
 * hull, and it keeps a slow float of its own on top of that — sound that hangs
 * over a boat should lag behind it a little, the way the bulge lags behind the
 * playhead on the page's trace.
 *
 * The resting place is expressed against the ark's box rather than in absolute
 * px: the arch's roof is at 32.8% of that box whatever its size, so one rule
 * clears it by the same 10px on a 320px ark and on a 192px one.
 *
 * Six bars, one shared 0.9s loop, delays chosen so no two peak together — read
 * as sound rather than as a spinner.
 */

const BARS = [
  { height: 10, delay: "-0.1s" },
  { height: 18, delay: "-0.35s" },
  { height: 26, delay: "-0.6s" },
  { height: 16, delay: "-0.2s" },
  { height: 22, delay: "-0.5s" },
  { height: 12, delay: "-0.75s" },
];

/** Bottom of the equalizer, above the ark's box: the roof, plus a little air. */
const PERCH = "calc(67.2% + 10px)";

export function Onde({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`absolute left-1/2 z-[1] -ml-[23px] ${className}`} style={{ bottom: PERCH }}>
      <div
        className={`${styles.onde} flex h-6.5 items-center gap-[3px]`}
        style={{ filter: "drop-shadow(0 2px 8px oklch(0.505 0.185 277 / 0.5))" }}
      >
        {BARS.map((bar, i) => (
          <span key={i} className={styles.ondeBar} style={{ height: `${bar.height}px`, animationDelay: bar.delay }} />
        ))}
      </div>
    </div>
  );
}
