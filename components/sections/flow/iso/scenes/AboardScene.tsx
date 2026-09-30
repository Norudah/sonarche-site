"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { floorEllipse, onFloor, polygon, polyline, project, shift } from "../iso";
import { Box, Shadow, Stage } from "../primitives";
import { INDIGO, INK, LAVENDER, PAPER } from "../tones";
import { useDiorama } from "../useDiorama";

gsap.registerPlugin(DrawSVGPlugin);

/*
 * Step 02 — the cargo comes aboard.
 *
 * An open hold on the plinth, three berths, and a crate for each track lowered
 * into its berth on a four-leg sling. In front of each berth a status lamp on
 * a post: its ring fills while the crate is hauled and turns green when it
 * lands. The crate is the same sealed box from the hook to the berth, its
 * waveform untouched. Once all three are in, the berths sink below deck and
 * the hold is ready for the next voyage.
 */

const SCENE = "flow-aboard";

const HOLD = { x: -96, y: -38, w: 192, d: 76, h: 30, t: 5, floor: 3 } as const;

const CRATE = { w: 50, d: 54, h: 24 } as const;
const BERTHS = [-58, 0, 58].map((cx) => ({ x: cx - CRATE.w / 2, y: -CRATE.d / 2, cx }));

/* The status lamps: on posts in front of the hold, one per berth. */
const POST = { y: 60, h: 30 } as const;
const RING_R = 11;
/* How high a crate is picked up from, and how long the haul takes. */
const DROP = 128;
const HAUL = 1.25;

/* The waveform printed on every crate's side, identical from hook to berth. */
const WAVE = [0.35, 0.7, 0.5, 0.95, 0.6, 0.8, 0.4, 0.65, 0.3];

