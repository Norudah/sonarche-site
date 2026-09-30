"use client";

import { Bar, barSetter } from "../Bar";
import { floorEllipse, onFloor, onSide, shift } from "../iso";
import { Box, Shadow, Stage } from "../primitives";
import { continuum, INDIGO, INK, PAPER } from "../tones";
import { useDiorama } from "../useDiorama";

/*
 * Step 01 — a link is fished out of the stream and dropped in the composer.
 *
 * The stream is a patch of the hero's sea on the plinth, the brand's bars in
 * miniature, heaving. A link rises out of it, arcs across, and plugs into the
 * composer; the voyage lines up underneath, one row per track, and the row
 * already in the hold greys out and folds away, silently.
 */

const SCENE = "flow-paste";

/* The composer: a window floating over the left of the plinth, facing right.
   `x` is its screen's plane, `y` its near end, `w` runs back from there. */
const WIN = { x: -95, y: 62, z: 132, w: 140, h: 118, t: 8 } as const;

/* The link token, docked in the composer's field (offsets from WIN). */
const CHIP = { y: 15, z: 91.5, w: 40, d: 5, h: 17 } as const;

/* The stream: 10×7 thin bars on the front right, painted back to front. */
const SEA = Array.from({ length: 70 }, (_, i) => ({ x: (i % 10) * 11, y: -22 + Math.floor(i / 10) * 11 }))
  .sort((a, b) => a.x + a.y - (b.x + b.y) || a.x - b.x)
  .map((b) => ({ ...b, k: (b.x + b.y + 22) / 187 }));

/* Where the link is fished from: the middle of the stream. */
const FISH = { x: 52, y: 13 } as const;

/* Queue rows in the composer. The settled list is three rows: the one already
   in the hold is drawn hidden in the third slot, and the fourth track is drawn
   in that slot too, the place it ends up once the duplicate has folded away. */
const ROWS = [
  { slot: 0, title: 64, artist: 36 },
  { slot: 1, title: 50, artist: 46 },
  { slot: 2, title: 58, artist: 30, duplicate: true },
  { slot: 2, title: 70, artist: 40 },
] as const;
const ROW_TOP = 58;
const ROW_STEP = 14.5;

