"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import { usePlatform } from "@/components/download/usePlatform";

import type { HoldCopy } from "./copy";
import { Explorer } from "./Explorer";
import { Finder } from "./Finder";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * The window follows the visitor's system, like the download button: Finder on a Mac, Explorer
 * everywhere else. Server-rendered settled, every destination ticked. With motion allowed and room
 * for it, a "Sonarche" folder is lifted from the path and dropped on each destination in turn.
 */

const ICONS = [
  "M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5ZM11 18.5h2",
  "M3.5 13.5 6 5.5h12l2.5 8M3.5 13.5h17v4a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-4ZM16.5 16.2h.01",
  "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "M4.5 5.5h15v10h-15zM2.5 19h19",
];

export function HoldStage({ copy }: { copy: HoldCopy }) {
  const root = useRef<HTMLDivElement>(null);
  const mac = usePlatform() === "macos";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 64rem)", () => {
        const stage = root.current;
        const ghost = stage?.querySelector<HTMLElement>("[data-hold-ghost]");
        const source = stage?.querySelector<HTMLElement>("[data-hold-source]");
        const targets = gsap.utils.toArray<HTMLElement>("[data-hold-dest]");
        if (!stage || !ghost || !source) return;

        const at = (el: HTMLElement) => {
          const box = stage.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return {
            x: r.left - box.left + r.width / 2 - ghost.offsetWidth / 2,
            y: r.top - box.top + r.height / 2 - ghost.offsetHeight / 2,
          };
        };

        const lights = targets.map((target) => gsap.utils.toArray<HTMLElement>("[data-hold-lit]", target));
        gsap.set(lights.flat(), { opacity: 0 });
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });
        targets.forEach((target, i) => {
          tl.call(() => {
            gsap.set(ghost, { ...at(source), opacity: 0, scale: 0.9 });
          })
            .to(ghost, { opacity: 1, scale: 1.05, duration: 0.25 })
            .to(ghost, { x: () => at(target).x, y: () => at(target).y, scale: 1, duration: 1.1, ease: "power2.inOut" })
            .to(ghost, { opacity: 0, scale: 0.8, duration: 0.25 })
            .to(lights[i], { opacity: 1, duration: 0.3 }, "<");
        });
        tl.to(lights.flat(), { opacity: 0, duration: 0.4 }, "+=1.6");

        const st = ScrollTrigger.create({
          trigger: stage,
          start: "top 70%",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
        });

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [mac] },
  );

  return (
    <div ref={root} className="relative mx-auto mt-12 max-w-[70rem] px-8 sm:px-15">
      {mac ? (
        <Finder ui={copy.ui.macos} otherApp={copy.otherApp} />
      ) : (
        <Explorer ui={copy.ui.windows} otherApp={copy.otherApp} />
      )}

      <span
        aria-hidden
        data-hold-ghost
        className="bg-surface text-foreground-strong ring-accent pointer-events-none absolute top-0 left-0 z-10 hidden items-center gap-2 rounded-[10px] py-2 pr-3.5 pl-2.5 text-[0.8125rem] font-semibold opacity-0 shadow-[0_18px_36px_-12px_oklch(0.505_0.185_277/0.6)] ring-[1.5px] lg:flex"
      >
        <svg width="18" height="16" viewBox="0 0 16 14">
          <path
            d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3.2l1.5 1.6h6.3A1.5 1.5 0 0 1 15 4.1v7.4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11.5Z"
            fill="var(--accent)"
          />
        </svg>
        Sonarche
      </span>

      <ul className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {copy.destinations.map((destination, i) => (
          <li
            key={destination.where}
            data-hold-dest
            className="border-border relative flex min-h-34 flex-col gap-1.5 rounded-2xl border-[1.5px] border-dashed p-4 lg:p-4.5"
          >
            <span
              aria-hidden
              data-hold-lit
              className="border-accent absolute -inset-[1.5px] rounded-2xl border-2 bg-[color-mix(in_oklch,var(--accent-soft)_70%,transparent)]"
            />
            <span className="relative flex items-center justify-between">
              <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d={ICONS[i]}
                  stroke="var(--accent)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                aria-hidden
                data-hold-lit
                className="bg-success flex size-5.5 items-center justify-center rounded-full"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6.2 5 8.5l4.5-5"
                    stroke="var(--snow)"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <p className="font-display text-foreground-strong relative mt-1.5 text-base font-semibold lg:text-lg">
              {destination.where}
            </p>
            <p className="text-body relative text-[0.8125rem] leading-[1.45] lg:text-sm">{destination.note}</p>
          </li>
        ))}
      </ul>
      <p className="text-accent-muted mt-5 text-center font-serif text-lg italic">{copy.note}</p>
    </div>
  );
}
