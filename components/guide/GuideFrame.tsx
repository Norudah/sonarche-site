import type { ReactNode } from "react";

import { ReadingShell } from "@/components/reading/ReadingShell";
import { GITHUB_URL, type Locale } from "@/lib/site";

import { guideCopy } from "./copy";
import { GuideMenu } from "./GuideMenu";

type GuideFrameProps = {
  locale: Locale;
  alternate: string;
  /** The open guide's id; null on the index. */
  current: string | null;
  children: ReactNode;
};

/* The guide reads as documentation: every guide in a menu on the left, sticky beside the text on
   wide screens, folded above it on narrow ones. */
export function GuideFrame({ locale, alternate, current, children }: GuideFrameProps) {
  const copy = guideCopy[locale];

  return (
    <ReadingShell locale={locale} section="guide" alternate={alternate}>
      <div className="mx-auto flex w-full max-w-[72rem] flex-col px-6 sm:px-10 lg:flex-row lg:gap-14">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pt-10 pb-6">
            <GuideMenu locale={locale} current={current} sections />
          </div>
        </aside>

        <details className="border-separator bg-surface mt-8 rounded-2xl border px-3 py-3 lg:hidden">
          <summary className="text-foreground-strong font-display cursor-pointer px-2.5 text-[0.875rem] font-medium">
            {copy.allGuides}
          </summary>
          <div className="mt-3">
            <GuideMenu locale={locale} current={current} />
          </div>
        </details>

        <div className="w-full max-w-[46rem] min-w-0 pt-10 lg:pt-14">{children}</div>
      </div>
    </ReadingShell>
  );
}

/** The last line of the index and of every guide. */
export function ReportLine({ locale }: { locale: Locale }) {
  const copy = guideCopy[locale];

  return (
    <p className="text-muted mt-6 text-[0.875rem]">
      {copy.reportLead}{" "}
      <a
        href={`${GITHUB_URL}/issues/new`}
        className="text-accent hover:text-accent-strong font-semibold transition-colors hover:underline hover:underline-offset-4"
      >
        {copy.reportLink} <span aria-hidden>↗</span>
      </a>
    </p>
  );
}