export function PasteScene() {
  const ref = useDiorama(({ q, intro, loop, idle, start }) => {
    const [chip] = q("[data-chip]");
    const [splash] = q("[data-splash]");
    const [url] = q("[data-url]");
    const [caret] = q("[data-caret]");
    const [button] = q("[data-go]");
    const [focus] = q("[data-focus]");
    const rows = q("[data-row]");
    const dup = rows[2];
    const last = rows[3];
    const [badge] = q("[data-badge]");

    /* The swell: every bar on a travelling sine, set per frame. It opens flat
       and the intro brings the water up. */
    const sea = q("[data-sea] [data-bar-h]").map((bar, i) => ({ set: barSetter(bar), ...SEA[i] }));
    const wave = { t: 0, a: 0 };
    const heave = () => {
      for (const b of sea) b.set(wave.a * (9 + 6.5 * Math.sin(wave.t - b.x * 0.075 - b.y * 0.05)));
    };
    heave();
    intro.to(wave, { a: 1, duration: 1.6, ease: "power2.out", onUpdate: heave }, 0.3);
    idle.to(wave, { t: Math.PI * 2, duration: 2.8, ease: "none", onUpdate: heave });

    /* The first frame: an empty composer, the token still under water. */
    const lift = shift(FISH.x - (WIN.x + CHIP.d / 2), FISH.y - (CHIP.y + CHIP.w / 2), -CHIP.z);
    start(chip, { x: lift.x, y: lift.y, scale: 0.3, opacity: 0, transformOrigin: "50% 50%" });
    start(url, { scaleX: 0, transformOrigin: "0% 50%" });
    start([caret, focus, badge, splash], { opacity: 0 });
    start(rows, { opacity: 0, x: -10 });
    start(dup, { scaleY: 1, transformOrigin: "50% 0%" });
    start(last, { y: ROW_STEP });

    /* Fished out: a splash, and the token rises clear of the water. */
    loop.fromTo(
      splash,
      { scale: 0.2, opacity: 0.95, transformOrigin: "50% 50%" },
      { scale: 1.8, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false },
      0.3,
    );
    loop.to(chip, { opacity: 1, scale: 1, y: lift.y - 62, duration: 0.75, ease: "back.out(2)" }, 0.3);

    /* Across and in: x eases late, y winds up then drops, which draws the arc. */
    loop.to(chip, { x: 0, duration: 1.1, ease: "power2.inOut" }, 1.15);
    loop.to(chip, { y: 0, duration: 1.1, ease: "back.in(1.2)" }, 1.15);
    loop.to(chip, { scaleX: 1.14, scaleY: 0.84, duration: 0.08, ease: "power1.out" }, 2.25);
    loop.to(chip, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.35)" }, 2.33);
    loop.to(focus, { opacity: 1, duration: 0.2 }, 2.25);

    /* The address fills in, the caret settles at its end and blinks. */
    loop.to(url, { scaleX: 1, duration: 0.45, ease: "steps(9)" }, 2.4);
    loop.set(caret, { opacity: 1 }, 2.85);
    loop.to(caret, { opacity: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.26 }, 3.1);

    /* Go. */
    loop.to(button, { scale: 0.84, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, 3.75);
    loop.to(button, { scale: 1, duration: 0.55, ease: "elastic.out(1.2, 0.4)" }, 3.85);
    loop.to([focus, caret], { opacity: 0, duration: 0.4 }, 3.85);

    /* The voyage lines up, one row per track. */
    loop.to(rows, { opacity: 1, x: 0, duration: 0.55, stagger: 0.14, ease: "power3.out" }, 3.9);

    /* Already aboard: marked, dimmed, folded away; the next row closes the gap. */
    loop.fromTo(
      badge,
      { scale: 0.4, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false },
      4.85,
    );
    loop.to(dup, { opacity: 0.35, duration: 0.3 }, 5.2);
    loop.to(dup, { scaleY: 0, opacity: 0, duration: 0.45, ease: "power3.in" }, 5.65);
    loop.to(last, { y: 0, duration: 0.55, ease: "power3.inOut" }, 5.9);

    /* Held, then put away: the rows fade, the token lets go. */
    const out = 8.8;
    loop.to(rows, { opacity: 0, x: 8, duration: 0.4, stagger: 0.06, ease: "power2.in" }, out);
    loop.to(url, { scaleX: 0, duration: 0.3, ease: "power2.in" }, out + 0.2);
    loop.to(chip, { opacity: 0, scale: 0.6, duration: 0.45, ease: "power2.in" }, out + 0.3);
    loop.set({}, {}, out + 1.2);
  });

  return (
    <Stage scene={SCENE} svgRef={ref}>
      <Shadow scene={SCENE} at={[WIN.x + 14, WIN.y - WIN.w / 2]} r={50} />

      {/* The stream, built into the plinth. */}
      <g data-rise>
        <rect
          x={-5}
          y={-27}
          width={9 * 11 + 15}
          height={6 * 11 + 15}
          rx={3}
          transform={onFloor(0, 0, 0.5)}
          fill="oklch(0.925 0.035 277)"
          stroke="oklch(0.86 0.05 277)"
        />
        <g data-sea>
          {SEA.map((b, i) => (
            <Bar key={i} at={[b.x, b.y, 0]} size={[5, 5, 9]} tone={continuum(b.k)} />
          ))}
        </g>
        <ellipse data-splash opacity={0} {...floorEllipse(FISH.x, FISH.y, 14, 16)} stroke="white" strokeWidth={2} />
      </g>

      {/* The composer. */}
      <g data-drop>
        <Box at={[WIN.x - WIN.t, WIN.y - WIN.w, WIN.z - WIN.h]} size={[WIN.t, WIN.w, WIN.h]} tone={PAPER} />
        <g transform={onSide(WIN.x, WIN.y, WIN.z)}>
          <rect width={WIN.w} height={WIN.h} fill="oklch(0.997 0.002 279)" />
          <rect width={WIN.w} height={15} fill="oklch(0.955 0.012 279)" />
          {[9, 17, 25].map((u) => (
            <circle key={u} cx={u} cy={7.5} r={2.2} fill="oklch(0.82 0.035 279)" />
          ))}

          <rect x={8} y={26} width={124} height={22} rx={6} fill="white" stroke={INK.line} strokeWidth={1.2} />
          <rect
            data-focus
            opacity={0}
            x={7}
            y={25}
            width={126}
            height={24}
            rx={7}
            stroke={INK.accent}
            strokeWidth={1.6}
          />
          <rect data-url x={58} y={35} width={42} height={4} rx={2} fill="oklch(0.76 0.04 279)" />
          <rect data-caret opacity={0} x={101.5} y={32} width={1.4} height={10} fill={INK.accent} />
          <g data-go>
            <rect x={108} y={29} width={20} height={16} rx={5} fill={INK.accent} />
            <path
              d="M113,37 L122,37 M118.5,33.5 L122,37 L118.5,40.5"
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
                <rect x={8} y={top} width={124} height={12} rx={3} fill="oklch(0.972 0.008 279)" />
                <circle cx={16} cy={top + 6} r={3.4} stroke={INK.accent} strokeWidth={1.4} />
                <rect x={25} y={top + 3} width={row.title} height={3} rx={1.5} fill="oklch(0.7 0.05 279)" />
                <rect x={25} y={top + 7.4} width={row.artist} height={2.2} rx={1.1} fill="oklch(0.85 0.025 279)" />
                <rect x={114} y={top + 4.8} width={12} height={2.4} rx={1.2} fill="oklch(0.85 0.025 279)" />
                {"duplicate" in row && (
                  <g data-badge>
                    <rect x={96} y={top + 2} width={14} height={8} rx={2} fill="oklch(0.92 0.02 279)" />
                    <path
                      d={`M99.5,${top + 6} l2,2 l4,-4`}
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

      {/* The link token: the one thing rescued from the stream. */}
      <g data-depth="2">
        <g data-chip>
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
    </Stage>
  );
}
