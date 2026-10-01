import type { MetadataRoute } from "next";

import { BLOG_PATH, POSTS, postPaths } from "@/lib/blog";
import { GUIDE_PATH, guidePaths, publishedGuides } from "@/lib/guide";
import { CONTENT_UPDATED, LOCALE_PATH, LOCALES, absoluteUrl, withXDefault, type Locale } from "@/lib/site";

export const dynamic = "force-static";

const latest = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), "");

function entries(paths: Record<Locale, string>, lastModified: string, priority: number | Record<Locale, number>) {
  const languages = Object.fromEntries(
    Object.entries(withXDefault(paths)).map(([key, path]) => [key, absoluteUrl(path)]),
  );

  return LOCALES.map((locale) => ({
    url: absoluteUrl(paths[locale]),
    lastModified,
    priority: typeof priority === "number" ? priority : priority[locale],
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = publishedGuides();

  return [
    ...entries(LOCALE_PATH, CONTENT_UPDATED, { fr: 1, en: 0.9 }),
    ...entries(BLOG_PATH, latest(POSTS.map((post) => post.published)) || CONTENT_UPDATED, 0.6),
    ...POSTS.flatMap((post) => entries(postPaths(post), post.updated ?? post.published, 0.7)),
    /* An empty guide index is noindex, so it stays out until something is published. */
    ...(guides.length === 0
      ? []
      : [
          ...entries(GUIDE_PATH, latest(guides.map((guide) => guide.updated)), 0.6),
          ...guides.flatMap((guide) => entries(guidePaths(guide), guide.updated, 0.7)),
        ]),
  ];
}
