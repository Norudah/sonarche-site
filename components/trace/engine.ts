import { traceLiveScale, traceOffset, type TraceBounds } from "./shape";

/*
 * The trace's driver: it measures the segments the page has planted, draws the
 * resting line through them, and moves the playhead.
 *
 * Plain DOM, no React. The segments are server-rendered inside server
 * components a dozen sections apart, so there is no ref to hand around — the
 * engine finds them by attribute, exactly once per layout, and holds them. That
 * is also why this is the only place in the codebase that queries the document
 * globally; keeping it in one file is what makes it reviewable.
 *
 * The line is the sine of shape.ts and nothing else. An earlier version routed
 * it around every line of copy so it never ran behind a word; it worked, and it
 * looked like a circuit trace — the constraint won every argument with the
 * curve. The line goes back to its own shape, and legibility is bought with ink
 * instead: the resting stroke is a hair above the paper, and the lit one is
 * still well under body copy (see TraceSegment.tsx). It crosses text; it does
 * not compete with it.
 *
 * Per frame, three things happen and they cost very different amounts:
 *   - the drift transform and the lit dash offset: two style writes per segment;
 *   - the live bulge: one path of ~108 points, on the one or two segments the
 *     playhead is inside;
 *   - nothing at all for segments outside the viewport, which is most of them.
 *
 * The measurement is deliberately NOT part of the frame: reading a rect after
 * writing attributes forces a layout, and doing that at 60fps on a dozen
 * elements is the one thing that would make this expensive. It runs on a
 * ResizeObserver instead (see Trace.tsx).
 */

/** Distance between samples of the resting line. Eight is smooth at any width. */
const SAMPLE = 8;
/** How far a segment's path runs past its own box, so seams overlap. */
const OVER = SAMPLE * 3;
/** px over which the line fades in at the top and out at the bottom. */
const FADE = 280;

/** The bulge is short and fast, so it is sampled finer. */
const LIVE_SAMPLE = 5;
/** How much line the playhead disturbs, each way. */
const LIVE_REACH = 270;
/** Gaussian falloff of the bulge — it dies out well before its reach. */
const LIVE_SIGMA = 155;
/** Peak sideways excursion of the bulge, at full width. */
const LIVE_AMP = 44;
/** Wavelength of the ripple inside the bulge. */
const LIVE_WAVE = 15;
/** Seconds for the playhead to catch up with the middle of the viewport. */
const HEAD_LAG = 0.22;
/** How far outside the viewport a segment still gets updated. */
const MARGIN = 400;

type Segment = {
  svg: SVGSVGElement;
  host: HTMLElement;
  lit: SVGPathElement;
  live: SVGPathElement;
  dot: SVGCircleElement;
  /** Document y of the segment's top, and its height. */
  top: number;
  height: number;
  /** Length of the resting path, for the dash trick that lights it. */
  length: number;
  /**
   * The span the path actually covers, in the segment's own coordinates.
   *
   * Not 0..height: the path overshoots its box at both ends so that seams
   * overlap, and it stops short at the very first and last segments where the
   * trace begins and ends. Lighting it by the box instead of by the drawn span
   * put the lit/unlit boundary a couple of dozen pixels off, differently in
   * every segment — which is exactly what a seam that looks out of step is.
   */
  from: number;
  to: number;
  /** Last progress written, so a settled segment stops repainting. */
  litAt: number;
  /** Whether the bulge is currently drawn here — lets us clear it exactly once. */
  liveOn: boolean;
};

export type Trace = {
  /** gsap.ticker callback: elapsed seconds, frame delta in ms. */
  frame: (time: number, delta: number) => void;
  /** Draw the line at its end state — fully read, nothing moving. */
  settle: () => void;
  /** Forget the measurement; the next frame re-reads the layout. */
  invalidate: () => void;
};

