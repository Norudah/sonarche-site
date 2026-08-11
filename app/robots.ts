import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** Required by `output: 'export'` — a route handler has to opt into being a file. */
export const dynamic = "force-static";

/*
 * Everything is crawlable, and that is on purpose.
 *
 * There is nothing here worth hiding: a static export of a dozen public pages,
 * no admin, no search parameters, no duplicate paths a crawler could get lost
 * in. The one temptation is to disallow the pages that should not be indexed —
 * the guide's empty index, a guide still in draft — and it would be exactly
 * wrong: a page blocked in robots.txt is a page whose `noindex` is never read,
 * so it can still surface in results, as a bare URL with no description. Those
 * pages say `noindex` in their own head (see lib/guide.ts), which only works if
 * the crawler is allowed to fetch them.
 *
 * The sitemap line is the whole point of the file: it is how a crawler finds
 * the list of pages without having to walk the site to guess it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", SITE_URL).href,
  };
}
