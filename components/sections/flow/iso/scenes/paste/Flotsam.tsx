import { onFront } from "@/components/sections/flow/iso/iso";
import { Box } from "@/components/sections/flow/iso/primitives";
import { INK, LAVENDER, PAPER } from "@/components/sections/flow/iso/tones";

/* A piece of the web adrift: a note card, a stray pixel, another link. */
export function Flotsam({ x, y, kind }: { x: number; y: number; kind: "note" | "pixel" | "link" }) {
  if (kind === "pixel") return <Box at={[x - 4, y - 4, 4]} size={[8, 8, 8]} tone={LAVENDER} />;
  if (kind === "link") {
    return (
      <g>
        <Box at={[x - 14, y - 2, 4]} size={[28, 4, 12]} tone={PAPER} />
        <g transform={onFront(x - 14, y + 2, 16)} stroke={INK.accent} strokeWidth={1.3} fill="none">
          <rect x={5} y={3.5} width={7} height={5} rx={2.5} />
          <rect x={10} y={3.5} width={7} height={5} rx={2.5} />
        </g>
      </g>
    );
  }
  return (
    <g>
      <Box at={[x - 7, y - 7, 4]} size={[14, 14, 14]} tone={PAPER} />
      <g transform={onFront(x - 7, y + 7, 18)}>
        <ellipse cx={5.6} cy={10.5} rx={2.3} ry={1.8} fill={INK.accent} />
        <path d="M7.8,10.5 V3.5 l3.4,1.4" stroke={INK.accent} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}
