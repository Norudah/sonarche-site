import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § Hero. */

export type HeroCopy = {
  badge: string;
  wordmark: string;
  /** BRAND — English in every language, never reworded. */
  tagline: string;
  /** The page's h1 and the hero's only line: the hook, in the words people search for. */
  heading: string;
  /** No `ctaPrimary`: the download button builds its own labels. */
  ctaSecondary: string;
  scrollHint: string;
};

export const heroCopy: Record<Locale, HeroCopy> = {
  en: {
    badge: "FREE · OPEN SOURCE · OFFLINE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    heading: "Paste a link: Sonarche downloads the track, recognizes it by ear, fixes its tags and files it away.",
    ctaSecondary: "See how it works ↓",
    scrollHint: "SCROLL ↓",
  },
  fr: {
    badge: "GRATUIT · OPEN SOURCE · HORS LIGNE",
    wordmark: "SONARCHE",
    tagline: "From the stream into the Ark.",
    heading: "Colle un lien : Sonarche télécharge le morceau, le reconnaît à l'oreille, corrige ses tags et le range.",
    ctaSecondary: "Comment ça marche ↓",
    scrollHint: "DÉFILER ↓",
  },
};
