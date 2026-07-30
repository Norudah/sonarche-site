import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § True names / Les vrais noms. */

export type CompareRow = {
  /** Field name — Title, Artist, … */
  key: string;
  /** What a downloader guessed. */
  scraped: string;
  /** What the fingerprint answered. */
  identified: string;
};

export type TrueNamesCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  body: string;
  scrapedLabel: string;
  scrapedBadge: string;
  identifiedLabel: string;
  identifiedBadge: string;
  /** The three steps stacked between the two panels. */
  pipeline: string[];
  rows: CompareRow[];
  coverLine: string;
};

export const trueNamesCopy: Record<Locale, TrueNamesCopy> = {
  en: {
    kicker: "TRUE NAMES",
    headingBefore: "It doesn't read the title.",
    headingEmphasis: "It listens to the song.",
    body: "Most tools just copy whatever text happened to come with the file. That's how you end up with an artist called « Official Audio ». Sonarche never guesses: ffmpeg and Chromaprint turn the waveform itself into a fingerprint, AcoustID matches that fingerprint to one exact recording, and MusicBrainz — twenty years of community-verified discography — hands back the real facts.",
    scrapedLabel: "SCRAPED FROM THE PAGE",
    scrapedBadge: "best guess",
    identifiedLabel: "IDENTIFIED BY THE AUDIO",
    identifiedBadge: "verified",
    pipeline: ["FINGERPRINT", "→ ACOUSTID", "→ MUSICBRAINZ"],
    rows: [
      {
        key: "Title",
        scraped: "Ghost - Mary On A Cross (Official Audio) [HQ]",
        identified: "Mary on a Cross",
      },
      { key: "Artist", scraped: "unknown — read off the file name", identified: "Ghost" },
      { key: "Album", scraped: "—", identified: "Seven Inches of Satanic Panic" },
      { key: "Year", scraped: "2022 (file date)", identified: "2019" },
      {
        key: "Artwork",
        scraped: "embedded thumbnail, 16:9, letterboxed",
        identified: "official front cover, 1400×1400",
      },
    ],
    coverLine: "And the cover comes with it — the real square artwork, not the fourth result on Google Images.",
  },
  fr: {
    kicker: "LES VRAIS NOMS",
    headingBefore: "Il ne lit pas le titre.",
    headingEmphasis: "Il écoute le morceau.",
    body: "La plupart des outils recopient le texte qui traînait avec le fichier. C'est comme ça qu'on se retrouve avec un artiste nommé « Official Audio ». Sonarche, lui, ne devine jamais : ffmpeg et Chromaprint transforment l'onde sonore elle-même en empreinte, AcoustID relie cette empreinte à un enregistrement précis, et MusicBrainz — vingt ans de discographie vérifiée par la communauté — rend son verdict : les faits, les vrais.",
    scrapedLabel: "GRATTÉ SUR LA PAGE",
    scrapedBadge: "au jugé",
    identifiedLabel: "IDENTIFIÉ PAR L'AUDIO",
    identifiedBadge: "vérifié",
    pipeline: ["EMPREINTE", "→ ACOUSTID", "→ MUSICBRAINZ"],
    rows: [
      {
        key: "Titre",
        scraped: "Ghost - Mary On A Cross (Official Audio) [HQ]",
        identified: "Mary on a Cross",
      },
      { key: "Artiste", scraped: "inconnu — lu dans le nom du fichier", identified: "Ghost" },
      { key: "Album", scraped: "—", identified: "Seven Inches of Satanic Panic" },
      { key: "Année", scraped: "2022 (date du fichier)", identified: "2019" },
      {
        key: "Pochette",
        scraped: "vignette intégrée, 16:9, bandes noires",
        identified: "pochette officielle, 1400×1400",
      },
    ],
    coverLine: "Et la pochette arrive avec — la vraie, carrée, pas le quatrième résultat de Google Images.",
  },
};
