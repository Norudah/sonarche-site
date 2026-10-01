import type { Metadata, Viewport } from "next";

import { AUTHOR, OG_LOCALE, SEARCH_TITLE, SITE_URL, ogImage, withXDefault, type Locale } from "@/lib/site";

export const layoutMetadata = (locale: Locale): Metadata => ({
  metadataBase: new URL(SITE_URL),
  title: { default: SEARCH_TITLE[locale], template: "%s | Sonarche" },
});

/* Hex, not the oklch paper colour: theme-color is read by the OS shell, which drops what it cannot parse. */
export const VIEWPORT: Viewport = { themeColor: "#f8f9fd" };

type PageMetadataInput = {
  locale: Locale;
  /** The page's path in each language. */
  paths: Record<Locale, string>;
  /** The search title. */
  title: Metadata["title"];
  /** What a shared link shows. */
  shareTitle: string;
  description: string;
  robots?: Metadata["robots"];
  article?: { publishedTime?: string; modifiedTime: string };
};

export function pageMetadata({
  locale,
  paths,
  title,
  shareTitle,
  description,
  robots,
  article,
}: PageMetadataInput): Metadata {
  const url = paths[locale];
  const shared = {
    locale: OG_LOCALE[locale],
    url,
    siteName: "Sonarche",
    title: shareTitle,
    description,
    images: [ogImage(locale)],
  };

  return {
    title,
    description,
    robots,
    alternates: { canonical: url, languages: withXDefault(paths) },
    openGraph: article
      ? { ...shared, type: "article", ...article, authors: [AUTHOR.name] }
      : { ...shared, type: "website" },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [ogImage(locale)] },
  };
}
