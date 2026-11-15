import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Reading pages: what the journal and the guide share. */

export type ReadingCopy = {
  readingTime: (minutes: number) => string;
  updatedOn: string;
  tableOfContents: string;
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    readingTime: (minutes) => `${minutes} min read`,
    updatedOn: "Updated",
    tableOfContents: "On this page",
  },
  fr: {
    readingTime: (minutes) => `${minutes} min de lecture`,
    updatedOn: "Mis à jour le",
    tableOfContents: "Sommaire",
  },
};
