"use client";

import { useEffect, useRef } from "react";

import styles from "./hero.module.css";
import type { Tier } from "./scene/createScene";

/*
 * The live storm's front door — and the reason the hero still costs nothing
 * before it is read.
 *
 * The CSS storm (Storm.tsx) is the poster: server-rendered, the first thing
 * painted, and what every visitor the scene is not for keeps. This mounts an
 * empty canvas over it and, once the page has loaded and gone idle, fetches the
 * WebGL chunk. When the scene has its first frame it flags the section, the
 * canvas fades in over the poster and the poster is put to sleep underneath.
 * Any failure on the way — no WebGL, a chunk that never lands, a device the
 * watchdog finds too slow — just leaves the poster where it was.
 *
 * The effect is here because the scene is an external system with a lifetime
 * of its own: it is created once, and disposed of on unmount and on HMR.
 */

const HIGH: Tier = { pixelRatio: 1.75, antialias: true, density: 1, rain: 520, pixels: 260 };
const LOW: Tier = { pixelRatio: 1.25, antialias: false, density: 0.7, rain: 320, pixels: 160 };

/** How long the canvas takes to fade in; the poster is put to sleep after it. */
const HANDOVER_MS = 1400;

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

/*
 * Who gets the scene.
 *
 * Wide screens only — the `lg` where the page's own layouts go wide. Sonarche
 * is a desktop app: the visitor who can act on this page is at a computer, and
 * a computer has a GPU with frame budget to spare. On a phone the same scene
 * measured as a 5s block of the main thread under Lighthouse's throttling, for
 * a sea that fills the bottom fifth of a narrow screen; the poster is the
 * better page there, and costs nothing.
 *
 * Reduced motion never gets it: the poster already settles for them. Data
 * savers keep the poster too — this is 150KB of decoration. Everyone else gets
 * a tier from what the browser says about the machine, and the watchdog in
 * createScene.ts corrects a tier that turns out to be optimistic.
 */
const WIDE = "(min-width: 64rem)";

function pickTier(): Tier | null {
  if (!window.matchMedia(WIDE).matches) return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return null;

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  return cores >= 8 && memory >= 8 ? HIGH : LOW;
}

/** After the load event and an idle moment: never in the way of the page itself. */
function whenSettled(run: () => void): () => void {
  let idle = 0;
  let timer = 0;
  const schedule = () => {
    // Safari has no requestIdleCallback; a beat after load is its nearest.
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(run, { timeout: 1500 });
    else timer = window.setTimeout(run, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    window.removeEventListener("load", schedule);
    if (idle) window.cancelIdleCallback(idle);
    window.clearTimeout(timer);
  };
}

export function HeroScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest("section");
    if (!canvas || !host) return;
    const tier = pickTier();
    if (!tier) return;

    let scene: { dispose(): void } | undefined;
    let cancelled = false;
    let handover = 0;

    const cancel = whenSettled(() => {
      import("./scene/createScene").then(
        ({ createScene }) => {
          if (cancelled) return;
          scene = createScene({
            canvas,
            host,
            tier,
            onLive: () => {
              host.dataset.scene = "live";
              handover = window.setTimeout(() => (host.dataset.scene = "settled"), HANDOVER_MS);
            },
            onFail: () => {
              window.clearTimeout(handover);
              delete host.dataset.scene;
            },
          });
        },
        // The chunk never came: the poster is already the page.
        () => {},
      );
    });

    return () => {
      cancelled = true;
      cancel();
      window.clearTimeout(handover);
      scene?.dispose();
      delete host.dataset.scene;
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`${styles.scene} pointer-events-none absolute inset-0 z-[4] h-full w-full`}
    />
  );
}
