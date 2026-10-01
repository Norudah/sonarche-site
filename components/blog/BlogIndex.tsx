import { EntryRow } from "@/components/reading/EntryRow";
import { MetaLine } from "@/components/reading/MetaLine";
import { ReadingIndex } from "@/components/reading/ReadingIndex";
import { readingCopy } from "@/components/reading/copy";
import { BLOG_PATH, formatDate, POSTS, postPath } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import { OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";

export const blogIndexMetadata = (locale: Locale) =>
  pageMetadata({
    locale,
    paths: BLOG_PATH,
    title: { absolute: blogCopy[locale].indexSearchTitle },
    shareTitle: blogCopy[locale].indexTitle,
    description: blogCopy[locale].indexDek,
  });

export function BlogIndex({ locale }: { locale: Locale }) {
  const copy = blogCopy[locale];

  return (
    <ReadingIndex
      locale={locale}
      section="journal"
      alternate={BLOG_PATH[OTHER_LOCALE[locale]]}
      title={copy.indexTitle}
      dek={copy.indexDek}
    >
      <ul className="border-separator mt-14 border-t">
        {POSTS.map((post) => (
          <li key={post.id} className="border-separator border-b">
            <EntryRow
              href={postPath(post, locale)}
              meta={
                <MetaLine
                  items={[
                    <time key="date" dateTime={post.published}>
                      {formatDate(post.published, locale)}
                    </time>,
                    readingCopy[locale].readingTime(post.minutes),
                  ]}
                />
              }
              title={post.title[locale]}
              titleAs="h2"
              description={post.description[locale]}
              cta={copy.readPost}
            />
          </li>
        ))}
      </ul>
    </ReadingIndex>
  );
}
