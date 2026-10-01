import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

import { project } from "@/components/sections/flow/iso/iso";
import { animateSea } from "@/components/sections/flow/iso/sea";
import type { Cast } from "@/components/sections/flow/iso/useDiorama";

import { CRANE, driver, REST, type Pose } from "./Crane";
import { swell, WATER } from "./hull";
import { BERTHS, CRATE, FISH, hookAbove, PIT, reach, toward, WATER_BOTTOM } from "./layout";

gsap.registerPlugin(DrawSVGPlugin);

/*
 * The bow crane slews out, hauls a crate from the water, swings it inboard, lets the swing die and
 * lowers it into its berth; its porthole turns green. With all three aboard the crane parks and
 * the berths are struck below.
 */
export function directAboard({ q, intro, loop, idle, start, onFrame }: Cast, scene: string) {
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
  loop.set(hold, { attr: { "clip-path": `url(#${scene}-pit)` } }, stow - 0.05);
  loop.to(crates, { y: 30, duration: 0.7, ease: "power3.in", stagger: 0.12 }, stow);
  loop.to(lit, { opacity: 0, duration: 0.4, stagger: 0.1 }, stow + 0.6);
  loop.to(glows, { opacity: 0, duration: 0.4, stagger: 0.1 }, stow + 0.6);
  loop.to(arcs, { drawSVG: "100% 100%", duration: 0.5, stagger: 0.1 }, stow + 0.6);
  loop.set({}, {}, stow + 1.4);
}
