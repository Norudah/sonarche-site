"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * The cascade's scroll choreography — the first GSAP on the site.
 *
 * Each row surfaces as it comes up the viewport: scrubbed, not triggered, so
 * the reveal is tied to the scroll position rather than fired once. That is the
 * mockup's own mapping — a row is at 0.28 opacity when its top is at 94% of the
 * viewport and settled by the time it reaches 44%.
 *
 * The rows themselves are server-rendered and arrive as children: this component
 * only animates nodes that are already in the DOM, so the copy is in the HTML for
 * a crawler and for anyone whose JavaScript never loads. Without JS the rows stay
 * at their natural, fully visible state — `fromTo` only dims them once GSAP is
 * running, and the section sits far below the fold, so the switch is never seen.
 */

export function FlowCascade({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-flow-row]");

        rows.forEach((row) => {
          gsap.fromTo(
            row,
            { opacity: 0.28, y: 30 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top 94%", end: "top 44%", scrub: true },
            },
          );
        });
      });

      // Reduced motion gets no branch at all: the rows are already settled.
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mx-auto mt-14 flex max-w-[80rem] flex-col gap-18 sm:mt-18 sm:gap-22">
      {children}
    </div>
  );
}
