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

/**
 * Open Graph wants a full locale, language and territory. The bare `fr` and `en`
 * we shipped before are not valid values, and the scrapers that check simply
 * drop the tag.
 */
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};

/**
 * The day the page's text last changed, for the sitemap.
 *
 * Bumped by hand rather than derived from the build: a date that moves on every
 * deploy tells a crawler the copy changed when only a stylesheet did, and a
 * sitemap that cries wolf is one that stops being read. Move it when
 * docs/copy/*.md moves.
 */
export const CONTENT_UPDATED = "2026-07-31";

/**
 * The <title>, which is a different job from the wordmark.
 *
 * The tagline is the brand and it holds the hero, the footer and every social
 * card — but nobody types "from the stream into the ark" into a search box.
 * This is the one string whose entire purpose is to be found, so it names the
 * brand first and then says, in the visitor's own language, what the thing is.
 * `og:title` keeps the tagline: a shared link is read by a person, not matched
 * against a query.
 */
export const SEARCH_TITLE: Record<Locale, string> = {
  fr: "Sonarche — bibliothèque musicale open source et hors ligne",
  en: "Sonarche — open-source, offline music library",
};

/** The brand title, for social cards and the site name. */
export const BRAND_TITLE = "Sonarche — From the stream into the Ark.";
