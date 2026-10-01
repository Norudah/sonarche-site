import { type Locale } from "@/lib/site";

import { Ark } from "@/components/brand/Ark";
import { Onde } from "@/components/brand/Onde";
import { LiveSea } from "@/components/brand/scene/LiveSea";
import scene from "@/components/brand/scene/scene.module.css";
import { DownloadCta } from "@/components/download/DownloadCta";

import { heroCopy } from "./copy";
import styles from "./hero.module.css";
import { Storm, WATERLINE } from "./Storm";

/*
 * The LCP: no entrance animation on the text, so first paint never waits on JavaScript. The CSS
 * storm paints first; on wide screens the WebGL sea (LiveSea) takes over once ready. The stage has
 * a fixed height because the ark, swell and horizon keep proportions to each other, not to the
 * window; the download cluster is built to fit it.
 */

export function Hero({ locale }: { locale: Locale }) {
  const copy = heroCopy[locale];

  return (
    <section
      data-anim-gate
      className="relative isolate h-[845px] overflow-hidden sm:h-[876px]"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.986 0.004 279), oklch(0.972 0.01 279) 55%, oklch(0.93 0.036 279) 100%)",
      }}
    >
      <div className={`${scene.poster} absolute inset-0`}>
        <Storm>
          <div className="absolute inset-0 z-[2]">
            {/* Both offsets put the hull bottom 4px under the waterline. */}
            <Ark
              className="absolute top-[571px] left-1/2 -ml-24 h-48 w-48 sm:top-[496px] sm:-ml-40 sm:h-80 sm:w-80"
              shadow="0 7px 13px oklch(0.4 0.1 277 / 0.16)"
            >
              <Onde />
            </Ark>
          </div>
        </Storm>
      </div>
      <LiveSea weather="storm" waterline={WATERLINE} className="z-[4]" />

      {/* `data-scene-clear`: the live storm's rain parts around this block. */}
      <div
        data-scene-clear
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-8 pt-16 text-center sm:px-15 sm:pt-20"
      >
        <p className="text-accent font-sans text-[0.625rem] font-semibold tracking-[0.2em] sm:text-xs sm:tracking-[0.34em]">
          {copy.badge}
        </p>

        <h1 className="mt-5 flex flex-col items-center">
          <span className="text-foreground-strong font-display text-[clamp(3.25rem,9.6vw,8.625rem)] leading-none font-extrabold tracking-[0.015em]">
            {copy.wordmark}
          </span>
          <span className="text-accent-muted mt-3 font-serif text-[clamp(1.375rem,2.15vw,1.9375rem)] leading-snug italic">
            {copy.tagline}
          </span>
        </h1>

        {/* 38rem: the French subline wraps to a third line at the mockup's 34. */}
        <p className="text-body mt-2.5 max-w-[38rem] text-base leading-relaxed sm:text-[1.09rem]">{copy.subline}</p>

        <div className="mt-6 w-full">
          <DownloadCta locale={locale}>
            <a
              href="#flow"
              className="border-border text-foreground hover:border-accent/50 hover:text-accent bg-surface/70 hover:bg-surface focus-visible:ring-accent/40 focus-visible:ring-offset-background rounded-full border px-6 py-4 text-[0.9375rem] font-medium transition-[translate,scale,border-color,color,background-color,box-shadow] duration-[260ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_12px_26px_oklch(0.32_0.11_277/0.14)] focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.97] active:duration-75 motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors"
            >
              {copy.ctaSecondary}
            </a>
          </DownloadCta>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 z-[5] -translate-x-1/2">
        <p
          className={`${styles.scrollHint} text-accent-muted font-display text-[0.6875rem] font-semibold tracking-[0.24em]`}
        >
          {copy.scrollHint}
        </p>
      </div>
    </section>
  );
}
