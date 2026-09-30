import { useId, type ReactNode, type Ref, type SVGProps } from "react";

import { box, floorEllipse, polygon, polyline, STAGE, type Vec3 } from "./iso";
import { INK, type Tone } from "./tones";

/*
 * The dioramas' shared vocabulary: a lit box, an extruded outline (a hull, a
 * disc), a cylinder, and the stage they stand in.
 * Nothing here animates by itself — the scenes tag the groups they move and
 * their director does the rest.
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

type PrismProps = {
  /** The outline on the floor, in world units, convex, in either winding. */
  outline: readonly (readonly [number, number])[];
  z: number;
  h: number;
  tone: Tone;
  rim?: boolean;
  /** false for a band wrapped round something taller: sides only. */
  lid?: boolean;
} & Omit<SVGProps<SVGGElement>, "children">;

/**
 * An outline extruded upward. Each side the camera can see is shaded by where
 * it faces, blended from the lit left tone to the shaded right one, so a
 * many-sided outline reads as a smooth curve.
 */
export function Prism({ outline: points, z, h, tone, rim = true, lid = true, ...rest }: PrismProps) {
  const cx = points.reduce((s, p) => s + p[0], 0) / points.length;
  const cy = points.reduce((s, p) => s + p[1], 0) / points.length;

  const sides = points.flatMap((a, i) => {
    const b = points[(i + 1) % points.length];
    let nx = b[1] - a[1];
    let ny = -(b[0] - a[0]);
    if (nx * ((a[0] + b[0]) / 2 - cx) + ny * ((a[1] + b[1]) / 2 - cy) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const len = Math.hypot(nx, ny) || 1;
    nx /= len;
    ny /= len;
    if (nx + ny <= 0.001) return [];
    const t = Math.round(Math.min(1, Math.max(0, (nx - ny + 1) / 2)) * 100);
    return [{ a, b, t }];
  });

  return (
    <g {...rest}>
      {sides.map(({ a, b, t }, i) => {
        const fill = `color-mix(in oklch, ${tone.right} ${t}%, ${tone.left})`;
        return (
          <path
            key={i}
            d={polygon([
              [a[0], a[1], z],
              [b[0], b[1], z],
              [b[0], b[1], z + h],
              [a[0], a[1], z + h],
            ])}
            style={{ fill, stroke: fill }}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        );
      })}
      {lid && (
        <path
          d={polygon(points.map(([x, y]) => [x, y, z + h] as const))}
          fill={tone.top}
          stroke={tone.top}
          strokeWidth={0.6}
          strokeLinejoin="round"
        />
      )}
      {rim && (
        <path
          d={sides
            .map(({ a, b }) =>
              polyline([
                [a[0], a[1], z + h],
                [b[0], b[1], z + h],
              ]),
            )
            .join(" ")}
          stroke="white"
          strokeOpacity={0.7}
          strokeWidth={1}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/** A regular outline of `n` corners around (x, y), for discs and pads. */
export function circle(x: number, y: number, r: number, n = 48): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.round((x + r * Math.cos(a)) * 100) / 100, Math.round((y + r * Math.sin(a)) * 100) / 100];
  });
}

type CylinderProps = {
  at: Vec3;
  r: number;
  h: number;
  tone: Tone;
  /** Replaces the lid's fill, for a lid that is a face of its own. */
  lid?: string;
} & Omit<SVGProps<SVGGElement>, "children">;

/** An upright cylinder: a side shaded across its width and a lit lid. */
export function Cylinder({ at, r, h, tone, lid, ...rest }: CylinderProps) {
  const id = `cyl${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const top = floorEllipse(at[0], at[1], at[2] + h, r);
  const base = top.cy + h;

  return (
    <g {...rest}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={tone.left} />
          <stop offset="45%" stopColor={tone.left} />
          <stop offset="100%" stopColor={tone.right} />
        </linearGradient>
      </defs>
      <path
        d={`M${top.cx - top.rx},${top.cy} L${top.cx - top.rx},${base} A${top.rx},${top.ry} 0 0 0 ${top.cx + top.rx},${base} L${top.cx + top.rx},${top.cy} Z`}
        fill={`url(#${id})`}
      />
      <ellipse {...top} fill={lid ?? tone.top} stroke="white" strokeOpacity={0.6} strokeWidth={0.9} />
    </g>
  );
}

type StageProps = {
  /** Unique per page: prefixes the shared gradient ids. */
  scene: string;
  svgRef?: Ref<SVGSVGElement>;
  children: ReactNode;
};

/** The 560×420 stage and the gradients every scene shares. */
export function Stage({ scene, svgRef, children }: StageProps) {
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
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.4} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
        </radialGradient>
      </defs>
      {children}
    </svg>
  );
}
