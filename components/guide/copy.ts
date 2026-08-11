import type { Topic } from "@/lib/guide";
import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The guide / Le guide.
   What the guide shares with the journal — wordmark, tagline, reading time —
   lives in components/reading/copy.ts. Each guide's own text lives with it, in
   components/guide/guides. */

export type GuideCopy = {
  /** The nav label, beside the wordmark. */
  guide: string;
  indexTitle: string;
  indexDek: string;
  /** The index's <title> — written to be matched against a query. */
  indexSearchTitle: string;
  /** Heading of each group on the index. */
  topics: Record<Topic, string>;
  /** The button on a row of the index. */
  readGuide: string;
  /** The version line under a guide's title. Takes the version because that is
   *  data, not copy. */
  checkedAgainst: (version: string) => string;
  /** The badge a draft carries. Never seen in production — a draft is not on
   *  the index there — but seen at its own URL, which is where it is judged. */
  draft: string;
  /** What the index says while nothing is published yet. */
  emptyTitle: string;
  emptyBody: string;
  /** The card a guide ends on, back to the table of contents. */
  moreGuides: string;
};

export const guideCopy: Record<Locale, GuideCopy> = {
  en: {
    guide: "Guide",
    indexTitle: "Using Sonarche",
    indexSearchTitle: "Sonarche guide — install, import, tag and play",
    indexDek:
      "How to get each part of the app to do what you want, one walkthrough at a time. Written against a numbered version, and revised when that version moves.",
    topics: {
      start: "Getting started",
      library: "Your library",
      listen: "Listening",
      settings: "Settings and upkeep",
    },
    readGuide: "Read the guide",
    checkedAgainst: (version) => `Checked against Sonarche ${version}`,
    draft: "Draft",
    emptyTitle: "Nothing here yet",
    emptyBody: "The first walkthroughs are being written. The journal has something to read in the meantime.",
    moreGuides: "All guides",
  },
  fr: {
    guide: "Guide",
    indexTitle: "Utiliser Sonarche",
    indexSearchTitle: "Guide Sonarche — installer, importer, taguer et écouter",
    indexDek:
      "Comment obtenir de chaque partie de l'app ce que tu en attends, un pas-à-pas à la fois. Écrit pour une version numérotée, et repris quand cette version bouge.",
    topics: {
      start: "Démarrer",
      library: "Ta bibliothèque",
      listen: "Écouter",
      settings: "Réglages et entretien",
    },
    readGuide: "Lire le guide",
    checkedAgainst: (version) => `Vérifié sur Sonarche ${version}`,
    draft: "Brouillon",
    emptyTitle: "Rien ici pour l'instant",
    emptyBody: "Les premiers pas-à-pas sont en cours d'écriture. En attendant, il y a de quoi lire dans le journal.",
    moreGuides: "Tous les guides",
  },
};