export function createTrace(): Trace {
  let segments: Segment[] = [];
  let bounds: TraceBounds = { start: 0, end: 0, width: 0 };
  let stale = true;
  let head: number | null = null;

  /*
   * The two ends fade rather than stop. A stroke cannot carry an opacity ramp
   * along its own length, so the ramp goes on the host box as a mask — which
   * also means a segment sitting entirely between the two ramps needs no mask
   * at all, and most of them don't.
   */
  function fadeMask(host: HTMLElement, top: number, height: number) {
    const inFrom = bounds.start - top;
    const outTo = bounds.end - top;
    let inTo = inFrom + FADE;
    let outFrom = outTo - FADE;
    if (outFrom < inTo) inTo = outFrom = (inTo + outFrom) / 2;

    if (inTo <= 0 && outFrom >= height) {
      host.style.removeProperty("mask-image");
      host.style.removeProperty("-webkit-mask-image");
      return;
    }
    const ramp =
      `linear-gradient(to bottom, transparent ${inFrom.toFixed(1)}px, #000 ${inTo.toFixed(1)}px,` +
      ` #000 ${outFrom.toFixed(1)}px, transparent ${outTo.toFixed(1)}px)`;
    host.style.setProperty("mask-image", ramp);
    host.style.setProperty("-webkit-mask-image", ramp);
  }

  function restingPath(top: number, height: number) {
    const cx = bounds.width / 2;
    let d = "";
    let from = 0;
    let to = 0;
    // Overshoot both ends: neighbouring segments clip each other, and the seam
    // has to fall inside drawn line on both sides or it shows as a gap.
    for (let y = -OVER; y <= height + OVER; y += SAMPLE) {
      const gy = top + y;
      if (gy < bounds.start || gy > bounds.end) continue;
      if (!d) from = y;
      to = y;
      d += (d ? " L" : "M") + (cx + traceOffset(gy, bounds)).toFixed(1) + "," + y;
    }
    return { d, from, to };
  }

  function measure() {
    segments = [];

    const svgs = Array.from(document.querySelectorAll<SVGSVGElement>("[data-trace-seg]"));
    // The host is measured, never the svg: the svg's own height attribute would
    // make the reading circular, and its per-frame drift would bake an offset in.
    const hosts = svgs.map((svg) => svg.parentElement);
    const boxes = hosts.map((host) => host?.getBoundingClientRect());
    const width = Math.round(boxes[0]?.width ?? 0);
    // A page not laid out yet stays stale, and the next frame tries again —
    // clearing the flag here would leave the trace undrawn for good.
    if (!width) return;

    const scrollY = window.scrollY;
    let start = 0;
    let end = 0;
    svgs.forEach((svg, i) => {
      const box = boxes[i];
      if (!box) return;
      const top = box.top + scrollY;
      if (svg.dataset.traceStart) start = top + Number(svg.dataset.traceStart);
      if (svg.dataset.traceEnd) end = top + Number(svg.dataset.traceEnd);
    });
    if (end <= start) return;

    bounds = { start, end, width };
    stale = false;

    svgs.forEach((svg, i) => {
      const box = boxes[i];
      const host = hosts[i];
      const base = svg.querySelector<SVGPathElement>('[data-trace-part="base"]');
      const lit = svg.querySelector<SVGPathElement>('[data-trace-part="lit"]');
      const live = svg.querySelector<SVGPathElement>('[data-trace-part="live"]');
      const dot = svg.querySelector<SVGCircleElement>('[data-trace-part="dot"]');
      if (!box || !host || !base || !lit || !live || !dot) return;

      const top = Math.round(box.top + scrollY);
      const height = Math.round(box.height);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      const { d, from, to } = restingPath(top, height);
      base.setAttribute("d", d);
      lit.setAttribute("d", d);
      live.setAttribute("d", "");
      dot.setAttribute("r", "0");
      fadeMask(host, top, height);

      const length = d ? lit.getTotalLength() : 0;
      lit.style.strokeDasharray = `${length} ${length}`;
      lit.style.strokeDashoffset = String(length);

      segments.push({ svg, host, lit, live, dot, top, height, length, from, to, litAt: -1, liveOn: false });
    });
  }

  function clearLive(seg: Segment) {
    if (!seg.liveOn) return;
    seg.live.setAttribute("d", "");
    seg.dot.setAttribute("r", "0");
    seg.liveOn = false;
  }

  function frame(time: number, delta: number) {
    if (stale) measure();
    if (!segments.length) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const cx = bounds.width / 2;
    const liveScale = traceLiveScale(bounds.width);

    // The line drifts like a firefly — never quite still, never locked to the
    // viewport, so it reads as floating rather than as pasted on the page.
    const driftX = 11 * Math.sin(time * 0.21) + 6 * Math.sin(time * 0.53 + 1.3);
    const driftY = 9 * Math.sin(time * 0.29 + 0.7) + 4 * Math.sin(time * 0.67);

    // The playhead chases the middle of the viewport, but lazily and with a
    // wander of its own: a head welded to the scrollbar reads as a progress bar.
    const target = scrollY + vh * 0.5;
    head = head === null ? target : head + (target - head) * (1 - Math.exp(-delta / 1000 / HEAD_LAG));
    const wander = 30 * Math.sin(time * 0.33) + 12 * Math.sin(time * 0.79 + 2.1);
    // It never leaves the drawn line.
    const headY = Math.min(bounds.end - 12, Math.max(bounds.start + 12, head + wander));

    for (const seg of segments) {
      const viewTop = seg.top - scrollY;
      if (viewTop > vh + MARGIN || viewTop + seg.height < -MARGIN) continue;

      seg.svg.style.transform = `translate(${driftX.toFixed(2)}px, ${driftY.toFixed(2)}px)`;

      // Against the drawn span, not the box: see Segment.from.
      const span = seg.to - seg.from || 1;
      const progress = Math.max(0, Math.min(1, (headY - seg.top - seg.from) / span));
      if (Math.abs(progress - seg.litAt) > 0.0004) {
        seg.lit.style.strokeDashoffset = (seg.length * (1 - progress)).toFixed(1);
        seg.litAt = progress;
      }

      const localHead = headY - seg.top;
      if (localHead < -LIVE_REACH || localHead > seg.height + LIVE_REACH) {
        clearLive(seg);
        continue;
      }

      let d = "";
      for (let dy = -LIVE_REACH; dy <= LIVE_REACH; dy += LIVE_SAMPLE) {
        const y = localHead + dy;
        const gy = seg.top + y;
        if (y < -SAMPLE || y > seg.height + SAMPLE) continue;
        if (gy < bounds.start || gy > bounds.end) continue;
        const envelope = Math.exp(-((dy / LIVE_SIGMA) ** 2));
        const amp = LIVE_AMP * liveScale * envelope * (0.5 + 0.5 * Math.sin(time * 2.7 + dy * 0.018));
        const x = cx + traceOffset(gy, bounds) + amp * Math.sin(y / LIVE_WAVE + time * 8);
        d += (d ? " L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
      }
      if (!d) {
        clearLive(seg);
        continue;
      }

      seg.live.setAttribute("d", d);
      seg.dot.setAttribute("cx", (cx + traceOffset(headY, bounds)).toFixed(1));
      seg.dot.setAttribute("cy", localHead.toFixed(1));
      seg.dot.setAttribute("r", (4.5 + 1.6 * Math.sin(time * 3.4)).toFixed(2));
      seg.liveOn = true;
    }
  }

  function settle() {
    if (stale) measure();
    for (const seg of segments) {
      seg.svg.style.transform = "";
      seg.lit.style.strokeDashoffset = "0";
      seg.litAt = 1;
      clearLive(seg);
    }
  }

  return {
    frame,
    settle,
    invalidate: () => {
      stale = true;
    },
  };
}
