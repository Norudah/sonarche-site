import { INK } from "@/components/sections/flow/iso/tones";

import { ORBIT } from "./layout";

/* A tag chip, centred on the orbit's centre; the director moves it round. */
export function Chip({ label }: { label: string }) {
  const w = 44;
  const h = 14;
  const [x, y] = [ORBIT.x - w / 2, ORBIT.y - h / 2 - w / 4];
  return (
    <g transform={`matrix(1 0.5 0 1 ${x} ${y})`}>
      <rect x={1.5} y={1.5} width={w} height={h} rx={3} fill="oklch(0.3 0.06 279 / 0.12)" />
      <rect width={w} height={h} rx={3} fill="white" stroke={INK.line} />
      <circle cx={6.5} cy={7} r={2} fill={INK.accent} />
      <text x={11.5} y={10.2} fontSize={8.6} fill={INK.label} style={{ fontFamily: "var(--font-mono)" }}>
        {label}
      </text>
    </g>
  );
}
