/*
 * Face shades for the dioramas: one light, from the upper left, so every
 * material is a top, a lit left face and a shaded right face.
 *
 * Every hue is the page's own — 279 for the paper greys, 277 for the indigo,
 * the success green for "done" — only stepped in lightness so a box reads as a
 * volume. Nothing here is a new colour; it is the tokens in globals.css, lit.
 */

export type Tone = { top: string; left: string; right: string };

export const PAPER: Tone = {
  top: "oklch(0.995 0.004 279)",
  left: "oklch(0.95 0.011 279)",
  right: "oklch(0.905 0.018 279)",
};

export const PLINTH: Tone = {
  top: "oklch(0.972 0.01 279)",
  left: "oklch(0.915 0.024 279)",
  right: "oklch(0.855 0.036 279)",
};

export const LAVENDER: Tone = {
  top: "oklch(0.915 0.045 277)",
  left: "oklch(0.845 0.07 277)",
  right: "oklch(0.77 0.085 277)",
};

export const INDIGO: Tone = {
  top: "oklch(0.63 0.165 277)",
  left: "oklch(0.505 0.185 277)",
  right: "oklch(0.42 0.155 277)",
};

export const DEEP: Tone = {
  top: "oklch(0.4 0.12 277)",
  left: "oklch(0.32 0.1 277)",
  right: "oklch(0.26 0.08 277)",
};

export const GREEN: Tone = {
  top: "oklch(0.64 0.12 158)",
  left: "oklch(0.52 0.115 158)",
  right: "oklch(0.44 0.1 158)",
};

/** Flat inks for marks drawn on faces. */
export const INK = {
  accent: "var(--accent)",
  success: "var(--success)",
  line: "oklch(0.87 0.02 279)",
  groove: "oklch(0.93 0.012 279)",
  label: "oklch(0.42 0.08 277)",
  shadow: "oklch(0.3 0.06 279)",
} as const;

/**
 * The poster's equalizer continuum (the sea's bar foot, brand/sea/sea.ts),
 * k = 0 the deep indigo, k = 1 the pale lavender, so a row of bars reads as the
 * brand's own waveform rather than a generic chart.
 */
export function continuum(k: number): Tone {
  const l = 0.545 + 0.135 * k;
  const c = 0.2 - 0.062 * k;
  const h = Math.round(276 + 7 * k);
  return {
    top: `oklch(${(l + 0.12).toFixed(3)} ${(c * 0.7).toFixed(3)} ${h})`,
    left: `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`,
    right: `oklch(${(l - 0.09).toFixed(3)} ${(c * 0.85).toFixed(3)} ${h})`,
  };
}
