"use client";

import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { Bar, barSetter } from "../Bar";
import { onFloor, project } from "../iso";
import { Motes } from "../Motes";
import { Box, circle, Cylinder, Prism, Stage } from "../primitives";
import { continuum, INK, LAVENDER, PAPER, type Tone } from "../tones";
import { useDiorama } from "../useDiorama";
import { Card, Orb, ORB, ORBITS } from "./sonar/Orb";

gsap.registerPlugin(DrawSVGPlugin);

/*
 * Step 03 — the sonar reads the song.
 *
 * Sonarche is sonar + arche, and this is the sonar. A round station, the crate
 * from the hold on its hub, and the track around it as a ring spectrum, turning.
 * A sweep goes round once and, bar by bar, the spectrum collapses into a ring
 * of bits on the deck: the acoustic fingerprint, what Chromaprint makes of a
 * song. The print is sent up to AcoustID, which lights, pings, and weighs
 * candidates; the guesses fall away, and the one recording that matches comes
 * down to the hub, sealed green.
 */

const SCENE = "flow-print";

const DISC = { r: 126, z: -14 } as const;
const DISC_TONE: Tone = { top: "oklch(0.975 0.008 279)", left: LAVENDER.left, right: LAVENDER.right };

/* The ring spectrum: two rings of bars around the hub. */
const RINGS = [
  { r: 86, n: 44, offset: 0 },
  { r: 66, n: 34, offset: 0.5 },
] as const;

function energy(a: number, ring: number): number {
  const v = 0.5 + 0.28 * Math.sin(3 * a + ring) + 0.2 * Math.sin(7 * a + 1.3 + ring * 2);
  return Math.min(1, Math.max(0.05, v));
}

const BARS = RINGS.flatMap((ring, ri) =>
  Array.from({ length: ring.n }, (_, k) => {
    const a = ((k + ring.offset) / ring.n) * Math.PI * 2;
    const e = energy(a, ri);
    return {
      a: Math.round(a * 1000) / 1000,
      ring: ri,
      x: Math.round(ring.r * Math.cos(a) * 10) / 10,
      y: Math.round(ring.r * Math.sin(a) * 10) / 10,
      lit: e > 0.52,
      k: Math.round((1 - e) * 100) / 100,
    };
  }),
).sort((p, q) => p.x + p.y - (q.x + q.y) || p.x - q.x);

const BAR = 5.6;
const SPIN = 0.55;

function height(bar: (typeof BARS)[number], t: number): number {
  return 4 + 30 * energy(bar.a - SPIN * t, bar.ring) + 2.5 * Math.sin(t * 5 + bar.a * 9);
}

/* The hub and the crate on it. */
const HUB = { r: 26, h: 16 } as const;
const CRATE = { s: 22, h: 16 } as const;

/* The answer card's resting place over the hub, and where it starts: the
   middle of the three candidates the orb weighs, fanned out to its left. */
const ANSWER = { x: 257, y: 128 } as const;
const CANDIDATES = [
  { x: ORB.x - 230, y: ORB.y + 18 },
  { x: ORB.x - 160, y: ORB.y - 2 },
  { x: ORB.x - 90, y: ORB.y - 22 },
] as const;

const SCAN = { at: 0.4, pass: 2.8 } as const;

