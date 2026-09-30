"use client";

import { Bar, barTo } from "../Bar";
import { box, floorEllipse, onFloor, onFront, onSide, polyline, project, shift } from "../iso";
import { Box, Shadow, Stage } from "../primitives";
import { continuum, INDIGO, INK, LAVENDER, PAPER, type Tone } from "../tones";
import { useDiorama } from "../useDiorama";

/*
 * Step 03 — the audio itself becomes the fingerprint.
 *
 * On the pad, the track as a spectrogram: a field of bars, time along one axis,
 * frequency along the other. A scan beam crosses it and, column by column, the
 * field collapses into a flat grid of bits, which is what Chromaprint does to a
 * song. The grid sends its query up to AcoustID, the node answers with a
 * sonar ping, and the recording comes back identified. At no point does
 * anything read a title.
 */

const SCENE = "flow-print";

const GRID = { x: -100, y: -40, cols: 10, rows: 6, cell: 11, bar: 7, z: 4 } as const;
const PAD = {
  x: GRID.x - 7,
  y: GRID.y - 7,
  w: (GRID.cols - 1) * GRID.cell + GRID.bar + 14,
  d: (GRID.rows - 1) * GRID.cell + GRID.bar + 14,
};

/* A spectrogram that looks like music: low bands louder, a beat along time. */
function energy(col: number, row: number): number {
  const v = 0.5 + 0.27 * Math.sin(col * 1.3 + row * 0.7) + 0.21 * Math.sin(col * 0.55 - row * 1.9 + 1.2);
  return Math.min(1, Math.max(0, v));
}

const CELLS = Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
  const col = i % GRID.cols;
  const row = Math.floor(i / GRID.cols);
  const e = energy(col, row);
  // Rounded: Math.sin is not bit-identical between the server and the browser,
  // and an attribute off in its last digit is a hydration mismatch.
  const h = Math.round((5 + 36 * e) * 10) / 10;
  return {
    col,
    x: GRID.x + col * GRID.cell,
    y: GRID.y + row * GRID.cell,
    h,
    lit: e > 0.52,
    e: Math.round(e * 100) / 100,
  };
}).sort((a, b) => a.x + a.y - (b.x + b.y) || a.x - b.x);

/* AcoustID: a floating stack of drums over the back right of the plinth. */
const NODE = { x: 74, y: -44, z: 96, r: 19, drum: 9, gap: 3.5 } as const;
const NODE_TOP = NODE.z + 3 * NODE.drum + 2 * NODE.gap;

/* The answer: a card standing over the pad once the match is back. */
const CARD = { x: -96, y: -18, z: 58, w: 86, h: 42, t: 3 } as const;

