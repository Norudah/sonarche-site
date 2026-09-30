import type { ReactNode, Ref, SVGProps } from "react";

import { box, floorEllipse, onFloor, polyline, project, STAGE, type Vec3 } from "./iso";
import { INK, PLINTH, type Tone } from "./tones";

/*
 * The dioramas' shared vocabulary: a lit box, a soft contact shadow, and the
 * stage every scene is built on. Nothing here animates by itself — the scenes
 * tag the groups they move and their director does the rest.
 */

type BoxProps = {
  at: Vec3;
  size: Vec3;
  tone: Tone;
  /** The catch-light along the two top edges nearest the camera. */
  rim?: boolean;
} & Omit<SVGProps<SVGGElement>, "children">;

export function Box({ at, size, tone, rim = true, ...rest }: BoxProps) {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const faces = box(x, y, z, w, d, h);

  return (
    <g {...rest}>
      {/* Each face is stroked in its own colour so neighbours meet without an
          anti-aliased hairline of background between them. */}
      <path d={faces.left} fill={tone.left} stroke={tone.left} strokeWidth={0.6} strokeLinejoin="round" />
      <path d={faces.right} fill={tone.right} stroke={tone.right} strokeWidth={0.6} strokeLinejoin="round" />
      <path d={faces.top} fill={tone.top} stroke={tone.top} strokeWidth={0.6} strokeLinejoin="round" />
      {rim && (
        <path
          d={polyline([
            [x, y + d, z + h],
            [x + w, y + d, z + h],
            [x + w, y, z + h],
          ])}
          stroke="white"
          strokeOpacity={0.75}
          strokeWidth={1}
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

type ShadowProps = {
  scene: string;
  /** Centre on the floor, in world units. */
  at: readonly [number, number];
  /** Radius in world units; the ellipse follows the floor's 2:1. */
  r: number;
  z?: number;
} & Omit<SVGProps<SVGEllipseElement>, "children">;

export function Shadow({ scene, at, r, z = 0, ...rest }: ShadowProps) {
  return <ellipse {...floorEllipse(at[0], at[1], z, r)} fill={`url(#${scene}-shade)`} {...rest} />;
}

/** The plinth's footprint, shared so scenes can lay props out against it. */
export const PLINTH_BOUNDS = { x: -120, y: -75, w: 240, d: 150, h: 16 } as const;

type StageProps = {
  /** Unique per page: prefixes the gradient and pattern ids. */
  scene: string;
  svgRef?: Ref<SVGSVGElement>;
  children: ReactNode;
};

export function Stage({ scene, svgRef, children }: StageProps) {
  const { x, y, w, d, h } = PLINTH_BOUNDS;
  const [gx, gy] = project(0, 0, -h);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${STAGE.width} ${STAGE.height}`}
      fill="none"
      className="absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <radialGradient id={`${scene}-shade`}>
          <stop offset="0%" stopColor={INK.shadow} stopOpacity={0.26} />
          <stop offset="55%" stopColor={INK.shadow} stopOpacity={0.1} />
          <stop offset="100%" stopColor={INK.shadow} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${scene}-glow`}>
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.35} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
        </radialGradient>
        <pattern id={`${scene}-dots`} width={20} height={20} patternUnits="userSpaceOnUse">
          <circle cx={10} cy={10} r={1.3} fill="oklch(0.84 0.03 279)" />
        </pattern>
      </defs>

      <g data-stage>
        <ellipse cx={gx} cy={gy + 18} rx={250} ry={96} fill={`url(#${scene}-shade)`} opacity={0.8} />
        <Box at={[x, y, -h]} size={[w, d, h]} tone={PLINTH} />
        {/* The survey grid, drawn in floor units so the dots sit on the iso lattice. */}
        <rect
          x={x + 10}
          y={y + 10}
          width={w - 20}
          height={d - 20}
          fill={`url(#${scene}-dots)`}
          transform={onFloor(0, 0)}
        />
      </g>

      {children}
    </svg>
  );
}
