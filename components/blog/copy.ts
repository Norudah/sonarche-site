import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The journal. */

export type BlogCopy = {
  /** The nav label. */
  journal: string;
  indexTitle: string;
  indexDek: string;
  /** Beside the under-construction badge. */
  construction: string;
  /** The index's <title>, written to match a query. */
  indexSearchTitle: string;
  /** The label on the newest post's wide card. */
  featured: string;
  by: string;
  /** The card that points from the index to the guide. */
  howToLabel: string;
  howToBody: string;
  howToLink: string;
  /** The card that points from a post to its guide. */
  practice: string;
  /** The closing card every post ends on. */
  ctaTitle: string;
  ctaBody: string;
  ctaLink: string;
};

export const blogCopy: Record<Locale, BlogCopy> = {
  en: {
    journal: "Journal",
    indexTitle: "The ship's log",
    construction: "The journal fills up as it goes. It's out already, as it stands.",
    indexSearchTitle: "Sonarche journal | music libraries, tags and metadata",
    indexDek:
      "Notes on music you own: files, metadata, formats, and what it takes for a library to outlive the apps that read it.",
    featured: "Featured",
    by: "by",
    howToLabel: "Looking for a how-to?",
    howToBody: "The journal tells, the guide shows. The app's walkthroughs are in the",
    howToLink: "guide",
    practice: "Put it into practice · Guide",
    ctaTitle: "Sonarche does all of this for you",
    ctaBody:
      "A desktop app that identifies every track by its own audio, files it in plain folders you can read without it, and plays the lot on a native engine. Free, open source, offline.",
    ctaLink: "Discover Sonarche",
  },
  fr: {
    journal: "Journal",
    indexTitle: "Le journal de bord",
    construction: "Le journal s'étoffe au fil de l'eau. On le publie déjà, tel qu'il est.",
    indexSearchTitle: "Journal Sonarche | bibliothèque musicale, tags et métadonnées",
    indexDek:
      "Des notes sur la musique qu'on possède : fichiers, métadonnées, formats, et ce qu'il faut pour qu'une bibliothèque survive aux applications qui la lisent.",
    featured: "À la une",
    by: "par",
    howToLabel: "Tu cherches un mode d'emploi ?",
    howToBody: "Le journal raconte, le guide montre. Les pas-à-pas de l'app sont dans le",
    howToLink: "guide",
    practice: "Le mettre en pratique · Guide",
    ctaTitle: "Sonarche fait tout ça pour toi",
    ctaBody:
      "Une app de bureau qui identifie chaque morceau à l'oreille, le range dans des dossiers clairs que tu peux lire sans elle, et joue l'ensemble sur un moteur natif. Gratuite, open source, hors ligne.",
    ctaLink: "Découvrir Sonarche",
  },
};
