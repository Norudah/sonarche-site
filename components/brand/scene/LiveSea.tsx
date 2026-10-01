"use client";

import { useEffect, useRef, useState } from "react";

import type { Tier } from "./createScene";
import styles from "./scene.module.css";
import type { WeatherName } from "./weather";

/*
 * Mounts a canvas over a CSS poster and, once the page is idle, loads the WebGL chunk. The host is
 * flagged `loading` (a sonar loader holds), then `live` on the first frame, or `off` when the scene
 * cannot run, which reveals the poster. A lost GPU context rebuilds the scene; the footer's sea is
 * only built once the visitor heads there.
 */

const HIGH: Tier = { pixelRatio: 2, antialias: true, density: 1, rain: 520, pixels: 60 };
const LOW: Tier = { pixelRatio: 1.5, antialias: true, density: 0.7, rain: 320, pixels: 40 };

type NavigatorHints = Navigator & { deviceMemory?: number };

/*
 * Wide screens only: on a phone the scene cost a 5s main-thread block under Lighthouse for a sea
 * filling a fifth of the screen. Never under reduced motion. Power state and data saver only pick
 * the tier (decided 2026-09-30); the watchdog lowers resolution rather than giving up.
 */
const WIDE = "(min-width: 64rem)";

function pickTier(): Tier | null {
  if (!window.matchMedia(WIDE).matches) return null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const nav = navigator as NavigatorHints;
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
  /** The poster's waterline, px above the host's bottom edge: where the loader pings. */
  waterline: number;
  /** Stacking within the host: above the poster, under the copy. */
  className?: string;
};

/** Context losses the scene is rebuilt after before the poster takes over. */
const REBUILDS = 3;

/** The loader's equalizer: the Onde's delays, so it plays the same tune. */
const BARS = ["-0.1s", "-0.35s", "-0.6s", "-0.2s", "-0.5s"];

export function LiveSea({ weather, waterline, className = "" }: LiveSeaProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Bumped when the GPU drops the context: a new key is a new canvas, and a
  // lost context cannot be taken back on the old one.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const tier = pickTier();
    if (!tier) {
      // Not for this visitor: the poster, straight away.
      host.dataset.scene = "off";
      return () => delete host.dataset.scene;
    }

    let scene: { dispose(): void } | undefined;
    let cancelled = false;
    let cancelNear = () => {};
    // From here on JavaScript owns the handover: the loader stays until the
    // scene is live, and the CSS timer that would bring the poster in is off.
    if (host.dataset.scene !== "live" && host.dataset.scene !== "settled") host.dataset.scene = "loading";

    const load = () =>
      import("./createScene").then(
        ({ createScene }) => {
          if (cancelled) return;
          try {
            scene = createScene({
              canvas,
              host,
              weather,
              tier,
              onLive: () => (host.dataset.scene = "live"),
              onSettled: () => (host.dataset.scene = "settled"),
              onFail: () => (host.dataset.scene = "off"),
              onLost: () => {
                if (generation >= REBUILDS) host.dataset.scene = "off";
                else setGeneration((g) => g + 1);
              },
            });
          } catch {
            // A scene that throws on the way up is a scene that gave up: the poster, now.
            host.dataset.scene = "off";
          }
        },
        // The chunk never came: the poster, now.
        () => (host.dataset.scene = "off"),
      );

    // A rebuild after a lost context loads straight away: the page is settled.
    let cancel = () => {};
    if (generation) load();
    else
      cancel = whenSettled(() => {
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
  }, [weather, generation]);

  return (
    <>
      <canvas
        key={generation}
        ref={ref}
        aria-hidden
        className={`${styles.canvas} pointer-events-none absolute inset-0 h-full w-full ${className}`}
      />
      <div aria-hidden className={styles.loader} style={{ bottom: waterline }}>
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.equalizer}>
          {BARS.map((delay) => (
            <span key={delay} style={{ animationDelay: delay }} />
          ))}
        </span>
      </div>
    </>
  );
}
