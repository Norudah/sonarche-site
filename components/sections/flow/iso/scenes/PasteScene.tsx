"use client";

import { Bar } from "../Bar";
import { floorEllipse, onFront, onSide, project, shift } from "../iso";
import { Motes } from "../Motes";
import { Box, Stage } from "../primitives";
import { animateSea } from "../sea";
import { continuum, INDIGO, INK, LAVENDER, PAPER } from "../tones";
import { useDiorama } from "../useDiorama";

/*
 * Step 01 — a link is rescued from the stream.
 *
 * No table this time: the scene stands in the water. A round patch of the
 * hero's sea heaves, dissolving at its edges, with the web's flotsam riding
 * it: notes, pixels, links. Over it floats the composer. It locks on to one
 * link, draws it up a beam of light (the water rings where it left), and plugs
 * it into its field. The voyage lines up underneath, the row already in the
 * hold folds away, and at the end the link is let go, back into the stream.
 */

const SCENE = "flow-paste";

/* The sea: a disc of bars, deep in the middle, pale and short at the rim. */
const SEA = { x: 34, y: 18, r: 122, step: 15 } as const;
const CELLS = (() => {
  const cells: { x: number; y: number; k: number }[] = [];
  const n = Math.ceil(SEA.r / SEA.step) + 1;
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x = SEA.x + i * SEA.step + (j % 2 ? SEA.step / 2 : 0);
      const y = SEA.y + j * SEA.step * 0.9;
      const k = Math.hypot(x - SEA.x, y - SEA.y) / SEA.r;
      if (k <= 1) cells.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, k: Math.round(k * 100) / 100 });
    }
  }
  return cells.sort((a, b) => a.x + a.y - (b.x + b.y) || a.x - b.x);
})();

function swell(x: number, y: number, t: number) {
  const k = Math.hypot(x - SEA.x, y - SEA.y) / SEA.r;
  const fade = 1 - 0.75 * k * k;
  return fade * (9 + 5 * Math.sin(t * 1.7 - x * 0.055 - y * 0.035) + 3 * Math.sin(t * 1.1 + k * 7));
}

/* The composer: a window floating over the back of the water, facing right.
   `x` is its screen's plane, `y` its near end, `w` runs back from there. */
const WIN = { x: -62, y: 62, z: 162, w: 150, h: 112, t: 8 } as const;

/* The link token as docked in the composer's field. */
const CHIP = { y: 15, z: 121.5, w: 40, d: 5, h: 17 } as const;

/* Where it floats before it is rescued. */
const FISH = { x: 12, y: 66 } as const;

/* The rest of the stream's flotsam: what is not taken, this time. */
const FLOTSAM = [
  { x: 92, y: -38, kind: "note" },
  { x: 128, y: 34, kind: "pixel" },
  { x: 62, y: 104, kind: "link" },
  { x: 2, y: -22, kind: "pixel" },
  { x: 104, y: 92, kind: "note" },
  { x: 52, y: 18, kind: "pixel" },
] as const;

/* Queue rows. The settled list is three: the one already in the hold is drawn
   hidden in the third slot, and the fourth track is drawn in that slot too. */
const ROWS = [
  { slot: 0, title: 70, artist: 38 },
  { slot: 1, title: 54, artist: 48 },
  { slot: 2, title: 62, artist: 32, duplicate: true },
  { slot: 2, title: 76, artist: 42 },
] as const;
const ROW_TOP = 58;
const ROW_STEP = 14.5;

/* The beam's rungs climb from the water to the composer's underside. */
const [FX, FY] = project(FISH.x, FISH.y, 6);
const RUNG = (() => {
  const [tx, ty] = project(WIN.x, CHIP.y + CHIP.w / 2, WIN.z - WIN.h);
  return { x: tx - FX, y: ty - FY };
})();

