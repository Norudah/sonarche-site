import { INDIGO, INK, LAVENDER } from "../../tones";

/*
 * AcoustID, drawn as what it is to the station below: a body in the sky that
 * answers when pinged. A lit sphere, two tilted orbits with a satellite each,
 * a halo, and its name. A sphere is the one shape that needs no projection.
 */

export const ORB = { x: 452, y: 70, r: 21 } as const;

/* Two orbits, tilted opposite ways; a satellite rides each. */
export const ORBITS = [
  { rx: 40, ry: 11, tilt: -16, speed: 1.1, phase: 0 },
  { rx: 33, ry: 9, tilt: 22, speed: -1.5, phase: 2 },
] as const;

export function Orb({ scene, label }: { scene: string; label: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${scene}-orb`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0%" stopColor="oklch(0.9 0.06 285)" />
          <stop offset="35%" stopColor={INDIGO.top} />
          <stop offset="80%" stopColor={INDIGO.left} />
          <stop offset="100%" stopColor={INDIGO.right} />
        </radialGradient>
      </defs>

      <circle cx={ORB.x} cy={ORB.y} r={ORB.r * 2.6} fill={`url(#${scene}-glow)`} />
      {[0, 1].map((i) => (
        <ellipse
          key={i}
          data-orb-ping
          cx={ORB.x}
          cy={ORB.y}
          rx={ORB.r + 4}
          ry={ORB.r + 4}
          stroke={INK.accent}
          strokeWidth={1.4}
          opacity={0}
        />
      ))}

      <g data-orb>
        {ORBITS.map((o, i) => (
          <ellipse
            key={i}
            cx={ORB.x}
            cy={ORB.y}
            rx={o.rx}
            ry={o.ry}
            stroke={LAVENDER.right}
            strokeWidth={1}
            opacity={0.8}
            transform={`rotate(${o.tilt} ${ORB.x} ${ORB.y})`}
          />
        ))}
        <circle cx={ORB.x} cy={ORB.y} r={ORB.r} fill={`url(#${scene}-orb)`} />
        <ellipse
          cx={ORB.x - 7}
          cy={ORB.y - 9}
          rx={6}
          ry={3.4}
          fill="white"
          opacity={0.45}
          transform={`rotate(-30 ${ORB.x - 7} ${ORB.y - 9})`}
        />
        {/* The near half of each orbit passes in front of the sphere. */}
        {ORBITS.map((o, i) => (
          <path
            key={i}
            d={`M${ORB.x - o.rx},${ORB.y} A${o.rx},${o.ry} 0 0 0 ${ORB.x + o.rx},${ORB.y}`}
            stroke={LAVENDER.right}
            strokeWidth={1.2}
            transform={`rotate(${o.tilt} ${ORB.x} ${ORB.y})`}
          />
        ))}
        {ORBITS.map((o, i) => (
          <g key={i} transform={`rotate(${o.tilt} ${ORB.x} ${ORB.y})`}>
            <circle data-sat cx={ORB.x + o.rx} cy={ORB.y} r={2.8} fill="white" stroke={INDIGO.left} strokeWidth={1.2} />
          </g>
        ))}
      </g>

      <text
        x={ORB.x}
        y={ORB.y + ORB.r + 26}
        textAnchor="middle"
        fontSize={10.5}
        letterSpacing={0.4}
        fill={INK.label}
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </text>
    </g>
  );
}

/* A recording card as the station sees it: a cover, a title, an artist. */
export function Card({ x, y, tone }: { x: number; y: number; tone: "answer" | "guess" }) {
  const guess = tone === "guess";
  return (
    <g transform={`matrix(1 0.5 0 1 ${x} ${y})`}>
      <rect x={2} y={2} width={46} height={30} rx={3} fill="oklch(0.3 0.06 279 / 0.12)" />
      <rect width={46} height={30} rx={3} fill="white" stroke={guess ? "var(--rust-edge)" : INK.line} />
      <rect x={5} y={5} width={20} height={20} rx={2} fill={guess ? "var(--rust-soft)" : LAVENDER.top} />
      {guess ? (
        <text
          x={15}
          y={20}
          textAnchor="middle"
          fontSize={13}
          fill="var(--rust)"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ?
        </text>
      ) : (
        <>
          <ellipse cx={12.5} cy={19} rx={3} ry={2.3} fill={INK.accent} />
          <path
            d="M15.3,19 V9.5 l5,2"
            stroke={INK.accent}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      <rect
        x={29}
        y={8}
        width={13}
        height={3.2}
        rx={1.6}
        fill={guess ? "var(--rust)" : "oklch(0.5 0.06 279)"}
        opacity={guess ? 0.55 : 1}
      />
      <rect x={29} y={15} width={10} height={2.4} rx={1.2} fill={guess ? "var(--rust-edge)" : "oklch(0.78 0.03 279)"} />
      {!guess && (
        <g data-seal>
          <circle cx={44} cy={2} r={6.5} fill={INK.success} />
          <path
            d="M41,2.2 l2,2 l4,-4.2"
            stroke="white"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </g>
  );
}
