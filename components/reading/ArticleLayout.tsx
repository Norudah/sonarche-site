import type { ReactNode } from "react";

import type { Locale } from "@/lib/site";

import { Prose } from "./Prose";
import { Toc, TocFolded } from "./Toc";

type ArticleLayoutProps = {
  locale: Locale;
  meta: ReactNode;
  title: string;
  children: ReactNode;
  /** What the article ends on, after the prose. */
  end: ReactNode;
};

/* Three columns keep the article on the page's centre line with the Toc in the margin. Below `lg`
   the grid collapses and the folded Toc sits under the title instead. */
export function ArticleLayout({ locale, meta, title, children, end }: ArticleLayoutProps) {
  return (
    <div className="mx-auto grid w-full max-w-[72rem] px-6 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_38rem_minmax(0,1fr)] lg:gap-10">
      <div className="hidden lg:block lg:justify-self-end">
        <Toc locale={locale} />
      </div>

      <article className="w-full min-w-0">
        <header>
          {meta}
          <h1 className="text-foreground-strong font-display mt-4 text-[clamp(2rem,5vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.025em]">
            {title}
          </h1>
        </header>

        <TocFolded locale={locale} />

        <div className="mt-8">
          <Prose>{children}</Prose>
        </div>

        {end}
      </article>
    </div>
  );
}
