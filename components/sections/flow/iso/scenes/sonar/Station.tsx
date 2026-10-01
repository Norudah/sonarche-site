import { Bar } from "@/components/sections/flow/iso/Bar";
import { onFloor } from "@/components/sections/flow/iso/iso";
import { circle, Prism } from "@/components/sections/flow/iso/primitives";
import { continuum, INK } from "@/components/sections/flow/iso/tones";

import { BAR, BARS, DISC, DISC_TONE } from "./layout";

/* The round deck: its graduations, the fingerprint bits and the sweep. */
export function Station({ scene }: { scene: string }) {
  return (
    <>
      <Prism outline={circle(0, 0, DISC.r, 72)} z={DISC.z} h={-DISC.z} tone={DISC_TONE} />
      <g transform={onFloor(0, 0, 0.2)}>
        <circle r={DISC.r - 8} stroke={INK.line} strokeWidth={1} />
        <circle r={100} stroke={INK.line} strokeWidth={1} />
        <circle r={44} stroke={INK.line} strokeWidth={1} strokeDasharray="3 4" />
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const r0 = i % 6 ? 108 : 104;
          return (
            <line
              key={i}
              x1={Math.round(r0 * Math.cos(a) * 100) / 100}
              y1={Math.round(r0 * Math.sin(a) * 100) / 100}
              x2={Math.round(112 * Math.cos(a) * 100) / 100}
              y2={Math.round(112 * Math.sin(a) * 100) / 100}
              stroke={i % 6 ? INK.line : "oklch(0.75 0.05 279)"}
              strokeWidth={i % 6 ? 1 : 1.6}
            />
          );
        })}
        {[0, 1].map((i) => (
          <circle key={i} data-ping r={40} stroke={INK.accent} strokeWidth={1.4} opacity={0} />
        ))}

        {/* The fingerprint: one bit where each bar stood. */}
        <circle data-print-glow r={76} stroke="oklch(0.62 0.2 277 / 0.5)" strokeWidth={34} opacity={0} />
        {BARS.map((b, i) => (
          <rect
            key={i}
            data-bit
            x={b.x - 3.4}
            y={b.y - 3.4}
            width={6.8}
            height={6.8}
            rx={1}
            fill={b.lit ? INK.accent : "oklch(0.88 0.035 277)"}
            transform={`rotate(${Math.round((b.a * 180) / Math.PI)} ${b.x} ${b.y})`}
          />
        ))}

        {/* The sweep: a wedge of light behind its leading edge. */}
        <g data-sweep opacity={0}>
          <circle r={100} fill="none" />
          <path d="M0,0 L100,0 A100,100 0 0,0 64.28,-76.6 Z" fill={`url(#${scene}-sweep)`} />
          <path d="M0,0 L100,0" stroke="oklch(0.58 0.22 277)" strokeWidth={2} strokeLinecap="round" />
        </g>
      </g>
    </>
  );
}

/* One half of the ring spectrum, keeping each bar's place in the full list. */
export function Ring({ bars, all }: { bars: typeof BARS; all: typeof BARS }) {
  return (
    <>
      {bars.map((b) => (
        <Bar
          key={all.indexOf(b)}
          at={[b.x - BAR / 2, b.y - BAR / 2, 0]}
          size={[BAR, BAR, 18]}
          tone={continuum(0.1 + b.k * 0.8)}
          opacity={0}
        />
      ))}
    </>
  );
}
