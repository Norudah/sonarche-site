import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Reading pages / Pages de lecture.
   What the journal and the guide say identically, and nothing else — a string
   that belongs to one of them lives in that section's own copy.ts. */

export type ReadingCopy = {
  wordmark: string;
  /** BRAND — English in every language. */
  tagline: string;
  backToSite: string;
  /** Written as a function because the number is data, not copy. */
  readingTime: (minutes: number) => string;
  updatedOn: string;
};

export const readingCopy: Record<Locale, ReadingCopy> = {
  en: {
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    backToSite: "Back to the site",
    readingTime: (minutes) => `${minutes} min read`,
    updatedOn: "Updated",
  },
  fr: {
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    backToSite: "Retour au site",
    readingTime: (minutes) => `${minutes} min de lecture`,
    updatedOn: "Mis à jour le",
  },
};
