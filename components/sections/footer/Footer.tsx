import { Ark } from "@/components/brand/Ark";
import { Onde } from "@/components/brand/Onde";
import { SeaBody } from "@/components/brand/sea/SeaBody";
import { SeaLayer } from "@/components/brand/sea/SeaLayer";
import { buildSea, SEA_CALM } from "@/components/brand/sea/sea";
import { TraceSegment } from "@/components/trace/TraceSegment";
import { AUTHOR, GITHUB_URL, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { footerCopy } from "./copy";

/*
 * The last call, and the ark at rest.
 *
 * The page opened on a vessel in a storm and closes on the same vessel in home
 * water — same drawing, same sea, no rain and half the swell. That is the whole
 * narrative in two pictures, and it is why both the ark and the water are shared
 * components rather than the hero's.
 *
 * The language switch lives here rather than in a header: a static export cannot
 * redirect on Accept-Language, so the swap has to be visible somewhere, and the
 * foot of the page is where someone who has read it will look.
 */

/*
 * The surface, in px above the harbour's bottom edge. The ark's hull bottoms out
 * 96px up, so the waterline is 4px into it — the same bite the hero takes out of
 * the hull, which is what makes the vessel float rather than sit on a line.
 */
const WATERLINE = 92;

/*
 * Where the page-long trace ends, in px from the footer's top edge — just above
 * the last call, inside the section's own top padding. It arrives faded out
 * rather than cut: the ramp is the trace's business, not this section's.
 */
const LANDFALL = 68;

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];
  const other = OTHER_LOCALE[locale];
  const sea = buildSea(SEA_CALM, WATERLINE);

  return (
    <footer
      className="relative isolate overflow-hidden pt-24 sm:pt-26"
      style={{
        background: "linear-gradient(180deg, oklch(0.982 0.006 279 / 0), oklch(0.972 0.012 277 / 0.82) 60%)",
      }}
    >
      {/* The trace comes to rest in the footer's top padding, above the
          heading. Its box only has to contain that point — everything below is
          past the end of the line. See components/trace. */}
      <TraceSegment end={LANDFALL} className="absolute inset-x-0 top-0 z-[-1] h-[12.5rem]" />
      <div className="relative z-10 flex flex-col items-center px-8 text-center sm:px-15">
        <h2 className="text-foreground-strong font-display flex max-w-[46rem] flex-col text-[clamp(2rem,4.1vw,3.625rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-4 max-w-[32.5rem] text-[1.09rem] leading-relaxed">{copy.body}</p>

        <a
          href={GITHUB_URL}
          className="bg-accent text-accent-foreground font-display hover:bg-accent-strong focus-visible:ring-accent/40 focus-visible:ring-offset-background mt-8 rounded-full px-8.5 py-4.25 text-base font-semibold shadow-[0_8px_24px_oklch(0.505_0.185_277/0.28)] transition-[translate,scale,box-shadow,background-color] duration-[260ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] outline-none hover:-translate-y-1 hover:scale-[1.05] hover:shadow-[0_18px_38px_oklch(0.505_0.185_277/0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.96] active:shadow-[0_4px_12px_oklch(0.505_0.185_277/0.3)] active:duration-75 motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:transition-colors"
        >
          {copy.cta}
        </a>

        <p className="text-muted mt-8 text-[0.8125rem]">{copy.license}</p>

        <p className="mt-3 max-w-[32.5rem] text-[0.78125rem] leading-[1.6] text-[oklch(0.58_0.02_279)]">
          {copy.personalUse}
        </p>
      </div>

      {/*
       * The ark, home. The hero's sea, calmed: no rain, no crests, a swell that
       * barely breathes.
       *
       * The colophon sits down here, in the water, rather than on a rule above
       * the harbour. It was taking a strip of paper the vessel needed — with it
       * moved, the ark gets that air back and the page ends on one picture
       * instead of a picture with a caption bar bolted over it.
       */}
      <div className="relative mt-10 h-[19.5rem]" style={sea.style}>
        <div aria-hidden>
          {/* The water itself: the section's gradient stops at paper, so without
              a body of its own the swell would stand on nothing. */}
          <SeaBody body={sea.body} />

          <SeaLayer bars={sea.deep} deep />
          <SeaLayer bars={sea.back} />

          <Ark
            className="absolute bottom-[3.625rem] left-1/2 z-[2] h-[14.375rem] w-[14.375rem] -translate-x-1/2"
            shadow="0 6px 12px oklch(0.38 0.1 277 / 0.16)"
          >
            <Onde />
          </Ark>

          <SeaLayer bars={sea.front} className="z-[3]" />
        </div>

        {/* A waterline, not a footer bar: it is the last thing on the page and
            the least important, so it is set a step below body scale and drained
            of most of its contrast. The language switch keeps a hair more weight
            than the rest of the line — it is the only control down here. */}
        <div className="absolute inset-x-0 bottom-0 z-[4] mx-auto flex max-w-[80rem] flex-col items-center gap-2 px-8 pb-4 text-[0.6875rem] sm:px-15 md:flex-row md:justify-between">
          {/* The signature rides with the wordmark rather than standing on its
              own: it is an attribution of the thing just named, not a fourth
              item competing with the tagline and the two links. One line, the
              colophon's own size, the name a link to the profile — the product
              is the subject and the author is the signature. */}
          <p className="flex items-baseline gap-2 text-[oklch(0.52_0.03_279)]">
            <span className="font-display font-medium tracking-[0.12em] text-[oklch(0.42_0.03_279)]">
              {copy.wordmark}
            </span>
            <span aria-hidden>·</span>
            <a
              href={AUTHOR.url}
              rel="author"
              className="hover:text-accent transition-colors hover:underline hover:underline-offset-3"
            >
              {copy.signature}
            </a>
          </p>

          <p className="font-serif text-[0.8125rem] text-[oklch(0.5_0.05_277)] italic">{copy.tagline}</p>

          <div className="flex items-center gap-3.5">
            <a
              href={LOCALE_PATH[other]}
              hrefLang={other}
              className="hover:text-accent font-medium text-[oklch(0.48_0.03_279)] underline decoration-[oklch(0.48_0.03_279/0.35)] underline-offset-3 transition-colors hover:decoration-current"
            >
              {copy.otherLanguage}
            </a>
            <a
              href={GITHUB_URL}
              className="hover:text-accent-strong text-[oklch(0.48_0.03_279)] transition-colors hover:underline hover:underline-offset-3"
            >
              {copy.github}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
