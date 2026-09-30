"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * The one director every diorama shares.
 *
 * A scene is server-rendered in its settled state — the story's last frame —
 * which is what a crawler, a reader without JavaScript and anyone asking for
 * reduced motion sees. Only under `no-preference` does a scene hand this hook
 * three timelines to fill:
 *
 * - `intro` plays once, when the diorama comes up the viewport: the stage (and
 *   anything built into it, `[data-rise]`) rises, and every `[data-drop]` prop
 *   lands on it, in document order.
 * - `loop` follows it for as long as the page is open, and is written so that
 *   its last frame is its first: a story told, held, and put away.
 * - `idle` starts with the intro and never syncs to either: the water's swell,
 *   a machine's hum.
 *
 * Both are paused while the diorama is off-screen (they are GSAP, so the page's
 * AnimationGate cannot see them), and a pointer over the row leans every
 * `[data-depth]` layer by its depth: the one cue a flat drawing needs to read
 * as a model on a table.
 */

type Cast = {
  q: (selector: string) => Element[];
  intro: gsap.core.Timeline;
  loop: gsap.core.Timeline;
  /** Ambient motion (a swell, a hum) that runs from the intro on, unsynced. */
  idle: gsap.core.Timeline;
  /**
   * The loop's first frame: applied now, so the intro opens on it, and again at
   * the top of every lap, so a clear-out that lands slightly off is snapped
   * back while nothing is on show.
   */
  start: (targets: gsap.TweenTarget, vars: gsap.TweenVars) => void;
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
        intro.fromTo(
          q("[data-drop]"),
          { y: -46, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.9)", stagger: 0.09 },
          0.25,
        );

        const start = (targets: gsap.TweenTarget, vars: gsap.TweenVars) => {
          gsap.set(targets, vars);
          loop.set(targets, vars, 0);
        };

        direct({ q, intro, loop, idle, start });

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

        const cleanups = [() => reveal.kill(), () => presence.kill()];

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
