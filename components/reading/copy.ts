import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Reading pages: what the journal and the guide share. */

export type ReadingCopy = {
  readingTime: (minutes: number) => string;
  updatedOn: string;
  /** The badge on an index that is published while it grows. */
  underConstruction: string;
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    readingTime: (minutes) => `${minutes} min read`,
    updatedOn: "Updated",
    underConstruction: "Under construction",
  },
  fr: {
    readingTime: (minutes) => `${minutes} min de lecture`,
    updatedOn: "Mis à jour le",
    underConstruction: "En construction",
  },
};
