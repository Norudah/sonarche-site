import { readingCopy } from "@/components/reading/copy";
import { UnderConstruction } from "@/components/reading/UnderConstruction";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { BLOG_PATH, formatDate, type Post, POSTS, postPath } from "@/lib/blog";
import { GUIDE_PATH, publishedGuides } from "@/lib/guide";
import { pageMetadata } from "@/lib/metadata";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";
import { PostIllustration } from "./PostIllustration";

export const blogIndexMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: BLOG_PATH,
    title: { absolute: blogCopy[locale].indexSearchTitle },
    shareTitle: blogCopy[locale].indexTitle,
    description: blogCopy[locale].indexDek,
  });

const LABEL = "font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase";

/* Cards, the newest one wide: a journal is browsed, where the guide is consulted. */
export function BlogIndex({ locale }: { locale: Locale }) {
  const copy = blogCopy[locale];
  const [newest, ...older] = POSTS;

  return (
    <ReadingShell locale={locale} section="journal" alternate={BLOG_PATH[OTHER_LOCALE[locale]]}>
      <header className="border-separator bg-surface relative overflow-hidden border-b">
        {/* Ruled lines, a notebook's, where the guide would sit on a grid. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(0deg,oklch(0.905_0.01_279/0.6)_0_1px,transparent_1px_28px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto flex max-w-[44rem] flex-col items-center px-6 pt-16 pb-14 text-center sm:pt-20">
          <span className="border-separator bg-surface text-foreground inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] tracking-[0.04em]">
            <span aria-hidden className="bg-accent size-1.75 rounded-[2px]" />
            {copy.journal}
          </span>
          <h1 className="text-foreground-strong font-display mt-5 text-[clamp(2.25rem,6vw,3.375rem)] leading-[1.05] font-bold tracking-[-0.03em]">
            {copy.indexTitle}
          </h1>
          <p className="text-body mt-4 max-w-[36rem] text-[1.09rem] leading-relaxed">{copy.indexDek}</p>
          <UnderConstruction locale={locale}>{copy.construction}</UnderConstruction>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[72rem] px-6 pt-12 sm:px-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newest && (
            <li className="sm:col-span-2 lg:col-span-3">
              <a
                href={postPath(newest, locale)}
                className="group border-separator bg-surface hover:border-accent/40 grid items-center gap-6 rounded-[1.125rem] border p-3.5 transition-colors lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8 lg:pr-8"
              >
                <PostIllustration kind={newest.illustration} large />
                <span className="flex flex-col gap-3 px-1.5 pb-3 lg:p-0">
                  <span className={`text-accent ${LABEL}`}>{copy.featured}</span>
                  <h2 className="text-foreground-strong font-display group-hover:text-accent text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] font-bold tracking-[-0.02em] transition-colors">
                    {newest.title[locale]}
                  </h2>
                  <span className="text-body text-[1rem] leading-relaxed">{newest.description[locale]}</span>
                  <Dateline post={newest} locale={locale} />
                </span>
              </a>
            </li>
          )}

          {older.map((post) => (
            <li key={post.id} className="flex">
              <a
                href={postPath(post, locale)}
                className="group border-separator bg-surface hover:border-accent/40 flex w-full flex-col gap-2 rounded-[1.125rem] border p-3.5 pb-5 transition-colors"
              >
                <PostIllustration kind={post.illustration} />
                <h2 className="text-foreground-strong font-display group-hover:text-accent mt-2 px-1.5 text-[1.125rem] leading-snug font-semibold transition-colors">
                  {post.title[locale]}
                </h2>
                <span className="text-body px-1.5 text-[0.875rem] leading-relaxed">{post.description[locale]}</span>
                <span className="mt-auto px-1.5 pt-1">
                  <Dateline post={post} locale={locale} />
                </span>
              </a>
            </li>
          ))}
        </ul>

        {publishedGuides().length > 0 && (
          <a
            href={GUIDE_PATH[locale]}
            className="border-separator bg-surface hover:border-accent/40 mt-10 flex flex-col gap-2 rounded-2xl border p-5 transition-colors sm:max-w-[calc(50%-0.5rem)]"
          >
            <span className={`text-muted ${LABEL}`}>{copy.howToLabel}</span>
            <span className="text-body text-[0.9rem] leading-relaxed">
              {copy.howToBody}{" "}
              <span className="text-accent font-semibold">
                {copy.howToLink} <span aria-hidden>→</span>
              </span>
            </span>
          </a>
        )}
      </div>
    </ReadingShell>
  );
}

function Dateline({ post, locale }: { post: Post; locale: Locale }) {
  return (
    <span className="text-muted font-mono text-[0.6875rem] tracking-[0.04em]">
      <time dateTime={post.published}>{formatDate(post.published, locale)}</time> ·{" "}
      {readingCopy[locale].readingTime(post.minutes)}
    </span>
  );
}
