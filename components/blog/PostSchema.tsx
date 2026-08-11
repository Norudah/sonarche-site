import { type Post, postPath } from "@/lib/blog";
import { AUTHOR, OG_IMAGE, SITE_URL, type Locale } from "@/lib/site";

/*
 * The post, said to a machine — the journal's counterpart to the landing's
 * SoftwareApplication block (components/layout/StructuredData.tsx).
 *
 * `BlogPosting` is what makes a page eligible to be understood as an article
 * with a date and an author rather than as one more page of the site, which is
 * the whole point of the journal existing. Nothing here claims anything the
 * page does not show: the headline is its h1, the dates are its dateline, the
 * author is the one who signs the footer.
 */

type PostSchemaProps = {
  post: Post;
  locale: Locale;
};

export function PostSchema({ post, locale }: PostSchemaProps) {
  const url = new URL(postPath(post, locale), SITE_URL).href;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title[locale],
    description: post.description[locale],
    image: [new URL(OG_IMAGE.url, SITE_URL).href],
    inLanguage: locale,
    datePublished: post.published,
    dateModified: post.updated ?? post.published,
    author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
    publisher: { "@type": "Organization", name: "Sonarche", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    isAccessibleForFree: true,
  };

  /* See StructuredData for why this is the one right use of the escape hatch,
     and why `<` is replaced all the same. */
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
