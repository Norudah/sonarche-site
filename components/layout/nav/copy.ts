import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md § Navigation bar and fr.md § Barre de navigation. */

export type NavCopy = {
  wordmark: string;
  guide: string;
  journal: string;
  download: string;
  /** Accessible names, announced, never rendered. */
  label: string;
  languages: string;
};

export const navCopy: Record<Locale, NavCopy> = {
  en: {
    wordmark: "SONARCHE",
    guide: "Guide",
    journal: "Journal",
    download: "Download ↓",
    label: "Site",
    languages: "Language",
  },
  fr: {
    wordmark: "SONARCHE",
    guide: "Guide",
    journal: "Journal",
    download: "Télécharger ↓",
    label: "Site",
    languages: "Langue",
  },
};
