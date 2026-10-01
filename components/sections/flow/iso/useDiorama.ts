"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Scenes are server-rendered settled; only under `no-preference` do they get three timelines:
 * `intro` plays once on reveal (`[data-rise]` rises, `[data-drop]` lands), `loop` repeats after it
 * and must end on its first frame, `idle` runs unsynced from the intro on. All pause off-screen,
 * since AnimationGate cannot see GSAP. A fine pointer leans each `[data-depth]` layer.
 */

export type Cast = {
  q: (selector: string) => Element[];
  intro: gsap.core.Timeline;
  loop: gsap.core.Timeline;
  idle: gsap.core.Timeline;
  /** The loop's first frame: applied now, and again at the top of every lap to snap any drift. */
  start: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => void;
  /** Runs every frame while the scene is started and on screen. */
  onFrame: (fn: () => void) => void;
};

export function useDiorama(direct: (cast: Cast) => void) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(svg);
        const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        const loop = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "power3.out" } });
        const idle = gsap.timeline({ paused: true, repeat: -1 });

        intro.fromTo(
          q("[data-stage], [data-rise]"),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "expo.out" },
        );
        const drops = q("[data-drop]");
        if (drops.length) {
          intro.fromTo(
            drops,
            { y: -46, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.9)", stagger: 0.09 },
            0.25,
          );
        }

        const start = (targets: gsap.TweenTarget, vars: gsap.TweenVars) => {
          gsap.set(targets, vars);
          loop.set(targets, vars, 0);
        };

        const frames: (() => void)[] = [];
        const onFrame = (fn: () => void) => frames.push(fn);

        direct({ q, intro, loop, idle, start, onFrame });

        let current = intro;
        let started = false;
        let visible = false;

        intro.eventCallback("onComplete", () => {
          current = loop;
          if (visible) loop.play(0);
        });

        const reveal = ScrollTrigger.create({
          trigger: svg,
          start: "top 78%",
          once: true,
          onEnter: () => {
            started = true;
            intro.play();
            idle.play();
          },
        });

        const presence = ScrollTrigger.create({
          trigger: svg,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!started) return;
            if (visible) {
              current.play();
              idle.play();
            } else {
              current.pause();
              idle.pause();
            }
          },
        });

        const tick = () => {
          if (started && visible) for (const fn of frames) fn();
        };
        gsap.ticker.add(tick);

        const cleanups = [() => reveal.kill(), () => presence.kill(), () => gsap.ticker.remove(tick)];

        if (window.matchMedia("(pointer: fine)").matches) {
          cleanups.push(lean(svg, Array.from(svg.querySelectorAll<SVGGElement>("[data-depth]"))));
        }

        return () => cleanups.forEach((fn) => fn());
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}

/** Screen units a depth-1 layer travels at the edge of the row. */
const LEAN = { x: 5, y: 3 };

function lean(svg: SVGSVGElement, layers: SVGGElement[]): () => void {
  const host = svg.closest<HTMLElement>("[data-flow-row]") ?? svg.parentElement;
  if (!layers.length || !host) return () => {};

  const movers = layers.map((el) => ({
    depth: Number(el.dataset.depth ?? 0),
    x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
    y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
  }));

  const onMove = (event: PointerEvent) => {
    const r = svg.getBoundingClientRect();
    const nx = gsap.utils.clamp(-1, 1, (event.clientX - (r.left + r.width / 2)) / (r.width / 2));
    const ny = gsap.utils.clamp(-1, 1, (event.clientY - (r.top + r.height / 2)) / (r.height / 2));
    for (const m of movers) {
      m.x(nx * m.depth * LEAN.x);
      m.y(ny * m.depth * LEAN.y);
    }
  };

  const onLeave = () => {
    for (const m of movers) {
      m.x(0);
      m.y(0);
    }
  };

  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);

  return () => {
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointerleave", onLeave);
  };
}