export function FingerprintScene() {
  const ref = useDiorama(({ q, loop, idle, start }) => {
    const bars = q("[data-print] [data-bar-h]");
    const bits = q("[data-bit]");
    const [beam] = q("[data-beam]");
    const [flash] = q("[data-flash]");
    const [node] = q("[data-node]");
    const pings = q("[data-ping]");
    const [ask] = q("[data-ask]");
    const [answer] = q("[data-answer]");
    const [card] = q("[data-card]");
    const [seal] = q("[data-seal]");

    idle.to(node, { y: -4, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: 1 });

    const sweep = (GRID.cols - 1) * GRID.cell + GRID.bar + 10;
    start(bars, { opacity: 1 });
    start(bits, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    start(beam, { x: 0, y: 0, opacity: 0 });
    start([flash, ask, answer], { opacity: 0 });
    start(ask, { x: 0, y: 0 });
    start(pings, { opacity: 0, scale: 0.6, transformOrigin: "50% 50%" });
    start(card, { opacity: 0, y: 14, scale: 0.9, transformOrigin: "50% 100%" });
    start(seal, { scale: 0, transformOrigin: "50% 50%" });

    /* The track plays: the field breathes once before it is read. */
    barTo(
      loop,
      bars,
      (i) => CELLS[i].h * (0.55 + 0.45 * Math.abs(Math.sin(i * 2.1))),
      { duration: 0.35, ease: "power2.inOut", each: 0.004 },
      0.2,
    );
    barTo(loop, bars, (i) => CELLS[i].h, { duration: 0.45, ease: "power2.inOut", each: 0.004 }, 0.6);

    /* The scan: the beam crosses and each column it passes collapses to bits. */
    const scan = 1.3;
    const pass = 1.9;
    const to = shift(sweep, 0);
    loop.to(beam, { opacity: 1, duration: 0.25 }, scan - 0.2);
    loop.to(beam, { x: to.x, y: to.y, duration: pass, ease: "none" }, scan);
    loop.to(beam, { opacity: 0, duration: 0.3 }, scan + pass);
    for (let col = 0; col < GRID.cols; col++) {
      const at = scan + ((col * GRID.cell + GRID.bar / 2 + 5) / sweep) * pass;
      const idx = CELLS.flatMap((c, i) => (c.col === col ? [i] : []));
      barTo(
        loop,
        idx.map((i) => bars[i]),
        () => 0.001,
        { duration: 0.28, ease: "power2.in" },
        at,
      );
      loop.to(
        idx.map((i) => bars[i]),
        { opacity: 0, duration: 0.05 },
        at + 0.26,
      );
      loop.to(
        idx.map((i) => bits[i]),
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" },
        at + 0.2,
      );
    }

    /* The print is whole. Asked, pinged, answered. */
    const done = scan + pass + 0.3;
    loop.fromTo(
      flash,
      { opacity: 0.9 },
      { opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false },
      done,
    );
    const up = shift(NODE.x - (PAD.x + PAD.w / 2), NODE.y - (PAD.y + PAD.d / 2), NODE.z - GRID.z);
    loop.set(ask, { opacity: 1 }, done + 0.2);
    loop.to(ask, { x: up.x, y: up.y, duration: 0.7, ease: "power2.in" }, done + 0.2);
    loop.set(ask, { opacity: 0 }, done + 0.9);
    loop.to(node, { scale: 1.08, duration: 0.1, ease: "power2.out", transformOrigin: "50% 50%" }, done + 0.9);
    loop.to(node, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }, done + 1.0);
    loop.to(
      pings,
      { keyframes: { opacity: [0, 0.9, 0], scale: [0.6, 1.4, 2.4] }, duration: 1.2, ease: "power1.out", stagger: 0.3 },
      done + 0.95,
    );
    loop.fromTo(
      answer,
      { x: up.x, y: up.y },
      { x: 0, y: 0, duration: 0.7, ease: "power2.out", immediateRender: false },
      done + 1.8,
    );
    loop.to(answer, { keyframes: { opacity: [0, 1, 1, 0] }, duration: 0.8, ease: "none" }, done + 1.8);
    loop.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.8)" }, done + 2.4);
    loop.to(seal, { scale: 1, duration: 0.5, ease: "back.out(3)" }, done + 2.8);

    /* Held, then the field grows back for the next track. */
    const out = done + 5.6;
    loop.to(card, { opacity: 0, y: 10, duration: 0.45, ease: "power2.in" }, out);
    loop.to(bits, { opacity: 0, scale: 0.6, duration: 0.35, stagger: 0.006 }, out + 0.2);
    loop.set(bars, { opacity: 1 }, out + 0.5);
    barTo(loop, bars, (i) => CELLS[i].h, { duration: 0.5, ease: "back.out(1.4)", each: 0.008 }, out + 0.5);
    loop.set({}, {}, out + 1.6);
  });

  const beamFoot: [number, number, number][] = [
    [GRID.x - 5, PAD.y + 2, GRID.z + 0.5],
    [GRID.x - 5, PAD.y + PAD.d - 2, GRID.z + 0.5],
  ];
  const [ax, ay] = project(PAD.x + PAD.w / 2, PAD.y + PAD.d / 2, GRID.z + 2);
  const [bx, by] = project(NODE.x, NODE.y, NODE.z);

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.42} />
        </linearGradient>
        <linearGradient id={`${SCENE}-drum`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={INDIGO.left} />
          <stop offset="55%" stopColor={INDIGO.left} />
          <stop offset="100%" stopColor={INDIGO.right} />
        </linearGradient>
      </defs>

      {/* The pad and the spectrogram on it. */}
      <g data-drop>
        <Box at={[PAD.x, PAD.y, 0]} size={[PAD.w, PAD.d, GRID.z]} tone={PAPER} />
        {CELLS.map((c, i) => (
          <path
            key={i}
            data-bit
            d={box(c.x, c.y, GRID.z + 0.3, GRID.bar, GRID.bar, 0).top}
            fill={c.lit ? INK.accent : "oklch(0.9 0.03 277)"}
          />
        ))}
        <g data-print>
          {CELLS.map((c, i) => (
            <Bar
              key={i}
              at={[c.x, c.y, GRID.z]}
              size={[GRID.bar, GRID.bar, c.h]}
              tone={continuum(1 - c.e)}
              opacity={0}
            />
          ))}
        </g>
        <path
          data-flash
          opacity={0}
          d={box(PAD.x, PAD.y, GRID.z + 0.5, PAD.w, PAD.d, 0).top}
          stroke={INK.accent}
          strokeWidth={2}
          fill="oklch(0.62 0.2 277 / 0.12)"
        />
      </g>

      {/* The scan beam: a sheet of light standing across the pad. */}
      <g data-beam opacity={0}>
        <g transform={onSide(GRID.x - 5, PAD.y + PAD.d - 2, GRID.z + 54)}>
          <rect width={PAD.d - 4} height={54} fill={`url(#${SCENE}-beam)`} />
          <rect width={PAD.d - 4} height={1.5} fill="oklch(0.62 0.2 277)" opacity={0.7} />
        </g>
        <path d={polyline(beamFoot)} stroke="oklch(0.58 0.22 277)" strokeWidth={2.4} strokeLinecap="round" />
      </g>

      {/* The line to AcoustID, and what travels on it. */}
      <path d={`M${ax},${ay} L${bx},${by}`} stroke={INK.accent} strokeWidth={1.4} strokeDasharray="3 5" opacity={0.5} />
      <circle data-ask opacity={0} cx={ax} cy={ay} r={4} fill={INK.accent} />
      <circle data-answer opacity={0} cx={ax} cy={ay} r={4.5} fill={INK.success} />

      {/* AcoustID, and its name on the plinth under it. */}
      <Shadow scene={SCENE} at={[NODE.x, NODE.y]} r={26} />
      <text
        transform={onFloor(NODE.x - 30, NODE.y + 34)}
        style={{ fontFamily: "var(--font-mono)" }}
        fontSize={10.5}
        letterSpacing={0.4}
        fill={INK.label}
      >
        AcoustID
      </text>
      <g data-depth="3">
        <g data-drop>
          <g data-node>
            {[0, 1, 2].map((i) => (
              <Drum
                key={i}
                x={NODE.x}
                y={NODE.y}
                z={NODE.z + i * (NODE.drum + NODE.gap)}
                r={NODE.r}
                h={NODE.drum}
                tone={INDIGO}
              />
            ))}
            <ellipse {...floorEllipse(NODE.x, NODE.y, NODE_TOP, NODE.r * 0.45)} fill="oklch(0.8 0.1 277)" />
            {[0, 1].map((i) => (
              <ellipse
                key={i}
                data-ping
                opacity={0}
                {...floorEllipse(NODE.x, NODE.y, NODE.z + NODE.drum * 1.5 + NODE.gap, NODE.r + 6)}
                stroke={INK.accent}
                strokeWidth={1.6}
              />
            ))}
          </g>
        </g>
      </g>

      {/* The answer: identified, sealed green. */}
      <g data-depth="2">
        <g data-card>
          <Box at={[CARD.x, CARD.y - CARD.t, CARD.z]} size={[CARD.w, CARD.t, CARD.h]} tone={PAPER} />
          <g transform={onFront(CARD.x, CARD.y, CARD.z + CARD.h)}>
            <rect width={CARD.w} height={CARD.h} fill="white" />
            <rect x={7} y={7} width={28} height={28} rx={3} fill={LAVENDER.top} />
            <ellipse cx={18} cy={26} rx={3.6} ry={2.8} fill={INK.accent} />
            <path
              d="M21.4,26 V13.5 l6,2.4"
              stroke={INK.accent}
              strokeWidth={1.8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x={41} y={11} width={34} height={4} rx={2} fill="oklch(0.5 0.06 279)" />
            <rect x={41} y={19.5} width={24} height={3} rx={1.5} fill="oklch(0.75 0.035 279)" />
            <rect x={41} y={27} width={29} height={3} rx={1.5} fill="oklch(0.87 0.02 279)" />
            <g data-seal>
              <circle cx={CARD.w - 3} cy={3} r={8} fill={INK.success} />
              <path
                d={`M${CARD.w - 6.6},3.2 l2.4,2.5 l4.8,-5`}
                stroke="white"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
    </Stage>
  );
}

/* A drum: an upright cylinder, shaded across its width, with a lit lid. */
function Drum({ x, y, z, r, h, tone }: { x: number; y: number; z: number; r: number; h: number; tone: Tone }) {
  const top = floorEllipse(x, y, z + h, r);
  const bottomY = top.cy + h;
  return (
    <g>
      <path
        d={`M${top.cx - top.rx},${top.cy} L${top.cx - top.rx},${bottomY} A${top.rx},${top.ry} 0 0 0 ${top.cx + top.rx},${bottomY} L${top.cx + top.rx},${top.cy} Z`}
        fill={`url(#${SCENE}-drum)`}
      />
      <ellipse {...top} fill={tone.top} stroke="white" strokeOpacity={0.5} strokeWidth={0.8} />
    </g>
  );
}
