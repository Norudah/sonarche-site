import { project } from "../../iso";
import { Box, Cylinder } from "../../primitives";
import { DEEP, PAPER } from "../../tones";
import { DECK } from "./hull";

/*
 * The Ark's tower crane: a mast at the bow, a jib that slews all the way
 * round, a trolley that runs along it, and a cable that pays out.
 *
 * A jib turning about a vertical axis cannot be a rotation on screen: its
 * projection changes length and slope as it turns. It is drawn once in its own
 * units (along the jib in world units, across it in screen units) and laid
 * down each frame by one affine matrix, which maps the jib's axis onto its
 * projected direction and keeps its depth vertical. Everything here moves by
 * transform alone.
 */

export const CRANE = { x: 70, y: 0, top: 140, jib: 124, counter: 30 } as const;

/** Slew angle (radians, world), trolley radius, cable length, sideways swing. */
export type Pose = { a: number; r: number; l: number; sway: number };

export const REST: Pose = { a: 2.55, r: 62, l: 26, sway: 0 };

const [PX, PY] = project(CRANE.x, CRANE.y, CRANE.top);

export function frame({ a, r, l, sway }: Pose) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const [tx, ty] = project(CRANE.x + r * c, CRANE.y + r * s, CRANE.top);
  const len = Math.max(1, l);
  return {
    jib: `matrix(${f(c - s)} ${f((c + s) / 2)} 0 1 ${f(PX)} ${f(PY)})`,
    trolley: `translate(${f(tx)} ${f(ty)})`,
    cable: `matrix(1 0 ${f(sway)} ${f(len)} ${f(tx)} ${f(ty)})`,
    hook: `translate(${f(tx + sway)} ${f(ty + len)})`,
    /** The hook's screen point, for whatever hangs from it. */
    at: [tx + sway, ty + len] as const,
  };
}

const INK = "oklch(0.34 0.09 277)";

/** The mast and its turntable, part of the ship. */
export function Mast() {
  return (
    <g>
      <Box at={[CRANE.x - 3, CRANE.y - 3, DECK]} size={[6, 6, CRANE.top - DECK - 5]} tone={PAPER} />
      <Cylinder at={[CRANE.x, CRANE.y, CRANE.top - 5]} r={6} h={5} tone={DEEP} />
    </g>
  );
}

/** The moving parts, drawn above everything they carry. */
export function Rig() {
  const pose = frame(REST);
  const { jib, counter } = CRANE;
  const chord = (u: number) => -9 + (7 * (u + counter)) / (jib + counter);
  const lattice = Array.from({ length: Math.floor(jib / 10) }, (_, i) => {
    const u = i * 10;
    return `M${u},0 L${u + 5},${f(chord(u + 5))} L${u + 10},0`;
  }).join(" ");

  return (
    <g>
      <rect data-cable x={-0.6} width={1.2} height={1} fill={INK} transform={pose.cable} />
      <g data-trolley transform={pose.trolley}>
        <rect x={-5} y={-2} width={10} height={5} rx={1} fill={DEEP.left} />
      </g>
      <g data-hook transform={pose.hook}>
        <circle r={2.8} stroke={INK} strokeWidth={1.6} fill="white" />
        <path d="M0,2.8 v3 a2.4,2.4 0 1 0 2.4,2.4" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
      </g>
      <g data-jib transform={pose.jib}>
        <g stroke={INK} strokeLinecap="round" strokeLinejoin="round">
          <path d={`M${-counter},0 L${jib},0`} strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
          <path
            d={`M${-counter},${f(chord(-counter))} L${jib},${f(chord(jib))}`}
            strokeWidth={1.6}
            vectorEffect="non-scaling-stroke"
          />
          <path d={lattice} strokeWidth={0.9} vectorEffect="non-scaling-stroke" opacity={0.8} />
        </g>
        <rect x={-counter} y={0} width={13} height={9} fill={DEEP.right} />
        <rect
          x={-7}
          y={-12}
          width={12}
          height={12}
          rx={1.5}
          fill={PAPER.top}
          stroke={INK}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </g>
  );
}

/** Writes a pose onto the rig's elements. */
export function driver(root: { jib: Element; trolley: Element; cable: Element; hook: Element }) {
  return (pose: Pose) => {
    const fr = frame(pose);
    root.jib.setAttribute("transform", fr.jib);
    root.trolley.setAttribute("transform", fr.trolley);
    root.cable.setAttribute("transform", fr.cable);
    root.hook.setAttribute("transform", fr.hook);
    return fr.at;
  };
}

function f(n: number): number {
  return Math.round(n * 100) / 100;
}