export function PasteScene() {
  const ref = useDiorama(({ q, intro, loop, start, onFrame }) => {
    const [chip] = q("[data-chip]");
    const [bob] = q("[data-bob]");
    const [beam] = q("[data-beam]");
    const rungs = q("[data-rung]");
    const [lock] = q("[data-lock]");
    const burst = q("[data-burst]");
    const [halo] = q("[data-halo]");
    const [url] = q("[data-url]");
    const [caret] = q("[data-caret]");
    const [button] = q("[data-go]");
    const [focus] = q("[data-focus]");
    const rows = q("[data-row]");
    const dup = rows[2];
    const last = rows[3];
    const [badge] = q("[data-badge]");

    const sea = animateSea({
      bars: q("[data-sea] [data-bar-h]"),
      cells: CELLS,
      swell,
      intro,
      onFrame,
      floaters: q("[data-float]").map((el, i) => ({ el, x: FLOTSAM[i].x, y: FLOTSAM[i].y, lift: -6 })),
    });

    /* The first frame: an empty composer, the link riding the water. */
    const down = shift(FISH.x - (WIN.x + CHIP.d / 2), FISH.y - (CHIP.y + CHIP.w / 2), -CHIP.z + 4);
    start(chip, { x: down.x, y: down.y, scale: 0.8, transformOrigin: "50% 50%" });
    start(bob, { y: 0 });
    start(url, { scaleX: 0, transformOrigin: "0% 50%" });
    start([caret, focus, badge, beam, lock, halo], { opacity: 0 });
    start(burst, { opacity: 0, x: 0, y: 0 });
    start(rungs, { opacity: 0, x: 0, y: 0 });
    start(rows, { opacity: 0, x: -10 });
    start(dup, { scaleY: 1, transformOrigin: "50% 0%" });
    start(last, { y: ROW_STEP });

    /* Riding the swell until it is chosen. */
    loop.to(bob, { y: -3, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);

    /* Locked on: rings on the water, the beam comes down. */
    loop.fromTo(
      lock,
      { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" },
      {
        keyframes: { opacity: [0, 1, 0], scale: [0.4, 1.3, 1.8] },
        duration: 0.8,
        repeat: 1,
        ease: "power1.out",
        immediateRender: false,
      },
      0.3,
    );
    loop.to(beam, { keyframes: { opacity: [0, 0.9, 0.3, 1] }, duration: 0.45, ease: "none" }, 0.8);
    rungs.forEach((rung, i) => {
      loop.to(
        rung,
        { keyframes: { opacity: [0, 0.9, 0] }, x: RUNG.x, y: RUNG.y, duration: 0.9, repeat: 1, ease: "none" },
        1.0 + i * 0.3,
      );
    });

    /* Taken: the water rings, pixels scatter, and it rides the beam up. */
    const lift = 1.9;
    loop.call(() => sea.splash(FISH.x, FISH.y, 18), [], lift);
    loop.to(
      burst,
      {
        keyframes: { opacity: [0, 1, 0] },
        x: (i) => Math.round(Math.cos(i * 1.3) * (26 + (i % 3) * 9)),
        y: (i) => -22 - (i % 4) * 11,
        duration: 0.9,
        ease: "power2.out",
      },
      lift,
    );
    loop.to(chip, { x: 0, duration: 1.15, ease: "power2.inOut" }, lift);
    loop.to(chip, { y: 0, scale: 1, duration: 1.15, ease: "power3.inOut" }, lift);
    loop.to(beam, { opacity: 0, duration: 0.4 }, lift + 1.0);
    loop.to(chip, { scaleX: 1.14, scaleY: 0.84, duration: 0.08, ease: "power1.out" }, lift + 1.15);
    loop.to(chip, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.35)" }, lift + 1.23);
    loop.to(halo, { keyframes: { opacity: [0, 1, 0] }, duration: 0.9, ease: "power1.out" }, lift + 1.15);
    loop.to(focus, { opacity: 1, duration: 0.2 }, lift + 1.15);

    /* The address fills in, the caret settles at its end and blinks. */
    const typed = lift + 1.3;
    loop.to(url, { scaleX: 1, duration: 0.45, ease: "steps(9)" }, typed);
    loop.set(caret, { opacity: 1 }, typed + 0.45);
    loop.to(caret, { opacity: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.24 }, typed + 0.7);

    /* Go. The voyage lines up, one row per track. */
    const go = typed + 1.35;
    loop.to(button, { scale: 0.84, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, go);
    loop.to(button, { scale: 1, duration: 0.55, ease: "elastic.out(1.2, 0.4)" }, go + 0.1);
    loop.to([focus, caret], { opacity: 0, duration: 0.4 }, go + 0.1);
    loop.to(rows, { opacity: 1, x: 0, duration: 0.55, stagger: 0.14, ease: "power3.out" }, go + 0.15);

    /* Already aboard: marked, dimmed, folded away; the next row closes the gap. */
    const skip = go + 1.1;
    loop.fromTo(
      badge,
      { scale: 0.4, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false },
      skip,
    );
    loop.to(dup, { opacity: 0.35, duration: 0.3 }, skip + 0.35);
    loop.to(dup, { scaleY: 0, opacity: 0, duration: 0.45, ease: "power3.in" }, skip + 0.8);
    loop.to(last, { y: 0, duration: 0.55, ease: "power3.inOut" }, skip + 1.05);

    /* Held, then let go: the rows clear and the link drops back into the stream. */
    const out = skip + 3.6;
    loop.to(rows, { opacity: 0, x: 8, duration: 0.4, stagger: 0.06, ease: "power2.in" }, out);
    loop.to(url, { scaleX: 0, duration: 0.3, ease: "power2.in" }, out + 0.2);
    loop.to(chip, { x: down.x, duration: 0.75, ease: "power1.in" }, out + 0.4);
    loop.to(chip, { y: down.y, scale: 0.8, duration: 0.75, ease: "power3.in" }, out + 0.4);
    loop.call(() => sea.splash(FISH.x, FISH.y, 12), [], out + 1.15);
    loop.set({}, {}, out + 1.9);
  });

  const beamTop = [project(WIN.x, CHIP.y + CHIP.w + 6, WIN.z - WIN.h), project(WIN.x, CHIP.y - 6, WIN.z - WIN.h)];
  const beamFoot = [project(FISH.x, FISH.y - 14, 4), project(FISH.x, FISH.y + 14, 4)];

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-beam`} gradientUnits="userSpaceOnUse" x1="0" y1={beamTop[0][1]} x2="0" y2={FY}>
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.14} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.5} />
        </linearGradient>
      </defs>

      {/* The water, and the light under it. */}
      <g data-rise>
        <ellipse {...floorEllipse(SEA.x, SEA.y, -10, SEA.r + 26)} fill={`url(#${SCENE}-shade)`} opacity={0.55} />
        <ellipse {...floorEllipse(SEA.x, SEA.y, 0, SEA.r * 0.75)} fill={`url(#${SCENE}-glow)`} />
        <g data-sea>
          {CELLS.map((c, i) => (
            <g key={i} opacity={c.k > 0.72 ? Math.round((1 - (c.k - 0.72) / 0.28) * 100) / 100 : undefined}>
              <Bar at={[c.x - 3, c.y - 3, 0]} size={[6, 6, 9]} tone={continuum(Math.min(1, c.k * 1.1))} />
            </g>
          ))}
        </g>

        {FLOTSAM.map((f, i) => (
          <g key={i} data-float>
            <Flotsam x={f.x} y={f.y} kind={f.kind} />
          </g>
        ))}

        <ellipse data-lock opacity={0} {...floorEllipse(FISH.x, FISH.y, 8, 20)} stroke={INK.accent} strokeWidth={2} />
        <Motes area={{ x: SEA.x - 90, y: SEA.y - 90, w: 180, d: 180 }} count={26} seed={7} />
      </g>

      {/* The composer. */}
      <g data-drop>
        <Box at={[WIN.x - WIN.t, WIN.y - WIN.w, WIN.z - WIN.h]} size={[WIN.t, WIN.w, WIN.h]} tone={PAPER} />
        <g transform={onSide(WIN.x, WIN.y, WIN.z)}>
          <rect width={WIN.w} height={WIN.h} fill="oklch(0.997 0.002 279)" />
          <rect data-halo opacity={0} width={WIN.w} height={WIN.h} fill="oklch(0.62 0.2 277 / 0.08)" />
          <rect width={WIN.w} height={15} fill="oklch(0.955 0.012 279)" />
          {[9, 17, 25].map((u) => (
            <circle key={u} cx={u} cy={7.5} r={2.2} fill="oklch(0.82 0.035 279)" />
          ))}

          <rect x={8} y={26} width={134} height={22} rx={6} fill="white" stroke={INK.line} strokeWidth={1.2} />
          <rect
            data-focus
            opacity={0}
            x={7}
            y={25}
            width={136}
            height={24}
            rx={7}
            stroke={INK.accent}
            strokeWidth={1.6}
          />
          <rect data-url x={58} y={35} width={50} height={4} rx={2} fill="oklch(0.76 0.04 279)" />
          <rect data-caret opacity={0} x={109.5} y={32} width={1.4} height={10} fill={INK.accent} />
          <g data-go>
            <rect x={118} y={29} width={20} height={16} rx={5} fill={INK.accent} />
            <path
              d="M123,37 L132,37 M128.5,33.5 L132,37 L128.5,40.5"
              stroke="white"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {ROWS.map((row, i) => {
            const top = ROW_TOP + row.slot * ROW_STEP;
            return (
              <g key={i} data-row opacity={"duplicate" in row ? 0 : undefined}>
                <rect x={8} y={top} width={134} height={12} rx={3} fill="oklch(0.972 0.008 279)" />
                <circle cx={16} cy={top + 6} r={3.4} stroke={INK.accent} strokeWidth={1.4} />
                <rect x={25} y={top + 3} width={row.title} height={3} rx={1.5} fill="oklch(0.7 0.05 279)" />
                <rect x={25} y={top + 7.4} width={row.artist} height={2.2} rx={1.1} fill="oklch(0.85 0.025 279)" />
                <rect x={124} y={top + 4.8} width={12} height={2.4} rx={1.2} fill="oklch(0.85 0.025 279)" />
                {"duplicate" in row && (
                  <g data-badge>
                    <rect x={106} y={top + 2} width={14} height={8} rx={2} fill="oklch(0.92 0.02 279)" />
                    <path
                      d={`M109.5,${top + 6} l2,2 l4,-4`}
                      stroke="oklch(0.5 0.03 279)"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </g>

      {/* The capture beam, from the composer's underside down to the water. */}
      <g data-beam opacity={0}>
        <path
          d={`M${beamTop[0][0]},${beamTop[0][1]} L${beamTop[1][0]},${beamTop[1][1]} L${beamFoot[0][0]},${beamFoot[0][1]} L${beamFoot[1][0]},${beamFoot[1][1]} Z`}
          fill={`url(#${SCENE}-beam)`}
        />
        <path
          d={`M${beamTop[0][0]},${beamTop[0][1]} L${beamFoot[1][0]},${beamFoot[1][1]} M${beamTop[1][0]},${beamTop[1][1]} L${beamFoot[0][0]},${beamFoot[0][1]}`}
          stroke="white"
          strokeWidth={1.2}
          opacity={0.7}
        />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} data-rung cx={FX} cy={FY} rx={12} ry={4} stroke="white" strokeWidth={1.4} opacity={0} />
        ))}
      </g>

      {/* Pixels thrown off as the link leaves the water. */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          data-burst
          opacity={0}
          x={FX - 2}
          y={FY - 2}
          width={i % 3 ? 3 : 4}
          height={i % 3 ? 3 : 4}
          fill={i % 2 ? "white" : "oklch(0.62 0.17 277)"}
        />
      ))}

      {/* The link token: the one thing rescued from the stream. */}
      <g data-depth="2">
        <g data-chip>
          <g data-bob>
            <Box at={[WIN.x, CHIP.y, CHIP.z]} size={[CHIP.d, CHIP.w, CHIP.h]} tone={INDIGO} />
            <g transform={onSide(WIN.x + CHIP.d, CHIP.y + CHIP.w, CHIP.z + CHIP.h)}>
              <g stroke="white" strokeWidth={1.5} strokeLinecap="round" fill="none">
                <rect x={6} y={5.5} width={9} height={6} rx={3} />
                <rect x={12} y={5.5} width={9} height={6} rx={3} />
              </g>
              <rect x={25} y={7.4} width={10} height={2.4} rx={1.2} fill="white" opacity={0.75} />
            </g>
          </g>
        </g>
      </g>
    </Stage>
  );
}

/* A piece of the web adrift: a note card, a stray pixel, another link. */
function Flotsam({ x, y, kind }: { x: number; y: number; kind: "note" | "pixel" | "link" }) {
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
