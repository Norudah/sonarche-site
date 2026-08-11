import type { Locale } from "@/lib/site";

/* Verbatim from docs/copy/en.md and fr.md § The old way / L'ancienne méthode. */

export type ChainLink = {
  /** `TAB 1`, `APP 2`… — the tab or window you had to open. */
  step: string;
  tool: string;
  gripe: string;
  /** What the step costs you. The line under the card. */
  cost: string;
};

export type OldWayCopy = {
  kicker: string;
  headingBefore: string;
  headingEmphasis: string;
  sub: string;
  chain: ChainLink[];
  punchHeading: string;
  punchBody: string;
};

export const oldWayCopy: Record<Locale, OldWayCopy> = {
  en: {
    kicker: "THE OLD WAY",
    headingBefore: "You already know",
    headingEmphasis: "the old way.",
    sub: "Five tools, four tabs, and a download folder that looks like a crime scene. Every step loses something on the way.",
    chain: [
      {
        step: "TAB 1",
        tool: "A converter site",
        gripe:
          "One link at a time, converted on somebody else's server. You wait in a queue, then the browser drops the file wherever it feels like.",
        cost: "Slow, one track, re-encoded.",
      },
      {
        step: "APP 1",
        tool: "A bulk downloader",
        gripe:
          "Handles the playlist, at least. But it fills the tags from the file name, so your artist is « Unknown » and your album is blank.",
        cost: "Tags are a guess.",
      },
      {
        step: "APP 2",
        tool: "A tag editor",
        gripe: "Open every file. Retype the title, the artist, the year, the track number. Multiply by 80.",
        cost: "Hours of typing.",
      },
      {
        step: "TAB 2",
        tool: "An image search",
        gripe:
          "Hunt for a square cover that isn't a watermarked thumbnail, crop it, hope it matches the right pressing.",
        cost: "Wrong artwork forever.",
      },
      {
        step: "APP 3",
        tool: "Your music player",
        gripe: "Move the files in, re-scan the folder, then discover three duplicates and one album split in two.",
        cost: "A messy library anyway.",
      },
    ],
    punchHeading: "Sonarche does all five. In one window.",
    punchBody:
      "Point it at a link and walk away. The audio lands in the hold, gets listened to, identified, tagged, given its real cover, filed in the right folder. Then it plays, on a native Rust audio engine. No hand-off, no re-import, no second app.",
  },
  fr: {
    kicker: "L'ANCIENNE MÉTHODE",
    headingBefore: "L'ancienne méthode,",
    headingEmphasis: "tu la connais par cœur.",
    sub: "Cinq outils, quatre onglets, et un dossier Téléchargements qui ressemble à une scène de crime. Chaque étape perd quelque chose en route.",
    chain: [
      {
        step: "ONGLET 1",
        tool: "Un site de conversion",
        gripe:
          "Un lien à la fois, converti sur le serveur de quelqu'un d'autre. Tu attends dans une file, puis le navigateur dépose le fichier où bon lui semble.",
        cost: "Lent, un morceau, ré-encodé.",
      },
      {
        step: "APP 1",
        tool: "Un téléchargeur en masse",
        gripe:
          "Il gère la playlist, au moins. Mais il remplit les tags avec le nom du fichier : ton artiste s'appelle « Unknown » et ton album est vide.",
        cost: "Des tags devinés.",
      },
      {
        step: "APP 2",
        tool: "Un éditeur de tags",
        gripe: "Ouvrir chaque fichier. Retaper le titre, l'artiste, l'année, le numéro de piste. Multiplié par 80.",
        cost: "Des heures de saisie.",
      },
      {
        step: "ONGLET 2",
        tool: "Une recherche d'images",
        gripe:
          "Chercher une pochette carrée qui ne soit pas une vignette filigranée, la recadrer, espérer qu'elle corresponde au bon pressage.",
        cost: "La mauvaise pochette pour toujours.",
      },
      {
        step: "APP 3",
        tool: "Ton lecteur de musique",
        gripe:
          "Déplacer les fichiers, relancer l'analyse du dossier, puis découvrir trois doublons et un album coupé en deux.",
        cost: "Une bibliothèque bancale quand même.",
      },
    ],
    punchHeading: "Sonarche fait les cinq. Dans une seule fenêtre.",
    punchBody:
      "Donne-lui un lien et va vivre ta vie. L'audio rejoint la cale, se fait écouter, identifier, taguer, coiffer de sa vraie pochette, ranger dans le bon dossier. Puis la lecture démarre, sur un moteur audio natif en Rust. Pas de relais, pas de ré-import, pas de deuxième app.",
  },
};