export function AboardScene() {
  const ref = useDiorama(({ q, loop, start }) => {
    const crates = q("[data-crate]");
    const rigs = q("[data-rig]");
    const arcs = q("[data-arc]");
    const dones = q("[data-done]");
    const ticks = q("[data-tick]");
    const [hold] = q("[data-hold]");
    const shades = q("[data-berth-shade]");

    const up = shift(0, 0, DROP);
    start(crates, { x: 0, y: up.y, opacity: 0, scaleY: 1, transformOrigin: "50% 100%" });
    start(rigs, { opacity: 1, y: 0 });
    start(arcs, { drawSVG: "0%" });
    start(dones, { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
    start(ticks, { drawSVG: "0%" });
    start(shades, { opacity: 0, scale: 1.5, transformOrigin: "50% 50%" });

    BERTHS.forEach((_, i) => {
      const t = 0.4 + i * 1.45;
      const land = t + HAUL;

      /* Hauled down, the ring filling as it comes. */
      loop.to(crates[i], { opacity: 1, duration: 0.3, ease: "none" }, t);
      loop.to(crates[i], { y: 0, duration: HAUL, ease: "power2.inOut" }, t);
      loop.to(arcs[i], { drawSVG: "100%", duration: HAUL, ease: "power1.inOut" }, t);
      loop.to(shades[i], { opacity: 1, scale: 1, duration: HAUL, ease: "power2.inOut" }, t);

      /* Landed: the crate settles, the hold takes the weight. */
      loop.to(crates[i], { scaleY: 0.9, duration: 0.08, ease: "power2.out" }, land);
      loop.to(crates[i], { scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.35)" }, land + 0.08);
      loop.to(hold, { y: 1.6, duration: 0.07, ease: "power2.out" }, land);
      loop.to(hold, { y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }, land + 0.07);

      /* Unhooked, and the ring goes green. */
      loop.to(rigs[i], { y: -34, opacity: 0, duration: 0.7, ease: "power2.in" }, land + 0.25);
      loop.to(dones[i], { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.6)" }, land + 0.05);
      loop.to(ticks[i], { drawSVG: "100%", duration: 0.3, ease: "power2.out" }, land + 0.2);
    });

    /* All aboard. Held, then stowed below deck, and the rings stand down. */
    const stow = 7.6;
    loop.to(crates, { y: shift(0, 0, -CRATE.h - 4).y, duration: 0.7, ease: "power3.in", stagger: 0.12 }, stow);
    loop.to(shades, { opacity: 0, duration: 0.5, stagger: 0.12 }, stow + 0.2);
    loop.to(dones, { opacity: 0, scale: 0.6, duration: 0.35, ease: "power2.in", stagger: 0.08 }, stow + 0.5);
    loop.to(arcs, { drawSVG: "100% 100%", duration: 0.5, ease: "power2.inOut", stagger: 0.08 }, stow + 0.5);
    loop.set({}, {}, stow + 1.5);
  });

  const { x, y, w, d, h, t, floor } = HOLD;

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-cable`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={INK.label} stopOpacity={0} />
          <stop offset="70%" stopColor={INK.label} stopOpacity={0.7} />
        </linearGradient>
        {BERTHS.map((b, i) => (
          <clipPath key={i} id={`${SCENE}-berth-${i}`}>
            <path d={berthClip(b.x, b.y, floor)} />
          </clipPath>
        ))}
      </defs>

      <Shadow scene={SCENE} at={[0, 0]} r={100} opacity={0.7} />

      <g data-drop>
        <g data-hold>
          {/* Far walls first: their inner faces are the ones the camera sees. */}
          <Box at={[x, y, 0]} size={[w, t, h]} tone={LAVENDER} rim={false} />
          <Box at={[x, y, 0]} size={[t, d, h]} tone={LAVENDER} rim={false} />
          <path
            d={polygon([
              [x + t, y + t, floor],
              [x + w - t, y + t, floor],
              [x + w - t, y + d - t, floor],
              [x + t, y + d - t, floor],
            ])}
            fill="oklch(0.87 0.05 277)"
          />
          {/* Berth markings on the hold's floor. */}
          {BERTHS.map((b, i) => (
            <path
              key={i}
              d={polygon([
                [b.x - 2, b.y - 2, floor],
                [b.x + CRATE.w + 2, b.y - 2, floor],
                [b.x + CRATE.w + 2, b.y + CRATE.d + 2, floor],
                [b.x - 2, b.y + CRATE.d + 2, floor],
              ])}
              stroke="oklch(0.8 0.07 277)"
              strokeDasharray="4 3"
            />
          ))}

          {BERTHS.map((b, i) => (
            <ellipse key={i} data-berth-shade {...floorEllipse(b.cx, 0, floor, 27)} fill={`url(#${SCENE}-shade)`} />
          ))}

          {BERTHS.map((b, i) => (
            <g key={i} clipPath={`url(#${SCENE}-berth-${i})`}>
              <g data-crate>
                <Box at={[b.x, b.y, floor]} size={[CRATE.w, CRATE.d, CRATE.h]} tone={INDIGO} />
                <g transform={onFloor(b.x, b.y, floor + CRATE.h)}>
                  {WAVE.map((v, j) => (
                    <rect
                      key={j}
                      x={8 + j * 4.4}
                      y={CRATE.d / 2 - (v * 30) / 2}
                      width={2.4}
                      height={v * 30}
                      rx={1.2}
                      fill="white"
                      opacity={0.78}
                    />
                  ))}
                </g>
                <g data-rig opacity={0}>
                  <Rig cx={b.cx} top={floor + CRATE.h} />
                </g>
              </g>
            </g>
          ))}

          {/* Near walls last, so a crate on its way down passes behind them. */}
          <Box at={[x, y + d - t, 0]} size={[w, t, h]} tone={LAVENDER} />
          <Box at={[x + w - t, y, 0]} size={[t, d, h]} tone={LAVENDER} />
        </g>
      </g>

      {/* The status lamps, one per berth. */}
      {BERTHS.map((b, i) => {
        const [cx, cy] = project(b.cx, POST.y, POST.h + RING_R);
        return (
          <g key={i} data-drop>
            <Shadow scene={SCENE} at={[b.cx, POST.y]} r={8} />
            <Box at={[b.cx - 1.5, POST.y - 1.5, 0]} size={[3, 3, POST.h]} tone={PAPER} rim={false} />
            <circle cx={cx} cy={cy} r={RING_R + 3.5} fill={PAPER.top} stroke={INK.line} strokeWidth={1} />
            <circle cx={cx} cy={cy} r={RING_R} stroke={INK.groove} strokeWidth={2.6} />
            <circle
              data-arc
              cx={cx}
              cy={cy}
              r={RING_R}
              stroke={INK.accent}
              strokeWidth={2.6}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
            <g data-done>
              <circle cx={cx} cy={cy} r={RING_R + 1.3} fill={INK.success} />
              <path
                data-tick
                d={`M${cx - 4.6},${cy + 0.2} L${cx - 1.3},${cy + 3.4} L${cx + 5},${cy - 3.4}`}
                stroke="white"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        );
      })}
    </Stage>
  );
}

/* A crane's four-leg sling on a crate's top, a hook, and the cable up. */
function Rig({ cx, top }: { cx: number; top: number }) {
  const hook: [number, number, number] = [cx, 0, top + 16];
  const [hx, hy] = project(...hook);
  const corners: [number, number][] = [
    [cx - CRATE.w / 2 + 4, -CRATE.d / 2 + 4],
    [cx + CRATE.w / 2 - 4, -CRATE.d / 2 + 4],
    [cx + CRATE.w / 2 - 4, CRATE.d / 2 - 4],
    [cx - CRATE.w / 2 + 4, CRATE.d / 2 - 4],
  ];

  return (
    <>
      {corners.map(([cx2, cy2], i) => (
        <path key={i} d={polyline([[cx2, cy2, top], hook])} stroke={INK.label} strokeWidth={1} opacity={0.7} />
      ))}
      <rect x={hx - 0.7} y={hy - 170} width={1.4} height={168} fill={`url(#${SCENE}-cable)`} />
      <circle cx={hx} cy={hy} r={2.6} stroke={INK.label} strokeWidth={1.4} fill={PAPER.top} />
    </>
  );
}

/* Everything above a berth's near edges: a crate sinking below the floor is
   cut at its own footprint, the way the deck would hide it. */
function berthClip(x: number, y: number, z: number): string {
  const [lx, ly] = project(x, y + CRATE.d, z);
  const [fx, fy] = project(x + CRATE.w, y + CRATE.d, z);
  const [rx, ry] = project(x + CRATE.w, y, z);
  return `M${lx},${ly} L${fx},${fy} L${rx},${ry} L${rx},-400 L${lx},-400 Z`;
}
