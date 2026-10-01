import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { barSetter } from "@/components/sections/flow/iso/Bar";
import { project } from "@/components/sections/flow/iso/iso";
import type { Cast } from "@/components/sections/flow/iso/useDiorama";

import { ANSWER, BARS, CANDIDATES, CRATE, height, HUB, SCAN } from "./layout";
import { ORB, ORBITS } from "./Orb";

gsap.registerPlugin(DrawSVGPlugin);

/*
 * A sweep goes round once and, bar by bar, the spectrum collapses into a ring of bits: the
 * acoustic fingerprint. It goes up to AcoustID, which weighs candidates; the guesses fall away and
 * the match comes down to the hub, sealed green.
 */
export function directFingerprint({ q, intro, loop, idle, start, onFrame }: Cast) {
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
}
