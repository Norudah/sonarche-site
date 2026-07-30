/*
 * The trace's resting shape — where the line sits, horizontally, at a given
 * document y.
 *
 * The formula is the mockup's own (three beating sines plus a fine tremor), and
 * it is the whole drawing: a single continuous line that leaves the hero's water
 * under the hull, wanders across the page, and comes back to the centre to land
 * on the ark in the footer. Sections do not each get "a wave" — they get their
 * slice of this one curve, which is why the shape is a pure function of the
 * document coordinate and nothing else.
 *
 * Pure and dependency-free on purpose: everything that reads the DOM lives in
 * engine.ts, so this stays the one place the drawing is described.
 */

/** The curve is authored at 1440px. Below that it narrows with the viewport. */
const AUTHORED_WIDTH = 1440;
/** Past 1440 it keeps growing, but not for long — a 2560px screen is not twice as wide a sea. */
const MAX_SCALE = 1.15;

/**
 * How far it takes the line to slide out from the centre at the top, and to
 * return to it at the bottom. Both ends are anchored on an ark, and an ark is
 * centred: the line has to arrive dead straight or it misses the hull.
 */
const MOUTH = 430;

/** The tremor keeps some of its size on a phone, or the line reads as ruler-drawn. */
const MIN_TREMOR_SCALE = 0.5;

export type TraceBounds = {
  /** Document y where the line begins — under the hero's hull. */
  start: number;
  /** Document y where it ends — on the footer ark's roof. */
  end: number;
  /** Width of the column the line is drawn in. */
  width: number;
};

const smoothstep = (k: number) => {
  const c = Math.min(1, Math.max(0, k));
  return c * c * (3 - 2 * c);
};

export function traceOffset(y: number, { start, end, width }: TraceBounds): number {
  const scale = Math.min(MAX_SCALE, width / AUTHORED_WIDTH);

  const swing =
    (330 * Math.sin(y / 1550) + 155 * Math.sin(y / 620 + 1.1) + 46 * Math.sin(y / 235 + 2.3)) * scale +
    11 * Math.max(MIN_TREMOR_SCALE, scale) * Math.sin(y / 23);

  return swing * smoothstep((y - start) / MOUTH) * smoothstep((end - y) / MOUTH);
}

/** The playhead's live bulge, kept from swamping a narrow viewport. */
export function traceLiveScale(width: number): number {
  return Math.min(1, Math.max(0.6, width / AUTHORED_WIDTH));
}
