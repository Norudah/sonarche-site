import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Final CTA & footer / CTA final & footer. */

export type FooterCopy = {
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  /** No `cta`: the last call is the download button, which builds its own
   *  labels from the visitor's system. See components/download. */
  license: string;
  personalUse: string;
  wordmark: string;
  /** BRAND — English in every language. */
  tagline: string;
  /** The attribution line. The name itself is the same in both languages. */
  signature: string;
  /** The journal and the guide, entered from the waterline and nowhere else:
   *  the landing is a scroll narrative that must not be interrupted by a list
   *  of articles. The guide's link only renders once a guide is published. */
  journal: string;
  guide: string;
  github: string;
  /** Label of the link to the other language, in that language. */
  otherLanguage: string;
};

export const footerCopy: Record<Locale, FooterCopy> = {
  en: {
    headingBefore: "Free. Open source.",
    headingEmphasis: "Yours.",
    body: "No subscription, no cloud, no lock-in. The code is on GitHub — read it, fork it, board it.",
    license: "License: MIT",
    personalUse: "For personal use. Respect the terms of the services you use, and your local law.",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    signature: "by Romain Pierucci (@Norudah)",
    journal: "Journal",
    guide: "Guide",
    github: "GitHub ↗",
    otherLanguage: "Français",
  },
  fr: {
    headingBefore: "Gratuit. Open source.",
    headingEmphasis: "À toi.",
    body: "Pas d'abonnement, pas de cloud, pas de verrou. Le code est sur GitHub — lis-le, forke-le, monte à bord.",
    license: "Licence : MIT",
    personalUse: "Usage personnel — respecte les conditions des services que tu utilises et le droit de ton pays.",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    signature: "par Romain Pierucci (@Norudah)",
    journal: "Journal",
    guide: "Guide",
    github: "GitHub ↗",
    otherLanguage: "English",
  },
};
