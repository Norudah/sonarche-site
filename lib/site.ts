export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sonarche.org";

/**
 * The repo is still private (2026-07-30), so every CTA points at a URL that
 * does not resolve yet — deliberately, rather than rendering a dead button.
 * TODO: confirm the final handle before going public. This is the only string
 * to change.
 */
export const GITHUB_URL = "https://github.com/rpierucci/sonarche";

/** Two static routes, EN at the root. No Accept-Language redirect: a static
 *  export cannot, and a visible switch is better anyway. */
export const LOCALE_PATH: Record<Locale, string> = {
  en: "/",
  fr: "/fr/",
};

export const OTHER_LOCALE: Record<Locale, Locale> = {
  en: "fr",
  fr: "en",
};

/** `hreflang` map for the Metadata API, x-default on EN. */
export const LANGUAGE_ALTERNATES = {
  en: LOCALE_PATH.en,
  fr: LOCALE_PATH.fr,
  "x-default": LOCALE_PATH.en,
};
