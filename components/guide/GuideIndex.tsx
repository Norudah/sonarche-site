import { BLOG_PATH } from "@/lib/blog";
import { GUIDE_PATH, TOPICS, type Guide, guidePath, publishedGuides } from "@/lib/guide";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "@/components/blog/copy";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { readingCopy } from "@/components/reading/copy";

import { guideCopy } from "./copy";

/*
 * The guide's front page: a table of contents, grouped by topic.
 *
 * Grouped and not dated, which is the whole difference with the journal's index
 * — someone here is looking for one specific thing, and the order that helps
 * them is by subject, not by when it was written. A topic with nothing in it
 * does not render: the shape of the guide should be what exists, not what is
 * planned.
 */

export function GuideIndex({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];
  const guides = publishedGuides();

  return (
    <ReadingShell locale={locale} section="guide" alternate={GUIDE_PATH[OTHER_LOCALE[locale]]}>
      <div className="mx-auto w-full max-w-[38rem] px-6 pt-16 sm:px-0 sm:pt-24">
        <h1 className="text-foreground-strong font-display text-[clamp(2.25rem,5.5vw,3rem)] leading-[1.1] font-bold tracking-[-0.025em]">
          {copy.indexTitle}
        </h1>
        <p className="text-body mt-4 text-[1.09rem] leading-relaxed">{copy.indexDek}</p>

        {guides.length === 0 ? (
          <div className="border-separator bg-surface mt-14 rounded-2xl border p-7">
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
          TOPICS.map((topic) => {
            const inTopic = guides.filter((guide) => guide.topic === topic);
            if (inTopic.length === 0) return null;

            return (
              <section key={topic} className="mt-14">
                <h2 className="text-muted font-mono text-[0.6875rem] tracking-[0.14em] uppercase">
                  {copy.topics[topic]}
                </h2>

                <ul className="border-separator mt-4 border-t">
                  {inTopic.map((guide) => (
                    <li key={guide.id} className="border-separator border-b">
                      <GuideCard guide={guide} locale={locale} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })
        )}
      </div>
    </ReadingShell>
  );
}

/* A row, like the journal's, minus the date: what tells someone whether this
   page is still true is the app version, not the day it was written. */
function GuideCard({ guide, locale }: { guide: Guide; locale: Locale }) {
  const copy = guideCopy[locale];
  const shared = readingCopy[locale];

  return (
    <a href={guidePath(guide, locale)} className="block py-7">
      <p className="text-muted flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
        <span>{shared.readingTime(guide.minutes)}</span>
        <span aria-hidden className="text-border">
          ·
        </span>
        <span>{copy.checkedAgainst(guide.appVersion)}</span>
        {guide.draft && (
          <span className="border-warning/40 text-warning rounded-full border px-2 py-0.5 text-[0.625rem]">
            {copy.draft}
          </span>
        )}
      </p>

      <h3 className="text-foreground-strong hover:text-accent font-display mt-2 text-[1.4rem] leading-[1.25] font-bold tracking-[-0.02em] transition-colors">
        {guide.title[locale]}
      </h3>

      <p className="text-body mt-2 text-[0.95rem] leading-relaxed">{guide.description[locale]}</p>

      <span className="group/read border-border text-accent hover:border-accent hover:bg-accent hover:text-accent-foreground mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors">
        {copy.readGuide}
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover/read:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
