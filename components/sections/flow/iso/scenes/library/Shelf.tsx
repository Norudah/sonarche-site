import type { ReactNode } from "react";

import { onFront, polygon, project } from "../../iso";
import { Box } from "../../primitives";
import { continuum, DEEP, INDIGO, INK, LAVENDER, PAPER, type Tone } from "../../tones";

/*
 * The library the track is filed into: a cabinet of cubbies, open toward the
 * reader, every one holding sleeves but the one waiting for this track.
 *
 * Painted the way it is built, bottom row first and left to right, so each
 * shelf's front edge and each divider covers the cubby behind it.
 */

const SHELF = { x: 4, y: -86, cols: 3, rows: 3, cw: 38, ch: 36, d: 34, t: 3 } as const;
const FRONT = SHELF.y + SHELF.d;
const TARGET = { c: 1, r: 1 } as const;

/** The file's slot in the target cubby, at the front. */
export const SLOT = (() => {
  const x = SHELF.x + TARGET.c * SHELF.cw + SHELF.t + 3.5;
  const z = TARGET.r * SHELF.ch + SHELF.t;
  return { x, y: FRONT - 7, z, w: SHELF.cw - SHELF.t - 7, t: 3, h: 28 };
})();

const TONES: Tone[] = [DEEP, INDIGO, continuum(0.35), LAVENDER, continuum(0.6), INDIGO, DEEP, continuum(0.2)];

type ShelfProps = {
  /** Painted inside the target cubby, in front of its sleeves. */
  file: ReactNode;
};

export function Shelf({ file }: ShelfProps) {
  const { x, y, cols, rows, cw, ch, d, t } = SHELF;
  const W = cols * cw + t;

  return (
    <g>
      {/* The back panel's inner face. */}
      <path
        d={polygon([
          [x, y + t, 0],
          [x + W, y + t, 0],
          [x + W, y + t, rows * ch + t],
          [x, y + t, rows * ch + t],
        ])}
        fill="oklch(0.86 0.03 279)"
      />

      {Array.from({ length: rows }, (_, r) => (
        <g key={r}>
          <Box at={[x, y, r * ch]} size={[W, d, t]} tone={PAPER} rim={false} />
          {Array.from({ length: cols }, (_, c) => {
            const target = r === TARGET.r && c === TARGET.c;
            return (
              <g key={c}>
                <Box at={[x + c * cw, y, r * ch + t]} size={[t, d, ch - t]} tone={PAPER} rim={false} />
                <Sleeves c={c} r={r} few={target} />
                {target && file}
                <path
                  data-cubby-glow
                  d={opening(c, r)}
                  fill="oklch(0.66 0.2 277 / 0.38)"
                  stroke="white"
                  strokeWidth={1.4}
                  opacity={0}
                />
              </g>
            );
          })}
          <Box at={[x + cols * cw, y, r * ch + t]} size={[t, d, ch - t]} tone={PAPER} rim={false} />
        </g>
      ))}
      <Box at={[x, y, rows * ch]} size={[W, d, t]} tone={PAPER} />
      <path
        data-target-ring
        d={opening(TARGET.c, TARGET.r)}
        stroke={INK.accent}
        strokeWidth={1.6}
        strokeDasharray="4 3"
        opacity={0}
      />
    </g>
  );
}

/* The sleeves standing in one cubby, back to front. */
function Sleeves({ c, r, few }: { c: number; r: number; few: boolean }) {
  const { x, y, cw, ch, t } = SHELF;
  const count = few ? 2 : 4 - ((c + r) % 2);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const tone = TONES[(c * 3 + r * 2 + i) % TONES.length];
        const h = 22 + ((c * 5 + r * 3 + i * 7) % 7);
        return (
          <Box
            key={i}
            at={[x + c * cw + t + 3.5, y + t + 3 + i * 6, r * ch + t]}
            size={[cw - t - 7, 3, h]}
            tone={tone}
            rim={false}
          />
        );
      })}
    </>
  );
}

