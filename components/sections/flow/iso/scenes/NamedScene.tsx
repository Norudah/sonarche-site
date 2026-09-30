"use client";

import gsap from "gsap";

import type { SceneTags } from "../../copy";
import { onFront, polygon, project } from "../iso";
import { Box, Shadow, Stage } from "../primitives";
import { continuum, DEEP, INDIGO, INK, LAVENDER, PAPER, type Tone } from "../tones";
import { useDiorama } from "../useDiorama";

/*
 * Step 04 — the track gets its name, and a place.
 *
 * The file is held up in the air, blank: an empty cover, an empty tag panel.
 * One by one the six tags fly into it and are written as lines, the real cover
 * drops into its frame and catches the light, and a green seal says it is
 * done. Then the file is lowered into the folder where it now lives: a bin of
 * sleeves, where the others make room.
 */

const SCENE = "flow-named";

const BIN = { x: -18, y: -52, w: 76, d: 80, h: 24, t: 4, floor: 2 } as const;
const SLEEVE = { x: -11, w: 62, t: 3 } as const;

/* The sleeves already filed, back to front. */
const SHELF: { y: number; h: number; tone: Tone }[] = [
  { y: -44, h: 66, tone: DEEP },
  { y: -32, h: 70, tone: INDIGO },
  { y: -20, h: 63, tone: continuum(0.55) },
  { y: -8, h: 68, tone: LAVENDER },
];

/* The file itself, in its slot at the front of the bin. */
const FILE = { y: 5, h: 74 } as const;
const FACE = { x: SLEEVE.x, y: FILE.y + SLEEVE.t, z: BIN.floor + FILE.h } as const;

/* Held up for tagging: scaled about the middle of its face, moved up and left. */
const POSE_SCALE = 1.3;
const [OX, OY] = project(FACE.x + SLEEVE.w / 2, FACE.y, BIN.floor + FILE.h / 2);
const POSE = { x: 200 - OX, y: 136 - OY } as const;

/* Where the six tag lines sit on the file's face, in its own units. */
const LINES = [
  { u: 4, v: 61, w: 24 },
  { u: 4, v: 65.5, w: 19 },
  { u: 4, v: 70, w: 22 },
  { u: 33, v: 61, w: 18 },
  { u: 33, v: 65.5, w: 10 },
  { u: 33, v: 70, w: 15 },
] as const;

/* The tag chips waiting in a column to the left. */
const CHIP = { x: -138, y: 30, w: 44, d: 3, h: 14, base: 34, step: 18 } as const;
const chipZ = (i: number) => CHIP.base + (5 - i) * CHIP.step;

