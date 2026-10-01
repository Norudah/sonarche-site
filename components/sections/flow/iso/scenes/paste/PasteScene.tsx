"use client";

import { Bar } from "@/components/sections/flow/iso/Bar";
import { floorEllipse, onSide, project } from "@/components/sections/flow/iso/iso";
import { Motes } from "@/components/sections/flow/iso/Motes";
import { Box, Stage } from "@/components/sections/flow/iso/primitives";
import { continuum, INDIGO, INK, PAPER } from "@/components/sections/flow/iso/tones";
import { useDiorama } from "@/components/sections/flow/iso/useDiorama";

import { directPaste } from "./direct";
import { Flotsam } from "./Flotsam";
import { CELLS, CHIP, FISH, FLOTSAM, FX, FY, ROW_STEP, ROW_TOP, ROWS, SEA, WIN } from "./layout";

/* Step 01: a link rescued from the stream. A patch of the hero's sea, the web's flotsam riding it,
   and the composer floating above. */

const SCENE = "flow-paste";

export function PasteScene() {
  const ref = useDiorama(directPaste);

  const beamTop = [project(WIN.x, CHIP.y + CHIP.w + 6, WIN.z - WIN.h), project(WIN.x, CHIP.y - 6, WIN.z - WIN.h)];
  const beamFoot = [project(FISH.x, FISH.y - 14, 4), project(FISH.x, FISH.y + 14, 4)];

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-beam`} gradientUnits="userSpaceOnUse" x1="0" y1={beamTop[0][1]} x2="0" y2={FY}>
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.14} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.5} />
        </linearGradient>
      </defs>

      {/* The water, and the light under it. */}
      <g data-rise>
        <ellipse {...floorEllipse(SEA.x, SEA.y, -10, SEA.r + 26)} fill={`url(#${SCENE}-shade)`} opacity={0.55} />
        <ellipse {...floorEllipse(SEA.x, SEA.y, 0, SEA.r * 0.75)} fill={`url(#${SCENE}-glow)`} />
        <g data-sea>
          {CELLS.map((c, i) => (
            <g key={i} opacity={c.k > 0.72 ? Math.round((1 - (c.k - 0.72) / 0.28) * 100) / 100 : undefined}>
              <Bar at={[c.x - 3, c.y - 3, 0]} size={[6, 6, 9]} tone={continuum(Math.min(1, c.k * 1.1))} />
            </g>
          ))}
        </g>

        {FLOTSAM.map((f, i) => (
          <g key={i} data-float>
            <Flotsam x={f.x} y={f.y} kind={f.kind} />
          </g>
        ))}

        <ellipse data-lock opacity={0} {...floorEllipse(FISH.x, FISH.y, 8, 20)} stroke={INK.accent} strokeWidth={2} />
        <Motes area={{ x: SEA.x - 90, y: SEA.y - 90, w: 180, d: 180 }} count={26} seed={7} />
      </g>

      {/* The composer. */}
      <g data-drop>
        <Box at={[WIN.x - WIN.t, WIN.y - WIN.w, WIN.z - WIN.h]} size={[WIN.t, WIN.w, WIN.h]} tone={PAPER} />
        <g transform={onSide(WIN.x, WIN.y, WIN.z)}>
          <rect width={WIN.w} height={WIN.h} fill="oklch(0.997 0.002 279)" />
          <rect data-halo opacity={0} width={WIN.w} height={WIN.h} fill="oklch(0.62 0.2 277 / 0.08)" />
          <rect width={WIN.w} height={15} fill="oklch(0.955 0.012 279)" />
          {[9, 17, 25].map((u) => (
            <circle key={u} cx={u} cy={7.5} r={2.2} fill="oklch(0.82 0.035 279)" />
          ))}

          <rect x={8} y={26} width={134} height={22} rx={6} fill="white" stroke={INK.line} strokeWidth={1.2} />
          <rect
            data-focus
            opacity={0}
            x={7}
            y={25}
            width={136}
            height={24}
            rx={7}
            stroke={INK.accent}
            strokeWidth={1.6}
          />
          <rect data-url x={58} y={35} width={50} height={4} rx={2} fill="oklch(0.76 0.04 279)" />
          <rect data-caret opacity={0} x={109.5} y={32} width={1.4} height={10} fill={INK.accent} />
          <g data-go>
            <rect x={118} y={29} width={20} height={16} rx={5} fill={INK.accent} />
            <path
              d="M123,37 L132,37 M128.5,33.5 L132,37 L128.5,40.5"
              stroke="white"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {ROWS.map((row, i) => {
            const top = ROW_TOP + row.slot * ROW_STEP;
            return (
              <g key={i} data-row opacity={"duplicate" in row ? 0 : undefined}>
                <rect x={8} y={top} width={134} height={12} rx={3} fill="oklch(0.972 0.008 279)" />
                <circle cx={16} cy={top + 6} r={3.4} stroke={INK.accent} strokeWidth={1.4} />
                <rect x={25} y={top + 3} width={row.title} height={3} rx={1.5} fill="oklch(0.7 0.05 279)" />
                <rect x={25} y={top + 7.4} width={row.artist} height={2.2} rx={1.1} fill="oklch(0.85 0.025 279)" />
                <rect x={124} y={top + 4.8} width={12} height={2.4} rx={1.2} fill="oklch(0.85 0.025 279)" />
                {"duplicate" in row && (
                  <g data-badge>
                    <rect x={106} y={top + 2} width={14} height={8} rx={2} fill="oklch(0.92 0.02 279)" />
                    <path
                      d={`M109.5,${top + 6} l2,2 l4,-4`}
                      stroke="oklch(0.5 0.03 279)"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </g>

      {/* The capture beam, from the composer's underside down to the water. */}
      <g data-beam opacity={0}>
        <path
          d={`M${beamTop[0][0]},${beamTop[0][1]} L${beamTop[1][0]},${beamTop[1][1]} L${beamFoot[0][0]},${beamFoot[0][1]} L${beamFoot[1][0]},${beamFoot[1][1]} Z`}
          fill={`url(#${SCENE}-beam)`}
        />
        <path
          d={`M${beamTop[0][0]},${beamTop[0][1]} L${beamFoot[1][0]},${beamFoot[1][1]} M${beamTop[1][0]},${beamTop[1][1]} L${beamFoot[0][0]},${beamFoot[0][1]}`}
          stroke="white"
          strokeWidth={1.2}
          opacity={0.7}
        />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} data-rung cx={FX} cy={FY} rx={12} ry={4} stroke="white" strokeWidth={1.4} opacity={0} />
        ))}
      </g>

      {/* Pixels thrown off as the link leaves the water. */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          data-burst
          opacity={0}
          x={FX - 2}
          y={FY - 2}
          width={i % 3 ? 3 : 4}
          height={i % 3 ? 3 : 4}
          fill={i % 2 ? "white" : "oklch(0.62 0.17 277)"}
        />
      ))}

      {/* The link token: the one thing rescued from the stream. */}
      <g data-depth="2">
        <g data-chip>
          <g data-bob>
            <Box at={[WIN.x, CHIP.y, CHIP.z]} size={[CHIP.d, CHIP.w, CHIP.h]} tone={INDIGO} />
            <g transform={onSide(WIN.x + CHIP.d, CHIP.y + CHIP.w, CHIP.z + CHIP.h)}>
              <g stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none">
                <rect x={6} y={5.5} width={9} height={6} rx={3} />
                <rect x={12} y={5.5} width={9} height={6} rx={3} />
              </g>
              <rect x={25} y={7.4} width={10} height={2.4} rx={1.2} fill="white" opacity={0.75} />
            </g>
          </g>
        </g>
      </g>
    </Stage>
  );
}
