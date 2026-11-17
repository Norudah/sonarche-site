import type { Topic } from "@/lib/guide";
import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The guide. */

export type GuideCopy = {
  /** The nav label. */
  guide: string;
  /** The share card's title; the page itself shows `indexHeading`. */
  indexTitle: string;
  indexHeading: string;
  indexDek: string;
  /** Beside the under-construction badge. */
  construction: string;
  /** The index's <title>, written to match a query. */
  indexSearchTitle: string;
  topics: Record<Topic, string>;
  home: string;
  startHere: string;
  draft: string;
  /** Shown while nothing is published. */
  emptyTitle: string;
  emptyBody: string;
  /** Over the index's cards, the folded menu on mobile, and the last guide's closing link. */
  allGuides: string;
  previous: string;
  next: string;
  reportLead: string;
  reportLink: string;
};

export const guideCopy: Record<Locale, GuideCopy> = {
  en: {
    guide: "Guide",
    indexTitle: "Using Sonarche",
    indexHeading: "What do you want to do?",
    construction: "The guide grows with each release. It's out already, as it stands.",
    indexSearchTitle: "Sonarche guide | install, import, tag and play",
    indexDek:
      "How to get each part of the app to do what you want, one walkthrough at a time. Written against a numbered version, and revised when that version moves.",
    topics: {
      start: "Getting started",
      library: "Your library",
      listen: "Listening",
      settings: "Settings and upkeep",
    },
    home: "Guide home",
    startHere: "New here? Start here",
    draft: "Draft",
    emptyTitle: "Nothing here yet",
    emptyBody: "The first walkthroughs are being written. The journal has something to read in the meantime.",
    allGuides: "All guides",
    previous: "Previous guide",
    next: "Next guide",
    reportLead: "A screen no longer matches the guide?",
    reportLink: "Report it on GitHub",
  },
  fr: {
    guide: "Guide",
    indexTitle: "Utiliser Sonarche",
    indexHeading: "Que veux-tu faire ?",
    construction: "Le guide grandit au fil des versions. On le publie déjà, tel qu'il est.",
    indexSearchTitle: "Guide Sonarche | installer, importer, taguer et écouter",
    indexDek:
      "Comment obtenir de chaque partie de l'app ce que tu en attends, un pas-à-pas à la fois. Écrit pour une version numérotée, et repris quand cette version bouge.",
    topics: {
      start: "Démarrer",
      library: "Ta bibliothèque",
      listen: "Écouter",
      settings: "Réglages et entretien",
    },
    home: "Accueil du guide",
    startHere: "Nouveau ici ? Commence par là",
    draft: "Brouillon",
    emptyTitle: "Rien ici pour l'instant",
    emptyBody: "Les premiers pas-à-pas sont en cours d'écriture. En attendant, il y a de quoi lire dans le journal.",
    allGuides: "Tous les guides",
    previous: "Tuto précédent",
    next: "Tuto suivant",
    reportLead: "Un écran ne ressemble plus au guide ?",
    reportLink: "Signale-le sur GitHub",
  },
};
