import type { Metadata } from "next";

import { OG_IMAGE, OG_LOCALE, type Locale } from "@/lib/site";

/*
 * The journal, as a hand-kept list.
 *
 * There is no blog engine here and there will not be one: no markdown pipeline,
 * no frontmatter parser, no dependency. Every post is a React component written
 * by hand like any other section of this site, and this file is the only index
 * of them — it is what the list page renders, what the sitemap emits, and what
 * each locale's page reads to point at its translation. Publishing is one entry
 * here, one component, and two four-line route files.
 *
 * Every post exists in both languages, and `Record<Locale, string>` is how that
 * is enforced: hreflang alternates have to be reciprocal or a search engine
 * drops the pairing entirely, so a half-translated post has to fail the build
 * rather than ship a broken pair.
 */

/** The index of each language's journal. FR at the root, like the site. */
export const BLOG_PATH: Record<Locale, string> = {
  fr: "/blog/",
  en: "/en/blog/",
};

export type Post = {
  /** Stable internal id — the folder its component lives in, never a URL. */
  id: string;
  /** The URL segment, per language: a French reader gets a French slug. */
  slug: Record<Locale, string>;
  /** ISO day. Drives the order, the dateline and the sitemap's lastModified. */
  published: string;
  /** Set only on a real revision of the text, never on a restyle. */
  updated?: string;
  title: Record<Locale, string>;
  /** The meta description, and the dek under the title on the index. */
  description: Record<Locale, string>;
  /** Counted once by hand at ~200 words a minute, not derived. */
  minutes: number;
};

/** Newest first — the index renders this order as it stands. */
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

/** The reciprocal set a post's metadata declares. `x-default` is FR, as everywhere. */
export const postAlternates = (post: Post) => ({
  fr: postPath(post, "fr"),
  en: postPath(post, "en"),
  "x-default": postPath(post, "fr"),
});

/**
 * The entry a route file belongs to.
 *
 * Throws rather than returns undefined: a route whose id is not in the list is
 * a page with no title, no date and no alternates, and the build is the right
 * place to find that out.
 */
export function postById(id: string): Post {
  const post = POSTS.find((entry) => entry.id === id);
  if (!post) throw new Error(`Unknown post id: ${id}. Add it to POSTS in lib/blog.ts.`);
  return post;
}

/**
 * Everything a post's route file would otherwise retype.
 *
 * Four route files exist per post — two languages, and each is four lines — and
 * the head is the part that must not be hand-maintained: a canonical pointing
 * at the wrong locale or an alternates set that is not reciprocal is invisible
 * on the page and costs the post its indexing.
 *
 * The card image is the site's own for now. Per-post cards would come from
 * scripts/build-og-image.mjs, which already draws the ark and can take a title;
 * until a post is worth its own drawing, one card is better than none.
 */
export function postMetadata(post: Post, locale: Locale): Metadata {
  const path = postPath(post, locale);

  return {
    title: post.title[locale],
    description: post.description[locale],
    alternates: {
      canonical: path,
      languages: postAlternates(post),
    },
    openGraph: {
      type: "article",
      locale: OG_LOCALE[locale],
      url: path,
      siteName: "Sonarche",
      title: post.title[locale],
      description: post.description[locale],
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      authors: ["Romain Pierucci"],
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title[locale],
      description: post.description[locale],
      images: [OG_IMAGE.url],
    },
  };
}

/** The dateline, in the reader's own language. UTC so the day cannot drift by
 *  one on a build machine set elsewhere. */
export function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
