import { BLOG_PATH } from "@/lib/blog";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { AUTHOR, GITHUB_URL, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { footerCopy } from "./copy";
import { GitHubMark } from "./icons";

const LINK =
  "hover:text-accent-strong text-[oklch(0.48_0.03_279)] transition-colors hover:underline hover:underline-offset-3";

/* Equal thirds, not `justify-between`: the tagline must sit on the page's axis whatever the
   width of the signature beside it. The landing lays it over the harbour; the journal and the
   guide close on it alone. */

type ColophonProps = {
  locale: Locale;
  /** The other language's URL for this page; the landing's by default. */
  alternate?: string;
  /** Where it sits: over the harbour on the landing, in the flow elsewhere. */
  className?: string;
};

export function Colophon({ locale, alternate, className = "" }: ColophonProps) {
  const copy = footerCopy[locale];
  const other = OTHER_LOCALE[locale];

  return (
    <div
      className={`${className} mx-auto flex max-w-[80rem] flex-col items-center gap-2 px-8 pb-4 text-[0.6875rem] sm:px-15 md:grid md:grid-cols-3 md:items-center`}
    >
      <p className="flex items-baseline gap-2 text-[oklch(0.52_0.03_279)]">
        <span className="font-display font-medium tracking-[0.12em] text-[oklch(0.42_0.03_279)]">{copy.wordmark}</span>
        <span aria-hidden>·</span>
        <a
          href={AUTHOR.url}
          rel="author"
          className="hover:text-accent inline-flex items-baseline gap-1.5 transition-colors hover:underline hover:underline-offset-3"
        >
          <GitHubMark className="h-3 w-3 self-center opacity-70" />
          {copy.signature}
        </a>
      </p>

      <p className="font-serif text-[0.8125rem] text-[oklch(0.5_0.05_277)] italic md:justify-self-center">
        {copy.tagline}
      </p>

      {/* The guide appears with its first page. */}
      <div className="flex items-center gap-3.5 md:justify-self-end">
        <a href={BLOG_PATH[locale]} className={LINK}>
          {copy.journal}
        </a>
        {publishedGuides().length > 0 && (
          <a href={GUIDE_PATH[locale]} className={LINK}>
            {copy.guide}
          </a>
        )}
        <a
          href={alternate ?? LOCALE_PATH[other]}
          hrefLang={other}
          className="hover:text-accent font-medium text-[oklch(0.48_0.03_279)] underline decoration-[oklch(0.48_0.03_279/0.35)] underline-offset-3 transition-colors hover:decoration-current"
        >
          {copy.otherLanguage}
        </a>
        <a href={GITHUB_URL} className={`${LINK} inline-flex items-baseline gap-1.5`}>
          <GitHubMark className="h-3 w-3 self-center opacity-70" />
          {copy.github}
        </a>
      </div>
    </div>
  );
}
