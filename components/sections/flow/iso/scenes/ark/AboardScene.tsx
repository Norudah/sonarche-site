"use client";

import { Box, Stage } from "@/components/sections/flow/iso/primitives";
import { floorEllipse, onFloor, project } from "@/components/sections/flow/iso/iso";
import { Motes } from "@/components/sections/flow/iso/Motes";
import { continuum, PAPER } from "@/components/sections/flow/iso/tones";
import { useDiorama } from "@/components/sections/flow/iso/useDiorama";

import { Rig } from "./Crane";
import { directAboard } from "./direct";
import { WATER } from "./hull";
import { BERTHS, CABIN_TOP, CRATE, FISH, PIT } from "./layout";
import { pitClip, Ship, Sling, Water } from "./Ship";

/* Step 02: the cargo comes aboard the Ark, riding the same sea the link came out of. */

const SCENE = "flow-aboard";

export function AboardScene() {
  const ref = useDiorama((cast) => directAboard(cast, SCENE));

  const [bx, by] = project(FISH.x, FISH.y, 2);

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        {/* Everything but what lies under the hold's near deck edges. */}
        <clipPath id={`${SCENE}-pit`}>
          <path d={pitClip()} />
        </clipPath>
      </defs>

      <g data-rise>
        <ellipse {...floorEllipse(6, 2, -10, 176)} fill={`url(#${SCENE}-shade)`} opacity={0.5} />
        <ellipse {...floorEllipse(6, 2, 0, 120)} fill={`url(#${SCENE}-glow)`} opacity={0.8} />
      </g>

      <g data-sea>
        <g data-rise>
          <Water bars={WATER.back} />
        </g>

        {/* The ship. */}
        <g data-ship>
          <g data-bob>
            <Ship />
          </g>
        </g>

        <g data-rise>
          <Water bars={WATER.front} />
        </g>
      </g>

      <g data-rise>
        <Motes area={{ x: -100, y: -80, w: 220, d: 200 }} count={20} seed={11} />
        <Motes
          area={{ x: -88, y: -4, w: 8, d: 8, z: CABIN_TOP + 20 }}
          count={9}
          seed={3}
          rise={60}
          colors={["oklch(0.86 0.04 279)", "white", "oklch(0.78 0.08 280)"]}
        />
      </g>

      {/* What the crane carries, and the crane's moving parts, above it all. */}
      <g data-rig-layer>
        <g data-bob>
          <g data-crates>
            {BERTHS.map((b, i) => (
              <g key={i} data-crate>
                <g data-squash>
                  <Box at={[b.x, b.y, PIT.floor]} size={[CRATE.w, CRATE.d, CRATE.h]} tone={PAPER} />
                  <g transform={onFloor(b.x, b.y, PIT.floor + CRATE.h)}>
                    {[0.4, 0.8, 0.55, 1, 0.65, 0.85, 0.35].map((v, j) => (
                      <rect
                        key={j}
                        x={5 + j * 2.6}
                        y={CRATE.d / 2 - v * 12}
                        width={1.5}
                        height={v * 24}
                        rx={0.75}
                        fill={continuum(j / 7).left}
                      />
                    ))}
                  </g>
                </g>
                <g data-sling opacity={0}>
                  <Sling cx={b.cx} top={PIT.floor + CRATE.h} />
                </g>
              </g>
            ))}
          </g>
          <Rig />
        </g>
      </g>

      {/* Spray thrown up where a crate leaves the water. */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          data-burst
          opacity={0}
          x={bx - 1.5}
          y={by - 1.5}
          width={3}
          height={3}
          fill={i % 2 ? "white" : "oklch(0.72 0.12 280)"}
        />
      ))}
    </Stage>
  );
}
