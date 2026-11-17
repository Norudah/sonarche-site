"use client";

import { useEffect, useState } from "react";

import { SonarcheMark } from "@/components/brand/SonarcheMark";
import { PlatformMark } from "@/components/download/icons";
import { BUILDS_FOR } from "@/components/download/platform";
import { hrefFor, useLatestRelease } from "@/components/download/useLatestRelease";
import { usePlatform } from "@/components/download/usePlatform";
import { BLOG_PATH } from "@/lib/blog";
import { LOCALE_PATH, RELEASES_URL, type Locale } from "@/lib/site";

import { navCopy } from "./copy";
import { LocaleLinks } from "./LocaleLinks";

/*
 * One bar for the whole site. On the landing it stays out of the way over the hero, whose own
 * wordmark and download button already do this job: it slides in once the hero has scrolled off
 * from under it and leaves when the visitor scrolls back up. Rendered from the start, inert while
 * hidden, so it slides instead of popping. On the reading pages it simply sticks to the top.
 */

type SiteNavProps = {
  locale: Locale;
  /** Null until a guide is published: the link joins with the first one, as in the footer. */
  guideHref: string | null;
  /** The landing: hidden over the hero. */
  afterHero?: boolean;
  /** The reading section this page belongs to, marked in ink. */
  current?: "journal" | "guide";
  /** The other language's URL for this page; the landing's by default. */
  alternate?: string;
};

export function SiteNav({ locale, guideHref, afterHero = false, current, alternate }: SiteNavProps) {
  const copy = navCopy[locale];
  const [shown, setShown] = useState(!afterHero);
  const platform = usePlatform();
  const release = useLatestRelease();
  const build = platform ? BUILDS_FOR[platform][0] : undefined;

  useEffect(() => {
    const hero = afterHero ? document.querySelector("[data-hero]") : null;
    if (!hero) return;
    // The top margin is the bar's height: the bar arrives as the hero's last pixel leaves it.
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [afterHero]);

  return (
    <header
      inert={!shown}
      className={`border-separator/70 bg-background/80 ${afterHero ? "fixed inset-x-0" : "sticky"} top-0 z-50 border-b backdrop-blur-md transition-[translate,opacity] duration-400 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[75rem] items-center justify-between gap-4 px-5 sm:px-10">
        <a
          href={LOCALE_PATH[locale]}
          className="hover:text-foreground-strong text-foreground flex items-center gap-2 transition-colors"
        >
          <SonarcheMark className="h-6 w-6" />
          <span className="font-display hidden text-[0.8125rem] leading-none font-medium tracking-[0.14em] sm:inline">
            {copy.wordmark}
          </span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label={copy.label} className="flex items-center gap-4 sm:gap-5">
            {guideHref && (
              <a
                href={guideHref}
                aria-current={current === "guide" ? "page" : undefined}
                className={link(current === "guide")}
              >
                {copy.guide}
              </a>
            )}
            <a
              href={BLOG_PATH[locale]}
              aria-current={current === "journal" ? "page" : undefined}
              className={link(current === "journal")}
            >
              {copy.journal}
            </a>
          </nav>

          <a
            href={build ? hrefFor(release, build, RELEASES_URL) : RELEASES_URL}
            className="bg-accent text-accent-foreground hover:bg-accent-strong focus-visible:ring-accent/40 font-display inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-semibold shadow-[0_6px_16px_oklch(0.505_0.185_277/0.25)] transition-colors outline-none focus-visible:ring-2"
          >
            {/* Both marks ship; data-platform on <html> shows the right one from the first paint. */}
            <PlatformMark
              id="macos-universal"
              className="hidden h-[1.05em] w-[1.05em] -translate-y-px in-data-[platform=macos]:block"
            />
            <PlatformMark id="windows-x64" className="hidden h-[0.9em] w-[0.9em] in-data-[platform=windows]:block" />
            {copy.download}
          </a>

          <span className="hidden sm:block">
            <LocaleLinks locale={locale} label={copy.languages} alternate={alternate} />
          </span>
        </div>
      </div>
    </header>
  );
}

const link = (here: boolean) =>
  `font-display text-[0.8125rem] leading-none transition-colors ${
    here ? "text-foreground-strong font-medium" : "text-muted hover:text-accent"
  }`;
