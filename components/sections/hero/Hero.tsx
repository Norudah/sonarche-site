import { GITHUB_URL, type Locale } from "@/lib/site";

import { heroCopy } from "./copy";
import styles from "./hero.module.css";
import { HeroArk } from "./HeroArk";
import { Onde } from "./Onde";
import { Storm } from "./Storm";

/*
 * The hero — the LCP of the whole site, so it ships no JavaScript at all.
 *
 * No entrance animation on the text, deliberately: revealing an h1 from
 * opacity 0 hands the LCP to whenever the bundle lands, and leaves the page
 * blank if it never does. The motion here is ambient and CSS-only (Storm,
 * HeroArk, Onde); GSAP starts at the section below, where nothing is at stake.
 *
 * The h1 carries both the wordmark and the tagline, so the page has one heading
 * that reads as a sentence — "Sonarche. From the stream into the Ark." — rather
 * than a lone brand word.
 *
 * Geometry is the mockup's: a fixed 860px stage with the waterline 160px above
 * its bottom edge, the ark berthed on it, and the gradient darkening into the
 * water. Fixed rather than viewport-height because the composition is a drawing
 * — the ark, the swell and the horizon have to keep their proportions to each
 * other, not to the window. (Mobile gets its own pass.)
 */

export function Hero({ locale }: { locale: Locale }) {
  const copy = heroCopy[locale];

  return (
    <section
      className="relative isolate h-[825px] overflow-hidden sm:h-[860px]"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.986 0.004 279), oklch(0.972 0.01 279) 55%, oklch(0.93 0.036 279) 100%)",
      }}
    >
      <Storm>
        <div className="absolute inset-0 z-[2]">
          {/* Narrower and lower on a phone: the text block above it is twice as
              tall there, and a 320px ark in a 375px viewport is a bath toy. */}
          <HeroArk
            className="absolute top-[500px] left-1/2 -ml-24 h-48 w-48 sm:top-[430px] sm:-ml-40 sm:h-80 sm:w-80"
            style={{ filter: "drop-shadow(0 20px 24px oklch(0.4 0.12 277 / 0.2))" }}
          />
          {/* The equalizer keeps its 26px whatever the ark's size, so its offset
              is not simply scaled — on mobile it has to clear a head that sits
              proportionally higher in a smaller box. */}
          <Onde className="absolute top-[524px] left-1/2 z-[5] -ml-[23px] sm:top-[500px]" />
        </div>
      </Storm>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-8 pt-16 text-center sm:px-15 sm:pt-26">
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

        <div className="mt-6 flex w-full max-w-xs flex-col items-stretch gap-3.5 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <a
            href={GITHUB_URL}
            className="bg-accent text-accent-foreground font-display hover:bg-accent-strong rounded-full px-7.5 py-4 text-base font-semibold shadow-[0_8px_24px_oklch(0.505_0.185_277/0.28)] transition-colors"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href="#flow"
            className="border-border text-foreground hover:bg-surface bg-surface/70 rounded-full border px-6 py-4 text-[0.9375rem] font-medium transition-colors"
          >
            {copy.ctaSecondary}
          </a>
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