/* The front opening of a cubby, on the cabinet's open face. */
function opening(c: number, r: number): string {
  const { x, cw, ch, t } = SHELF;
  const x0 = x + c * cw + t;
  const x1 = x + (c + 1) * cw;
  const z0 = r * ch + t;
  const z1 = (r + 1) * ch;
  return polygon([
    [x0, FRONT, z0],
    [x1, FRONT, z0],
    [x1, FRONT, z1],
    [x0, FRONT, z1],
  ]);
}

/** The screen centre of the file's face in its slot, the origin it scales about. */
export const SLOT_FACE = project(SLOT.x + SLOT.w / 2, SLOT.y + SLOT.t, SLOT.z + SLOT.h / 2);

/* The file's face, in its own units (w × h), for the tag lines to aim at. */
export const LINES = [
  { u: 2, v: 21.4, w: 6.5 },
  { u: 2, v: 24.2, w: 5 },
  { u: 10.5, v: 21.4, w: 6 },
  { u: 10.5, v: 24.2, w: 4 },
  { u: 19, v: 21.4, w: 6 },
  { u: 19, v: 24.2, w: 4.5 },
] as const;

/** The track's sleeve: an empty frame, then its cover, its tags and its seal. */
export function File({ scene, which }: { scene: string; which: "fly" | "shelf" }) {
  const { x, y, z, w, t, h } = SLOT;
  return (
    <g data-file={which} opacity={which === "fly" ? 0 : undefined}>
      <g data-file-scale>
        <Box at={[x, y, z]} size={[w, t, h]} tone={PAPER} rim={false} />
        <g transform={onFront(x, y + t, z + h)}>
          <rect width={w} height={h} fill="white" />
          <rect
            x={2.3}
            y={2.3}
            width={w - 4.6}
            height={16.4}
            rx={1}
            stroke={INK.line}
            strokeWidth={0.6}
            strokeDasharray="1.6 1.4"
          />
          <g clipPath={`url(#${scene}-cover)`}>
            <g data-art>
              <rect x={2} y={2} width={w - 4} height={17} fill={`url(#${scene}-art)`} />
              <circle cx={w - 8} cy={7.5} r={3.4} fill="oklch(0.93 0.05 287)" />
              {[0, 1, 2].map((k) => (
                <rect key={k} x={2} y={12 + k * 2.2} width={w - 4} height={1} fill="white" opacity={0.3 - k * 0.07} />
              ))}
            </g>
            <g data-shine>
              <rect width={5} height={22} fill="white" opacity={0.5} transform="skewX(-18)" />
            </g>
          </g>
          {LINES.map((l, i) => (
            <g key={i}>
              <rect x={l.u} y={l.v} width={7} height={1.3} rx={0.65} fill="oklch(0.95 0.008 279)" />
              <rect
                data-line
                x={l.u}
                y={l.v}
                width={l.w}
                height={1.3}
                rx={0.65}
                fill={i === 0 ? "oklch(0.5 0.06 279)" : "oklch(0.72 0.04 279)"}
              />
            </g>
          ))}
          <g data-seal>
            <circle cx={w - 1.5} cy={1.5} r={3.4} fill={INK.success} />
            <path
              d={`M${w - 3.1},1.6 l1.1,1.1 l2.1,-2.2`}
              stroke="white"
              strokeWidth={0.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </g>
  );
}

/** The cover's frame, for the clip and gradient every File shares. */
export function FileDefs({ scene }: { scene: string }) {
  return (
    <>
      <linearGradient id={`${scene}-art`} x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0%" stopColor="oklch(0.38 0.14 277)" />
        <stop offset="60%" stopColor="oklch(0.56 0.17 280)" />
        <stop offset="100%" stopColor="oklch(0.78 0.1 287)" />
      </linearGradient>
      <clipPath id={`${scene}-cover`}>
        <rect x={2} y={2} width={SLOT.w - 4} height={17} rx={1} />
      </clipPath>
    </>
  );
}
