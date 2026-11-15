import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Reading pages: what the journal and the guide share. */

export type ReadingCopy = {
  /** BRAND — English in every language. */
  tagline: string;
  backToSite: string;
  readingTime: (minutes: number) => string;
  updatedOn: string;
  tableOfContents: string;
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    tagline: "From the stream into the Ark.",
    backToSite: "Back to the site",
    readingTime: (minutes) => `${minutes} min read`,
    updatedOn: "Updated",
    tableOfContents: "On this page",
  },
  fr: {
    tagline: "From the stream into the Ark.",
    backToSite: "Retour au site",
    readingTime: (minutes) => `${minutes} min de lecture`,
    updatedOn: "Mis à jour le",
    tableOfContents: "Sommaire",
  },
};
