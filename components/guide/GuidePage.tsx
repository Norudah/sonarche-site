import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/reading/Breadcrumb";
import { DraftBadge } from "@/components/reading/DraftBadge";
import { MetaLine } from "@/components/reading/MetaLine";
import { Prose } from "@/components/reading/Prose";
import { readingCopy } from "@/components/reading/copy";
import { GUIDE_PATH, type Guide, guidePath, neighbours, publishedGuides } from "@/lib/guide";
import { LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { guideCopy } from "./copy";
import { GuideFrame, ReportLine } from "./GuideFrame";
import { GuideSchema } from "./GuideSchema";

type GuidePageProps = {
  guide: Guide;
  locale: Locale;
  children: ReactNode;
};

/* The whole walkthrough on one scroll, its sections numbered. It ends on the next guide rather
   than a download card: whoever reads a guide already has the app. */
export function GuidePage({ guide, locale, children }: GuidePageProps) {
  const copy = guideCopy[locale];

  return (
    <GuideFrame locale={locale} alternate={guidePath(guide, OTHER_LOCALE[locale])} current={guide.id}>
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

      <article className="min-w-0">
        <header>
          <MetaLine
            items={[
              <a key="topic" href={GUIDE_PATH[locale]} className="text-accent hover:text-accent-strong font-semibold">
                {copy.topics[guide.topic]}
              </a>,
              readingCopy[locale].readingTime(guide.minutes),
            ]}
          >
            {guide.draft && <DraftBadge label={copy.draft} />}
          </MetaLine>
          <h1 className="text-foreground-strong font-display mt-4 text-[clamp(2rem,5vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            {guide.title[locale]}
          </h1>
        </header>

        <div className="mt-8">
          <Prose numbered>{children}</Prose>
        </div>
      </article>

      <Neighbours guide={guide} locale={locale} />
      <ReportLine locale={locale} />
    </GuideFrame>
  );
}

const LABEL = "font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase";

function Neighbours({ guide, locale }: { guide: Guide; locale: Locale }) {
  const copy = guideCopy[locale];
  const { previous, next } = neighbours(publishedGuides(), guide.id);

  return (
    <nav
      aria-label={copy.allGuides}
      className={`mt-16 grid gap-3 ${previous ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]" : ""}`}
    >
      {previous ? (
        <a
          href={guidePath(previous, locale)}
          className="border-separator bg-surface hover:border-accent/40 flex flex-col gap-1.5 rounded-2xl border p-5 transition-colors"
        >
          <span className={`text-muted ${LABEL}`}>← {copy.previous}</span>
          <span className="text-foreground-strong font-display text-[1.05rem] leading-snug font-semibold">
            {previous.title[locale]}
          </span>
        </a>
      ) : null}

      <a
        href={next ? guidePath(next, locale) : GUIDE_PATH[locale]}
        className="group bg-foreground-strong text-accent-foreground flex flex-col items-end gap-1.5 rounded-2xl p-5 text-right"
      >
        <span className={`text-[oklch(0.8_0.08_277)] ${LABEL}`}>
          {next ? copy.next : copy.allGuides}{" "}
          <span
            aria-hidden
            className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          >
            →
          </span>
        </span>
        {next && (
          <>
            <span className="font-display text-[1.15rem] leading-snug font-bold">{next.title[locale]}</span>
            <span className="text-[0.8125rem] text-[oklch(0.85_0.02_279)]">
              {readingCopy[locale].readingTime(next.minutes)}
            </span>
          </>
        )}
      </a>
    </nav>
  );
}
