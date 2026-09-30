"use client";

import gsap from "gsap";

import type { SceneTags } from "../../copy";
import { floorEllipse, project, shift } from "../iso";
import { Motes } from "../Motes";
import { Cylinder, Stage } from "../primitives";
import { INK, LAVENDER, PAPER } from "../tones";
import { useDiorama } from "../useDiorama";
import { File, FileDefs, LINES, Shelf, SLOT, SLOT_FACE } from "./library/Shelf";

/*
 * Step 04 — the track gets its name, and its place in the library.
 *
 * Over a lit pedestal the file hangs blank, and its six tags circle it like a
 * small orbit. One by one they spiral in and are written as lines, the real
 * cover drops into the frame and catches the light, a green seal. Then the
 * file flies to the cabinet, slides into the one empty cubby, and a wave of
 * light runs through every shelf: the library, whole.
 */

const SCENE = "flow-named";

/* The pedestal, and the file held over it, scaled up for the tagging. */
const PEDESTAL = { x: -84, y: 46, r: 30, h: 12 } as const;
const [PX, PY] = project(PEDESTAL.x, PEDESTAL.y, PEDESTAL.h);
const POSE = { x: PX, y: PY - 74, scale: 2.8 } as const;

/* The tags' orbit, in screen units round the held file. */
const ORBIT = { x: PX, y: PY - 58, rx: 96, ry: 30, speed: 0.9 } as const;

/* The file flies in front of its cubby before it slides home. */
const APPROACH = shift(0, 34, 0);

