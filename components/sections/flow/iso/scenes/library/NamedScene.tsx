"use client";

import type { SceneTags } from "@/components/sections/flow/copy";
import { floorEllipse } from "@/components/sections/flow/iso/iso";
import { Motes } from "@/components/sections/flow/iso/Motes";
import { Cylinder, Stage } from "@/components/sections/flow/iso/primitives";
import { INK, LAVENDER, PAPER } from "@/components/sections/flow/iso/tones";
import { useDiorama } from "@/components/sections/flow/iso/useDiorama";

import { Chip } from "./Chip";
import { directNamed } from "./direct";
import { PEDESTAL, POSE, PX, PY } from "./layout";
import { File, FileDefs, Shelf } from "./Shelf";

/* Step 04: the track gets its name, and its place in the library. */

const SCENE = "flow-named";

export function NamedScene({ tags }: { tags: SceneTags }) {
  const ref = useDiorama((cast) => directNamed(cast, tags));

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <FileDefs scene={SCENE} />
        <linearGradient id={`${SCENE}-column`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.28} />
        </linearGradient>
      </defs>

      <g data-rise>
        <ellipse cx={300} cy={300} rx={230} ry={90} fill={`url(#${SCENE}-shade)`} opacity={0.5} />
        <ellipse {...floorEllipse(40, -20, 0, 150)} fill="oklch(0.95 0.015 279)" opacity={0.7} />
        <Motes area={{ x: -20, y: -70, w: 140, d: 70, z: 30 }} count={14} seed={31} />
      </g>

      {/* The cabinet, with the file's home slot inside it. */}
      <g data-drop>
        <Shelf file={<File scene={SCENE} which="shelf" />} />
      </g>

      {/* The pedestal and its light. */}
      <g data-drop>
        <ellipse data-halo {...floorEllipse(PEDESTAL.x, PEDESTAL.y, 0, PEDESTAL.r + 16)} fill={`url(#${SCENE}-glow)`} />
        <Cylinder at={[PEDESTAL.x, PEDESTAL.y, 0]} r={PEDESTAL.r} h={PEDESTAL.h} tone={LAVENDER} lid={PAPER.top} />
        <ellipse
          {...floorEllipse(PEDESTAL.x, PEDESTAL.y, PEDESTAL.h + 0.3, PEDESTAL.r - 7)}
          stroke={INK.accent}
          strokeWidth={1.4}
          opacity={0.7}
        />
        <path
          data-column
          opacity={0}
          d={`M${PX - 30},${PY} L${PX - 24},${POSE.y} L${PX + 24},${POSE.y} L${PX + 30},${PY} Z`}
          fill={`url(#${SCENE}-column)`}
        />
      </g>

      {/* Tags behind the file. */}
      {tags.map((tag, i) => (
        <g key={i} data-chip-back opacity={0}>
          <Chip label={tag} />
        </g>
      ))}

      <g data-hover>
        <File scene={SCENE} which="fly" />
      </g>

      {/* Tags in front of it. */}
      <g data-depth="2">
        {tags.map((tag, i) => (
          <g key={i} data-chip-front opacity={0}>
            <Chip label={tag} />
          </g>
        ))}
      </g>
    </Stage>
  );
}
