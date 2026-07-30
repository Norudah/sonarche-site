import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Final CTA & footer / CTA final & footer. */

export type FooterCopy = {
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  cta: string;
  builtWith: string[];
  license: string;
  personalUse: string;
  wordmark: string;
  /** BRAND — English in every language. */
  tagline: string;
  github: string;
  /** Label of the link to the other language, in that language. */
  otherLanguage: string;
};

export const footerCopy: Record<Locale, FooterCopy> = {
  en: {
    headingBefore: "Free. Open source.",
    headingEmphasis: "Yours.",
    body: "No subscription, no cloud, no lock-in. The code is on GitHub — read it, fork it, board it.",
    cta: "Get Sonarche on GitHub ↗",
    builtWith: ["Tauri", "Rust", "React", "beets", "yt-dlp", "AcoustID"],
    license: "License: MIT",
    personalUse: "For personal use. Respect the terms of the services you use, and your local law.",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    github: "GitHub ↗",
    otherLanguage: "Français",
  },
  fr: {
    headingBefore: "Gratuit. Open source.",
    headingEmphasis: "À toi.",
    body: "Pas d'abonnement, pas de cloud, pas de verrou. Le code est sur GitHub — lis-le, forke-le, monte à bord.",
    cta: "Sonarche est sur GitHub ↗",
    builtWith: ["Tauri", "Rust", "React", "beets", "yt-dlp", "AcoustID"],
    license: "Licence : MIT",
    personalUse: "Usage personnel — respecte les conditions des services que tu utilises et le droit de ton pays.",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    github: "GitHub ↗",
    otherLanguage: "English",
  },
};
