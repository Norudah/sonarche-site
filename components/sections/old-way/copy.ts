import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The old way / L'ancienne méthode. */

type ChainLink = {
  step: string;
  tool: string;
  cost: string;
};

/** What each tool leaves behind, drawn inside its column. Demo content, not claims. */
type Leftovers = {
  fileName: string;
  guessedTags: { label: string; value: string }[];
  retypeCount: string;
  duplicates: string[];
};

export type OldWayCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  sub: string;
  chain: ChainLink[];
  leftovers: Leftovers;
  punchBefore: string;
  punchEmphasis: string;
  /** The same track once Sonarche is done with it. */
  result: { title: string; artist: string; release: string };
};

const SHARED = {
  fileName: "Ghost - Mary On A Cross (Official Audio) [HQ].mp3",
  retypeCount: "× 80",
  duplicates: ["Mary On A Cross", "Mary On A Cross (1)", "Mary On A Cross (2)", "Mary On A Cross (Official Audio)"],
};

export const oldWayCopy: Record<Locale, OldWayCopy> = {
  en: {
    kicker: "THE OLD WAY",
    headingBefore: "You already know",
    headingEmphasis: "the old way.",
    sub: "Five tools, four tabs, and a download folder that looks like a crime scene. Every step loses something on the way.",
    chain: [
      { step: "TAB 1", tool: "A converter site", cost: "Slow, one track, re-encoded." },
      { step: "APP 1", tool: "A bulk downloader", cost: "Tags are a guess." },
      { step: "APP 2", tool: "A tag editor", cost: "Hours of typing." },
      { step: "TAB 2", tool: "An image search", cost: "Wrong artwork forever." },
      { step: "APP 3", tool: "Your music player", cost: "A messy library anyway." },
    ],
    leftovers: {
      ...SHARED,
      guessedTags: [
        { label: "Artist", value: "Unknown" },
        { label: "Album", value: "" },
        { label: "Year", value: "" },
      ],
    },
    punchBefore: "Sonarche does all five.",
    punchEmphasis: "In one window.",
    result: { title: "Mary on a Cross", artist: "Ghost", release: "Seven Inches of Satanic Panic · 2019" },
  },
  fr: {
    kicker: "L'ANCIENNE MÉTHODE",
    headingBefore: "L'ancienne méthode,",
    headingEmphasis: "tu la connais par cœur.",
    sub: "Cinq outils, quatre onglets, et un dossier Téléchargements qui ressemble à une scène de crime. Chaque étape perd quelque chose en route.",
    chain: [
      { step: "ONGLET 1", tool: "Un site de conversion", cost: "Lent et un seul morceau à la fois." },
      { step: "APP 1", tool: "Un téléchargeur en masse", cost: "Des tags devinés." },
      { step: "APP 2", tool: "Un éditeur de tags", cost: "Des heures de saisies et de clics manuels." },
      { step: "ONGLET 2", tool: "Une recherche d'images", cost: "Des rectangles, des carrés : c'est pas carré." },
      { step: "APP 3", tool: "Ton lecteur de musique", cost: "Résultat ? Une bibliothèque bancale." },
    ],
    leftovers: {
      ...SHARED,
      guessedTags: [
        { label: "Artiste", value: "Unknown" },
        { label: "Album", value: "" },
        { label: "Année", value: "" },
      ],
    },
    punchBefore: "Sonarche fait les cinq.",
    punchEmphasis: "Dans une seule application.",
    result: { title: "Mary on a Cross", artist: "Ghost", release: "Seven Inches of Satanic Panic · 2019" },
  },
};
