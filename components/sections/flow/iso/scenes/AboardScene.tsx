"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { Bar } from "../Bar";
import { floorEllipse, onFloor, onFront, onSide, polygon, polyline, project } from "../iso";
import { Motes } from "../Motes";
import { Box, Cylinder, Prism, Stage } from "../primitives";
import { animateSea } from "../sea";
import { continuum, DEEP, INDIGO, INK, LAVENDER, PAPER, type Tone } from "../tones";
import { useDiorama } from "../useDiorama";
import { CRANE, driver, Mast, REST, Rig, type Pose } from "./ark/Crane";
import { DECK, HULL, KEEL, swell, WATER } from "./ark/hull";

gsap.registerPlugin(DrawSVGPlugin);

/*
 * Step 02 — the cargo comes aboard the Ark.
 *
 * The ship rides the same sea the link came out of. At the bow, a tower crane
 * slews out over the side, pays out its cable into the water and hauls a crate
 * up out of the stream (the sea rings where it breaks the surface), swings it
 * over the deck, lets the swing die, and lowers it into its berth in the hold.
 * The ship's head watches; one porthole per track fills while its crate is
 * hauled and turns green when it lands. With all three aboard, the crane
 * parks and the berths are struck below.
 */

const SCENE = "flow-aboard";

const HULL_TONE: Tone = { top: "oklch(0.965 0.012 279)", left: INDIGO.left, right: INDIGO.right };

const PIT = { x: -46, y: -22, w: 94, d: 44, floor: DECK - 14 } as const;
const CRATE = { w: 26, d: 38, h: 20, sling: 14 } as const;
const BERTHS = [-44, -14, 16].map((x) => ({ x, y: -CRATE.d / 2, cx: x + CRATE.w / 2 }));

const CABIN = { x: -100, y: -26, w: 44, d: 52, h: 38 } as const;
const CABIN_TOP = DECK + CABIN.h;
const PORTS = [10, 22, 34] as const;

/* Where the crates are fished from: the water off the port side. */
const FISH = { x: 14, y: 92 } as const;
const WATER_BOTTOM = -6;

const FOAM = [
  [-105, 36],
  [55, 36],
  [80, 31],
  [100, 21],
  [113, 10],
  [118, 0],
  [113, -10],
  [100, -21],
] as const;

const toward = (x: number, y: number) => Math.atan2(y - CRANE.y, x - CRANE.x);
const reach = (x: number, y: number) => Math.hypot(x - CRANE.x, y - CRANE.y);
const hookAbove = (bottom: number) => CRANE.top - (bottom + CRATE.h + CRATE.sling);

