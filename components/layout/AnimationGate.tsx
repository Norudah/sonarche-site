"use client";

import { useEffect } from "react";

/*
 * Pauses every CSS loop inside an off-screen `data-anim-gate` element (see globals.css). An
 * attribute flip keeps the SSR markup in the running state, so without JavaScript nothing pauses.
 * The margin restarts loops before they scroll into view. GSAP drives inline styles and is untouched.
 */

const RESUME_MARGIN = "25% 0px 25% 0px";

export function AnimationGate() {
  useEffect(() => {
    const gated = document.querySelectorAll("[data-anim-gate]");
    if (!gated.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.setAttribute("data-anim-gate", entry.isIntersecting ? "on" : "off");
        }
      },
      { rootMargin: RESUME_MARGIN },
    );
    gated.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
