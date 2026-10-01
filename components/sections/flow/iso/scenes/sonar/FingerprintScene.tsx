"use client";

import { onFloor, project } from "@/components/sections/flow/iso/iso";
import { Motes } from "@/components/sections/flow/iso/Motes";
import { Box, Cylinder, Stage } from "@/components/sections/flow/iso/primitives";
import { continuum, INK, LAVENDER, PAPER } from "@/components/sections/flow/iso/tones";
import { useDiorama } from "@/components/sections/flow/iso/useDiorama";

import { directFingerprint } from "./direct";
import { ANSWER, BARS, CANDIDATES, CRATE, HUB } from "./layout";
import { Card, Orb, ORB } from "./Orb";
import { Ring, Station } from "./Station";

/* Step 03: the sonar reads the song. A round station, the crate on its hub, the track around it as
   a turning ring spectrum. */

const SCENE = "flow-print";

export function FingerprintScene() {
  const ref = useDiorama(directFingerprint);

  const back = BARS.filter((b) => b.x + b.y < 0);
  const front = BARS.filter((b) => b.x + b.y >= 0);
  const [bx, by] = project(0, 0, HUB.h + CRATE.h);

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-sweep`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="-80">
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.5} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* The station. */}
      <g data-rise>
        <ellipse cx={280} cy={275} rx={220} ry={100} fill={`url(#${SCENE}-shade)`} opacity={0.55} />
        <Station scene={SCENE} />
        <Motes area={{ x: -90, y: -90, w: 180, d: 180 }} count={16} seed={21} />
      </g>

      {/* The ring spectrum, split round the hub so each half paints on its side. */}
      <g data-ring>
        <Ring bars={back} all={BARS} />
      </g>
      <g data-drop>
        <Cylinder at={[0, 0, 0]} r={HUB.r} h={HUB.h} tone={LAVENDER} />
        <Box at={[-CRATE.s / 2, -CRATE.s / 2, HUB.h]} size={[CRATE.s, CRATE.s, CRATE.h]} tone={PAPER} />
        <g transform={onFloor(-CRATE.s / 2, -CRATE.s / 2, HUB.h + CRATE.h)}>
          {[0.45, 0.85, 0.6, 1, 0.7, 0.4].map((v, j) => (
            <rect
              key={j}
              x={4 + j * 2.6}
              y={CRATE.s / 2 - v * 7}
              width={1.5}
              height={v * 14}
              rx={0.75}
              fill={continuum(j / 6).left}
            />
          ))}
        </g>
      </g>
      <g data-ring>
        <Ring bars={front} all={BARS} />
      </g>

      {/* The print, lifting off the deck on its way up. */}
      <g data-hologram opacity={0}>
        <g transform={onFloor(0, 0, 0.2)}>
          {BARS.filter((b) => b.lit).map((b, i) => (
            <rect
              key={i}
              x={b.x - 3.4}
              y={b.y - 3.4}
              width={6.8}
              height={6.8}
              rx={1}
              fill="oklch(0.62 0.2 277)"
              transform={`rotate(${Math.round((b.a * 180) / Math.PI)} ${b.x} ${b.y})`}
            />
          ))}
        </g>
      </g>

      {/* The line to AcoustID, and what travels up it. */}
      <path
        data-beam
        d={`M${bx},${by} L${ORB.x},${ORB.y + ORB.r}`}
        stroke={INK.accent}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} data-packet cx={bx} cy={by} r={3.2} fill={INK.accent} opacity={0} />
      ))}

      <g data-depth="3">
        <g data-drop>
          <Orb scene={SCENE} label="AcoustID" />
        </g>
      </g>

      {/* The candidates: two guesses and the match. */}
      <g data-depth="2">
        {[CANDIDATES[0], CANDIDATES[2]].map((c, i) => (
          <g key={i} data-guess opacity={0}>
            <Card x={c.x} y={c.y} tone="guess" />
          </g>
        ))}
        <g data-answer>
          <Card x={ANSWER.x} y={ANSWER.y} tone="answer" />
        </g>
      </g>
    </Stage>
  );
}
