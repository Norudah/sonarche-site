import type { Locale } from "@/lib/site";

/*
 * Verbatim from docs/copy/en.md § Hero and docs/copy/fr.md § Hero.
 * Never edited here — the decks are the source of truth (see CLAUDE.md).
 */

export type HeroCopy = {
  badge: string;
  wordmark: string;
  /** BRAND — English in every language, never reworded. */
  tagline: string;
  subline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
};

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    badge: "FREE · OPEN SOURCE · OFFLINE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    subline:
      "A music library that's truly yours — every track identified by its own audio, named in plain files, played on a native engine.",
    ctaPrimary: "Get Sonarche on GitHub ↗",
    ctaSecondary: "See how it works ↓",
    scrollHint: "SCROLL ↓",
  },
  fr: {
    badge: "GRATUIT · OPEN SOURCE · HORS LIGNE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    subline:
      "Une bibliothèque musicale qui t'appartient vraiment — chaque morceau identifié à l'oreille, rangé dans de simples fichiers, lu par un moteur natif.",
    ctaPrimary: "Sonarche est sur GitHub ↗",
    ctaSecondary: "Voir comment ça marche ↓",
    scrollHint: "DÉFILER ↓",
  },
};
