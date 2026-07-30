import type { MetadataRoute } from "next";

import { CONTENT_UPDATED, LOCALE_PATH, SITE_URL } from "@/lib/site";

/** Required by `output: 'export'` — a route handler has to opt into being a file. */
export const dynamic = "force-static";

const href = (path: string) => new URL(path, SITE_URL).href;

/**
 * Emitted as a static sitemap.xml.
 *
 * Both entries carry the full alternates set: a sitemap's hreflang links have to
 * be reciprocal, or search engines drop the pairing entirely.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    fr: href(LOCALE_PATH.fr),
    en: href(LOCALE_PATH.en),
  };

  return [
    { url: languages.fr, lastModified: CONTENT_UPDATED, priority: 1, alternates: { languages } },
    { url: languages.en, lastModified: CONTENT_UPDATED, priority: 0.9, alternates: { languages } },
  ];
}
