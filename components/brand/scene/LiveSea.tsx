"use client";

import { useEffect, useRef, useState } from "react";

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
 * frame it flags its host: the loader drawn in the poster's place (sonar rings
 * on flat water) bows out and the sea deploys from where it pinged
 * (scene.module.css). While it loads, the host is flagged `loading`, which
 * holds the loader in place however long that takes: a visitor whose machine
 * can run the scene never sees the poster first. Only a scene that cannot run
 * at all (no WebGL, a chunk that never lands, a shader that does not compile)
 * flags the host `off` and shows the poster. A slow machine keeps the scene at
 * a lower resolution (createScene.ts), and a GPU that takes its context back
 * gets the scene rebuilt on a fresh canvas.
 *
 * The host is the canvas's parent: the element the poster fills. The harbour,
 * at the foot of the page, is only built once the visitor is on their way to
 * it — a scene nobody scrolls to is GPU memory held for nothing. Both share
 * one chunk, so the second costs no download.
 *
 * The effect is here because the scene is an external system with a lifetime
 * of its own: it is created once, and disposed of on unmount and on HMR.
 */

const HIGH: Tier = { pixelRatio: 2, antialias: true, density: 1, rain: 520, pixels: 60 };
const LOW: Tier = { pixelRatio: 1.5, antialias: true, density: 0.7, rain: 320, pixels: 40 };

type NavigatorHints = Navigator & { deviceMemory?: number };

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
 * Reduced motion never gets it: the poster already settles for them.
 * Everyone else on a wide screen does, whatever the power state or the data
 * saver says (decided 2026-09-30: the scene is the page's arrival, and a
 * visitor on battery is still the visitor it is for). What the browser says
 * about the machine only picks the tier, and the watchdog in createScene.ts
 * lowers the resolution of a tier that turns out to be optimistic rather than
 * giving up. The rain and pixel counts only mean anything to the storm.
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
