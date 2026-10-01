import { Bar } from "@/components/sections/flow/iso/Bar";
import { onFront, onSide, polygon, polyline, project } from "@/components/sections/flow/iso/iso";
import { Box, Cylinder, Prism } from "@/components/sections/flow/iso/primitives";
import { continuum, DEEP, INDIGO, INK, LAVENDER, PAPER, type Tone } from "@/components/sections/flow/iso/tones";

import { Mast } from "./Crane";
import { DECK, HULL, KEEL, WATER } from "./hull";
import { BERTHS, CABIN, CABIN_TOP, CRATE, FOAM, PIT, PORTS } from "./layout";

const HULL_TONE: Tone = { top: "oklch(0.965 0.012 279)", left: INDIGO.left, right: INDIGO.right };

export function Water({ bars }: { bars: typeof WATER.back }) {
  return (
    <>
      {bars.map((c, i) => (
        <g key={i} opacity={c.k > 0.72 ? Math.round((1 - (c.k - 0.72) / 0.28) * 100) / 100 : undefined}>
          <Bar at={[c.x - 3, c.y - 3, 0]} size={[6, 6, 8]} tone={continuum(Math.min(1, 0.25 + c.k * 0.8))} />
        </g>
      ))}
    </>
  );
}

export function Ship() {
  const { x, y, w, d } = PIT;
  return (
    <>
      <Prism outline={HULL} z={KEEL} h={DECK - KEEL} tone={HULL_TONE} />
      <Prism outline={HULL} z={6} h={4} tone={LAVENDER} lid={false} rim={false} />
      {/* Foam where the hull meets the water, on the sides the camera sees. */}
      <path
        d={polyline(FOAM.map(([fx, fy]) => [fx, fy, 0.5] as const))}
        stroke="white"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />

      {/* Planking. */}
      {[-24, -12, 12, 24].map((py) => (
        <path
          key={py}
          d={polyline([
            [-100, py, DECK],
            [58, py, DECK],
          ])}
          stroke="oklch(0.91 0.02 279)"
          strokeWidth={1}
        />
      ))}

      {/* The hold: its far walls and floor, and the berth marks. */}
      <path
        d={polygon([
          [x, y, DECK],
          [x + w, y, DECK],
          [x + w, y, PIT.floor],
          [x, y, PIT.floor],
        ])}
        fill={DEEP.left}
      />
      <path
        d={polygon([
          [x, y, DECK],
          [x, y + d, DECK],
          [x, y + d, PIT.floor],
          [x, y, PIT.floor],
        ])}
        fill={DEEP.top}
      />
      <path
        d={polygon([
          [x, y, PIT.floor],
          [x + w, y, PIT.floor],
          [x + w, y + d, PIT.floor],
          [x, y + d, PIT.floor],
        ])}
        fill="oklch(0.46 0.12 277)"
      />
      {BERTHS.map((b, i) => (
        <path
          key={i}
          d={polygon([
            [b.x, b.y, PIT.floor],
            [b.x + CRATE.w, b.y, PIT.floor],
            [b.x + CRATE.w, b.y + CRATE.d, PIT.floor],
            [b.x, b.y + CRATE.d, PIT.floor],
          ])}
          stroke="oklch(0.62 0.14 277)"
          strokeDasharray="3 3"
        />
      ))}

      {/* The head: the cabin, its eyes on the hold, its portholes for the tally. */}
      <Box at={[CABIN.x, CABIN.y, DECK]} size={[CABIN.w, CABIN.d, CABIN.h]} tone={PAPER} />
      <Box at={[CABIN.x - 3, CABIN.y - 3, CABIN_TOP]} size={[CABIN.w + 6, CABIN.d + 6, 5]} tone={LAVENDER} />
      <g transform={onSide(CABIN.x + CABIN.w, CABIN.y + CABIN.d, CABIN_TOP)}>
        {[17, 35].map((u) => (
          <g key={u} data-eye>
            <rect x={u - 4} y={9} width={8} height={12} rx={4} fill={DEEP.right} />
            <circle data-glint cx={u + 1.4} cy={12.6} r={1.8} fill="white" />
          </g>
        ))}
      </g>
      <g transform={onFront(CABIN.x, CABIN.y + CABIN.d, CABIN_TOP)}>
        {PORTS.map((u, i) => (
          <g key={i}>
            <circle data-port-glow cx={u} cy={16} r={7} fill={INK.success} opacity={0.22} />
            <circle cx={u} cy={16} r={4.6} fill={DEEP.left} stroke={PAPER.right} strokeWidth={1.6} />
            <circle data-lit cx={u} cy={16} r={3.8} fill={INK.success} />
            <circle
              data-arc
              cx={u}
              cy={16}
              r={4.6}
              stroke={INK.success}
              strokeWidth={1.8}
              transform={`rotate(-90 ${u} 16)`}
            />
          </g>
        ))}
      </g>
      <Cylinder at={[-84, 0, CABIN_TOP + 5]} r={7} h={16} tone={INDIGO} lid={DEEP.right} />

      <Mast />
    </>
  );
}

/* A crane's four-leg sling on a crate's top. */
export function Sling({ cx, top }: { cx: number; top: number }) {
  const hook: [number, number, number] = [cx, 0, top + CRATE.sling];
  const inset = 4;
  const corners: [number, number][] = [
    [cx - CRATE.w / 2 + inset, -CRATE.d / 2 + inset],
    [cx + CRATE.w / 2 - inset, -CRATE.d / 2 + inset],
    [cx + CRATE.w / 2 - inset, CRATE.d / 2 - inset],
    [cx - CRATE.w / 2 + inset, CRATE.d / 2 - inset],
  ];
  return (
    <>
      {corners.map(([sx, sy], i) => (
        <path key={i} d={polyline([[sx, sy, top], hook])} stroke={INK.label} strokeWidth={1} opacity={0.75} />
      ))}
    </>
  );
}

/* Everything except the part under the hold's two near deck edges, so a crate
   sinking into its berth is hidden by the deck as it goes down. */
export function pitClip(): string {
  const { x, y, w, d } = PIT;
  const [lx, ly] = project(x, y + d, DECK);
  const [fx, fy] = project(x + w, y + d, DECK);
  const [rx, ry] = project(x + w, y, DECK);
  return `M-400,-400 H960 V900 H${rx} V${ry} L${fx},${fy} L${lx},${ly} V900 H-400 Z`;
}
