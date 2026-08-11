import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The journal / Le journal.
   What the journal shares with the guide — wordmark, tagline, reading time —
   lives in components/reading/copy.ts. The posts' own text lives with each
   post, in components/blog/posts. */

export type BlogCopy = {
  /** The nav label, beside the wordmark. */
  journal: string;
  indexTitle: string;
  indexDek: string;
  /** The index's <title>. Like SEARCH_TITLE in lib/site.ts, this one exists to
   *  be matched against a query — "Le journal de bord" is a good headline and a
   *  useless title. */
  indexSearchTitle: string;
  /** The button on a row of the index. The whole row is the link — this says
   *  out loud what clicking anywhere on it does. */
  readPost: string;
  /** The closing card every post ends on. */
  ctaTitle: string;
  ctaBody: string;
  ctaLink: string;
};

export const blogCopy: Record<Locale, BlogCopy> = {
  en: {
    journal: "Journal",
    indexTitle: "The ship's log",
    indexSearchTitle: "Sonarche journal — music libraries, tags and metadata",
    indexDek:
      "Notes on music you own: files, metadata, formats, and what it takes for a library to outlive the apps that read it.",
    readPost: "Read the post",
    ctaTitle: "Sonarche does all of this for you",
    ctaBody:
      "A desktop app that identifies every track by its own audio, files it in plain folders you can read without it, and plays the lot on a native engine. Free, open source, offline.",
    ctaLink: "Discover Sonarche",
  },
  fr: {
    journal: "Journal",
    indexTitle: "Le journal de bord",
    indexSearchTitle: "Journal Sonarche — bibliothèque musicale, tags et métadonnées",
    indexDek:
      "Des notes sur la musique qu'on possède : fichiers, métadonnées, formats, et ce qu'il faut pour qu'une bibliothèque survive aux applications qui la lisent.",
    readPost: "Lire l'article",
    ctaTitle: "Sonarche fait tout ça pour toi",
    ctaBody:
      "Une app de bureau qui identifie chaque morceau à l'oreille, le range dans des dossiers clairs que tu peux lire sans elle, et joue l'ensemble sur un moteur natif. Gratuite, open source, hors ligne.",
    ctaLink: "Découvrir Sonarche",
  },
};
