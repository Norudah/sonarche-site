import type { MetadataRoute } from "next";

import { BLOG_PATH, POSTS, postAlternates, postPath } from "@/lib/blog";
import { CONTENT_UPDATED, LOCALE_PATH, LOCALES, SITE_URL } from "@/lib/site";

/** Required by `output: 'export'` — a route handler has to opt into being a file. */
export const dynamic = "force-static";

const href = (path: string) => new URL(path, SITE_URL).href;

const absolute = (paths: Record<string, string>) =>
  Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, href(path)]));

/**
 * Emitted as a static sitemap.xml.
 *
 * Every entry carries its full alternates set: a sitemap's hreflang links have
 * to be reciprocal, or search engines drop the pairing entirely. The journal is
 * generated from lib/blog.ts rather than listed here — a post that ships
 * without a sitemap entry is a post nothing will find.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const landing = absolute(LOCALE_PATH);
  const blogIndex = absolute({ ...BLOG_PATH, "x-default": BLOG_PATH.fr });

  /* The index changes when the newest post does, and that is all it changes
     for: it holds no text of its own beyond one title and one line. */
  const newest = POSTS.reduce(
    (latest, post) => (post.published > latest ? post.published : latest),
    POSTS[0]?.published ?? CONTENT_UPDATED,
  );

  return [
    {
      url: href(LOCALE_PATH.fr),
      lastModified: CONTENT_UPDATED,
      priority: 1,
      alternates: { languages: { ...landing, "x-default": landing.fr } },
    },
    {
      url: href(LOCALE_PATH.en),
      lastModified: CONTENT_UPDATED,
      priority: 0.9,
      alternates: { languages: { ...landing, "x-default": landing.fr } },
    },
    ...LOCALES.map((locale) => ({
      url: href(BLOG_PATH[locale]),
      lastModified: newest,
      priority: 0.6,
      alternates: { languages: blogIndex },
    })),
    ...POSTS.flatMap((post) =>
      LOCALES.map((locale) => ({
        url: href(postPath(post, locale)),
        lastModified: post.updated ?? post.published,
        priority: 0.7,
        alternates: { languages: absolute(postAlternates(post)) },
      })),
    ),
  ];
}
