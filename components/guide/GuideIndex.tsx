import { blogCopy } from "@/components/blog/copy";
import { DraftBadge } from "@/components/reading/DraftBadge";
import { UnderConstruction } from "@/components/reading/UnderConstruction";
import { readingCopy } from "@/components/reading/copy";
import { BLOG_PATH } from "@/lib/blog";
import { GUIDE_PATH, type Guide, guidePath, publishedGuides } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { guideCopy } from "./copy";
import { GuideFrame, ReportLine } from "./GuideFrame";

export const guideIndexMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: GUIDE_PATH,
    title: { absolute: guideCopy[locale].indexSearchTitle },
    shareTitle: guideCopy[locale].indexTitle,
    description: guideCopy[locale].indexDek,
    robots: publishedGuides().length === 0 ? { index: false, follow: true } : undefined,
  });

export function GuideIndex({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];
  const guides = publishedGuides();

  return (
    <GuideFrame locale={locale} alternate={GUIDE_PATH[OTHER_LOCALE[locale]]} current={null}>
      <h1 className="text-foreground-strong font-display text-[clamp(2.25rem,5vw,3rem)] leading-[1.05] font-bold tracking-[-0.03em]">
        {copy.indexHeading}
      </h1>
      <p className="text-body mt-4 max-w-[36rem] text-[1.09rem] leading-relaxed">{copy.indexDek}</p>
      <UnderConstruction locale={locale}>{copy.construction}</UnderConstruction>

      {guides.length === 0 ? (
        <div className="border-separator bg-surface mt-10 rounded-2xl border p-7">
          <p className="text-foreground-strong font-display text-[1.15rem] font-bold tracking-[-0.01em]">
            {copy.emptyTitle}
          </p>
          <p className="text-body mt-2 text-[0.95rem] leading-relaxed">{copy.emptyBody}</p>
          <a
            href={BLOG_PATH[locale]}
            className="text-accent hover:text-accent-strong mt-4 inline-flex items-center gap-1.5 text-[0.95rem] font-medium transition-colors hover:underline hover:underline-offset-4"
          >
            {blogCopy[locale].indexTitle}
            <span aria-hidden>→</span>
          </a>
        </div>
      ) : (
        <>
          <StartCard guide={guides[0]} locale={locale} />

          <h2 className="text-muted mt-12 mb-4 font-mono text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
            {copy.allGuides}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.id} className="flex">
                <a
                  href={guidePath(guide, locale)}
                  className="group border-separator bg-surface hover:border-accent/40 flex w-full flex-col gap-2 rounded-2xl border p-5 transition-colors"
                >
                  <span className="text-accent font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase">
                    {copy.topics[guide.topic]}
                  </span>
                  <h3 className="text-foreground-strong font-display group-hover:text-accent text-[1.125rem] leading-snug font-semibold transition-colors">
                    {guide.title[locale]}
                  </h3>
                  <span className="text-body text-[0.875rem] leading-relaxed">{guide.description[locale]}</span>
                  <span className="text-muted mt-auto flex items-center gap-2 pt-1 font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
                    {readingCopy[locale].readingTime(guide.minutes)}
                    {guide.draft && <DraftBadge label={copy.draft} />}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <ReportLine locale={locale} />
    </GuideFrame>
  );
}

/* Sonar rings off the right edge: the app's own metaphor, in the accent, on its soft tint. */
const RINGS = [60, 110, 160, 210, 260];

function StartCard({ guide, locale }: { guide: Guide; locale: Locale }) {
  return (
    <a
      href={guidePath(guide, locale)}
      className="group border-accent/20 bg-accent-soft hover:border-accent/50 relative mt-9 grid items-center gap-5 overflow-hidden rounded-[1.25rem] border p-7 transition-colors sm:grid-cols-[minmax(0,1fr)_auto]"
    >
      <svg
        aria-hidden
        viewBox="0 0 320 300"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute inset-y-0 right-0 h-full w-3/5"
      >
        {RINGS.map((r, i) => (
          <circle
            key={r}
            cx="300"
            cy="150"
            r={r}
            fill="none"
            className="stroke-accent"
            strokeOpacity={0.34 - i * 0.06}
            strokeWidth="1.5"
          />
        ))}
        <circle cx="300" cy="150" r="7" className="fill-accent" />
        <circle cx="196" cy="96" r="4.5" className="fill-accent" />
      </svg>

      <span className="relative">
        <span className="text-accent block font-mono text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">
          {guideCopy[locale].startHere}
        </span>
        <span className="text-foreground-strong font-display mt-2 block text-[1.625rem] leading-tight font-bold tracking-[-0.02em]">
          {guide.title[locale]}
        </span>
        <span className="text-body mt-2 block max-w-[30rem] text-[0.95rem] leading-relaxed">
          {guide.description[locale]}
        </span>
      </span>

      <span className="bg-accent text-accent-foreground relative justify-self-start rounded-full px-4.5 py-2.5 text-[0.875rem] font-semibold whitespace-nowrap shadow-[0_10px_24px_-12px_oklch(0.505_0.185_277/0.7)] sm:justify-self-auto">
        {readingCopy[locale].readingTime(guide.minutes)}{" "}
        <span
          aria-hidden
          className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
