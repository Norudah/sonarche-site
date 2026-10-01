import styles from "./ark.module.css";

/* Positioned against the ark's box, so it clears the roof by the same 10px at any ark size. Delays
   chosen so no two bars peak together, which reads as sound rather than a spinner. */

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
