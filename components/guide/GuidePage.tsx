import type { ReactNode } from "react";

import { ArticleLayout } from "@/components/reading/ArticleLayout";
import { Breadcrumb } from "@/components/reading/Breadcrumb";
import { DraftBadge } from "@/components/reading/DraftBadge";
import { MetaLine } from "@/components/reading/MetaLine";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { readingCopy } from "@/components/reading/copy";
import { GUIDE_PATH, type Guide, guidePath } from "@/lib/guide";
import { LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { GuideSchema } from "./GuideSchema";
import { guideCopy } from "./copy";

type GuidePageProps = {
  guide: Guide;
  locale: Locale;
  children: ReactNode;
};

/* Unlike a post, it shows the app version it was checked against, and ends on the index rather
   than a download card: whoever reads a guide already has the app. */
export function GuidePage({ guide, locale, children }: GuidePageProps) {
  const copy = guideCopy[locale];

  return (
    <ReadingShell locale={locale} section="guide" alternate={guidePath(guide, OTHER_LOCALE[locale])}>
      <GuideSchema guide={guide} locale={locale} />
      {/* A draft is noindex; a breadcrumb naming it could still leak its title into an index. */}
      {!guide.draft && (
        <Breadcrumb
          locale={locale}
          trail={[
            { name: "Sonarche", path: LOCALE_PATH[locale] },
            { name: copy.guide, path: GUIDE_PATH[locale] },
            { name: guide.title[locale], path: guidePath(guide, locale) },
          ]}
        />
      )}

      <ArticleLayout
        locale={locale}
        title={guide.title[locale]}
        meta={
          <MetaLine items={[copy.checkedAgainst(guide.appVersion), readingCopy[locale].readingTime(guide.minutes)]}>
            {guide.draft && <DraftBadge label={copy.draft} />}
          </MetaLine>
        }
        end={
          <a
            href={GUIDE_PATH[locale]}
            className="border-separator bg-surface hover:border-accent/40 mt-16 flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors"
          >
            <span className="text-foreground-strong font-display text-[0.95rem] font-medium">{copy.moreGuides}</span>
            <span aria-hidden className="text-accent">
              →
            </span>
          </a>
        }
      >
        {children}
      </ArticleLayout>
    </ReadingShell>
  );
}
