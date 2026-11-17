import type { ReactNode } from "react";

import { Breadcrumb } from "@/components/reading/Breadcrumb";
import { MetaLine } from "@/components/reading/MetaLine";
import { Prose } from "@/components/reading/Prose";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { readingCopy } from "@/components/reading/copy";
import { BLOG_PATH, formatDate, type Post, postPath } from "@/lib/blog";
import { guideById, guidePath } from "@/lib/guide";
import { AUTHOR, LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";
import { PostCta } from "./PostCta";
import { PostSchema } from "./PostSchema";

type PostPageProps = {
  post: Post;
  locale: Locale;
  children: ReactNode;
};

/* A read, not a reference: one centred column, no table of contents, a quiet cover band. */
export function PostPage({ post, locale, children }: PostPageProps) {
  const copy = blogCopy[locale];
  const shared = readingCopy[locale];

  return (
    <ReadingShell locale={locale} section="journal" alternate={postPath(post, OTHER_LOCALE[locale])}>
      <PostSchema post={post} locale={locale} />
      <Breadcrumb
        locale={locale}
        trail={[
          { name: "Sonarche", path: LOCALE_PATH[locale] },
          { name: copy.journal, path: BLOG_PATH[locale] },
          { name: post.title[locale], path: postPath(post, locale) },
        ]}
      />

      <Cover />

      <article className="mx-auto w-full max-w-[42rem] px-6 pt-14 sm:pt-16">
        <header className="text-center">
          <MetaLine
            className="justify-center"
            items={[
              <a key="journal" href={BLOG_PATH[locale]} className="text-accent hover:text-accent-strong font-semibold">
                {copy.journal}
              </a>,
              <time key="published" dateTime={post.published}>
                {formatDate(post.published, locale)}
              </time>,
              shared.readingTime(post.minutes),
              post.updated && (
                <time key="updated" dateTime={post.updated}>
                  {shared.updatedOn} {formatDate(post.updated, locale)}
                </time>
              ),
            ]}
          />
          <h1 className="text-foreground-strong font-display mt-5 text-[clamp(2rem,5.5vw,3rem)] leading-[1.1] font-bold tracking-[-0.03em]">
            {post.title[locale]}
          </h1>
          <p className="text-foreground mx-auto mt-5 max-w-[36rem] text-[1.2rem] leading-relaxed">
            {post.description[locale]}
          </p>
          <p className="text-muted mt-6 text-[0.875rem]">
            {copy.by}{" "}
            <a href={AUTHOR.url} className="text-accent hover:text-accent-strong font-semibold">
              {AUTHOR.name}
            </a>
          </p>
        </header>

        <div className="mt-12">
          <Prose>{children}</Prose>
        </div>

        {post.guide && <Practice guideId={post.guide} locale={locale} />}
        <PostCta locale={locale} />
      </article>
    </ReadingShell>
  );
}

/* Equalizer bars, densest at the centre: the landing's sea, stilled. Computed once at build. */
const BARS = Array.from({ length: 120 }, (_, i) => {
  const height = 14 + (Math.sin(i * 0.29) + Math.sin(i * 0.083 + 1.4) + 2) * 19;
  const centre = 1 - Math.abs(i / 119 - 0.5) * 2;
  return { height: `${Math.round(height)}%`, opacity: 0.18 + 0.62 * centre };
});

function Cover() {
  return (
    <div aria-hidden className="border-separator bg-surface border-b">
      <div className="mx-auto flex h-36 max-w-[77.5rem] items-center gap-0.5 px-6 sm:h-56 sm:gap-1 sm:px-10">
        {BARS.map((bar, i) => (
          <span
            key={i}
            className="bg-accent flex-1 rounded-[3px] max-sm:odd:hidden"
            style={{ height: bar.height, opacity: bar.opacity }}
          />
        ))}
      </div>
    </div>
  );
}

function Practice({ guideId, locale }: { guideId: string; locale: Locale }) {
  const guide = guideById(guideId);

  return (
    <a
      href={guidePath(guide, locale)}
      className="group border-separator bg-surface hover:border-accent/40 mt-16 grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border p-5 transition-colors"
    >
      <span
        aria-hidden
        className="bg-accent-soft text-accent-strong flex size-11 items-center justify-center rounded-xl"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
          <path d="M4 20l4-1 10-10-3-3L5 16z M13 7l3 3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>
        <span className="text-accent block font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase">
          {blogCopy[locale].practice}
        </span>
        <span className="text-foreground-strong font-display group-hover:text-accent mt-1 block text-[1.1rem] leading-snug font-semibold transition-colors">
          {guide.title[locale]}
        </span>
      </span>
      <span className="text-muted font-mono text-[0.6875rem] tracking-[0.04em] whitespace-nowrap">
        {readingCopy[locale].readingTime(guide.minutes)} <span aria-hidden>→</span>
      </span>
    </a>
  );
}
