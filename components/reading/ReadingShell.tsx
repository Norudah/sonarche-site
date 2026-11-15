import type { ReactNode } from "react";

import { SiteNav } from "@/components/layout/nav/SiteNav";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { GITHUB_URL, LOCALE_PATH, type Locale } from "@/lib/site";

import { readingCopy } from "./copy";

/* The frame for the journal and the guide: no storm, no sea, no GSAP. The bar is the landing's. */

export type ReadingSection = "journal" | "guide";

type ReadingShellProps = {
  locale: Locale;
  section: ReadingSection;
  /** The other language's URL for the page being framed. */
  alternate: string;
  children: ReactNode;
};

export function ReadingShell({ locale, section, alternate, children }: ReadingShellProps) {
  const copy = readingCopy[locale];

  return (
    <>
      <SiteNav
        locale={locale}
        current={section}
        alternate={alternate}
        guideHref={publishedGuides().length > 0 ? GUIDE_PATH[locale] : null}
      />

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-separator/70 mt-24 border-t">
        <div className="text-muted mx-auto flex max-w-[68rem] flex-col items-center gap-2 px-6 py-6 text-[0.6875rem] sm:px-10 md:grid md:grid-cols-3 md:items-center">
          <a href={LOCALE_PATH[locale]} className="hover:text-accent transition-colors">
            ← {copy.backToSite}
          </a>

          <p className="font-serif text-[0.8125rem] text-[oklch(0.5_0.05_277)] italic md:justify-self-center">
            {copy.tagline}
          </p>

          <a
            href={GITHUB_URL}
            className="hover:text-accent transition-colors md:justify-self-end"
            rel="noreferrer"
            target="_blank"
          >
            GitHub ↗
          </a>
        </div>
      </footer>
    </>
  );
}
