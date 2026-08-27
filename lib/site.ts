/* French first, and not only alphabetically: it is the site's own language, and
   this order is what the top-right switch reads out. */
export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const SITE_URL = "https://sonarche.org";

/**
 * The app's repository, not this site's. Public since 2026-07-30.
 *
 * No longer the target of the page's calls to action — those download the app
 * now (see components/download). This stays for the colophon and the JSON-LD:
 * the code being readable is the argument, so it keeps a link.
 */
export const GITHUB_URL = "https://github.com/Norudah/sonarche";

/** The releases page. Every download path falls back to it, so it is the one
 *  URL on this page that must never depend on anything being reachable. */
export const RELEASES_URL = `${GITHUB_URL}/releases`;

/**
 * The latest release, asked at runtime from the visitor's own browser.
 *
 * A static export cannot know what the newest release is, and the asset names
 * carry the version — `Sonarche_1.0.0_aarch64.dmg` stops existing at 1.1.0, so
 * anything baked in here would 404 the day after a release, silently.
 *
 * Unauthenticated and CORS-open: 60 requests an hour per visitor IP, which is a
 * limit a landing page reaches only from behind a shared NAT. When it is hit —
 * or when GitHub is simply down — the button keeps the RELEASES_URL it was
 * rendered with. The failure mode is the page we had before, never a dead link.
 */
export const LATEST_RELEASE_API = "https://api.github.com/repos/Norudah/sonarche/releases/latest";

/** Whose project this is. The colophon signs the page and the JSON-LD says the
 *  same thing to a machine — MIT already puts the name in the repo's first
 *  line, so this only makes it findable from the page it belongs to. */
export const AUTHOR = { name: "Romain Pierucci", url: "https://github.com/Norudah" };

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
export const CONTENT_UPDATED = "2026-08-11";

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
  fr: "Sonarche | bibliothèque musicale open source et hors ligne",
  en: "Sonarche | open-source, offline music library",
};

/** The brand title, for social cards and the site name. */
export const BRAND_TITLE = "Sonarche: From the stream into the Ark.";

/**
 * The card an unfurler draws when the link is pasted into Discord or LinkedIn.
 *
 * Drawn by scripts/build-og-image.mjs — run it after any change to the mark, the
 * palette or the tagline. It lives in public/ rather than as an
 * `opengraph-image` file because that convention resolves per route segment, and
 * the two locales are two route groups: one copy, two layouts pointing at it.
 */
export const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

/**
 * What the card says to someone who cannot see it.
 *
 * One card serves every page, so one description does too — it describes the
 * drawing, not the page it was shared from. Kept here rather than beside each
 * `openGraph` block because a card with no alt is the default a route file
 * falls into by forgetting, and there is nothing to forget if there is only
 * one place it can come from.
 */
export const OG_IMAGE_ALT: Record<Locale, string> = {
  fr: "Sonarche : l'arche flottant sur une mer dessinée en barres d'égaliseur, sous le mot SONARCHE et la devise « From the stream into the Ark. »",
  en: 'Sonarche: the ark afloat on a sea drawn as equalizer bars, under the word SONARCHE and the tagline "From the stream into the Ark."',
};

/** The card, with its description, ready to drop into an `openGraph.images`. */
export const ogImage = (locale: Locale) => ({ ...OG_IMAGE, alt: OG_IMAGE_ALT[locale] });
