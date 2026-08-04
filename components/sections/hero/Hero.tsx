import { type Locale } from "@/lib/site";

import { Ark } from "@/components/brand/Ark";
import { Onde } from "@/components/brand/Onde";
import { DownloadCta } from "@/components/download/DownloadCta";

import { heroCopy } from "./copy";
import styles from "./hero.module.css";
import { Storm } from "./Storm";

/*
 * The hero — the LCP of the whole site, so it ships no JavaScript at all.
 *
 * No entrance animation on the text, deliberately: revealing an h1 from
 * opacity 0 hands the LCP to whenever the bundle lands, and leaves the page
 * blank if it never does. The motion here is ambient and CSS-only (Storm,
 * Ark, Onde); GSAP starts at the section below, where nothing is at stake.
 *
 * The h1 carries both the wordmark and the tagline, so the page has one heading
 * that reads as a sentence — "Sonarche. From the stream into the Ark." — rather
 * than a lone brand word.
 *
 * Geometry is the mockup's, with the sea taken down 50px from it: the waterline
 * sits 110px above the stage's bottom edge, the ark is berthed on it, and the
 * gradient darkens into the water. The mockup's higher horizon left the vessel
 * crowding the buttons — it needs sky over it to read as sailing rather than as
 * parked. Fixed rather than viewport-height because the composition is a
 * drawing: the ark, the swell and the horizon have to keep their proportions to
 * each other, not to the window.
 *
 * The stage is the one it always was, and the download cluster was built to fit
 * it rather than the other way round: the platform marks let the "Download for
 * macOS" heading go, and the note shares a line with the disclosure. Growing
 * this instead pushes the waterline down and takes the scroll hint under the
 * fold on a laptop — which is the whole bottom of the composition. Anything
 * added to the cluster is paid for inside it.
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
      <Storm>
        <div className="absolute inset-0 z-[2]">
          {/* Narrower and lower on a phone: the text block above it is twice as
              tall there, and a 320px ark in a 375px viewport is a bath toy.
              Both offsets put the hull bottom 4px under the waterline. */}
          <Ark
            className="absolute top-[571px] left-1/2 -ml-24 h-48 w-48 sm:top-[496px] sm:-ml-40 sm:h-80 sm:w-80"
            shadow="0 7px 13px oklch(0.4 0.1 277 / 0.16)"
          >
            <Onde />
          </Ark>
        </div>
      </Storm>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-8 pt-16 text-center sm:px-15 sm:pt-20">
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

        {/* 38rem, not the mockup's 34: the French subline is longer and a third
            line pushed the buttons down onto the equalizer. */}
        <p className="text-body mt-2.5 max-w-[38rem] text-base leading-relaxed sm:text-[1.09rem]">{copy.subline}</p>

        {/* The one exception to this section's no-JavaScript rule, and it earns
            it: the button has to read the machine it is on. It renders its final
            geometry on the server — a working link to the releases page — and
            only its label and href change once mounted, so the LCP never waits
            on the bundle and a hydration that never comes costs nothing. */}
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

      {/* Pinned to the very bottom edge, not floating in the band: the next
          section adds its own 104px of air below, and anything higher than this
          read as centred in that void rather than as the end of the hero. */}
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
