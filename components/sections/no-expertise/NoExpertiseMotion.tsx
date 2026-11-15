"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Plays the grid's mini-interfaces. The server renders each one in its final state, which is what
 * reduced motion and no-JavaScript readers keep. With motion allowed, each card rewinds to its
 * start and plays once when it reaches the lower third of the screen; the help card keeps cycling.
 * Transform and opacity only.
 */

type Point = { x: number; y: number };

/** Where to put a pointer so its tip lands on the middle of `target`, in `frame` coordinates. */
function aim(frame: Element, target: Element | null): Point {
  if (!target) return { x: 0, y: 0 };
  const f = frame.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  return { x: t.left - f.left + t.width / 2 - 3, y: t.top - f.top + t.height / 2 - 2 };
}

/** The first match that is actually laid out: some handles exist twice, one per breakpoint. */
function shown(root: Element, selector: string): HTMLElement | null {
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).find((el) => el.offsetParent !== null) ?? null;
}

const once = (trigger: Element, tl: gsap.core.Timeline) =>
  ScrollTrigger.create({ trigger, start: "top 72%", once: true, onEnter: () => void tl.play() });

export function NoExpertiseMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const fills = scope.querySelectorAll("[data-nx-fill]");
        const badges = scope.querySelectorAll("[data-nx-badge]");
        if (fills.length) {
          const tl = gsap.timeline({ paused: true });
          tl.fromTo(fills, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.4 }).fromTo(
            badges,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.7)", stagger: 0.4 },
            0.5,
          );
          once(fills[0], tl);
        }

        const editor = scope.querySelector("[data-ed-window]");
        if (editor) once(editor, editorSession(editor));

        const help = scope.querySelector("[data-help]");
        if (help) once(help, helpTour(help));

        const rematch = scope.querySelector("[data-rematch]");
        if (rematch) once(rematch, rematchRun(rematch));
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}

