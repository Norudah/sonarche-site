import type { ReactNode } from "react";

import { GUIDE_PATH, type Guide, guidePath } from "@/lib/guide";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { Prose } from "@/components/reading/Prose";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { Toc, TocFolded } from "@/components/reading/Toc";
import { readingCopy } from "@/components/reading/copy";

import { GuideSchema } from "./GuideSchema";
import { guideCopy } from "./copy";

/*
 * Everything a guide is except its words — the guide's counterpart to
 * components/blog/PostPage.
 *
 * Two differences with a post, and both are the point. The line above the title
 * says which version of the app this was checked against rather than when it
 * was written, because that is the question a reader actually has. And it ends
 * on the table of contents rather than on a download button: whoever is reading
 * this already has the app.
 */

type GuidePageProps = {
  guide: Guide;
  locale: Locale;
  children: ReactNode;
};

export function GuidePage({ guide, locale, children }: GuidePageProps) {
  const copy = guideCopy[locale];
  const shared = readingCopy[locale];
  const alternate = guidePath(guide, OTHER_LOCALE[locale]);

  return (
    <ReadingShell locale={locale} section="guide" alternate={alternate}>
      <GuideSchema guide={guide} locale={locale} />

      {/*
       * Three columns so the article stays on the page's own centre line and
       * the summary sits in the margin beside it — the alternative, a two
       * column grid, pushes the text off-centre for everyone whose window is
       * wide. Below `lg` the grid collapses and the Toc renders its folded
       * self above the text instead.
       */}
      <div className="mx-auto grid w-full max-w-[72rem] px-6 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_38rem_minmax(0,1fr)] lg:gap-10">
        <div className="hidden lg:block lg:justify-self-end">
          <Toc locale={locale} />
        </div>

        <article className="w-full min-w-0">
          <header>
            <p className="text-muted flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
              <span>{copy.checkedAgainst(guide.appVersion)}</span>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>{shared.readingTime(guide.minutes)}</span>
              {guide.draft && (
                <span className="border-warning/40 text-warning rounded-full border px-2 py-0.5 text-[0.625rem]">
                  {copy.draft}
                </span>
              )}
            </p>

            <h1 className="text-foreground-strong font-display mt-4 text-[clamp(2rem,5vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.025em]">
              {guide.title[locale]}
            </h1>
          </header>

          <TocFolded locale={locale} />

          <div className="mt-8">
            <Prose>{children}</Prose>
          </div>

          <a
            href={GUIDE_PATH[locale]}
            className="border-separator bg-surface hover:border-accent/40 mt-16 flex items-center justify-between gap-4 rounded-2xl border p-5 transition-colors"
          >
            <span className="text-foreground-strong font-display text-[0.95rem] font-medium">{copy.moreGuides}</span>
            <span aria-hidden className="text-accent">
              →
            </span>
          </a>
        </article>
      </div>
    </ReadingShell>
  );
}
