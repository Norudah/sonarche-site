"use client";

import { useEffect, useRef } from "react";

import type { Tier } from "./createScene";
import styles from "./scene.module.css";
import type { WeatherName } from "./weather";

/*
 * The live sea's front door — and the reason the posters still cost nothing
 * before they are read.
 *
 * Each sea on the page has a CSS poster (the hero's Storm, the footer's
 * harbour): server-rendered, painted first, and what every visitor the scene is
 * not for keeps. This mounts an empty canvas over it and, once the page has
 * loaded and gone idle, fetches the WebGL chunk. When the scene has its first
 * frame it flags its host and the ark's first ping sweeps the poster away
 * (scene.module.css); once the ring has covered the frame the poster is put to
 * sleep underneath. Any failure on the way — no WebGL, a chunk that never
 * lands, a device the watchdog finds too slow — leaves the poster where it was.
 *
 * The host is the canvas's parent: the element the poster fills. The harbour,
 * at the foot of the page, is only built once the visitor is on their way to
 * it — a scene nobody scrolls to is GPU memory held for nothing. Both share
 * one chunk, so the second costs no download.
 *
 * The effect is here because the scene is an external system with a lifetime
 * of its own: it is created once, and disposed of on unmount and on HMR.
 */

const HIGH: Tier = { pixelRatio: 2, antialias: true, density: 1, rain: 520, pixels: 210 };
const LOW: Tier = { pixelRatio: 1.25, antialias: false, density: 0.7, rain: 320, pixels: 160 };

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
 * createScene.ts corrects a tier that turns out to be optimistic. The rain
 * and pixel counts only mean anything to the storm.
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

/** Once the host is within a screen or so of the viewport. */
function whenNear(host: Element, run: () => void): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    },
    { rootMargin: "100% 0px" },
  );
  observer.observe(host);
  return () => observer.disconnect();
}

type LiveSeaProps = {
  weather: WeatherName;
  /** Stacking within the host: above the poster, under the copy. */
  className?: string;
};

export function LiveSea({ weather, className = "" }: LiveSeaProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const tier = pickTier();
    if (!tier) return;

    let scene: { dispose(): void } | undefined;
    let cancelled = false;
    let cancelNear = () => {};

    const load = () =>
      import("./createScene").then(
        ({ createScene }) => {
          if (cancelled) return;
          scene = createScene({
            canvas,
            host,
            weather,
            tier,
            onLive: () => (host.dataset.scene = "live"),
            onSettled: () => (host.dataset.scene = "settled"),
            onFail: () => delete host.dataset.scene,
          });
        },
        // The chunk never came: the poster is already the page.
        () => {},
      );

    const cancel = whenSettled(() => {
      if (weather === "calm") cancelNear = whenNear(host, load);
      else load();
    });

    return () => {
      cancelled = true;
      cancel();
      cancelNear();
      scene?.dispose();
      delete host.dataset.scene;
    };
  }, [weather]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`${styles.canvas} pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
