import { pageMetadata } from "@/lib/metadata";
import { LOCALES, type Locale } from "@/lib/site";

/*
 * The journal's only index: no blog engine, every post is a hand-written component. Every field
 * is a `Record<Locale, string>` so a half-translated post fails the build instead of shipping a
 * non-reciprocal hreflang pair.
 */

export const BLOG_PATH: Record<Locale, string> = {
  fr: "/blog/",
  en: "/en/blog/",
};

export type Post = {
  /** The folder its component lives in, never a URL. */
  id: string;
  slug: Record<Locale, string>;
  published: string;
  /** Set only on a real revision of the text. */
  updated?: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  /** Counted by hand at ~200 words a minute. */
  minutes: number;
};

/** Newest first. */
export const POSTS: Post[] = [
  {
    id: "wrong-tags",
    slug: {
      fr: "pourquoi-tes-tags-musicaux-sont-faux",
      en: "why-your-music-tags-are-wrong",
    },
    published: "2026-08-11",
    title: {
      fr: "Pourquoi les tags de tes fichiers musicaux sont faux",
      en: "Why your music files have the wrong tags",
    },
    description: {
      fr: "Un fichier audio ne sait pas ce qu'il contient : il porte ce qu'on a bien voulu écrire dessus. Comment les tags se cassent, pourquoi la recherche par texte ne les répare pas, et ce que l'empreinte acoustique change.",
      en: "An audio file doesn't know what it holds: it carries whatever was typed onto it. How tags break, why text search can't fix them, and what an audio fingerprint changes.",
    },
    minutes: 7,
  },
];

export const postPath = (post: Post, locale: Locale) => `${BLOG_PATH[locale]}${post.slug[locale]}/`;

export const postPaths = (post: Post) =>
  Object.fromEntries(LOCALES.map((locale) => [locale, postPath(post, locale)])) as Record<Locale, string>;

/** Throws so a route pointing at a missing id fails the build. */
export function postById(id: string): Post {
  const post = POSTS.find((entry) => entry.id === id);
  if (!post) throw new Error(`Unknown post id: ${id}. Add it to POSTS in lib/blog.ts.`);
  return post;
}

export const postMetadata = (post: Post, locale: Locale) =>
  pageMetadata({
    locale,
    paths: postPaths(post),
    title: post.title[locale],
    shareTitle: post.title[locale],
    description: post.description[locale],
    article: { publishedTime: post.published, modifiedTime: post.updated ?? post.published },
  });

/** UTC so the day cannot drift on a build machine in another timezone. */
export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