export function NamedScene({ tags }: { tags: SceneTags }) {
  const ref = useDiorama(({ q, loop, idle, start }) => {
    const [fly] = q('[data-file="fly"]');
    const [shelved] = q('[data-file="shelf"]');
    const flyScale = fly.querySelector("[data-file-scale]");
    const both = (sel: string) => [...fly.querySelectorAll(sel), ...shelved.querySelectorAll(sel)];
    const lines = LINES.map((_, i) => [
      fly.querySelectorAll("[data-line]")[i],
      shelved.querySelectorAll("[data-line]")[i],
    ]);
    const art = both("[data-art]");
    const shine = both("[data-shine]");
    const seal = both("[data-seal]");
    const backs = q("[data-chip-back]");
    const fronts = q("[data-chip-front]");
    const glows = q("[data-cubby-glow]");
    const [ring] = q("[data-target-ring]");
    const [column] = q("[data-column]");
    const [halo] = q("[data-halo]");

    idle.fromTo(
      halo,
      { scale: 0.9, opacity: 0.5, transformOrigin: "50% 50%" },
      { scale: 1.15, opacity: 1, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 1 },
    );

    /* The tags: each rides the orbit, or spirals from it into its line. */
    const home = LINES.map((l) => posed(l.u + l.w / 2, l.v + 0.6));
    const chips = tags.map((_, i) => ({
      m: { v: 0 },
      back: {
        x: gsap.quickSetter(backs[i], "x"),
        y: gsap.quickSetter(backs[i], "y"),
        o: gsap.quickSetter(backs[i], "opacity"),
      },
      front: {
        x: gsap.quickSetter(fronts[i], "x"),
        y: gsap.quickSetter(fronts[i], "y"),
        o: gsap.quickSetter(fronts[i], "opacity"),
      },
      shown: { v: 0 },
    }));
    const orbit = { phi: 0 };
    const place = () => {
      chips.forEach((c, i) => {
        const phi = orbit.phi + (i / chips.length) * Math.PI * 2;
        const m = c.m.v;
        const ox = ORBIT.x + ORBIT.rx * Math.cos(phi);
        const oy = ORBIT.y + ORBIT.ry * Math.sin(phi);
        const x = ox + (home[i][0] - ox) * m - ORBIT.x;
        const y = oy + (home[i][1] - oy) * m - ORBIT.y;
        const behind = Math.sin(phi) < 0 && m < 0.35;
        const o = c.shown.v * (1 - Math.max(0, (m - 0.75) / 0.25));
        c.back.x(x);
        c.back.y(y);
        c.back.o(behind ? o : 0);
        c.front.x(x);
        c.front.y(y);
        c.front.o(behind ? 0 : o);
      });
    };

    /* The first frame: the file held up blank, its tags not yet in orbit. */
    gsap.set(flyScale, { svgOrigin: `${SLOT_FACE[0]} ${SLOT_FACE[1]}`, smoothOrigin: false });
    start(fly, { opacity: 0, x: POSE.x - SLOT_FACE[0], y: POSE.y - SLOT_FACE[1] });
    start(flyScale, { scale: POSE.scale });
    start(shelved, { opacity: 0, x: 0, y: 0 });
    start(lines.flat(), { scaleX: 0, transformOrigin: "0% 50%" });
    start(art, { opacity: 0, scale: 1.3, transformOrigin: "50% 50%" });
    start(shine, { x: -30 });
    start(seal, { scale: 0, transformOrigin: "50% 50%" });
    start(glows, { opacity: 0 });
    start([ring, column], { opacity: 0 });
    start(orbit, { phi: 0 });
    chips.forEach((c) => {
      start(c.m, { v: 0 });
      start(c.shown, { v: 0 });
    });
    loop.call(place, [], 0);
    place();

    /* The file comes up and hovers; the tags fall into orbit and go round. */
    loop.to(fly, { opacity: 1, duration: 0.5 }, 0.2);
    loop.to(q("[data-hover]"), { y: -4, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0.2);
    loop.to(column, { opacity: 1, duration: 0.5 }, 0.2);
    loop.to(orbit, { phi: ORBIT.speed * 5.2, duration: 5.2, ease: "none", onUpdate: place }, 0.3);
    chips.forEach((c, i) => {
      loop.to(c.shown, { v: 1, duration: 0.4, onUpdate: place }, 0.4 + i * 0.1);
    });

    /* One by one, they spiral in and are written. */
    chips.forEach((c, i) => {
      const at = 1.8 + i * 0.36;
      loop.to(c.m, { v: 1, duration: 0.55, ease: "power2.in", onUpdate: place }, at);
      loop.to(lines[i], { scaleX: 1, duration: 0.35, ease: "power3.out" }, at + 0.5);
    });

    /* The real cover drops into the frame and catches the light. */
    const covered = 4.3;
    loop.to(art, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, covered);
    loop.to(shine, { x: 34, duration: 0.8, ease: "power2.inOut" }, covered + 0.35);
    loop.to(seal, { scale: 1, duration: 0.45, ease: "back.out(3)" }, covered + 0.8);

    /* Filed: to the cabinet, in front of its cubby, and home. */
    const filed = 5.8;
    loop.to(ring, { keyframes: { opacity: [0, 1, 0.6] }, duration: 0.6 }, filed - 0.3);
    loop.to(column, { opacity: 0, duration: 0.4 }, filed);
    loop.to(fly, { x: APPROACH.x, duration: 1, ease: "power2.inOut" }, filed);
    loop.to(fly, { y: APPROACH.y, duration: 1, ease: "back.in(1.1)" }, filed);
    loop.to(flyScale, { scale: 1, duration: 1, ease: "power2.inOut" }, filed);
    loop.set(fly, { opacity: 0 }, filed + 1);
    loop.set(shelved, { opacity: 1, x: APPROACH.x, y: APPROACH.y }, filed + 1);
    loop.to(shelved, { x: 0, y: 0, duration: 0.45, ease: "power3.out" }, filed + 1);
    loop.to(ring, { opacity: 0, duration: 0.3 }, filed + 1.2);

    /* The library, whole: a wave of light through every shelf. */
    const wave = filed + 1.5;
    loop.to(
      glows,
      { keyframes: { opacity: [0, 1, 0] }, duration: 0.7, ease: "none", stagger: { each: 0.08, from: "center" } },
      wave,
    );

    /* Held; then the shelf lets it go for the next one. */
    const out = wave + 3;
    loop.to(shelved, { opacity: 0, duration: 0.5 }, out);
    loop.set({}, {}, out + 0.8);
  });

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <defs>
        <FileDefs scene={SCENE} />
        <linearGradient id={`${SCENE}-column`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0} />
          <stop offset="100%" stopColor="oklch(0.62 0.2 277)" stopOpacity={0.28} />
        </linearGradient>
      </defs>

      <g data-rise>
        <ellipse cx={300} cy={300} rx={230} ry={90} fill={`url(#${SCENE}-shade)`} opacity={0.5} />
        <ellipse {...floorEllipse(40, -20, 0, 150)} fill="oklch(0.95 0.015 279)" opacity={0.7} />
        <Motes area={{ x: -20, y: -70, w: 140, d: 70, z: 30 }} count={14} seed={31} />
      </g>

      {/* The cabinet, with the file's home slot inside it. */}
      <g data-drop>
        <Shelf file={<File scene={SCENE} which="shelf" />} />
      </g>

      {/* The pedestal and its light. */}
      <g data-drop>
        <ellipse data-halo {...floorEllipse(PEDESTAL.x, PEDESTAL.y, 0, PEDESTAL.r + 16)} fill={`url(#${SCENE}-glow)`} />
        <Cylinder at={[PEDESTAL.x, PEDESTAL.y, 0]} r={PEDESTAL.r} h={PEDESTAL.h} tone={LAVENDER} lid={PAPER.top} />
        <ellipse
          {...floorEllipse(PEDESTAL.x, PEDESTAL.y, PEDESTAL.h + 0.3, PEDESTAL.r - 7)}
          stroke={INK.accent}
          strokeWidth={1.4}
          opacity={0.7}
        />
        <path
          data-column
          opacity={0}
          d={`M${PX - 30},${PY} L${PX - 24},${POSE.y} L${PX + 24},${POSE.y} L${PX + 30},${PY} Z`}
          fill={`url(#${SCENE}-column)`}
        />
      </g>

      {/* Tags behind the file. */}
      {tags.map((tag, i) => (
        <g key={i} data-chip-back opacity={0}>
          <Chip label={tag} />
        </g>
      ))}

      <g data-hover>
        <File scene={SCENE} which="fly" />
      </g>

      {/* Tags in front of it. */}
      <g data-depth="2">
        {tags.map((tag, i) => (
          <g key={i} data-chip-front opacity={0}>
            <Chip label={tag} />
          </g>
        ))}
      </g>
    </Stage>
  );
}

/* A tag chip, centred on the orbit's centre; the director moves it round. */
function Chip({ label }: { label: string }) {
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

/* A point on the file's face, in face units, as it appears while held up. */
function posed(u: number, v: number): [number, number] {
  const [sx, sy] = project(SLOT.x + u, SLOT.y + SLOT.t, SLOT.z + SLOT.h - v);
  return [POSE.x + (sx - SLOT_FACE[0]) * POSE.scale, POSE.y + (sy - SLOT_FACE[1]) * POSE.scale];
}
