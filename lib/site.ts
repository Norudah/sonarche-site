/* French first: it is the site's default language and the order the switch reads out. */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sonarche.org";

/** The app's repository, not this site's. */
export const GITHUB_URL = "https://github.com/Norudah/sonarche";

/** Every download path falls back here, so it must never depend on anything being reachable. */
export const RELEASES_URL = `${GITHUB_URL}/releases`;

/**
 * Asked at runtime: asset names carry the version, so a URL baked into the static export would 404
 * the day after the next release. Rate-limited to 60 requests/hour per IP; on failure the button
 * keeps RELEASES_URL.
 */
export const LATEST_RELEASE_API = "https://api.github.com/repos/Norudah/sonarche/releases/latest";

export const AUTHOR = { name: "Romain Pierucci", url: "https://github.com/Norudah" };

/* FR at the root: the page is written for a French audience first. A static export cannot redirect
   on Accept-Language, so the switch is visible instead. */
export const LOCALE_PATH: Record<Locale, string> = {
  fr: "/",
  en: "/en/",
};

export const OTHER_LOCALE: Record<Locale, Locale> = {
  fr: "en",
  en: "fr",
};

/** Open Graph only accepts language_TERRITORY; scrapers drop a bare `fr`. */
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_US",
};

/** The sitemap's date for the landing. Bumped by hand when docs/copy/*.md changes, not per deploy. */
export const CONTENT_UPDATED = "2026-08-11";

/** The <title> is written to be searched for; the tagline stays on og:title. */
export const SEARCH_TITLE: Record<Locale, string> = {
  fr: "Sonarche | bibliothèque musicale open source et hors ligne",
  en: "Sonarche | open-source, offline music library",
};

export const BRAND_TITLE = "Sonarche: From the stream into the Ark.";

/* The hero's subline. The FR one stops at 147 characters to fit a result snippet. */
export const LANDING_DESCRIPTION: Record<Locale, string> = {
  fr: "Une bibliothèque musicale qui t'appartient vraiment : chaque morceau identifié à l'oreille, tes fichiers sur ta machine, avec les bonnes informations.",
  en: "A music library that's truly yours: every track identified by its own audio, named in plain files, played on a native engine. Free and open source.",
};

/**
 * Drawn by scripts/build-og-image.mjs. Served from public/ rather than as an `opengraph-image`
 * route file, which would resolve per route group and need one copy per locale.
 */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

const OG_IMAGE_ALT: Record<Locale, string> = {
  fr: "Sonarche : l'arche flottant sur une mer dessinée en barres d'égaliseur, sous le mot SONARCHE et la devise « From the stream into the Ark. »",
  en: 'Sonarche: the ark afloat on a sea drawn as equalizer bars, under the word SONARCHE and the tagline "From the stream into the Ark."',
};

export const ogImage = (locale: Locale) => ({ ...OG_IMAGE, alt: OG_IMAGE_ALT[locale] });

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export const byLocale = <T>(fn: (locale: Locale) => T) =>
  Object.fromEntries(LOCALES.map((locale) => [locale, fn(locale)])) as Record<Locale, T>;

/** hreflang alternates must be reciprocal; `x-default` serves the FR root. */
export const withXDefault = (paths: Record<Locale, string>) => ({ ...paths, "x-default": paths.fr });
