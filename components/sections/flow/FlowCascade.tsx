"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Scrubbed to scroll position, not fired once. The rows are server-rendered children: without
   JavaScript, or under reduced motion, they simply stay fully visible. */

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
