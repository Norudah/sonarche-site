import { Ark } from "@/components/brand/Ark";
import { Onde } from "@/components/brand/Onde";
import { GITHUB_URL, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { footerCopy } from "./copy";

/*
 * The last call, and the ark at rest.
 *
 * The page opened on a vessel in a storm and closes on the same vessel in calm
 * water — same drawing, same loops, no rain. That is the whole narrative in two
 * pictures, and it is why the ark is a shared component rather than the hero's.
 *
 * The language switch lives here rather than in a header: a static export cannot
 * redirect on Accept-Language, so the swap has to be visible somewhere, and the
 * foot of the page is where someone who has read it will look.
 */

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale];
  const other = OTHER_LOCALE[locale];

  return (
    <footer
      className="relative overflow-hidden pt-24 sm:pt-26"
      style={{
        background: "linear-gradient(180deg, oklch(0.982 0.006 279 / 0), oklch(0.972 0.012 277 / 0.82) 60%)",
      }}
    >
      <div className="relative z-10 flex flex-col items-center px-8 text-center sm:px-15">
        <h2 className="text-foreground-strong font-display flex max-w-[46rem] flex-col text-[clamp(2rem,4.1vw,3.625rem)] leading-[1.15] font-bold tracking-[-0.02em]">
          <span>{copy.headingBefore}</span>
          <em className="text-accent font-serif text-[1.08em] leading-none italic">{copy.headingEmphasis}</em>
        </h2>

        <p className="text-body mt-4 max-w-[32.5rem] text-[1.09rem] leading-relaxed">{copy.body}</p>

        <a
          href={GITHUB_URL}
          className="bg-accent text-accent-foreground font-display hover:bg-accent-strong mt-8 rounded-full px-8.5 py-4.25 text-base font-semibold shadow-[0_8px_24px_oklch(0.505_0.185_277/0.28)] transition-colors"
        >
          {copy.cta}
        </a>

        <ul className="mt-8.5 flex flex-wrap justify-center gap-2.5">
          {copy.builtWith.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-[oklch(0.88_0.012_279)] bg-white px-3.25 py-2 font-mono text-xs font-medium text-[oklch(0.42_0.03_279)]"
            >
              {tool}
            </li>
          ))}
        </ul>

        <p className="text-muted mt-4 text-[0.8125rem]">{copy.license}</p>

        <p className="mt-3 max-w-[32.5rem] text-[0.78125rem] leading-[1.6] text-[oklch(0.58_0.02_279)]">
          {copy.personalUse}
        </p>
      </div>

      <div className="relative z-10 mx-auto mt-16 flex max-w-[80rem] flex-col items-center gap-4 px-8 py-5 sm:px-15 md:flex-row md:justify-between">
        <p className="font-display text-foreground-strong text-sm font-semibold tracking-[0.04em]">{copy.wordmark}</p>

        <p className="font-serif text-[0.9375rem] text-[oklch(0.5_0.05_277)] italic">{copy.tagline}</p>

        <div className="flex items-center gap-4">
          <a
            href={LOCALE_PATH[other]}
            hrefLang={other}
            className="text-muted hover:text-accent text-[0.8125rem] font-medium transition-colors"
          >
            {copy.otherLanguage}
          </a>
          <a href={GITHUB_URL} className="text-accent text-[0.8125rem] font-medium hover:underline">
            {copy.github}
          </a>
        </div>
      </div>

      {/* The ark, home. No storm, no rain — the sea it sits in is the section's
          own gradient, and the only thing still moving is the music. */}
      <div aria-hidden className="relative h-[18.75rem]">
        <Ark
          className="absolute bottom-[3.625rem] left-1/2 h-[14.375rem] w-[14.375rem] -translate-x-1/2"
          style={{ filter: "drop-shadow(0 18px 20px oklch(0.35 0.12 277 / 0.22))" }}
        />
        <Onde className="absolute top-11 left-1/2 z-[4] -ml-[23px]" />
      </div>
    </footer>
  );
}
