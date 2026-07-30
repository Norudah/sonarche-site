/* French first, and not only alphabetically: it is the site's own language, and
   this order is what the top-right switch reads out. */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sonarche.org";

/**
 * The repo is still private (2026-07-30), so every CTA points at a URL that
 * does not resolve yet — deliberately, rather than rendering a dead button.
 * TODO: confirm the final handle before going public. This is the only string
 * to change.
 */
export const GITHUB_URL = "https://github.com/rpierucci/sonarche";

/**
 * Two static routes, FR at the root. The audience this page is written for is
 * French, so French is what a bare sonarche.org serves; English is the
 * translation and lives one segment down. No Accept-Language redirect: a static
 * export cannot, and a visible switch is better anyway.
 */
export const LOCALE_PATH: Record<Locale, string> = {
  fr: "/",
  en: "/en/",
};

export const OTHER_LOCALE: Record<Locale, Locale> = {
  fr: "en",
  en: "fr",
};

/** `hreflang` map for the Metadata API. `x-default` points at the root, which
 *  is FR: it is the page a search engine should serve when it cannot tell. */
export const LANGUAGE_ALTERNATES = {
  fr: LOCALE_PATH.fr,
  en: LOCALE_PATH.en,
  "x-default": LOCALE_PATH.fr,
};