export function NamedScene({ tags }: { tags: SceneTags }) {
  const ref = useDiorama(({ q, loop, start }) => {
    const [file] = q("[data-file]");
    const [grow] = q("[data-file-scale]");
    const chips = q("[data-chip]");
    const lines = q("[data-line]");
    const [art] = q("[data-art]");
    const [shine] = q("[data-shine]");
    const [seal] = q("[data-seal]");
    const [lift] = q("[data-lift]");
    const sleeves = q("[data-sleeve]");
    const [bin] = q("[data-bin]");

    // The scale lives on its own group with a fixed origin: GSAP's smoothOrigin
    // would otherwise fold an origin change into x/y and the file would land off
    // its slot.
    gsap.set(grow, { svgOrigin: `${OX} ${OY}`, smoothOrigin: false });
    start(file, { x: POSE.x, y: POSE.y, opacity: 0 });
    start(grow, { scale: POSE_SCALE });
    start(chips, { x: 0, y: 0, scale: 1, opacity: 0, transformOrigin: "50% 50%" });
    start(lines, { scaleX: 0, transformOrigin: "0% 50%" });
    start(art, { opacity: 0, scale: 1.25, transformOrigin: "50% 50%" });
    start(shine, { x: -80 });
    start(seal, { scale: 0, transformOrigin: "50% 50%" });
    start(lift, { opacity: 0 });

    /* The blank file comes up, the tags line up beside it. */
    loop.to(file, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.2);
    loop.to(lift, { opacity: 1, duration: 0.5 }, 0.2);
    loop.fromTo(
      chips,
      { x: -12 },
      { x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power3.out", immediateRender: false },
      0.45,
    );

    /* Each tag flies into its line and is written there. */
    LINES.forEach((line, i) => {
      const [tx, ty] = posed(line.u + line.w / 2, line.v + 1.2);
      const [cx, cy] = project(CHIP.x + CHIP.w / 2, CHIP.y + CHIP.d, chipZ(i) + CHIP.h / 2);
      const at = 1.3 + i * 0.32;
      loop.to(chips[i], { x: tx - cx, duration: 0.5, ease: "power2.in" }, at);
      loop.to(chips[i], { y: ty - cy, duration: 0.5, ease: "back.in(1.6)" }, at);
      loop.to(chips[i], { scale: 0.3, opacity: 0, duration: 0.18, ease: "power2.in" }, at + 0.36);
      loop.to(lines[i], { scaleX: 1, duration: 0.35, ease: "power3.out" }, at + 0.45);
    });

    /* The real cover drops into its frame and catches the light. */
    loop.to(art, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, 3.55);
    loop.to(shine, { x: 90, duration: 0.8, ease: "power2.inOut" }, 3.9);
    loop.to(seal, { scale: 1, duration: 0.45, ease: "back.out(3)" }, 4.4);

    /* Filed: over the bin, down into its slot, and the others make room. */
    loop.to(file, { x: 0, y: -84, duration: 0.9, ease: "power2.inOut" }, 5.2);
    loop.to(grow, { scale: 1, duration: 0.9, ease: "power2.inOut" }, 5.2);
    loop.to(lift, { opacity: 0, duration: 0.5 }, 5.2);
    loop.to(file, { y: 0, duration: 0.55, ease: "power3.in" }, 6.1);
    loop.to(sleeves, { keyframes: { y: [0, -3, 0] }, duration: 0.45, ease: "power1.out", stagger: -0.06 }, 6.6);
    loop.to(bin, { keyframes: { y: [0, 1.5, 0] }, duration: 0.3, ease: "power1.out" }, 6.62);

    /* Held, then lifted back out for the next one. */
    const out = 9.4;
    loop.to(file, { y: -30, opacity: 0, duration: 0.6, ease: "power2.in" }, out);
    loop.set({}, {}, out + 1);
  });

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-art`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="oklch(0.38 0.14 277)" />
          <stop offset="60%" stopColor="oklch(0.56 0.17 280)" />
          <stop offset="100%" stopColor="oklch(0.78 0.1 287)" />
        </linearGradient>
        <clipPath id={`${SCENE}-cover`}>
          <rect x={4} y={4} width={54} height={54} rx={2} />
        </clipPath>
      </defs>

      {/* Where the file hangs while it is tagged. */}
      <g data-lift opacity={0}>
        <Shadow scene={SCENE} at={[-62, 40]} r={36} />
      </g>

      <g data-drop>
        <g data-bin>
          <Box at={[BIN.x, BIN.y, 0]} size={[BIN.w, BIN.t, BIN.h]} tone={PAPER} rim={false} />
          <Box at={[BIN.x, BIN.y, 0]} size={[BIN.t, BIN.d, BIN.h]} tone={PAPER} rim={false} />
          <path
            d={polygon([
              [BIN.x + BIN.t, BIN.y + BIN.t, BIN.floor],
              [BIN.x + BIN.w - BIN.t, BIN.y + BIN.t, BIN.floor],
              [BIN.x + BIN.w - BIN.t, BIN.y + BIN.d - BIN.t, BIN.floor],
              [BIN.x + BIN.t, BIN.y + BIN.d - BIN.t, BIN.floor],
            ])}
            fill="oklch(0.9 0.02 279)"
          />

          {SHELF.map((s, i) => (
            <g key={i} data-sleeve>
              <Box at={[SLEEVE.x, s.y, BIN.floor]} size={[SLEEVE.w, SLEEVE.t, s.h]} tone={s.tone} />
            </g>
          ))}

          <g data-file>
            <g data-file-scale>
              <Box at={[SLEEVE.x, FILE.y, BIN.floor]} size={[SLEEVE.w, SLEEVE.t, FILE.h]} tone={PAPER} />
              <g transform={onFront(FACE.x, FACE.y, FACE.z)}>
                <rect width={SLEEVE.w} height={FILE.h} fill="white" />

                {/* The empty frame, then the cover that fills it. */}
                <rect x={4.5} y={4.5} width={53} height={53} rx={2} stroke={INK.line} strokeDasharray="3 3" />
                <g clipPath={`url(#${SCENE}-cover)`}>
                  <g data-art>
                    <rect x={4} y={4} width={54} height={54} fill={`url(#${SCENE}-art)`} />
                    <circle cx={39} cy={22} r={9} fill="oklch(0.93 0.05 287)" />
                    {[0, 1, 2, 3].map((k) => (
                      <rect
                        key={k}
                        x={4}
                        y={37 + k * 5.4}
                        width={54}
                        height={2.4}
                        fill="white"
                        opacity={0.32 - k * 0.06}
                      />
                    ))}
                  </g>
                  <g data-shine>
                    <rect width={14} height={62} fill="white" opacity={0.45} transform="skewX(-18)" />
                  </g>
                </g>

                {LINES.map((l, i) => (
                  <g key={i}>
                    <rect x={l.u} y={l.v} width={25} height={2.4} rx={1.2} fill="oklch(0.95 0.008 279)" />
                    <rect
                      data-line
                      x={l.u}
                      y={l.v}
                      width={l.w}
                      height={2.4}
                      rx={1.2}
                      fill={i === 0 ? "oklch(0.5 0.06 279)" : "oklch(0.72 0.04 279)"}
                    />
                  </g>
                ))}

                <g data-seal>
                  <circle cx={SLEEVE.w - 4} cy={4} r={6.5} fill={INK.success} />
                  <path
                    d={`M${SLEEVE.w - 7},4.2 l2,2.1 l4,-4.2`}
                    stroke="white"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
            </g>
          </g>

          {/* Near walls last, so the file sinks behind them. */}
          <Box at={[BIN.x, BIN.y + BIN.d - BIN.t, 0]} size={[BIN.w, BIN.t, BIN.h]} tone={PAPER} />
          <Box at={[BIN.x + BIN.w - BIN.t, BIN.y, 0]} size={[BIN.t, BIN.d, BIN.h]} tone={PAPER} />
        </g>
      </g>

      {/* The six tags. */}
      <g data-depth="2">
        {tags.map((tag, i) => (
          <g key={tag} data-chip opacity={0}>
            <Box at={[CHIP.x, CHIP.y, chipZ(i)]} size={[CHIP.w, CHIP.d, CHIP.h]} tone={PAPER} />
            <g transform={onFront(CHIP.x, CHIP.y + CHIP.d, chipZ(i) + CHIP.h)}>
              <rect width={CHIP.w} height={CHIP.h} rx={2} fill="white" />
              <circle cx={6.5} cy={7} r={2} fill={INK.accent} />
              <text x={11.5} y={10.2} fontSize={8.6} fill={INK.label} style={{ fontFamily: "var(--font-mono)" }}>
                {tag}
              </text>
            </g>
          </g>
        ))}
      </g>
    </Stage>
  );
}

/* A point on the file's face, in face units, as it appears while held up. */
function posed(u: number, v: number): [number, number] {
  const [sx, sy] = project(FACE.x + u, FACE.y, FACE.z - v);
  return [OX + (sx - OX) * POSE_SCALE + POSE.x, OY + (sy - OY) * POSE_SCALE + POSE.y];
}
