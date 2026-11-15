import { LOCALES, type Locale } from "@/lib/site";

/** The first of our locales in `navigator.languages`, else English. Only decides a hint, never a redirect. */
export function preferredLocale(tags: readonly string[]): Locale {
  for (const tag of tags) {
    // "fr-FR" and "fr" are French; "frr" (Northern Frisian) is not.
    const lower = tag.toLowerCase();
    const match = LOCALES.find((code) => lower === code || lower.startsWith(`${code}-`));
    if (match) return match;
  }

  return "en";
}
