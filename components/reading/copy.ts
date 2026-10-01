import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Reading pages: what the journal and the guide share. */

export type ReadingCopy = {
  wordmark: string;
  /** BRAND — English in every language. */
  tagline: string;
  backToSite: string;
  readingTime: (minutes: number) => string;
  updatedOn: string;
  tableOfContents: string;
  /** Accessible name of the header nav. */
  sections: string;
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    backToSite: "Back to the site",
    readingTime: (minutes) => `${minutes} min read`,
    updatedOn: "Updated",
    tableOfContents: "On this page",
    sections: "Sections",
  },
  fr: {
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    backToSite: "Retour au site",
    readingTime: (minutes) => `${minutes} min de lecture`,
    updatedOn: "Mis à jour le",
    tableOfContents: "Sommaire",
    sections: "Sections",
  },
};
