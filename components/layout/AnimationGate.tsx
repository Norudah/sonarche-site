"use client";

import { useEffect } from "react";

/*
 * The page's off-screen animation brake.
 *
 * Every section runs ambient CSS loops — the sea alone is seven hundred bars —
 * and none of them can see the viewport. This can: it watches every element
 * that declared `data-anim-gate` and flips the attribute to "off" while the
 * element is out of view, which a global rule (see globals.css) turns into
 * `animation-play-state: paused` for the whole subtree. At the top of the page
 * that silences roughly three quarters of everything animating.
 *
 * Attribute flip rather than a class so the SSR markup stays the resume state:
 * with no JavaScript at all, nothing ever pauses and the page is merely what it
 * was before this existed.
 *
 * The margin restarts a section's loops well before it enters, so nothing is
 * ever seen frozen mid-cycle. Phase safety is free: paused animations hold
 * their clock, and everything phase-locked (a drop and its ripple) pauses and
 * resumes together.
 *
 * GSAP is untouched — it drives inline styles, not animations — and reduced
 * motion needs no case here: those animations are already `none`.
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
