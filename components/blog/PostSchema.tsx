import { JsonLd } from "@/components/layout/JsonLd";
import { type Post, postPath } from "@/lib/blog";
import { AUTHOR, OG_IMAGE, SITE_URL, absoluteUrl, type Locale } from "@/lib/site";

export function PostSchema({ post, locale }: { post: Post; locale: Locale }) {
  const url = absoluteUrl(postPath(post, locale));

  return (
    <JsonLd
      data={{
        "@type": "BlogPosting",
        headline: post.title[locale],
        description: post.description[locale],
        image: [absoluteUrl(OG_IMAGE.url)],
        inLanguage: locale,
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
        publisher: { "@type": "Organization", name: "Sonarche", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
        isAccessibleForFree: true,
      }}
    />
  );
}
