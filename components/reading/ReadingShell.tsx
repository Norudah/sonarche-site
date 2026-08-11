import type { ReactNode } from "react";

import { SonarcheMark } from "@/components/brand/SonarcheMark";
import { blogCopy } from "@/components/blog/copy";
import { guideCopy } from "@/components/guide/copy";
import { BLOG_PATH } from "@/lib/blog";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { GITHUB_URL, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { readingCopy } from "./copy";

/*
 * The frame around anything on this site that is meant to be read — the journal
 * and the guide, and whatever else ends up being prose on a page.
 *
 * Everything the landing page is not: no storm, no sea, no trace, no GSAP. The
 * landing is a scroll narrative that has to be felt; these are pages someone
 * came to read, and the only job of the frame is to say whose text it is and
 * how to get back to the product. The brand shows up three times and small: the
 * mark in the corner, the accent on links, the tagline at the foot.
 *
 * The language link is static and points at this exact page's translation —
 * every post and every guide exists in both languages, so it never has to
 * degrade to "somewhere on the other side". The landing's scroll-revealed
 * switch stays on the landing: a reading page has a header, so the control
 * belongs in it.
 */

export type ReadingSection = "journal" | "guide";

type ReadingShellProps = {
  locale: Locale;
  /** Which of the two the page belongs to. The header shows both. */
  section: ReadingSection;
  /** The other language's URL for the page being framed. */
  alternate: string;
  children: ReactNode;
};

export function ReadingShell({ locale, section, alternate, children }: ReadingShellProps) {
  const copy = readingCopy[locale];
  const other = OTHER_LOCALE[locale];

  /*
   * Both sections in the header, always — that is what makes them read as two
   * rooms of one place rather than two pages that happen to share a stylesheet.
   * The guide joins the moment it has something published, on the same rule as
   * the landing's footer link: a tab into an empty section is worse than no tab.
   */
  const sections = [
    { key: "journal" as const, label: blogCopy[locale].journal, href: BLOG_PATH[locale] },
    ...(publishedGuides().length > 0
      ? [{ key: "guide" as const, label: guideCopy[locale].guide, href: GUIDE_PATH[locale] }]
      : []),
  ];

  return (
    <>
      <header className="border-separator/70 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-[68rem] items-center justify-between px-6 py-3 sm:px-10">
          {/*
           * Centred, not baseline-aligned. The wordmark link is itself a flex
           * container, so its baseline is the mark's bottom edge rather than
           * its text's — align these three on a baseline and the separator and
           * the section name sit visibly lower than the brand. Everything on
           * this row is one line tall, so the centre line is the honest axis.
           */}
          <div className="flex items-center gap-2.5">
            <a
              href={LOCALE_PATH[locale]}
              className="hover:text-foreground-strong text-foreground flex items-center gap-2 transition-colors"
            >
              <SonarcheMark className="h-5 w-5" />
              <span className="font-display text-[0.8125rem] leading-none font-medium tracking-[0.14em]">
                {copy.wordmark}
              </span>
            </a>
            <span aria-hidden className="text-border leading-none">
              ·
            </span>

            <nav aria-label={copy.sections} className="flex items-center gap-3.5">
              {sections.map((entry) => (
                <a
                  key={entry.key}
                  href={entry.href}
                  aria-current={entry.key === section ? "page" : undefined}
                  className={`font-display text-[0.8125rem] leading-none tracking-[0.02em] transition-colors ${
                    entry.key === section ? "text-foreground-strong font-medium" : "text-muted hover:text-accent"
                  }`}
                >
                  {entry.label}
                </a>
              ))}
            </nav>
          </div>

          <a
            href={alternate}
            hrefLang={other}
            className="hover:text-accent text-muted font-mono text-[0.625rem] leading-none font-medium tracking-[0.14em] uppercase transition-colors"
          >
            {other}
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      {/* The waterline again, drained further: a reading page's foot is a way
          out, not a second ending. The tagline holds the middle because it is
          the one line that is the same on every page of this site. */}
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
