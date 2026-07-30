import { LOCALES, type Locale } from "@/lib/site";

/*
 * Which of our two languages a visitor would most likely rather read.
 *
 * The input is `navigator.languages` — the visitor's own ordered list, the one
 * they set in their browser or inherited from their system. It is the only
 * signal a static export gets: there is no server, so no Accept-Language header
 * and no IP geography, and neither of those answers the question anyway. A
 * country is not a language, and an English speaker in Paris has no business
 * being pushed onto the French page.
 *
 * The first of our locales they ask for wins. When they ask for neither — a
 * German or a Spanish reader — it is English, the language the two of us are
 * most likely to share.
 *
 * Nothing is redirected on the strength of this. It only decides whether the
 * other language is worth pointing at (see LocaleSwitch).
 */
export function preferredLocale(tags: readonly string[]): Locale {
  for (const tag of tags) {
    // "fr-FR" and "fr" are French; "frr" (Northern Frisian) is not.
    const lower = tag.toLowerCase();
    const match = LOCALES.find((code) => lower === code || lower.startsWith(`${code}-`));
    if (match) return match;
  }

  return "en";
}
