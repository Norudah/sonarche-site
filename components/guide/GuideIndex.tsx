import { blogCopy } from "@/components/blog/copy";
import { DraftBadge } from "@/components/reading/DraftBadge";
import { EntryRow } from "@/components/reading/EntryRow";
import { MetaLine } from "@/components/reading/MetaLine";
import { ReadingIndex } from "@/components/reading/ReadingIndex";
import { readingCopy } from "@/components/reading/copy";
import { BLOG_PATH } from "@/lib/blog";
import { GUIDE_PATH, TOPICS, guidePath, publishedGuides } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { guideCopy } from "./copy";

export const guideIndexMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: GUIDE_PATH,
    title: { absolute: guideCopy[locale].indexSearchTitle },
    shareTitle: guideCopy[locale].indexTitle,
    description: guideCopy[locale].indexDek,
    robots: publishedGuides().length === 0 ? { index: false, follow: true } : undefined,
  });

/* Grouped by topic, not dated: a reader here is looking for one subject. Empty topics don't render. */
export function GuideIndex({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];
  const guides = publishedGuides();

  return (
    <ReadingIndex
      locale={locale}
      section="guide"
      alternate={GUIDE_PATH[OTHER_LOCALE[locale]]}
      title={copy.indexTitle}
      dek={copy.indexDek}
    >
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
                    <EntryRow
                      href={guidePath(guide, locale)}
                      meta={
                        <MetaLine
                          items={[
                            readingCopy[locale].readingTime(guide.minutes),
                            copy.checkedAgainst(guide.appVersion),
                          ]}
                        >
                          {guide.draft && <DraftBadge label={copy.draft} />}
                        </MetaLine>
                      }
                      title={guide.title[locale]}
                      titleAs="h3"
                      description={guide.description[locale]}
                      cta={copy.readGuide}
                    />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </ReadingIndex>
  );
}
