import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § True names / Les vrais noms. */

type Field = {
  key: string;
  /** What a downloader guessed. */
  scraped: string;
  /** What the fingerprint answered. */
  identified: string;
  /** Spans the inspector's full width. */
  wide?: boolean;
};

type Side = { label: string; badge: string; count: string };

export type TrueNamesCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  lead: string;
  trackLabel: string;
  scraped: Side;
  identified: Side;
  fields: Field[];
  coverLine: string;
};

export const trueNamesCopy: Record<Locale, TrueNamesCopy> = {
  en: {
    kicker: "TRUE NAMES",
    headingBefore: "It doesn't read the title.",
    headingEmphasis: "It listens to the song.",
    lead: "Sonarche never guesses.",
    trackLabel: "TRACK",
    scraped: { label: "SCRAPED FROM THE PAGE", badge: "best guess", count: "1 of 7 fields" },
    identified: { label: "IDENTIFIED BY THE AUDIO", badge: "verified", count: "7 of 7 fields" },
    fields: [
      { key: "Track no.", scraped: "—", identified: "2" },
      {
        key: "Title",
        scraped: "Ghost - Mary On A Cross (Official Audio) [HQ]",
        identified: "Mary on a Cross",
        wide: true,
      },
      { key: "Artist", scraped: "unknown, read off the file name", identified: "Ghost", wide: true },
      { key: "Album", scraped: "—", identified: "Seven Inches of Satanic Panic", wide: true },
      { key: "Year", scraped: "2022 (file date)", identified: "2019" },
      { key: "Genre", scraped: "—", identified: "Hard Rock" },
    ],
    coverLine: "And the cover comes with it. The real square artwork, not the fourth result on Google Images.",
  },
  fr: {
    kicker: "LES VRAIS NOMS",
    headingBefore: "Il ne lit pas le titre.",
    headingEmphasis: "Il écoute le morceau.",
    lead: "Sonarche, lui, ne devine jamais.",
    trackLabel: "PISTE",
    scraped: { label: "GRATTÉ SUR LA PAGE", badge: "au jugé", count: "1 champ sur 7" },
    identified: { label: "IDENTIFIÉ PAR L'AUDIO", badge: "vérifié", count: "7 champs sur 7" },
    fields: [
      { key: "N° piste", scraped: "—", identified: "2" },
      {
        key: "Titre",
        scraped: "Ghost - Mary On A Cross (Official Audio) [HQ]",
        identified: "Mary on a Cross",
        wide: true,
      },
      { key: "Artiste", scraped: "inconnu, lu dans le nom du fichier", identified: "Ghost", wide: true },
      { key: "Album", scraped: "—", identified: "Seven Inches of Satanic Panic", wide: true },
      { key: "Année", scraped: "2022 (date du fichier)", identified: "2019" },
      { key: "Genre", scraped: "—", identified: "Hard Rock" },
    ],
    coverLine: "Et la pochette arrive avec. La vraie, carrée, pas le quatrième résultat de Google Images.",
  },
};