export function AboardScene() {
  const ref = useDiorama(({ q, intro, loop, idle, start, onFrame }) => {
    const [ship, rigLayer] = [q("[data-ship]")[0], q("[data-rig-layer]")[0]];
    const [hold] = q("[data-crates]");
    const crates = q("[data-crate]");
    const squash = q("[data-squash]");
    const slings = q("[data-sling]");
    const arcs = q("[data-arc]");
    const lit = q("[data-lit]");
    const glows = q("[data-port-glow]");
    const burst = q("[data-burst]");
    const eyes = q("[data-eye]");
    const glints = q("[data-glint]");

    const sea = animateSea({
      bars: q("[data-sea] [data-bar-h]"),
      cells: [...WATER.back, ...WATER.front],
      swell,
      intro,
      onFrame,
    });

    /* The crane, and whatever it is carrying. */
    const apply = driver({
      jib: q("[data-jib]")[0],
      trolley: q("[data-trolley]")[0],
      cable: q("[data-cable]")[0],
      hook: q("[data-hook]")[0],
    });
    const tops = BERTHS.map((b) => project(b.cx, 0, PIT.floor + CRATE.h));
    const carry = crates.map((c) => ({ x: gsap.quickSetter(c, "x"), y: gsap.quickSetter(c, "y") }));
    const pose: Pose = { ...REST };
    let carried = -1;
    const move = () => {
      const [hx, hy] = apply(pose);
      if (carried < 0) return;
      carry[carried].x(hx - tops[carried][0]);
      carry[carried].y(hy + CRATE.sling - tops[carried][1]);
    };
    const to = (vars: Partial<Pose>, duration: number, ease: string, at: number) =>
      loop.to(pose, { ...vars, duration, ease, onUpdate: move }, at);

    /* The ship drops into the water and bobs. */
    intro.fromTo([ship, rigLayer], { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.in" }, 0.2);
    intro.call(() => sea.splash(0, 0, 22), [], 1.0);
    intro.to([ship, rigLayer], { keyframes: { y: [0, 7, -2, 0] }, duration: 1.1, ease: "power1.out" }, 1.0);
    idle.to(q("[data-bob]"), { y: -2.4, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: 1 });

    /* The first frame: an empty hold, the crane parked. */
    start(pose, { ...REST });
    loop.call(
      () => {
        carried = -1;
        move();
      },
      [],
      0,
    );
    move();
    start(crates, { x: 0, y: 0, opacity: 0 });
    start(squash, { scaleY: 1, transformOrigin: "50% 100%" });
    start(slings, { opacity: 1 });
    start(arcs, { drawSVG: "0%" });
    start(lit, { opacity: 0 });
    start(glows, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" });
    start(burst, { opacity: 0, x: 0, y: 0 });
    start(hold, { attr: { "clip-path": "none" } });

    const pick = { a: toward(FISH.x, FISH.y), r: reach(FISH.x, FISH.y) };
    BERTHS.forEach((b, i) => {
      const t = 0.5 + i * 3.25;

      /* Out over the side, and down into the water. */
      to({ a: pick.a, r: pick.r, l: 46 }, 0.95, "power2.inOut", t);
      to({ l: hookAbove(WATER_BOTTOM) }, 0.45, "power2.in", t + 0.95);

      /* Hooked: the crate breaks the surface. */
      const hooked = t + 1.4;
      loop.call(
        () => {
          carried = i;
          move();
        },
        [],
        hooked,
      );
      loop.to(crates[i], { opacity: 1, duration: 0.15 }, hooked);
      loop.call(() => sea.splash(FISH.x, FISH.y, 16), [], hooked);
      loop.fromTo(
        burst,
        { x: 0, y: 0 },
        {
          keyframes: { opacity: [0, 1, 0] },
          x: (k) => Math.round(Math.cos(k * 1.7) * (18 + (k % 3) * 8)),
          y: (k) => -18 - (k % 4) * 9,
          duration: 0.8,
          ease: "power2.out",
          immediateRender: false,
        },
        hooked,
      );
      to({ l: 40 }, 0.6, "power2.out", hooked);
      loop.to(arcs[i], { drawSVG: "100%", duration: 1.75, ease: "power1.inOut" }, hooked);
      loop.to(eyes, { scaleY: 0.1, duration: 0.07, yoyo: true, repeat: 1, transformOrigin: "50% 50%" }, hooked + 0.1);

      /* Swung inboard; the load swings on, and dies out. */
      const swing = hooked + 0.55;
      to({ a: Math.PI, r: CRANE.x - b.cx }, 0.95, "power2.inOut", swing);
      loop.to(
        pose,
        { keyframes: { sway: [0, 10, -6, 3, 0] }, duration: 1.3, ease: "sine.out", onUpdate: move },
        swing + 0.45,
      );
      loop.to(glints, { x: -1.6, duration: 0.5 }, swing);

      /* Lowered into its berth, unhooked, and its porthole turns green. */
      to({ l: hookAbove(PIT.floor) }, 0.5, "power2.inOut", swing + 1.25);
      const landed = swing + 1.75;
      loop.call(
        () => {
          carried = -1;
        },
        [],
        landed,
      );
      loop.set(crates[i], { x: 0, y: 0 }, landed);
      loop.to(squash[i], { keyframes: { scaleY: [1, 0.9, 1.04, 1] }, duration: 0.45, ease: "power1.out" }, landed);
      loop.to(slings[i], { opacity: 0, duration: 0.15 }, landed);
      loop.to(lit[i], { opacity: 1, duration: 0.2 }, landed);
      loop.to(
        glows[i],
        { keyframes: { opacity: [0, 0.8, 0.22], scale: [0.5, 1.5, 1] }, duration: 0.7, ease: "power2.out" },
        landed,
      );
      loop.to(glints, { x: 0, duration: 0.5 }, landed);
      to({ l: 34 }, 0.35, "power2.out", landed);
    });

    /* All aboard: the crane parks, the berths are struck below, the lights stand down. */
    const park = 0.5 + 3 * 3.25 + 0.2;
    to({ ...REST }, 1.1, "power2.inOut", park);
    const stow = park + 1.6;
    loop.set(hold, { attr: { "clip-path": `url(#${SCENE}-pit)` } }, stow - 0.05);
    loop.to(crates, { y: 30, duration: 0.7, ease: "power3.in", stagger: 0.12 }, stow);
    loop.to(lit, { opacity: 0, duration: 0.4, stagger: 0.1 }, stow + 0.6);
    loop.to(glows, { opacity: 0, duration: 0.4, stagger: 0.1 }, stow + 0.6);
    loop.to(arcs, { drawSVG: "100% 100%", duration: 0.5, stagger: 0.1 }, stow + 0.6);
    loop.set({}, {}, stow + 1.4);
  });

  const [bx, by] = project(FISH.x, FISH.y, 2);

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        {/* Everything but what lies under the hold's near deck edges. */}
        <clipPath id={`${SCENE}-pit`}>
          <path d={pitClip()} />
        </clipPath>
      </defs>

      <g data-rise>
        <ellipse {...floorEllipse(6, 2, -10, 176)} fill={`url(#${SCENE}-shade)`} opacity={0.5} />
        <ellipse {...floorEllipse(6, 2, 0, 120)} fill={`url(#${SCENE}-glow)`} opacity={0.8} />
      </g>

      <g data-sea>
        <g data-rise>
          <Water bars={WATER.back} />
        </g>

        {/* The ship. */}
        <g data-ship>
          <g data-bob>
            <Ship />
          </g>
        </g>

        <g data-rise>
          <Water bars={WATER.front} />
        </g>
      </g>

      <g data-rise>
        <Motes area={{ x: -100, y: -80, w: 220, d: 200 }} count={20} seed={11} />
        <Motes
          area={{ x: -88, y: -4, w: 8, d: 8, z: CABIN_TOP + 20 }}
          count={9}
          seed={3}
          rise={60}
          colors={["oklch(0.86 0.04 279)", "white", "oklch(0.78 0.08 280)"]}
        />
      </g>

      {/* What the crane carries, and the crane's moving parts, above it all. */}
      <g data-rig-layer>
        <g data-bob>
          <g data-crates>
            {BERTHS.map((b, i) => (
              <g key={i} data-crate>
                <g data-squash>
                  <Box at={[b.x, b.y, PIT.floor]} size={[CRATE.w, CRATE.d, CRATE.h]} tone={PAPER} />
                  <g transform={onFloor(b.x, b.y, PIT.floor + CRATE.h)}>
                    {[0.4, 0.8, 0.55, 1, 0.65, 0.85, 0.35].map((v, j) => (
                      <rect
                        key={j}
                        x={5 + j * 2.6}
                        y={CRATE.d / 2 - v * 12}
                        width={1.5}
                        height={v * 24}
                        rx={0.75}
                        fill={continuum(j / 7).left}
                      />
                    ))}
                  </g>
                </g>
                <g data-sling opacity={0}>
                  <Sling cx={b.cx} top={PIT.floor + CRATE.h} />
                </g>
              </g>
            ))}
          </g>
          <Rig />
        </g>
      </g>

      {/* Spray thrown up where a crate leaves the water. */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          data-burst
          opacity={0}
          x={bx - 1.5}
          y={by - 1.5}
          width={3}
          height={3}
          fill={i % 2 ? "white" : "oklch(0.72 0.12 280)"}
        />
      ))}
    </Stage>
  );
}

function Water({ bars }: { bars: typeof WATER.back }) {
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

function Ship() {
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
function Sling({ cx, top }: { cx: number; top: number }) {
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
function pitClip(): string {
  const { x, y, w, d } = PIT;
  const [lx, ly] = project(x, y + d, DECK);
  const [fx, fy] = project(x + w, y + d, DECK);
  const [rx, ry] = project(x + w, y, DECK);
  return `M-400,-400 H960 V900 H${rx} V${ry} L${fx},${fy} L${lx},${ly} V900 H-400 Z`;
}
