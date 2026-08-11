import type { ReactNode } from "react";

import { BLOG_PATH, formatDate, type Post, postPath } from "@/lib/blog";
import { LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { Breadcrumb } from "@/components/reading/Breadcrumb";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { Prose } from "@/components/reading/Prose";
import { Toc, TocFolded } from "@/components/reading/Toc";
import { readingCopy } from "@/components/reading/copy";

import { blogCopy } from "./copy";
import { PostCta } from "./PostCta";
import { PostSchema } from "./PostSchema";

/*
 * Everything a post is except its words.
 *
 * The two route files of a post are four lines each — a metadata export and
 * this, wrapped around the body — so that writing one is writing prose and
 * nothing else. Title, dateline, measure, closing card and JSON-LD are decided
 * here, once, and stay identical across the journal.
 */

type PostPageProps = {
  post: Post;
  locale: Locale;
  children: ReactNode;
};

export function PostPage({ post, locale, children }: PostPageProps) {
  const shared = readingCopy[locale];
  const alternate = postPath(post, OTHER_LOCALE[locale]);

  return (
    <ReadingShell locale={locale} section="journal" alternate={alternate}>
      <PostSchema post={post} locale={locale} />
      <Breadcrumb
        locale={locale}
        trail={[
          { name: "Sonarche", path: LOCALE_PATH[locale] },
          { name: blogCopy[locale].journal, path: BLOG_PATH[locale] },
          { name: post.title[locale], path: postPath(post, locale) },
        ]}
      />

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
            {/* The dateline reads as one line of small caps above the title: it
              is context, not a headline, and a post that is a year old should
              say so plainly rather than hide it. */}
            <p className="text-muted flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
              <time dateTime={post.published}>{formatDate(post.published, locale)}</time>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>{shared.readingTime(post.minutes)}</span>
              {post.updated && (
                <>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <time dateTime={post.updated}>
                    {shared.updatedOn} {formatDate(post.updated, locale)}
                  </time>
                </>
              )}
            </p>

            <h1 className="text-foreground-strong font-display mt-4 text-[clamp(2rem,5vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.025em]">
              {post.title[locale]}
            </h1>
          </header>

          <TocFolded locale={locale} />

          <div className="mt-8">
            <Prose>{children}</Prose>
          </div>

          <PostCta locale={locale} />
        </article>
      </div>
    </ReadingShell>
  );
}
