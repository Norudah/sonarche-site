import type { CSSProperties } from "react";

import styles from "./trace.module.css";

/*
 * One section's slice of the page-long trace.
 *
 * Every section between the two ends plants one of these; the engine stitches
 * them into a single curve (see shape.ts). A slice rather than one page-tall svg
 * for two reasons: a 12,000px svg is a compositing layer nobody wants on a
 * phone, and — the real one — a section paints its own background, so the only
 * way for the line to be *over* the paper and *under* the copy is for the
 * section itself to hold it.
 *
 * That is the whole contract: the host section is `relative isolate`, this sits
 * at z-index -1, and everything the section renders stays above it untouched.
 *
 * The ink is the whole legibility story. The line does cross copy — it follows
 * its own curve and nothing else — so it is set light enough that crossing costs
 * nothing: the resting stroke sits a couple of steps off the paper it is drawn
 * on, and even the playhead's bulge stays lighter than the palest text on the
 * page. Anything darker and the page starts arguing with itself; this is the one
 * set of values in the trace that should not be nudged without looking at a
 * paragraph behind it.
 *
 * The four parts are empty here and filled by the engine: `base` is the line at
 * rest, `lit` the same path revealed by a dash offset as the page is read,
 * `live` the bulge around the playhead, `dot` the playhead itself.
 */

/*
 * Wide screens only.
 *
 * The trace is drawn for a page with margins. On a phone the copy runs the full
 * width, so a line that follows its own curve has nowhere to go but through the
 * middle of every paragraph, permanently — what reads as a thread on a desktop
 * reads as a scratch on the glass. It is switched off rather than tamed: there
 * is no version of it that is worth a line across the text on a 390px column.
 *
 * `lg`, the same 64rem where the page's own layouts go wide (see Under the deck
 * and Deck). This string and the `lg:block` below are the two halves of one
 * decision and have to stay equal: the css hides the drawing, the media query
 * stops the clock in Trace.tsx so nothing is computed for it either.
 */
export const TRACE_WIDE = "(min-width: 64rem)";

const INK = {
  base: "oklch(0.955 0.008 277)",
  lit: "oklch(0.912 0.026 277)",
  live: "oklch(0.845 0.06 277)",
  dot: "oklch(0.78 0.09 277)",
};

type TraceSegmentProps = {
  /** Where the whole trace begins, in px from this segment's top. One section on the page carries it. */
  start?: number;
  /** Where it ends, likewise. */
  end?: number;
  /** Placement and stacking. The default is the contract above. */
  className?: string;
  style?: CSSProperties;
};

export function TraceSegment({ start, end, className = "absolute inset-0 z-[-1]", style }: TraceSegmentProps) {
  return (
    <div aria-hidden className={`pointer-events-none hidden overflow-hidden lg:block ${className}`} style={style}>
      {/*
       * `overflow-visible` is load-bearing, not tidiness. A root <svg> clips to
       * its own viewport by default, and this one drifts (the CSS loop in
       * trace.module.css): with the default clip, the few pixels the engine
       * deliberately draws past each end get cut off, and every seam between two
       * sections opens into a gap that scrolls with the drift. The host div does
       * the clipping instead — it does not move, so the two slices always meet.
       */}
      <svg
        data-trace-seg=""
        data-trace-start={start}
        data-trace-end={end}
        fill="none"
        className={`absolute top-0 left-0 overflow-visible ${styles.drift}`}
      >
        <path data-trace-part="base" d="" stroke={INK.base} strokeWidth={1} />
        <path data-trace-part="lit" d="" stroke={INK.lit} strokeWidth={1.3} strokeLinecap="round" />
        <path data-trace-part="live" d="" stroke={INK.live} strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
        <circle data-trace-part="dot" r="0" fill={INK.dot} opacity={0.5} />
      </svg>
    </div>
  );
}
