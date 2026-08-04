"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { createTrace } from "./engine";
import { TRACE_WIDE } from "./TraceSegment";

gsap.registerPlugin(useGSAP);

/*
 * The trace's heartbeat — the one thing on the page running every frame.
 *
 * It renders nothing. The line lives in the segments the sections planted (see
 * TraceSegment.tsx); this only owns the clock, the resize handling and the
 * cleanup. Mounting it is what turns the trace on.
 *
 * gsap.ticker rather than a hand-rolled rAF: it is the loop ScrollTrigger is
 * already running, so the whole page still ticks once per frame, and useGSAP
 * disposes of it on unmount and on HMR.
 *
 * Deliberately not throttled below the display's rate: the playhead is the one
 * live thing crossing the whole screen, and a stepped bulge reads as a stutter,
 * not as calm. Its budget is bought elsewhere — the drift is a compositor-run
 * CSS loop (trace.module.css) and a still page writes no dash offsets (see
 * engine.ts), so full rate is only ever paid for the bulge itself.
 *
 * Reduced motion gets the line drawn and fully read — the end state of a page
 * someone has scrolled through — with no clock at all. The drawing survives;
 * only the movement goes.
 *
 * Both conditions are gated on width: below `lg` the segments are display:none
 * (see TraceSegment) and there is nothing to draw into, so running the clock
 * would be pure cost on the one class of device that can least afford it.
 * gsap.matchMedia reverts on a resize past the breakpoint, so a phone rotated
 * into a wide layout starts the line and a window narrowed drops it.
 */

export function Trace() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(`${TRACE_WIDE} and (prefers-reduced-motion: no-preference)`, () => {
      const trace = createTrace();
      // Body resizes cover both a window resize and anything below the fold
      // changing height (a font landing, an image finally decoding).
      const observer = new ResizeObserver(() => trace.invalidate());
      observer.observe(document.body);
      gsap.ticker.add(trace.frame);

      return () => {
        gsap.ticker.remove(trace.frame);
        observer.disconnect();
      };
    });

    mm.add(`${TRACE_WIDE} and (prefers-reduced-motion: reduce)`, () => {
      const trace = createTrace();
      const redraw = () => {
        trace.invalidate();
        trace.settle();
      };
      // Drawn once here rather than left to the observer's first delivery: that
      // one is scheduled with a frame, and a page opened in a background tab
      // gets no frames until it is looked at.
      redraw();
      const observer = new ResizeObserver(redraw);
      observer.observe(document.body);

      return () => observer.disconnect();
    });

    return () => mm.revert();
  });

  return null;
}
