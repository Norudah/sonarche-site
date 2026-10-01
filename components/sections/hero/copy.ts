import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Hero. */

export type HeroCopy = {
  badge: string;
  wordmark: string;
  /** BRAND — English in every language, never reworded. */
  tagline: string;
  subline: string;
  /** No `ctaPrimary`: the download button builds its own labels. */
  ctaSecondary: string;
  scrollHint: string;
};

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    badge: "FREE · OPEN SOURCE · OFFLINE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    subline:
      "A music library that's truly yours: every track identified by its own audio, named in plain files, played on a native engine.",
    ctaSecondary: "See how it works ↓",
    scrollHint: "SCROLL ↓",
  },
  fr: {
    badge: "GRATUIT · OPEN SOURCE · HORS LIGNE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    subline:
      "Une bibliothèque musicale qui t'appartient vraiment : chaque morceau identifié à l'oreille, tes fichiers sur ta machine, avec les bonnes informations.",
    ctaSecondary: "Comment ça marche ↓",
    scrollHint: "DÉFILER ↓",
  },
};