/* ≈ 10 s: the genre for the whole album, then one artist by hand, then save. */
function editorSession(win: Element): gsap.core.Timeline {
  const q = gsap.utils.selector(win);
  const cursor = q("[data-ed-cursor]");
  const to = (selector: string) => () => aim(win, shown(win, selector));
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

  tl.set(q("[data-ed-genre-old], [data-ed-old], [data-ed-artist-old]"), { opacity: 1, y: 0 })
    .set(q("[data-ed-genre-new], [data-ed-new], [data-ed-artist-new], [data-ed-pill], [data-ed-tick]"), { opacity: 0 })
    .set(cursor, { x: () => win.clientWidth * 0.6, y: () => win.clientHeight * 0.85, opacity: 0 })
    .to(cursor, { opacity: 1, duration: 0.3 })
    .to(cursor, { x: () => to("[data-ed-genre]")().x, y: () => to("[data-ed-genre]")().y, duration: 0.9 })
    .fromTo(q("[data-ed-menu]"), { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" })
    .to(cursor, { x: () => to("[data-ed-option]")().x, y: () => to("[data-ed-option]")().y, duration: 0.5 })
    .to(cursor, { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 })
    .to(q("[data-ed-menu]"), { opacity: 0, y: -6, duration: 0.2 })
    .to(q("[data-ed-genre-old]"), { opacity: 0, duration: 0.25 }, "<")
    .to(q("[data-ed-genre-new]"), { opacity: 1, duration: 0.25 }, "<");

  q("[data-ed-row]").forEach((row, i) => {
    const at = i === 0 ? ">" : "<+=0.2";
    tl.fromTo(
      row.querySelector("[data-ed-flash]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 },
      at,
    )
      .to(row.querySelector("[data-ed-old]"), { opacity: 0, y: -6, duration: 0.3, ease: "power3.out" }, "<")
      .fromTo(
        row.querySelector("[data-ed-new]"),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
        "<",
      );
  });

  tl.to(cursor, { x: () => to("[data-ed-artist]")().x, y: () => to("[data-ed-artist]")().y, duration: 0.8 }, "+=0.3")
    .to(cursor, { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 })
    .to(q("[data-ed-artist-old]"), { opacity: 0, duration: 0.2 })
    .to(q("[data-ed-artist-new]"), { opacity: 1, duration: 0.2 }, "<")
    .fromTo(q("[data-ed-caret]"), { opacity: 1 }, { opacity: 0, duration: 0.01, delay: 1.1 })
    .fromTo(
      q("[data-ed-pop]"),
      { opacity: 0, y: 8, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" },
    )
    .to(cursor, { x: () => to("[data-ed-keep]")().x, y: () => to("[data-ed-keep]")().y, duration: 0.7 }, "+=0.4")
    .to(cursor, { scale: 0.85, duration: 0.08, yoyo: true, repeat: 1 })
    .to(q("[data-ed-pop]"), { opacity: 0, y: 8, duration: 0.25 })
    .fromTo(q("[data-ed-pill]"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" })
    .to(cursor, { x: () => to("[data-ed-save]")().x, y: () => to("[data-ed-save]")().y, duration: 0.8 }, "+=0.2")
    .to(q("[data-ed-save]"), { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 })
    .fromTo(
      q("[data-ed-tick]"),
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", stagger: 0.06 },
    )
    .to(cursor, { opacity: 0, duration: 0.4 }, "+=0.4");

  return tl;
}

/* Visits each "?" in turn and opens its explanation under it; loops. */
function helpTour(frame: Element): gsap.core.Timeline {
  const q = gsap.utils.selector(frame);
  const marks = q("[data-help-q]");
  const tips = q("[data-help-tip]");
  const cursor = q("[data-help-cursor]");
  const tl = gsap.timeline({ paused: true, repeat: -1, defaults: { ease: "power2.inOut" } });

  tl.set(tips, { opacity: 0 }).set(cursor, {
    opacity: 1,
    x: () => frame.clientWidth * 0.55,
    y: () => frame.clientHeight,
  });
  marks.forEach((mark, i) => {
    const below = () => {
      const p = aim(frame, mark);
      return { x: Math.max(0, Math.min(p.x - 30, frame.clientWidth - tips[i].offsetWidth)), y: p.y + 16 };
    };
    tl.to(cursor, { x: () => aim(frame, mark).x, y: () => aim(frame, mark).y, duration: 0.7 })
      .to(mark, { scale: 1.25, duration: 0.2 })
      .fromTo(
        tips[i],
        { opacity: 0, x: () => below().x, y: () => below().y + 6 },
        { opacity: 1, y: () => below().y, duration: 0.35, ease: "power3.out" },
        "<",
      )
      .to(tips[i], { opacity: 0, duration: 0.3 }, "+=2.2")
      .to(mark, { scale: 1, duration: 0.2 }, "<");
  });

  return tl;
}

/* The wrong track, one click, the fingerprint runs, the right track. */
function rematchRun(frame: Element): gsap.core.Timeline {
  const q = gsap.utils.selector(frame);
  const cursor = q("[data-rm-cursor]");
  const button = frame.querySelector("[data-rm-button]");
  const bars = q("[data-rm-bar]");
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

  tl.set(q("[data-rm-old]"), { opacity: 1 })
    .set(q("[data-rm-new]"), { opacity: 0 })
    .set(cursor, { opacity: 0, x: () => frame.clientWidth * 0.7, y: () => frame.clientHeight })
    .to(cursor, { opacity: 1, duration: 0.3 }, "+=0.6")
    .to(cursor, { x: () => aim(frame, button).x, y: () => aim(frame, button).y, duration: 0.8 })
    .to(button, { scale: 0.93, duration: 0.1, yoyo: true, repeat: 1 })
    .to(bars, { opacity: 1, duration: 0.2 }, "<")
    .to(bars, {
      scaleY: () => gsap.utils.random(0.35, 1),
      duration: 0.28,
      ease: "sine.inOut",
      repeat: 7,
      repeatRefresh: true,
      stagger: { each: 0.02, from: "random" },
    })
    .to(bars, { scaleY: 0.18, opacity: 0.3, duration: 0.3 })
    .to(q("[data-rm-old]"), { opacity: 0, duration: 0.3 }, "<")
    .to(q("[data-rm-new]"), { opacity: 1, duration: 0.3 }, "<")
    .to(cursor, { opacity: 0, duration: 0.4 }, "+=0.6");

  return tl;
}
