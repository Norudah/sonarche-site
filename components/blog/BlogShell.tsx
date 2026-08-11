import type { ReactNode } from "react";

import { SonarcheMark } from "@/components/brand/SonarcheMark";
import { BLOG_PATH } from "@/lib/blog";
import { GITHUB_URL, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";

/*
 * The journal's chrome — everything the landing page is not.
 *
 * No storm, no sea, no trace, no GSAP. The landing is a scroll narrative that
 * has to be felt; this is a page someone came to read, and the only job of the
 * frame around the text is to say whose text it is and how to get back to the
 * product. The brand shows up three times and small: the mark in the corner,
 * the accent on links, the tagline at the foot.
 *
 * The language link is static and points at this exact page's translation —
 * every post exists in both languages (see lib/blog.ts), so it never has to
 * degrade to "somewhere on the other side". The landing's scroll-revealed
 * switch stays on the landing: a reading page has a header, so the control
 * belongs in it.
 */

type BlogShellProps = {
  locale: Locale;
  /** The other language's URL for the page being framed. */
  alternate: string;
  children: ReactNode;
};

export function BlogShell({ locale, alternate, children }: BlogShellProps) {
  const copy = blogCopy[locale];
  const other = OTHER_LOCALE[locale];

  return (
    <>
      <header className="border-separator/70 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-[68rem] items-center justify-between px-6 py-3 sm:px-10">
          {/*
           * Centred, not baseline-aligned. The wordmark link is itself a flex
           * container, so its baseline is the mark's bottom edge rather than
           * its text's — align these three on a baseline and the separator and
           * "Journal" sit visibly lower than the brand. Everything on this row
           * is one line tall, so the centre line is the honest axis.
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
            <a
              href={BLOG_PATH[locale]}
              className="hover:text-accent text-muted font-display text-[0.8125rem] leading-none tracking-[0.02em] transition-colors"
            >
              {copy.journal}
            </a>
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

      {/* The waterline again, drained further: the journal's foot is a way out,
          not a second ending. The tagline holds the middle because it is the
          one line that is the same on every page of this site. */}
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
