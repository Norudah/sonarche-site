import type { CSSProperties, ReactNode } from "react";

import styles from "./ark.module.css";

/*
 * The ark, alive.
 *
 * The same vessel as components/brand/SonarcheMark.tsx, minus its wave — do not
 * let the two diverge in hull geometry. The mark's frozen six-bar wave is gone
 * on purpose: here it becomes the live equalizer of Onde.tsx, docked above the
 * hull rather than drawn into it.
 *
 * Five nested loops, all CSS (see hero.module.css for why): a long sail across
 * the berth, a float, a roll about the waterline, the wake breathing under the
 * hull, the cargo settling, the portholes pulsing out of phase. No JavaScript.
 *
 * `children` is the equalizer, and where it goes is the point: inside the sail
 * and the float, outside the roll. Sound docked above a hull has to travel with
 * that hull — an equalizer holding still while the vessel moves under it reads
 * as two drawings, not one — but it must not heel with it either, or it tips
 * over. The drop shadow rides on the roll for the same reason: it belongs to the
 * vessel, and the equalizer casts its own.
 */

const PORTHOLES = [
  { cx: 5.6, delay: "0s" },
  { cx: 9.7, delay: "-0.7s" },
  { cx: 14.3, delay: "-1.4s" },
  { cx: 18.4, delay: "-2.1s" },
];

const HEAD = "M7.5 12V9.75C7.5 8.85 8.4 8.2 9.7 8 10.5 7.88 13.5 7.88 14.3 8 15.6 8.2 16.5 8.85 16.5 9.75V12Z";

type ArkProps = {
  className?: string;
  style?: CSSProperties;
  /** The vessel's own drop shadow, as the body of a `drop-shadow()`. */
  shadow?: string;
  /** The equalizer. Rides the hull's sail and float, not its roll. */
  children?: ReactNode;
};

export function Ark({ className, style, shadow, children }: ArkProps) {
  return (
    <div aria-hidden className={className} style={style}>
      <div className={`${styles.arkSail} h-full w-full`}>
        <div className={`${styles.arkFloat} relative h-full w-full`}>
          {children}
          <div
            className={`${styles.arkRoll} h-full w-full`}
            style={shadow ? { filter: `drop-shadow(${shadow})` } : undefined}
          >
            <svg viewBox="0 0 24 24" className="h-full w-full overflow-visible">
              <defs>
                <clipPath id="hero-ark-head">
                  <path d={HEAD} />
                </clipPath>
              </defs>

              {/* the wake — a shadow on the water, breathing */}
              <g className={styles.arkWake}>
                <ellipse cx="12" cy="20.1" rx="11.4" ry="0.5" fill="#6163f2" opacity="0.35" />
              </g>

              {/* the head: basket-handle arch, two eyes */}
              <path d={HEAD} fill="#c5cbef" />
              <g clipPath="url(#hero-ark-head)">
                <rect x="7.5" y="7.8" width="9" height="0.85" fill="#e2e7fc" />
                <rect x="7.5" y="11.4" width="9" height="0.6" fill="#a5aede" />
              </g>
              <g className={styles.arkBlink}>
                <rect x="9" y="9.05" width="2" height="2" rx="0.75" fill="#222652" />
                <rect x="13" y="9.05" width="2" height="2" rx="0.75" fill="#222652" />
                <circle cx="9.6" cy="9.65" r="0.42" fill="#818cf9" />
                <circle cx="13.6" cy="9.65" r="0.42" fill="#818cf9" />
              </g>

              {/* the cargo: amber at the ends, indigo amidships, settling apart */}
              <g className={styles.arkCargo}>
                <rect x="3" y="9" width="2" height="3" rx="0.5" fill="#efa831" />
                <rect x="3" y="9" width="2" height="0.45" rx="0.22" fill="#fae1b8" />
                <rect x="3" y="10.3" width="2" height="0.5" fill="#fae1b8" />
                <rect x="19" y="9" width="2" height="3" rx="0.5" fill="#efa831" />
                <rect x="19" y="9" width="2" height="0.45" rx="0.22" fill="#fae1b8" />
                <rect x="19" y="10.3" width="2" height="0.5" fill="#fae1b8" />
              </g>
              <g className={styles.arkCargoLate}>
                <rect x="5.1" y="10" width="1.5" height="2" rx="0.45" fill="#3d4097" />
                <rect x="5.1" y="10" width="1.5" height="0.4" rx="0.2" fill="#818cf9" />
                <rect x="5.1" y="10.9" width="1.5" height="0.45" fill="#818cf9" />
                <rect x="17.4" y="10" width="1.5" height="2" rx="0.45" fill="#3d4097" />
                <rect x="17.4" y="10" width="1.5" height="0.4" rx="0.2" fill="#818cf9" />
                <rect x="17.4" y="10.9" width="1.5" height="0.45" fill="#818cf9" />
              </g>

              {/* the hull: gunwale, two strakes, four portholes */}
              <rect x="1.6" y="12" width="20.8" height="1.1" rx="0.55" fill="#818cf9" />
              <path
                d="M2.2 13.2h19.6q.75 0 .65.75l-.45 2.6q-.6 3.25-3.4 3.25H5.4q-2.8 0-3.4-3.25l-.45-2.6q-.1-.75.65-.75Z"
                fill="#3d4097"
              />
              <path d="M2.2 13.2h19.6q.75 0 .65.75H1.55q-.1-.75.65-.75Z" fill="#4f52c1" />
              <path d="M3.7 16.5h16.6l-.3 1.15q-.75 2.45-2.9 2.45H6.9q-2.15 0-2.9-2.45Z" fill="#2e3172" />
              <path d="M3.7 16.5h16.6l-.14.55H3.84Z" fill="#3d4097" />
              <g fill="#818cf9">
                {PORTHOLES.map((porthole) => (
                  <circle
                    key={porthole.cx}
                    cx={porthole.cx}
                    cy="15"
                    r="0.45"
                    className={styles.arkPorthole}
                    style={{ animationDelay: porthole.delay }}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
