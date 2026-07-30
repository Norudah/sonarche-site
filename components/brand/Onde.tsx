import styles from "./ark.module.css";

/*
 * The equalizer docked above the ark.
 *
 * The brand mark carries a frozen six-bar wave; here it is replaced by a live
 * one, detached from the drawing and floating a little above the hull. That is
 * the whole point of the hero: the vessel is not only loaded, it is playing.
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

export function Onde({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
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
