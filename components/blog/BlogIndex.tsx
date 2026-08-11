import { BLOG_PATH, formatDate, POSTS, type Post, postPath } from "@/lib/blog";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { ReadingShell } from "@/components/reading/ReadingShell";
import { readingCopy } from "@/components/reading/copy";

import { blogCopy } from "./copy";

/*
 * The journal's front page: a title, a line saying what is written here, and
 * the posts newest first.
 *
 * No pagination, no tags, no search, no archive by year. There will be a dozen
 * posts a year at most, and every one of those would be a feature built for a
 * list that fits on one screen. When the list stops fitting, that is the day to
 * build the first of them.
 */

export function BlogIndex({ locale }: { locale: Locale }) {
  const copy = blogCopy[locale];

  return (
    <ReadingShell locale={locale} section="journal" alternate={BLOG_PATH[OTHER_LOCALE[locale]]}>
      <div className="mx-auto w-full max-w-[38rem] px-6 pt-16 sm:px-0 sm:pt-24">
        <h1 className="text-foreground-strong font-display text-[clamp(2.25rem,5.5vw,3rem)] leading-[1.1] font-bold tracking-[-0.025em]">
          {copy.indexTitle}
        </h1>
        <p className="text-body mt-4 text-[1.09rem] leading-relaxed">{copy.indexDek}</p>

        <ul className="border-separator mt-14 border-t">
          {POSTS.map((post) => (
            <li key={post.id} className="border-separator border-b">
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      </div>
    </ReadingShell>
  );
}

/*
 * A row, not a card: no border box, no thumbnail, no "read more".
 *
 * The whole row is the link — a title-only hit area asks someone to aim at a
 * line of text, and the dek is part of what they are choosing anyway.
 */
function PostCard({ post, locale }: { post: Post; locale: Locale }) {
  const copy = blogCopy[locale];
  const shared = readingCopy[locale];

  return (
    <a href={postPath(post, locale)} className="block py-7">
      <p className="text-muted flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] tracking-[0.1em] uppercase">
        <time dateTime={post.published}>{formatDate(post.published, locale)}</time>
        <span aria-hidden className="text-border">
          ·
        </span>
        <span>{shared.readingTime(post.minutes)}</span>
      </p>

      {/* Each part answers for itself: no `group-hover` anywhere on this row.
          Lighting up the title and the button together, from anywhere in a
          400px-tall block, made the pointer look like it was hovering two
          things at once. */}
      <h2 className="text-foreground-strong hover:text-accent font-display mt-2 text-[1.4rem] leading-[1.25] font-bold tracking-[-0.02em] transition-colors">
        {post.title[locale]}
      </h2>

      <p className="text-body mt-2 text-[0.95rem] leading-relaxed">{post.description[locale]}</p>

      {/*
       * A span, not a nested link: the row above it is already the anchor, and
       * a link inside a link is invalid html that browsers repair by breaking
       * one of the two. It is named as a group only so the arrow travels with
       * the button it sits in, and with nothing else.
       */}
      <span className="group/read border-border text-accent hover:border-accent hover:bg-accent hover:text-accent-foreground mt-4 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors">
        {copy.readPost}
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover/read:translate-x-0.5 motion-reduce:transition-none"
        >
          →
        </span>
      </span>
    </a>
  );
}
