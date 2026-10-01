import type { ReactNode } from "react";

import { ArticleLayout } from "@/components/reading/ArticleLayout";
import { Breadcrumb } from "@/components/reading/Breadcrumb";
import { MetaLine } from "@/components/reading/MetaLine";
import { ReadingShell } from "@/components/reading/ReadingShell";
import { readingCopy } from "@/components/reading/copy";
import { BLOG_PATH, formatDate, type Post, postPath } from "@/lib/blog";
import { LOCALE_PATH, OTHER_LOCALE, type Locale } from "@/lib/site";

import { blogCopy } from "./copy";
import { PostCta } from "./PostCta";
import { PostSchema } from "./PostSchema";

type PostPageProps = {
  post: Post;
  locale: Locale;
  children: ReactNode;
};

export function PostPage({ post, locale, children }: PostPageProps) {
  const shared = readingCopy[locale];

  return (
    <ReadingShell locale={locale} section="journal" alternate={postPath(post, OTHER_LOCALE[locale])}>
      <PostSchema post={post} locale={locale} />
      <Breadcrumb
        locale={locale}
        trail={[
          { name: "Sonarche", path: LOCALE_PATH[locale] },
          { name: blogCopy[locale].journal, path: BLOG_PATH[locale] },
          { name: post.title[locale], path: postPath(post, locale) },
        ]}
      />

      <ArticleLayout
        locale={locale}
        title={post.title[locale]}
        meta={
          <MetaLine
            items={[
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
        }
        end={<PostCta locale={locale} />}
      >
        {children}
      </ArticleLayout>
    </ReadingShell>
  );
}