export function FingerprintScene() {
  const ref = useDiorama(({ q, intro, loop, idle, start, onFrame }) => {
    const bars = q("[data-ring] [data-bar-h]");
    const bits = q("[data-bit]");
    const [sweep] = q("[data-sweep]");
    const [printGlow] = q("[data-print-glow]");
    const [hologram] = q("[data-hologram]");
    const [beam] = q("[data-beam]");
    const packets = q("[data-packet]");
    const [orb] = q("[data-orb]");
    const orbPings = q("[data-orb-ping]");
    const guesses = q("[data-guess]");
    const [answer] = q("[data-answer]");
    const [seal] = q("[data-answer] [data-seal]");
    const sats = q("[data-sat]");
    const pings = q("[data-ping]");

    /* The spectrum turns; each bar is alive until the sweep reads it. */
    const setters = bars.map(barSetter);
    const alive = BARS.map(() => ({ a: 1 }));
    const level = { a: 0 };
    const satX = sats.map((s) => gsap.quickSetter(s, "x"));
    const satY = sats.map((s) => gsap.quickSetter(s, "y"));
    const satO = sats.map((s) => gsap.quickSetter(s, "opacity"));
    const draw = () => {
      const t = gsap.ticker.time;
      for (let i = 0; i < setters.length; i++) setters[i](level.a * alive[i].a * height(BARS[i], t));
      ORBITS.forEach((o, i) => {
        const phi = o.phase + o.speed * t;
        satX[i](o.rx * (Math.cos(phi) - 1));
        satY[i](o.ry * Math.sin(phi));
        satO[i](Math.sin(phi) < 0 ? 0.35 : 1);
      });
    };
    draw();
    intro.to(level, { a: 1, duration: 1.4, ease: "power2.out", onUpdate: draw }, 0.4);
    onFrame(draw);

    idle.fromTo(
      pings,
      { scale: 0.3, opacity: 0.7, transformOrigin: "50% 50%" },
      { scale: 2.6, opacity: 0, duration: 2.6, ease: "power1.out", stagger: 1.3 },
    );

    /* The first frame: the spectrum whole, the deck blank, nothing asked yet. */
    start(bars, { opacity: 1 });
    start(alive, { a: 1 });
    start(bits, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" });
    start(sweep, { rotation: 0, opacity: 0, transformOrigin: "50% 50%" });
    start([printGlow, ...packets, ...orbPings], { opacity: 0 });
    start(hologram, { opacity: 0, y: 0, scale: 1, transformOrigin: "50% 50%" });
    start(beam, { drawSVG: "0%" });
    start(guesses, { opacity: 0, y: 0, scale: 0.6, transformOrigin: "50% 50%" });
    start(answer, {
      opacity: 0,
      x: CANDIDATES[1].x - ANSWER.x,
      y: CANDIDATES[1].y - ANSWER.y,
      scale: 0.8,
      transformOrigin: "50% 50%",
    });
    start(seal, { scale: 0, transformOrigin: "50% 50%" });

    /* The sweep: once round, and every bar it passes is read into a bit. */
    loop.to(sweep, { opacity: 1, duration: 0.3 }, SCAN.at - 0.2);
    loop.to(sweep, { rotation: 360, duration: SCAN.pass, ease: "none" }, SCAN.at);
    loop.to(sweep, { opacity: 0, duration: 0.3 }, SCAN.at + SCAN.pass - 0.1);
    BARS.forEach((b, i) => {
      const at = SCAN.at + (b.a / (Math.PI * 2)) * SCAN.pass;
      loop.to(alive[i], { a: 0, duration: 0.22, ease: "power2.in" }, at);
      loop.set(bars[i], { opacity: 0 }, at + 0.22);
      loop.to(bits[i], { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, at + 0.12);
    });

    /* The print is whole: it glows, and goes up the beam. */
    const sent = SCAN.at + SCAN.pass + 0.2;
    loop.to(printGlow, { keyframes: { opacity: [0, 1, 0.3] }, duration: 0.8, ease: "power1.out" }, sent);
    /* A copy of the print lifts off the deck and gathers over the hub. */
    loop.to(
      hologram,
      { keyframes: { opacity: [0, 0.9, 0.9, 0] }, y: -78, scale: 0.35, duration: 1.1, ease: "power2.inOut" },
      sent + 0.05,
    );
    loop.to(beam, { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, sent + 0.2);
    const [bx, by] = project(0, 0, HUB.h + CRATE.h);
    packets.forEach((p, i) => {
      loop.fromTo(
        p,
        { x: 0, y: 0 },
        {
          keyframes: { opacity: [0, 1, 1, 0] },
          x: ORB.x - bx,
          y: ORB.y + ORB.r - by,
          duration: 0.6,
          ease: "power1.in",
          immediateRender: false,
        },
        sent + 1.0 + i * 0.12,
      );
    });

    /* AcoustID lights and weighs its candidates; the guesses fall away. */
    const asked = sent + 1.65;
    loop.to(
      orb,
      { keyframes: { scale: [1, 1.12, 1] }, duration: 0.5, ease: "power2.out", transformOrigin: "50% 50%" },
      asked,
    );
    loop.to(
      orbPings,
      {
        keyframes: { opacity: [0, 0.9, 0], scale: [1, 1.4, 1.8] },
        duration: 1,
        stagger: 0.25,
        ease: "power1.out",
        transformOrigin: "50% 50%",
      },
      asked,
    );
    loop.to(
      [guesses[0], answer, guesses[1]],
      { opacity: 1, scale: 0.8, duration: 0.45, stagger: 0.1, ease: "back.out(2.4)" },
      asked + 0.3,
    );
    loop.to(guesses, { y: 34, opacity: 0, duration: 0.55, stagger: 0.12, ease: "power2.in" }, asked + 1.2);

    /* The match comes down to the hub, sealed. */
    const matched = asked + 1.5;
    loop.to(answer, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.inOut" }, matched);
    loop.to(seal, { scale: 1, duration: 0.45, ease: "back.out(3)" }, matched + 0.75);
    loop.to(beam, { drawSVG: "100% 100%", duration: 0.5, ease: "power2.in" }, matched + 0.4);

    /* Held; then the deck is wiped and the spectrum grows back. */
    const out = matched + 3.6;
    loop.to(answer, { opacity: 0, y: -12, duration: 0.45, ease: "power2.in" }, out);
    loop.to(bits, { opacity: 0, scale: 0.4, duration: 0.3, stagger: 0.004 }, out + 0.2);
    loop.to(printGlow, { opacity: 0, duration: 0.3 }, out + 0.2);
    loop.set(bars, { opacity: 1 }, out + 0.5);
    loop.to(alive, { a: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.008 }, out + 0.5);
    loop.set({}, {}, out + 1.8);
  });

  const back = BARS.filter((b) => b.x + b.y < 0);
  const front = BARS.filter((b) => b.x + b.y >= 0);
  const [bx, by] = project(0, 0, HUB.h + CRATE.h);

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <linearGradient id={`${SCENE}-sweep`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="-80">
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.5} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* The station. */}
      <g data-rise>
        <ellipse cx={280} cy={275} rx={220} ry={100} fill={`url(#${SCENE}-shade)`} opacity={0.55} />
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
            <path d="M0,0 L100,0 A100,100 0 0,0 64.28,-76.6 Z" fill={`url(#${SCENE}-sweep)`} />
            <path d="M0,0 L100,0" stroke="oklch(0.58 0.22 277)" strokeWidth={2} strokeLinecap="round" />
          </g>
        </g>
        <Motes area={{ x: -90, y: -90, w: 180, d: 180 }} count={16} seed={21} />
      </g>

      {/* The ring spectrum, split round the hub so each half paints on its side. */}
      <g data-ring>
        <Ring bars={back} all={BARS} />
      </g>
      <g data-drop>
        <Cylinder at={[0, 0, 0]} r={HUB.r} h={HUB.h} tone={LAVENDER} />
        <Box at={[-CRATE.s / 2, -CRATE.s / 2, HUB.h]} size={[CRATE.s, CRATE.s, CRATE.h]} tone={PAPER} />
        <g transform={onFloor(-CRATE.s / 2, -CRATE.s / 2, HUB.h + CRATE.h)}>
          {[0.45, 0.85, 0.6, 1, 0.7, 0.4].map((v, j) => (
            <rect
              key={j}
              x={4 + j * 2.6}
              y={CRATE.s / 2 - v * 7}
              width={1.5}
              height={v * 14}
              rx={0.75}
              fill={continuum(j / 6).left}
            />
          ))}
        </g>
      </g>
      <g data-ring>
        <Ring bars={front} all={BARS} />
      </g>

      {/* The print, lifting off the deck on its way up. */}
      <g data-hologram opacity={0}>
        <g transform={onFloor(0, 0, 0.2)}>
          {BARS.filter((b) => b.lit).map((b, i) => (
            <rect
              key={i}
              x={b.x - 3.4}
              y={b.y - 3.4}
              width={6.8}
              height={6.8}
              rx={1}
              fill="oklch(0.62 0.2 277)"
              transform={`rotate(${Math.round((b.a * 180) / Math.PI)} ${b.x} ${b.y})`}
            />
          ))}
        </g>
      </g>

      {/* The line to AcoustID, and what travels up it. */}
      <path
        data-beam
        d={`M${bx},${by} L${ORB.x},${ORB.y + ORB.r}`}
        stroke={INK.accent}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} data-packet cx={bx} cy={by} r={3.2} fill={INK.accent} opacity={0} />
      ))}

      <g data-depth="3">
        <g data-drop>
          <Orb scene={SCENE} label="AcoustID" />
        </g>
      </g>

      {/* The candidates: two guesses and the match. */}
      <g data-depth="2">
        {[CANDIDATES[0], CANDIDATES[2]].map((c, i) => (
          <g key={i} data-guess opacity={0}>
            <Card x={c.x} y={c.y} tone="guess" />
          </g>
        ))}
        <g data-answer>
          <Card x={ANSWER.x} y={ANSWER.y} tone="answer" />
        </g>
      </g>
    </Stage>
  );
}

/* One half of the ring spectrum, keeping each bar's place in the full list. */
function Ring({ bars, all }: { bars: typeof BARS; all: typeof BARS }) {
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
