import type { Metadata } from "next";

import { OG_IMAGE, OG_LOCALE, ogImage, type Locale } from "@/lib/site";

/*
 * The guide, as a hand-kept list — the same shape as lib/blog.ts, and
 * deliberately not the same module.
 *
 * A guide is not a post. A post is dated, read once, and written for someone who
 * has never heard of Sonarche; a guide is undated, consulted, and written for
 * someone who has the app open on the other screen. That difference is the whole
 * reason the two live apart: a reverse-chronological index is the right filing
 * for one and the wrong filing for the other.
 *
 * What a guide carries instead of a publication date is the version of the app
 * it was checked against. A guide describing a screen that has since moved is
 * worse than no guide at all — it makes the reader doubt what they are looking
 * at — so the version is on the page, in front of them, not in a comment.
 */

/** The index of each language's guide. FR at the root, like the site. */
export const GUIDE_PATH: Record<Locale, string> = {
  fr: "/guide/",
  en: "/en/guide/",
};

/**
 * What a guide is filed under. The index groups by this, in this order.
 *
 * Four buckets and no more: a table of contents whose sections outnumber its
 * entries is a table of contents nobody reads.
 */
export const TOPICS = ["start", "library", "listen", "settings"] as const;

export type Topic = (typeof TOPICS)[number];

export type Guide = {
  /** Stable internal id — the folder its component lives in, never a URL. */
  id: string;
  /** The URL segment, per language: a French reader gets a French slug. */
  slug: Record<Locale, string>;
  topic: Topic;
  /** The app version this guide was last checked against, e.g. "0.9.1". */
  appVersion: string;
  /** ISO day of the last real revision. Drives the sitemap, not the page. */
  updated: string;
  title: Record<Locale, string>;
  /** The meta description, and the line under the title on the index. */
  description: Record<Locale, string>;
  /** Counted once by hand at ~200 words a minute, not derived. */
  minutes: number;
  /**
   * Written but not published: absent from the index and the sitemap, and the
   * page tells crawlers not to index it.
   *
   * The routes still build, so a draft is readable at its own URL and looks
   * exactly like the real thing — which is the only way to judge it before
   * publishing. `next dev` lists drafts on the index; a production build never
   * does.
   */
  draft?: boolean;
};

/** Ordered inside each topic by what someone would read first. */
export const GUIDES: Guide[] = [
  {
    id: "getting-started",
    slug: {
      fr: "premiere-mise-en-route",
      en: "getting-started",
    },
    topic: "start",
    appVersion: "0.9.1",
    updated: "2026-08-11",
    title: {
      fr: "Première mise en route",
      en: "Getting started",
    },
    description: {
      fr: "De l'installation à la première bibliothèque : l'avertissement du système, le walkthrough de premier lancement, la clé AcoustID et ce qu'elle change.",
      en: "From install to a first library: the system warning, the first-run walkthrough, the AcoustID key and what it changes.",
    },
    minutes: 5,
    draft: true,
  },
];

/** What the index and the sitemap are allowed to show. */
export const publishedGuides = () => GUIDES.filter((guide) => !guide.draft || process.env.NODE_ENV !== "production");

export const guidePath = (guide: Guide, locale: Locale) => `${GUIDE_PATH[locale]}${guide.slug[locale]}/`;

/** The reciprocal set a guide's metadata declares. `x-default` is FR, as everywhere. */
export const guideAlternates = (guide: Guide) => ({
  fr: guidePath(guide, "fr"),
  en: guidePath(guide, "en"),
  "x-default": guidePath(guide, "fr"),
});

/**
 * The entry a route file belongs to. Throws rather than returns undefined: a
 * route whose id is not in the list is a page with no title and no alternates,
 * and the build is the right place to find that out.
 */
export function guideById(id: string): Guide {
  const guide = GUIDES.find((entry) => entry.id === id);
  if (!guide) throw new Error(`Unknown guide id: ${id}. Add it to GUIDES in lib/guide.ts.`);
  return guide;
}

/**
 * Everything a guide's route file would otherwise retype. See postMetadata in
 * lib/blog.ts — same reasoning, plus the `noindex` a draft has to carry: its
 * route is built and reachable, so nothing but this keeps it out of an index.
 */
export function guideMetadata(guide: Guide, locale: Locale): Metadata {
  const path = guidePath(guide, locale);

  return {
    title: guide.title[locale],
    description: guide.description[locale],
    robots: guide.draft ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: path,
      languages: guideAlternates(guide),
    },
    openGraph: {
      type: "article",
      locale: OG_LOCALE[locale],
      url: path,
      siteName: "Sonarche",
      title: guide.title[locale],
      description: guide.description[locale],
      modifiedTime: guide.updated,
      authors: ["Romain Pierucci"],
      images: [ogImage(locale)],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title[locale],
      description: guide.description[locale],
      images: [OG_IMAGE.url],
    },
  };
}
